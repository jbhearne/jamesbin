///////////////////////////////////////////////////
///Order based HTTP requests/response for RESTful API///////

//import
const pool = require('./util/pool');
const { 
  isOrderOpen, 
  defaultBillingAndDelivery,
  updateDelivery,
  updateBilling,
  addCCToBilling,
  findAllOrders,
  findOrderById,
  findOrderByUserId,
  changeOrder,
  removeOrder,
  completeOrderNow
} = require('./util/findOrder');
//DONE PASS
const { 
  formatContactOutput,
  formatNewDelivery,
  formatNewBilling 
} = require('./util/formatOutput')
const { collectCart } = require('./util/findCart');
const { addContactInfo } =require('./util/findContact')

//get all orders and send response objects
const getOrders = async (request, response) => {
  const orders = await findAllOrders();
  response.status(200).json(orders);
  /*pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });*/
};

//get all orders for a user specified by id parameter and sends response object.
const getOrdersByUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const order = await findOrderByUserId(id);
  response.status(200).json(order);
  /*pool.query('SELECT * FROM orders WHERE user_id = $1', [id], (error, results) => {
    if (error) {
    throw error;
    }
    response.status(200).json(results.rows);
  });*/
};

//get an order from its id parameter and send a response object
const getOrderById = async (request, response) => {
  const id = parseInt(request.params.id);
  const order = await findOrderById(id);
  response.status(200).json(order);
  /*pool.query('SELECT * FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });*/
};

//creates a new order but only if the user does not already have an open order. all the data is handled internally, no request object needed.
const createOrder = async (request, response) => {
  const userId = request.user.id
  const order = await addOrderOnUser(userId)
  if (typeof order === 'object') {  //IDEA create an error checking function that makes sure user object conforms to spec.
    response.status(201).send(`User created with ID: ${order.id}`);
  } else if (typeof order === 'string') {
    response.status(400).send(order);
  } else {
    throw Error(`deletedUser = ${order}`);
  }
  /*const isOpen = await isOrderOpen(userId);

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
  }*/
};


//REVIEW add the ability to change delivery and billing info
//for closing or opening an order. requires request objecct with date the order is closed or null for open.
const updateOrder = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const order = await changeOrder(id, updates);
  response.status(200).send(`Order modified with ID: ${order.id}`);

  /*const { dateCompleted } = request.body;

  pool.query(
    'UPDATE orders SET date_completed = $1 WHERE id = $2',
    [dateCompleted, id],
    (error, results) => {
      if (error) {
        throw error;
      }
    response.status(200).send(`Order modified with ID: ${id}`);
  });*/
};

//deletes an ordder
const deleteOrder = async (request, response) => {
  const id = parseInt(request.params.id);
  const order = await removeOrder(id)
  response.status(204).send(`Order deleted with ID: ${order.id}`);
  /*pool.query('DELETE FROM orders WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(204).send(`Order deleted with ID: ${id}`);
  });*/
};

//DONE PASS
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
 
  if (!body.useDefaultDelivery){
    const newContactD = await addContactInfo(body.delivery.contact);
    const deliveryContact = formatContactOutput(newContactD);
    const newDelivery = formatNewDelivery(cart.delivery.id, body.delivery, deliveryContact);
    updateDelivery(cart.delivery.id, newDelivery, newDelivery.contact.id); //REVIEW shoud this be an await even though I don't need the results necessarily.
  }
  
  if (!body.useDefaultBilling) {
    const newContactB = await addContactInfo(body.billing.contact);
    const billingContact = formatContactOutput(newContactB);
    const newBilling = formatNewBilling(cart.billing.id, body.billing, billingContact);
    updateBilling(cart.billing.id, newBilling, newBilling.contact.id); //REVIEW "
  }
  
  addCCToBilling(body.ccPlaceholder, cart.billing.id) //REVIEW  "
  
  const finishedOrder = await completeOrderNow(amount, cart.items[0].order_id);

  //TODO add a format function to display order/cart/billing/delivery info
  
  response.status(200).send(`Order #${finishedOrder.id} completed for ${finishedOrder.amount}`);
  /*const sql = 'UPDATE orders SET date_completed = NOW(), amount = $1 WHERE id = $2 RETURNING *;'

  pool.query(sql, [amount, cart.items[0].order_id], (error, results) => {
    if (error) {
      throw error;
    }
    console.log('inside')
    response.status(200).send(`Order #${results.rows[0].id} completed for ${results.rows[0].amount}`);
  })*/
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
