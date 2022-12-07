
const { orders } = require('.');
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
const { response } = require('express');

const getOrders = (request, response) => {
  pool.query('SELECT * FROM orders ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getOrdersByUser = (request, response) => {
  //DONE: ??? should i use param with a user route or authorization logic?
  //REVIEW: ??? #getOrdersByUser do i need this function or should I use more logic  in getOrders?
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


const createOrder = async (request, response) => {
//DONE: ??? should the dates be generated in the App or in Postgress
  //DONE: const { userId, dateStarted } = request.body; //TODO: should I get user id from req.user object? yes because otherwise anyone could create an order for any other user. 
  const userId = request.user.id  //REVIEW: this should work if the user is creating an order, but would  not work if admin wanted to create an order for another user.
  //GARBAGE - console.log(userId + ' '+ dateStarted)
  const isOpen = await isOrderOpen(userId); //DONE: PASS this should make it so that only one open order can be created at one time.
  if (isOpen) {
    response.status(400).send(`This user already has an order open. Open order ID: ${isOpen}`);
    } else {
    const { billingId, deliveryId } = await defaultBillingAndDelivery(userId); //DONE: PASS should create rows with primary keys in the new tables: 'billing' and 'delivery'
    console.log(billingId + ' - ' + deliveryId)
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
    response.status(204).send(`Order deleted with ID: ${id}`);
  });
};

//DONE: PASS: the checkout function completes the order, but first checks tp see if the user wants to use the default delivery option or add new info
//REVIEW I am sure there is a less awkward way of doing this.
const checkout = async (request, response) => {
  const body = request.body;
  const user = request.user;
  const cart = await collectCart(user.id);  
  const amount = cart.total;
  console.log(amount)
  const isNotOneOrder = cart.items.some((item) => item.order_id !== cart.items[0].order_id);
  if (isNotOneOrder) {
    throw Error('Multiple orders!')
  }
  console.log(body.useDefaultDelivery + 'deliv')
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
  console.log('after conditional')
  addCCToBilling(body.ccPlaceholder, billing.id) //REVIEW  "
  const sql = 'UPDATE orders SET date_completed = NOW(), amount = $1 WHERE id = $2 RETURNING *;'
  console.log('afterCC')
  console.log(cart.items[0].order_id)
  pool.query(sql, [amount, cart.items[0].order_id], (error, results) => {
    if (error) {
      throw error;
    }
    console.log('inside')
    response.status(200).send(`Order #${results.rows[0].id} completed for ${results.rows[0].amount}`);
    //response.status(200).send(`Order  completed for `);
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
