///////////////////////////////////////////////  
//Functions related to querying cart table//

//import and create pool
const pool = require('./util/pool');

//import functions related to the order
const { checkNoResults } = require('./util/checkFind')
const { 
  findBillingInfo, 
  findDeliveryInfo, 
  isOrderOpen, 
  findOpenOrderByUserId,
  findOrderById,
  isItemOnCompleteOrder,
  addOrder,
  defaultBillingAndDelivery,
} = require('./findOrder');
const { isProductExtant } = require('./findProduct');

//gets all the info needed for to present the current user's open order (shopping cart)
//Returns an object that includes an array of items in cart, a total price for all items/qty added together, a billing object, a delivery obj
//OR returns a string stating that no order has been started.
const collectCart = async (userId) => {
  const sql = "SELECT cart.order_id, cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) AS qty_total\
  FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
  WHERE orders.user_id = $1 AND orders.date_completed IS NULL ORDER BY cart.id DESC;"

  const client = await pool.connect();
  const cart = await client.query(sql, [userId])
  client.release();

  let items = []
  let total = 0

  if (cart.rows.length === 0) {
    const isOrder = await  isOrderOpen(userId);
    
    if (isOrder) {
      items[0] = { order_id: isOrder }  //REVIEW I should probably move the order_id out of the item and into the return object.
    } else {
      return 'No order started';
    }
  } else {
    items = cart.rows;
    const sum = items.reduce((sum, row) => sum + Number(row.qty_total.replace(/[^0-9.-]+/g,"")), 0);
    total = Math.trunc(sum * 100) / 100; //25246.350000000002 changes to 25246.35
  }

  const billing = await findBillingInfo(items[0].order_id); 
  const delivery = await findDeliveryInfo(items[0].order_id);

  const checkout = { items, total, billing, delivery}
  //testlog console.log(checkout)
  return checkout;
}

//returns an array of all cart items from the database
const findAllCartItems = async () => {
    const sql = 'SELECT * FROM cart';
    const results = await pool.query(sql);
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    const cartItems = results.rows;
    return cartItems;
}

//returns a cart item object from the database as specified by the cart id
const findCartItemById = async (id) => {
  const sql = 'SELECT * FROM cart WHERE id = $1';
  const results = await pool.query(sql, [id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const cartItem = results.rows[0];
  return cartItem;
}

//returns an array of all cart items from a single order as specified by the order id
const findCartByOrderId = async (orderId) => {
  const sql = 'SELECT * FROM cart WHERE order_id = $1';
  const results = await pool.query(sql, [orderId]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const cart = results.rows;
  return cart;
}


//returns an array of all cart items that are on open orders
const findAllCurrentCartItemsWithProducts = async () => {
  const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.date_completed IS NULL;';
  const results = await pool.query(sql);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const cartItems = results.rows;
  return cartItems;
}
//returns an array of all cart items that are on open orders the belong to the specified user id.
const findAllCurrentCartItemsWithProductsByUser = async (userId) => {
  const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL ORDER BY cart.id;';
   
  const client = await pool.connect();
  const results = await pool.query(sql, [userId]);
  client.release();

  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const cartItems = results.rows;
  return cartItems;
}

//takes a new cart item object with the odrder id determined by the open order that belongs to the specified user id and inserts into the cart table.
const addCartItemToUserOrder = async (userId, newCartItem) => {
  const { productId, quantity } = newCartItem;
  const extantOrder = await findOpenOrderByUserId(userId);
  const isProduct = await isProductExtant(productId);
  let order = extantOrder;
  
  if (extantOrder === 'No orders started') {
    const ids = await defaultBillingAndDelivery(userId);
    const newOrder = await addOrder({ 
      user_id: userId,                   //TODO need to fix camelcase/snakecase
      billing_id: ids.billingId,
      delivery_id: ids.deliveryId,
    })
    order = newOrder;
  } 

  if (typeof extantOrder === 'string' && extantOrder !== 'No orders started') {
    return extantOrder;
  } else if (!isProduct) {
    return `Product #${productId} does not exist.`;
  } else {
    const sql = 'INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';

    const client = await pool.connect();
    const results = await client.query(sql, [order.id, productId, quantity]);
    client.release();
    
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    const cartItem = results.rows[0];
    return cartItem;
  }
}

//takes a new cart item object and order id if the order is open it inserts the new cart item into the cart table.
const addCartItemOnOrder = async (orderId, newCartItem) => {
  const { productId, quantity } = newCartItem;
  const order = await findOrderById(orderId);
  const isProduct = await isProductExtant(productId);

  if (typeof order === 'string') {
    return order;
  } else if (!isProduct) {
    return `Product #${productId} does not exist.`;
  } else if (order.date_completed) {
    return `Order ${order.id} is already complete`
  } else {
    const sql = 'INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
    const results = await pool.query(sql, [order.id, productId, quantity]);
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    const cartItem = results.rows[0];
    return cartItem;
  }
}


//udpates the cart item quantity of the specified cart id.
const changeCartItemQuantity = async (id, quantity) => {
  const isComplete = await isItemOnCompleteOrder(id);
  if (isComplete) {
    return `Cart id: ${id} belongs to order that is already complete`;
  } else {
    const sql = 'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *';

    const client = await pool.connect();
    const results = await client.query(sql, [quantity, id]);
    client.release();
    
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    return results.rows[0];
  }
}

//returns a cart item object if it belongs to the specified user id.
const findCartItemIfUser = async (cartId, userId) => {
  const sql = 'SELECT cart.id FROM cart JOIN orders ON cart.order_id = orders.id \
   WHERE orders.user_id = $1 AND cart.id = $2';

  const client = await pool.connect();
  const results = await client.query(sql, [userId, cartId]);
  client.release();
  
  if (results.rows.length === 0) {
    return `User has no cart item id ${cartId}`;  //REVIEW Keep because less generic?
  } else {
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    return results.rows[0];
  }
}

//udpates the cart item quantity of the specified cart id if it belongs to the specified id.
const changeCartItemQuantityIfUser = async (cartId, quantity, userId) => {
  const searchItem = await findCartItemIfUser(cartId, userId);
  if (typeof searchItem === 'string') {
    return searchItem;
  } else {
    const cartItem = await changeCartItemQuantity(cartId, quantity);
    return cartItem;
  }
}

//deletes the cart item indicated by the cart item id from the database.
const removeCartItem = async (id) => {
  const sql = 'DELETE FROM cart WHERE id = $1 RETURNING *';

  const client = await pool.connect();
  const results = await client.query(sql, [id]);
  client.release();
  
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  return results.rows[0]
}

//deletes the cart item indicated by the cart item id if it belongs to the current user.
const removeCartItemIfUser = async (cartId, userId) => {
  const searchItem = await findCartItemIfUser(cartId, userId);
  if (typeof searchItem === 'string') {
    return searchItem;
  } else {
    const cartItem = await removeCartItem(cartId);
    return cartItem;
  }
}

module.exports = {
  collectCart,
  findAllCartItems,
  findCartItemById,
  findCartByOrderId,
  findAllCurrentCartItemsWithProducts,
  findAllCurrentCartItemsWithProductsByUser,
  addCartItemToUserOrder,
  addCartItemOnOrder,
  changeCartItemQuantity,
  findCartItemIfUser,
  changeCartItemQuantityIfUser,
  removeCartItem,
  removeCartItemIfUser
}