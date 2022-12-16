//////////////////////////////////////////////
////functions for accessing the cart table///

//inport
const pool = require('./util/pool');
const { isItemOnCompleteOrder } = require('./util/findOrder');
const { 
  collectCart,
  findAllCartItems,
  findCartItemById,
  findCartByOrderId,
  findAllCurrentCartItemsWithProductsByUser,
  addCartItemToUserOrder,
  addCartItemOnOrder,
  changeCartItemQuantity,
  changeCartItemQuantityIfUser,
  removeCartItem,
  removeCartItemIfUser
} = require('./util/findCart');
const { isProductExtant } = require('./util/findProduct');

//DONE PASS
//REFACTOR[id=additem] rename appropiate functions to ...CartItem
//gets all cart items sends a response object
const getCartItems = async (request, response) => {
  const cartItems = findAllCartItems();
  response.status(200).json(cartItems);
  /*pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });*/
};


//gets all cart items for a specidfied order. sends a response object.
const getCartByOrderId = async (request, response) => {
  const id = parseInt(request.params.id);
  const cart = await findCartByOrderId(id);
  response.status(200).json(cart);
  /*pool.query('SELECT * FROM cart WHERE order_id = $1', [id], (error, results) => {
    if (error) {
    throw error;functions
    }
    response.status(200).json(results.rows);
  });*/
};

//gets a cart item by its id. sends a response object
const getCartItemById = async (request, response) => {
  const id = parseInt(request.params.id);
  const cartItem = await findCartItemById(id);
  response.status(200).json(cartItem);
  /*pool.query('SELECT * FROM cart WHERE id = $1', [id], (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });*/
};

//gets all items on an order and the coresponding product info from products table. Sends a response object. this is what a "cart" is.
const getCartWithProductsByUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const cartItems = await findAllCurrentCartItemsWithProductsByUser(id);
  response.status(200).json(cartItems);
  /*const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL;';
  
  pool.query(sql, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });*/
}

//similar to above with subtotals and total plus delivery and billing info
const getCartForCheckout = async (request, response) => { 
  const user = request.user;
  //TODO: add check constraint to database to ensure there is only one open order for a given user.
  const checkoutCart = await collectCart(user.id)

  if (typeof checkoutCart === 'string') { //REVIEW: I know i need to work on this so that it works more through a traditional error handling
    response.status(400).send(checkoutCart);
  } else {
  response.status(200).send(checkoutCart);
  }
}

//create a cart item on the current user's open order. expects a request.
const createCartItem = async (request, response) => {
  const newCartItem = request.body;
  const userId =  request.user.id
  const cartItem = await addCartItemToUserOrder(userId, newCartItem);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item added with ID: ${cartItem.id}`);
  }
  /*const order = await pool.query('SELECT * FROM orders WHERE user_id = $1 AND date_completed IS NULL;', [userId])
  const isProduct = await isProductExtant(productId)

  if (order.rows.length === 0) {
    response.status(400).send(`Must initialize order first.`);
  } else if (!isProduct) {
    response.status(400).send(`Product #${productId} does not exist.`);
  } else {
    const orderId = order.rows[0].id
    pool.query('INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [orderId, productId, quantity], 
      (error, results) => {
        if (error) {
        throw error;
        }
        response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);  
    });
  }*/
};

//create a cart item on an arbitary order as specified. send a response.
const createCartItemOnOrder = async (request, response) => { 
  const id = parseInt(request.params.id);
  const newCartItem = request.body;
  const cartItem = await addCartItemOnOrder(id, newCartItem);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item added with ID: ${cartItem.id}`);
  }
  /*const { productId, quantity } = request.body;
  const order = await pool.query('SELECT * FROM orders WHERE id = $1;', [id])
  
  if (!order.rows[0].date_completed) {
    pool.query('INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', 
      [id, productId, quantity], 
      async (error, results) => {
        if (error) {
        throw error;
        }
        response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);
    });
  } else {
    response.status(400).send(`Order ${id} is already complete`);
  }*/
};

//updates the quantity of an item in the cart as specified by cart id.
const updateCartItem = async (request, response, next) => {
  //console.log('\x1B[31mtest updateCartItem \x1B[37m')  //LEARNED how to color text in BASH console.
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const cartItem = await changeCartItemQuantity(id, quantity);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item ID: ${cartItem.id} updated.`);
  }
  /*const isComplete = await isItemOnCompleteOrder(id);

  if (isComplete) {
    response.status(400).send(`Cart id: ${id} belongs to order that is already complete`);
    next();
  } else {

    pool.query(
      'UPDATE cart SET quantity = $1 WHERE id = $2',
      [quantity, id],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(200).send(`Cart modified with ID: ${id}`);
      });
  }*/
};

//similar to above, but checks if the cart belongs to current user and the order is still open.
const updateCartItemIfUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const userId = request.user.id
  const cartItem = await changeCartItemQuantityIfUser(id, quantity, userId);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item ID: ${cartItem.id} updated.`);
  }
  /*const sql = 'SELECT cart.id FROM cart JOIN orders ON cart.order_id = orders.id WHERE orders.user_id = $1'
  const userCart = await pool.query(sql, [userId])
  console.log(userCart.rows)
  const carts = [];
  for (let cart in userCart.rows) {
    console.log(userCart.rows[cart].id)
    carts.push(userCart.rows[cart].id)
  }
  console.log(carts)
  if (carts.includes(id)) {
    const isComplete = await isItemOnCompleteOrder(id)
    if (isComplete) {
      response.status(400).send(`Cart id: ${id} belongs to order that is already complete`);
      next();
    } else {

      pool.query(
        'UPDATE cart SET quantity = $1 WHERE id = $2',
        [quantity, id],
        (error, results) => {
          if (error) {
            throw error;
          }
        response.status(200).send(`Cart modified with ID: ${id}`);
      });
    }
  } else {
    response.status(400).send(`Cart id: ${id} does not belong to current user`);
  }*/
}

//deletes a cart item. 
const deleteCartItem = async (request, response) => {
  const id = parseInt(request.params.id);
  const cartItem = await removeCartItem(id);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(204).send(`Cart item ID: ${cartItem.id} deleted.`);
  }
  /*pool.query('DELETE FROM cart WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Cart deleted with ID: ${id}`);
  });*/
}

//same as above, but checks to make sure cart items belong to current user.
const deleteCartItemIfUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const userId = request.user.id
  const cartItem = await removeCartItemIfUser(id, userId);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(204).send(`Cart item ID: ${cartItem.id} deleted.`);
  }
  /*const sql = 'SELECT cart.id FROM cart JOIN orders ON cart.order_id = orders.id WHERE orders.user_id = $1'
  const userCart = await pool.query(sql, [userId])
  const carts = [];
  
  for (let cart in userCart.rows) {
    carts.push(userCart.rows[cart].id)
  }

  if (carts.includes(id)) {
    const isComplete = await isItemOnCompleteOrder(id)
    if (isComplete) {
      response.status(400).send(`Cart id: ${id} belongs to order that is already complete`);
      next();
    } else {
      pool.query(
        'DELETE FROM cart WHERE id = $1',
        [id],
        (error, results) => {
          if (error) {
            throw error;
          }
        response.status(200).send(`Cart deleted with ID: ${id}`);
      });
    }
  } else {
    response.status(400).send(`Cart id: ${id} does not belong to current user`);
  }*/
};


module.exports = {
    getCartItems,
    getCartByOrderId,
    getCartItemById,
    createCartItem,
    updateCartItem,
    deleteCartItem,
    getCartWithProductsByUser,
    updateCartItemIfUser,
    createCartItemOnOrder,
    deleteCartItemIfUser,
    getCartForCheckout
};
//!REFACTOR