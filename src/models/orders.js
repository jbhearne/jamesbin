///////////////////////////////////////////////////
///Order based HTTP requests/response for RESTful API///////

//import
const { 
  updateDelivery,
  updateBilling,
  addCCToBilling,
  findAllOrders,
  findOrderById,
  findOrderByUserId,
  addOrderOnUser,
  changeOrder,
  removeOrder,
  completeOrderNow
} = require('./util/findOrder');

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
}

//get all orders for a user specified by id parameter and sends response object.
const getOrdersByUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const orders = await findOrderByUserId(id);
  response.status(200).json(orders);
}

//get an order from its id parameter and send a response object
const getOrderById = async (request, response) => {
  const id = parseInt(request.params.id);
  const order = await findOrderById(id);
  response.status(200).json(order);
}

//creates a new order but only if the user does not already have an open order. all the data is handled internally, no request object needed.
const createOrder = async (request, response) => {
  const userId = request.user.id
  const order = await addOrderOnUser(userId)
  if (typeof order === 'object') {  //IDEA create an error checking function that makes sure user object conforms to spec.
    response.status(201).send(`Order created with ID: ${order.id}`);
  } else if (typeof order === 'string') {
    response.status(400).send(order);
  } else {
    throw Error(`deletedUser = ${order}`);
  }
}

//REVIEW add the ability to change delivery and billing info
//for closing or opening an order. requires request objecct with date the order is closed or null for open.
const updateOrder = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const order = await changeOrder(id, updates);
  response.status(200).send(`Order modified with ID: ${order.id}`);
}

//deletes an ordder
const deleteOrder = async (request, response) => {
  const id = parseInt(request.params.id);
  const order = await removeOrder(id)
  response.status(200).send(`Order deleted with ID: ${order.id}`);
}

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
    await updateDelivery(cart.delivery.id, newDelivery, newDelivery.contact.id);
  }
  
  if (!body.useDefaultBilling) {
    const newContactB = await addContactInfo(body.billing.contact);
    const billingContact = formatContactOutput(newContactB);
    const newBilling = formatNewBilling(cart.billing.id, body.billing, billingContact);
    await updateBilling(cart.billing.id, newBilling, newBilling.contact.id);
  }
  
  addCCToBilling(body.ccPlaceholder, cart.billing.id)
  
  const finishedOrder = await completeOrderNow(amount, cart.items[0].order_id);

  //TODO add a format function to display order/cart/billing/delivery info
  
  response.status(200).send(`Order #${finishedOrder.id} completed for ${finishedOrder.amount}`);
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
