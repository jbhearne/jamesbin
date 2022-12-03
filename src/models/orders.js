
const pool = require('./util/pool');

const getOrders = (request, response) => {
  pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getOrdersByUser = (request, response) => {
  //??? should i use param with a user route or authorization logic?
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM orders WHERE user_id = $1', [id], (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getOrderById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};


const createOrder = (request, response) => {
//??? should the dates be generated in the App or in Postgress
  const { userId, dateStarted } = request.body; //TODO: should I get user id from req.user object? yes because otherwise anyone could create an order for any other user. 
  console.log(userId + ' '+ dateStarted)
  pool.query('INSERT INTO orders (user_id, date_started) VALUES ($1, $2) RETURNING *', 
    [userId, dateStarted], 
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).send(`Order added with ID: ${results.rows[0].id}`);
  });
};

const updateOrder = (request, response) => {
  const id = parseInt(request.params.id);
  const { dateCompleted } = request.body;

  pool.query(
    'UPDATE orders SET date_completed = $1 WHERE id = $2',
    [dateCompleted, id],
    (error, results) => {
      if (error) {
        throw error;
      }
    response.status(200).send(`Order modified with ID: ${id}`);
  });
};

const deleteOrder = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Order deleted with ID: ${id}`);
  });
};

module.exports = {
    getOrders,
    getOrdersByUser,
    getOrderById,
    createOrder,
    updateOrder,
    deleteOrder
};
  