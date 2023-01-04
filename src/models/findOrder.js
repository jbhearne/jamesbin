///////////////////////////////////////////////  
//Functions related to querying orders table//

//import and create pool
const pool = require('./util/pool');
const { messageNoResults, checkNoResults } = require('./util/checkFind');

//checks to see if the current user has order that has not yet been completed.
//Returns false if they have no open order OR returns the order object if there is an open order.
const isOrderOpen = async (userId) => {
  const orders = await pool.query('SELECT id FROM orders WHERE user_id = $1 AND date_completed IS NULL', [userId])
  if (orders.rows.length === 0) {
    return false;
  } else if (orders.rows.length === 1) {
    return orders.rows[0].id;
  } else {
    throw Error('multiple open orders') //REVIEW might be a more proactive way to handle this.
  }
}

//checks if the specified cart (ID) belongs to a complete order. Returns true if it does and false if it does not. 
const isItemOnCompleteOrder = async id => {
  const result = await pool.query(
    'SELECT orders.date_completed FROM cart JOIN orders ON cart.order_id = orders.id WHERE cart.id = $1',
    [id]); ////LEARNED:  no callback... pool.query returns the results and can be used with async/await to create asyncronous functions/modules.
  let notNull = false;
  if (result.rows.length === 1) {
    if (result.rows[0].date_completed) {
      notNull = true;
      //console.log(result.rows[0].date_completed);
    } 
  } else if (result.rows.length > 1) {
    throw Error('Multiple Rows.');
  }
  return notNull;
}

//sets default values for billing and delivery to the current users name, contact info and other preset values. 
//Returns an object with the IDs for both delivery row and billing row.
const defaultBillingAndDelivery = async (userId) => {
  const results =  await pool.query('SELECT * FROM users WHERE id = $1', [userId])
  const noResults = messageNoResults(results);
  if (noResults) throw Error('User query failed: ' + noResults);
  const { fullname, contact_id } = results.rows[0]

  const defaultBillingMethod = 'credit card'
  const defaultDeliveryMethod = 'standard shipping' //ANCHOR[id=defaultMethod] - change some other selection method.
  
  const createdBilling = await pool.query('INSERT INTO billing (payer_name, method, contact_id) VALUES ($1, $2, $3) RETURNING *;',
  [ fullname, defaultBillingMethod, contact_id, ]);
  const billingResults = messageNoResults(createdBilling);
  if (billingResults) throw Error('Did not return billing info: ' + noResults);
  const createdDelivery = await pool.query('INSERT INTO delivery (receiver_name, method, contact_id) VALUES ($1, $2, $3) RETURNING *;',
  [ fullname, defaultDeliveryMethod, contact_id, ]);
  const deliveryResults = messageNoResults(createdDelivery);
  if (deliveryResults) throw Error('Did not return delivery info: ' + noResults);
  return {
    billingId: createdBilling.rows[0].id,
    deliveryId: createdDelivery.rows[0].id
  }
}

//queries billing and contact tables using the order ID. Returns object that contains billing/contact info.
const findBillingInfo = async (orderId) => {
  const sql = 'SELECT orders.billing_id, billing.payer_name, billing.method, billing.contact_id, billing.cc_placeholder,\
   contact.phone, contact.address, contact.city, contact.state, contact.zip, contact.email\
   FROM orders JOIN billing ON orders.billing_id = billing.id JOIN contact ON billing.contact_id = contact.id\
    WHERE orders.id = $1'

  const results  = await pool.query(sql, [orderId]);
  const noResults = messageNoResults(results);
  if (noResults) throw Error('Did not return billing info: ' + noResults);
  const billing = results.rows[0];

  const info = {
    id: billing.billing_id,
    payerName: billing.payer_name,
    paymentMethod: billing.method,
    contact: {
      id: billing.contact_id,
      phone: billing.phone,
      address: billing.address,
      city: billing.city,
      state: billing.state,
      zip: billing.zip,
      email: billing.email
    }
  }
  return info;
}

//queries delivery and contact tables using the order ID. Returns object that contains delivery/contact info.
const findDeliveryInfo = async (orderId) => {
  const sql = 'SELECT orders.delivery_id, delivery.receiver_name, delivery.method, delivery.contact_id, delivery.notes,\
   contact.phone, contact.address, contact.city, contact.state, contact.zip, contact.email\
   FROM orders JOIN delivery ON orders.delivery_id = delivery.id JOIN contact ON delivery.contact_id = contact.id\
    WHERE orders.id = $1'

  const results  = await pool.query(sql, [orderId]);
  const noResults = messageNoResults(results);
  if (noResults) throw Error('Did not return delivery info: ' + noResults);
  const delivery = results.rows[0];

  const info = {
    id: delivery.delivery_id,
    receiverName: delivery.receiver_name,
    deliveryMethod: delivery.method,
    contact: {
      id: delivery.contact_id,
      phone: delivery.phone,
      address: delivery.address,
      city: delivery.city,
      state: delivery.state,
      zip: delivery.zip,
      email: delivery.email
    }
  }
  return info;
}

//change the values of the delivery table entry as specified by the delivery ID.
//values are determined by a delivery object (updates) and the contact ID.
//returns the updated delivery object.
const updateDelivery = async (deliveryId, updates, contactId) => {
  const { receiverName, deliveryMethod, notes } = updates
  const sql = 'UPDATE delivery SET receiver_name = $1, method = $2, notes = $3, contact_id = $4 WHERE id = $5 RETURNING *;';

  const results = await pool.query(sql, [receiverName, deliveryMethod, notes, contactId, deliveryId])
  const noResults = messageNoResults(results);
  if (noResults) throw Error('Did not return delivery info: ' + noResults);

  return results.rows[0]
}

//change the values of the billing table entry as specified by the billing ID.
//values are determined by a billing object (updates) and the contact ID.
//returns the updated billing object.
const updateBilling = async (billingId, updates, contactId) => {
  const { payerName, paymentMethod } = updates
  const sql = 'UPDATE billing SET payer_name = $1, method = $2, contact_id = $3 WHERE id = $4 RETURNING *;';

  const results = await pool.query(sql, [payerName, paymentMethod, contactId, billingId])
  const noResults = messageNoResults(results);
  if (noResults) throw Error('Did not return billing info: ' + noResults);

  return results.rows[0]
}

//a way to add creditcard info, but not really. just a flourish in that direction.
const addCCToBilling = async (cc, billingId) => {
  const sql = 'UPDATE billing SET cc_placeholder = $1 WHERE id = $2 RETURNING *';
  const  results = pool.query(sql, [cc, billingId]);
  const noResults = messageNoResults(results);
  if (noResults) throw Error('Did not return billing/CC info: ' + noResults);
  return results;
}

//returns an array of all orders from the database
const findAllOrders = async () => {
  const sql = 'SELECT * FROM orders ORDER BY id ASC';
  const results = await pool.query(sql)
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  return results.rows
}

//returns a order object from the database as specified by the orders id
const findOrderById = async (id) => {
  const sql = 'SELECT * FROM orders WHERE id = $1';
  const results = await pool.query(sql, [id]);
  if (results.rows.length === 0) {
    return 'No orders started';
  } else {
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    return results.rows[0];
  }
}

//returns an array of all orders from a single user as specified by the user id.
const findOrdersByUserId = async (id) => {
  const  sql = 'SELECT * FROM orders WHERE user_id = $1';
  const results = await pool.query(sql, [id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const  orderArr = results.rows; 
  return orderArr;
}

//returns an order object that has not been completed from a single user as specified by the user id.
const findOpenOrderByUserId = async (userId) => {
  const sql = 'SELECT * FROM orders WHERE user_id = $1 AND date_completed IS NULL;';
  const results = await pool.query(sql, [userId]);
  if (results.rows.length === 0) {
    return 'No orders started';
  } else {
    const noResults = checkNoResults(results);
    if (noResults) return noResults;
    return results.rows[0];
  }
}

//takes a new order object and inserts it into the orders table.
const addOrder = async (newOrder) => {
  const { user_id, billing_id, delivery_id } = newOrder //TODO: clarifiy snake case vs camel case
  const sql = 'INSERT INTO orders (user_id, date_started, billing_id, delivery_id) VALUES ($1, NOW(), $2, $3) RETURNING *'; //uses Postgres NOW() built-in function.
  const results = await pool.query(sql, [user_id, billing_id, delivery_id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const orderObj = results.rows[0];
  return orderObj;
}

//constructs a new order object with the specified user id and inserts it into the orders table
const addOrderOnUser = async (userId) => {
  const isOpen = await isOrderOpen(userId);
  if (isOpen) {
    return `This user already has an order open. Open order ID: ${isOpen}`
    } else {
    const { billingId, deliveryId } = await defaultBillingAndDelivery(userId);
    const newOrder = {
      user_id: userId,
      billing_id: billingId,
      delivery_id: deliveryId
    }
    const orderObj = await addOrder(newOrder);
    return orderObj;
  }
}

//takes an order object (with partial or complete properties) and updates the row indicated by the orders id.
//TODO check for consistency with column name variables.
const changeOrder = async (id, updates) => {
  const existingOrder = await findOrderById(id);

  for (key in existingOrder) {
    if (updates[key]) { existingOrder[key] = updates[key] } //checks if updated value is present on request body and updates that value, keeps old values.
  }

  const { user_id, date_started, date_completed, billing_id, delivery_id } = existingOrder;
  const sql = 'UPDATE orders SET user_id = $1, date_started = $2, date_completed = $3, billing_id = $4, delivery_id = $5 \
    WHERE id = $6 RETURNING *';
  const results = await pool.query(sql, [user_id, date_started, date_completed, billing_id, delivery_id, id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const orderObj = results.rows[0];
  return orderObj;
}

//takes a monetary value and updates the date completed with the current datetime on the row specified by the order id.
const completeOrderNow = async (amount, orderId) => {
  const sql = 'UPDATE orders SET date_completed = NOW(), amount = $1 WHERE id = $2 RETURNING *;'
  const results = await pool.query(sql, [amount, orderId]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const orderObj = results.rows[0];
  return orderObj;
}

//deletes the product indicated by the product id from the database.
const removeOrder = async (id) => {
  const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
  const results = await pool.query(sql, [id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  const deletedOrderObj = results.rows[0];

  return deletedOrderObj;
}

module.exports = {
  isOrderOpen,
  defaultBillingAndDelivery,
  findBillingInfo,
  findDeliveryInfo,
  updateDelivery,
  updateBilling,
  addCCToBilling,
  isItemOnCompleteOrder,
  findAllOrders,
  findOrderById,
  findOrdersByUserId,
  findOpenOrderByUserId,
  addOrder,
  addOrderOnUser,
  changeOrder,
  removeOrder,
  completeOrderNow
}