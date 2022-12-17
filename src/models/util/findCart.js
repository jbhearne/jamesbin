///////////////////////////////////////////////  
//Functions related to querying cart table//

//import and create pool
const pool = require('./pool');

//import functions related to the order
const { 
  findBillingInfo, 
  findDeliveryInfo, 
  isOrderOpen, 
  findOpenOrderByUserId,
  findOrderById,
  isItemOnCompleteOrder
} = require('./findOrder');
const { isProductExtant } = require('./findProduct');

//gets all the info needed for to present the current user's open order (shopping cart)
//Returns an object that includes an array of items in cart, a total price for all items/qty added together, a billing object, a delivery obj
//OR returns a string stating that no order has been started.
const collectCart = async (userId) => {
  const sql = "SELECT cart.order_id, cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) AS qty_total\
  FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
  WHERE orders.user_id = $1 AND orders.date_completed IS NULL;"

  const cart = await pool.query(sql, [userId])

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
  return checkout;
}

const findAllCartItems = async () => {
  const sql = 'SELECT * FROM cart';
  const results = await pool.query(sql);
  const cartItems = results.rows;
  return cartItems;
}

const findCartItemById = async (id) => {
  const sql = 'SELECT * FROM cart WHERE id = $1';
  const results = await pool.query(sql, [id]);
  const cartItem = results.rows[0];
  return cartItem;
}

const findCartByOrderId = async (orderId) => {
  const sql = 'SELECT * FROM cart WHERE order_id = $1';
  const results = await pool.query(sql, [orderId]);
  const cart = results.rows;
  return cart;
}

const findAllCurrentCartItemsWithProducts = async () => {
  const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL;';
  const results = await pool.query(sql);
  const cartItems = results.rows;
  return cartItems;
}

const findAllCurrentCartItemsWithProductsByUser = async (userId) => {
  const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL;';
  const results = await pool.query(sql, [userId]);
  const cartItems = results.rows;
  return cartItems;
}

const addCartItemToUserOrder = async (userId, newCartItem) => {
  const { productId, quantity } = newCartItem;
  const order = await findOpenOrderByUserId(userId);
  const isProduct = await isProductExtant(productId);

  if (typeof order === 'string') {
    return order;
  } else if (!isProduct) {
    return `Product #${productId} does not exist.`;
  } else {
    const sql = 'INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *';
    const results = await pool.query(sql, [order.id, productId, quantity]);
    const cartItem = results.rows[0];
    return cartItem;
  }
}

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
    const cartItem = results.rows[0];
    return cartItem;
  }
}

const changeCartItemQuantity = async (id, quantity) => {
  const isComplete = await isItemOnCompleteOrder(id);
  if (isComplete) {
    return `Cart id: ${id} belongs to order that is already complete`;
  } else {
    const sql = 'UPDATE cart SET quantity = $1 WHERE id = $2 RETURNING *';
    const results = await pool.query(sql, [quantity, id]);
    return results.rows[0];
  }
}

const findCartItemIfUser = async (cartId, userId) => {
  const sql = 'SELECT cart.id FROM cart JOIN orders ON cart.order_id = orders.id \
   WHERE orders.user_id = $1 AND cart.id = $2';
  const results = await pool.query(sql, [userId, cartId]);
  if (results.rows.length === 0) {
    return `User has no cart item id ${cartId}`;
  } else {
    return results.rows[0];
  }
}

const changeCartItemQuantityIfUser = async (cartId, quantity, userId) => {
  const searchItem = await findCartItemIfUser(cartId, userId);
  if (typeof searchItem === 'string') {
    return searchItem;
  } else {
    const cartItem = await changeCartItemQuantity(cartId, quantity);
    return cartItem;
  }
}

const removeCartItem = async (id) => {
  const sql = 'DELETE FROM cart WHERE id = $1 RETURNING *';
  const results = await pool.query(sql, [id]);
  return results.rows[0]
}

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