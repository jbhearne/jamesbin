
const pool = require('./util/pool');
//GARBAGE: const { checkManyToOne } = require('./util/check-relation');
const orderComplete = require('./util/orderCompleted');
//const { response } = require('express');

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

const createCart = (request, response) => {
    //??? should the dates be generated in the App or in Postgress
  const { orderId, productId, quantity } = request.body; //TODO: should I get order id from some other source like req.user? yes because otherwise anyone could create an order for any other user. 

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
  console.log('\x1B[31mtest updateCart \x1B[37m')
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
    getCartWithProductsByUser
};