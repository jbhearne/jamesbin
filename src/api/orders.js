///////////////////////////////////////////////////
///Order based HTTP requests/response for RESTful API///////

//import
const { checkForFoundRowObj, checkForFoundRowsArr } = require('../models/util/checkFind')
const { 
  updateDelivery,
  updateBilling,
  addCCToBilling,
  findAllOrders,
  findOrderById,
  findOrdersByUserId,
  addOrderOnUser,
  changeOrder,
  removeOrder,
  completeOrderNow
} = require('../models/findOrder');

const { 
  formatContactOutput,
  formatNewDelivery,
  formatNewBilling 
} = require('../models/util/formatOutput')
const { collectCart } = require('../models/findCart');
const { addContactInfo } =require('../models/findContact')

//get all orders and send response objects
const getOrders = async (request, response) => {
  const orders = await findAllOrders();
  response.status(200).json(orders);
  try {
    const orders = await findAllOrders();
    const check = checkForFoundRowsArr(orders);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//get all orders for a user specified by id parameter and sends response object.
const getOrdersByUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const orders = await findOrdersByUserId(id);
    const check = checkForFoundRowsArr(orders);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//get an order from its id parameter and send a response object
const getOrderById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const order = await findOrderById(id);
    const check = checkForFoundRowObj(order);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//creates a new order but only if the user does not already have an open order. all the data is handled internally, no request object needed.
const createOrder = async (request, response) => {
  const userId = request.user.id
  try {
    const order = await addOrderOnUser(userId)
    const check = checkForFoundRowObj(order);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Order created with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//REVIEW add the ability to change delivery and billing info
//for closing or opening an order. requires request objecct with date the order is closed or null for open.
const updateOrder = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const order = await changeOrder(id, updates);
  response.status(200).send(`Order modified with ID: ${order.id}`);
  try {
    const order = await changeOrder(id, updates);
    const check = checkForFoundRowObj(order);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Order modified with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//deletes an ordder
const deleteOrder = async (request, response) => {
  const id = parseInt(request.params.id);
  const order = await removeOrder(id)
  response.status(200).send(`Order deleted with ID: ${order.id}`);
  try {
    const order = await removeOrder(id);
    const check = checkForFoundRowObj(order);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Order deleted with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//checkout updates order table and alters other related tables. requires a request object.
const checkout = async (request, response) => {
  const body = request.body;
  const user = request.user;
  try {
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
      await updateDelivery(cart.delivery.id, newDelivery, newDelivery.contact.id);
    }
    
    if (!body.useDefaultBilling) {
      const newContactB = await addContactInfo(body.billing.contact);
      const billingContact = formatContactOutput(newContactB);
      const newBilling = formatNewBilling(cart.billing.id, body.billing, billingContact);
      await updateBilling(cart.billing.id, newBilling, newBilling.contact.id);
    }
    
    await addCCToBilling(body.ccPlaceholder, cart.billing.id)
    
    const finishedOrder = await completeOrderNow(amount, cart.items[0].order_id);
    const check = checkForFoundRowObj(finishedOrder);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Order #${check.results.id} completed for ${check.results.amount}`);
    //TODO add a format function to display order/cart/billing/delivery info

  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
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
