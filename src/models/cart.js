
const pool = require('./pool');

const getCart = (request, response) => {
  pool.query('SELECT * FROM cart ORDER BY id ASC', (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getCartByOrder = (request, response) => {
  const { orderId } = request.body;
  pool.query('SELECT * FROM cart WHERE order_id = $1', [orderId], (error, results) => {
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


const createCart = (request, response) => {
    //should the dates be generated in the App or in Postgress
  const { orderId, productId, quantity } = request.body;

  pool.query('INSERT INTO cart (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *', 
    [orderId, productId, quantity], 
    (error, results) => {
      if (error) {
      throw error;
      }
      response.status(201).send(`Cart added with ID: ${results.rows[0].id}`);
  });
};

const updateCart = (request, response) => {
  const id = parseInt(request.params.id)
  const { quantity } = request.body

  pool.query(
    'UPDATE cart SET quantity = $1 WHERE id = $2',
    [quantity, id],
    (error, results) => {
      if (error) {
        throw error;
      }
    response.status(200).send(`Cart modified with ID: ${id}`);
  });
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
    deleteCart
};