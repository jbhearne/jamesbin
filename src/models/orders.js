///////////////////////////////////////////////////
///functions for accessing the orders table///////

//import
const pool = require('./util/pool');
const { isOrderOpen, 
  defaultBillingAndDelivery,
  formatNewContact,
  formatNewDelivery,
  formatNewBilling,
  updateDelivery,
  updateBilling,
  addCCToBilling } = require('./util/findOrder');
const { collectCart } = require('./util/findCart');

//get all orders and send response objects
const getOrders = (request, response) => {
  pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//get all orders for a user specified by id parameter and sends response object.
const getOrdersByUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM orders WHERE user_id = $1', [id], (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });
};

//get an order from its id parameter and send a response object
const getOrderById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//creates a new order but only if the user does not already have an open order. all the data is handled internally, no request object needed.
const createOrder = async (request, response) => {
  const userId = request.user.id  //REVIEW: this should work if the user is creating an order, but would  not work if admin wanted to create an order for another user.
  const isOpen = await isOrderOpen(userId);

  if (isOpen) {
    response.status(400).send(`This user already has an order open. Open order ID: ${isOpen}`);
    } else {
    const { billingId, deliveryId } = await defaultBillingAndDelivery(userId); //DONE: PASS should create rows with primary keys in the new tables: 'billing' and 'delivery'
    
    pool.query('INSERT INTO orders (user_id, date_started, billing_id, delivery_id) VALUES ($1, NOW(), $2, $3) RETURNING *', 
      [userId, billingId, deliveryId], 
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`Order added with ID: ${results.rows[0].id}`);
    });
  }
};


//REVIEW add the ability to change delivery and billing info
//for closing or opening an order. requires request objecct with date the order is closed or null for open.
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

//deletes an ordder
const deleteOrder = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(204).send(`Order deleted with ID: ${id}`);
  });
};

//checkout updates order table and alters other related tables. requires a request object.
const checkout = async (request, response) => {
  const body = request.body;
  const user = request.user;
  const cart = await collectCart(user.id);  
  const amount = cart.total;

  const isNotOneOrder = cart.items.some((item) => item.order_id !== cart.items[0].order_id);
  if (isNotOneOrder) {
    throw Error('Multiple orders!')
  }

  const { delivery, billing } = cart
 
  if (!body.useDefaultDelivery){
    const deliveryContact = await formatNewContact(body.delivery.contact);
    const newDelivery = formatNewDelivery(delivery.id, body.delivery, deliveryContact);
    updateDelivery(delivery.id, newDelivery, newDelivery.contact.id); //REVIEW shoud this be an await even though I don't need the results necessarily.
  }
  
  if (!body.useDefaultBilling) {
    const billingContact = await formatNewContact(body.billing.contact);
    const newBilling = formatNewBilling(billing.id, body.billing, billingContact);
    updateBilling(billing.id, newBilling, newBilling.contact.id); //REVIEW "
  }
  
  addCCToBilling(body.ccPlaceholder, billing.id) //REVIEW  "
  
  const sql = 'UPDATE orders SET date_completed = NOW(), amount = $1 WHERE id = $2 RETURNING *;'

  pool.query(sql, [amount, cart.items[0].order_id], (error, results) => {
    if (error) {
      throw error;
    }
    console.log('inside')
    response.status(200).send(`Order #${results.rows[0].id} completed for ${results.rows[0].amount}`);
  })
}

module.exports = {
  getOrders,
  getOrdersByUser,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  checkout
};
