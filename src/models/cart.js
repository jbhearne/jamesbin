
const pool = require('./util/pool');
//GARBAGE: const { checkManyToOne } = require('./util/check-relation');
const orderComplete = require('./util/orderCompleted');
const { cart } = require('.');
//GARBAGE: const { response } = require('express');

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

const getCartWithProductsByUser = (request, response) => {
  const id = parseInt(request.params.id);
  const sql = 'SELECT cart.id, cart.order_id, cart.product_id, products.name, products.price, cart.quantity\
   FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
   WHERE orders.user_id = $1 AND orders.date_completed IS NULL;'
  
  pool.query(sql, [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
}

const createCart = async (request, response) => { //TODO: rename to createCartItem
    //GARBAGE: ??? should the dates be generated in the App or in Postgress
    //SELECT * FROM orders WHERE user_id = request.user.id AND date_completed IS NULL;
    //DONE: PASS: TODO: if a user is creating a cart item it needs to belong to an non-completed order owned by the user
  //DONE: PASS: const { orderId, productId, quantity } = request.body; //TODO: should I get order id from some other source like req.user? yes because otherwise anyone could create an order for any other user. 
 
  const { productId, quantity } = request.body;
  const userId =  request.user.id
  const order = await pool.query('SELECT * FROM orders WHERE user_id = $1 AND date_completed IS NULL;', [userId])
  const orderId = order.rows[0].id
  pool.query('INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', 
    [orderId, productId, quantity], 
    (error, results) => {
      if (error) {
      throw error;
      }
      response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);
  });
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

/*??? started this function, but realized that since there are multiple cart items per user/order it does not make sense.
//i need to create a functio or alter the above that allows for the slection of cart items by id, but only those that belong to the user.
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

module.exports = {
    getCart,
    getCartByOrder,
    getCartById,
    createCart,
    updateCart,
    deleteCart,
    getCartWithProductsByUser,
    updateCartWithUser
};