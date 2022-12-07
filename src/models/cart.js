
const pool = require('./util/pool');
//GARBAGE: const { checkManyToOne } = require('./util/check-relation');
const orderComplete = require('./util/orderCompleted');
const { collectCart } = require('./util/findCart');
const { isProductExtant } = require('./util/findProduct')
const { cart } = require('.');
//const { checkout } = require('../routes/orders'); //NOTE VS code imported this with out me knowing and it broke my code for a bit. I should watch my naming better.
//GARBAGE: const { response } = require('express');


//TODO: rename appropiate functions to ...CartItem
const getCart = (request, response) => {
  pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCartByOrder = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM cart WHERE order_id = $1', [id], (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCartById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM cart WHERE id = $1', [id], (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });
};

//REVIEW: these are simlar getCartWithProductsByUser and getCartForCheckout. But this can be used by admin to get any users cart
const getCartWithProductsByUser = (request, response) => {
  const id = parseInt(request.params.id);
  const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL;';
  
  pool.query(sql, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
}

const getCartForCheckout = async (request, response) => { 
  const user = request.user;
  //TODO: add check constraint to database to ensure there is only one open order for a given user.
  /*GARBAGE: const sql = "SELECT cart.order_id, cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) AS qty_total\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL;"

  pool.query(sql, [user.id], async(error, results) => {
    if (error) {
      throw error;
    }
    const rows = await results.rows;
    const total = rows.reduce((sum, row) => sum + Number(row.qty_total.replace(/[^0-9.-]+/g,"")), 0); //DONE: PASS should convert dollar string to number.
    const checkout = { rows, total }
    response.status(200).send(checkout);
  });*/
  
  const checkoutCart = await collectCart(user.id)
  console.log(checkoutCart)
  /*try {
    const checkoutCart = await collectCart(user.id) //DONE FIXME error when no open orders, must handle logic
    console.log(checkoutCart)
  } catch (error) {
    response.status(400).send(`No order ${error}.`);
  }*/
  if (typeof checkoutCart === 'string') { //REVIEW: I know i need to work on this so that it works more through a traditional error handling
    response.status(400).send(checkoutCart);
  } else {
  response.status(200).send(checkoutCart);
  }
}

const createCartItem = async (request, response) => { //DONE: TODO: rename to createCartItem
    //GARBAGE: ??? should the dates be generated in the App or in Postgress
    //SELECT * FROM orders WHERE user_id = request.user.id AND date_completed IS NULL;
    //DONE: PASS: TODO: if a user is creating a cart item it needs to belong to an non-completed order owned by the user
  //DONE: PASS: const { orderId, productId, quantity } = request.body; //TODO: should I get order id from some other source like req.user? yes because otherwise anyone could create an order for any other user. 
 
  const { productId, quantity } = request.body;
  const userId =  request.user.id
  const order = await pool.query('SELECT * FROM orders WHERE user_id = $1 AND date_completed IS NULL;', [userId]) //DONE: FIXME error when attempting to add to cart on nonexistant order need logic to handle this.
  const isProduct = await isProductExtant(productId)
  //console.log(order.rows)
  console.log(!!!order.rows + ' order.rows')
  console.log(isProduct)
  if (order.rows.length === 0) {                      //NOTE: maybe not...LEARNED double exclamation forces a falsy/truthy to real boolean but, triple to negate truthy value,  single ! does not negate the value of an object or array.
    response.status(400).send(`Must initialize order first.`);
  } else if (!isProduct) {
    response.status(400).send(`Product #${productId} does not exist.`);
  } else {
    const orderId = order.rows[0].id
    pool.query('INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', //DONE: FIXME error happens when trying to add product that does not exist
      [orderId, productId, quantity], 
      (error, results) => {
        if (error) {
        throw error;
        }
        response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);  
    });
  }
};

const createCartItemOnOrder = async (request, response) => { 
  const id = parseInt(request.params.id);
  const { productId, quantity } = request.body;
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
  }
};

const updateCart = async (request, response, next) => {
  //GARBAGE: console.log('%c test updateCart', 'color: #ff0000')
  console.log('\x1B[31mtest updateCart \x1B[37m')  //LEARNED how to color text in BASH console.
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const isComplete = await orderComplete(id)
  console.log('7:: ' + isComplete + ' after call to orderComplete in cart.js')
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
        console.log('8:: updated the cart qty')
        setTimeout(() => {console.log('9:: ' + isComplete + ' has orderComplete resolved?')}, 1000 ) 
      response.status(200).send(`Cart modified with ID: ${id}`);
    });
  }
};

//DONE: PASS added this to update carts for user
const updateCartWithUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const userId = request.user.id
  const sql = 'SELECT cart.id FROM cart JOIN orders ON cart.order_id = orders.id WHERE orders.user_id = $1'
  const userCart = await pool.query(sql, [userId])
  console.log(userCart.rows)
  const carts = [];
  for (let cart in userCart.rows) {
    console.log(userCart.rows[cart].id)
    carts.push(userCart.rows[cart].id)
  }
  console.log(carts)
  if (carts.includes(id)) {
    const isComplete = await orderComplete(id)
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
          console.log('8:: updated the cart qty')
          setTimeout(() => {console.log('9:: ' + isComplete + ' has orderComplete resolved?')}, 1000 ) 
        response.status(200).send(`Cart modified with ID: ${id}`);
      });
    }
  } else {
    response.status(400).send(`Cart id: ${id} does not belong to current user`);
  }
};

/*DONE: ??? started this function, but realized that since there are multiple cart items per user/order it does not make sense.
//i need to create a function or alter the above that allows for the slection of cart items by id, but only those that belong to the user.
  const updateCartByUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const user = await pool.query('SELECT * FROM users WHERE id = $1', [id]
  const isComplete = await orderComplete()

}*/

const deleteCart = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM cart WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Cart deleted with ID: ${id}`);
  });
};

//ANCHOR[id=deleteCartWithUser] adding a method for removing cart items
const deleteCartWithUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const userId = request.user.id
  const sql = 'SELECT cart.id FROM cart JOIN orders ON cart.order_id = orders.id WHERE orders.user_id = $1'
  const userCart = await pool.query(sql, [userId])
  console.log(userCart.rows)
  const carts = [];
  for (let cart in userCart.rows) {
    console.log(userCart.rows[cart].id)
    carts.push(userCart.rows[cart].id)
  }
  console.log(carts)
  if (carts.includes(id)) {
    const isComplete = await orderComplete(id)
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
          //GARBAGE: console.log('8:: updated the cart qty')
          //setTimeout(() => {console.log('9:: ' + isComplete + ' has orderComplete resolved?')}, 1000 ) 
        response.status(200).send(`Cart deleted with ID: ${id}`);
      });
    }
  } else {
    response.status(400).send(`Cart id: ${id} does not belong to current user`);
  }
};

module.exports = {
    getCart,
    getCartByOrder,
    getCartById,
    createCartItem,
    updateCart,
    deleteCart,
    getCartWithProductsByUser,
    updateCartWithUser,
    createCartItemOnOrder,
    deleteCartWithUser,
    getCartForCheckout
};