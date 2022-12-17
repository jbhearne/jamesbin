///////////////////////////////////////////////  
//Functions related to querying orders table//

//import and create pool
const pool = require('./pool');

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
      console.log(result.rows[0].date_completed);
    } else if (result.rows.length > 1) {
      throw Error('Multiple Rows.');
    }
  }
  return notNull;
}

//sets default values for billing and delivery to the current users name, contact info and other preset values. 
//Returns an object with the IDs for both delivery row and billing row.
const defaultBillingAndDelivery = async (userId) => {
  const user =  await pool.query('SELECT * FROM users WHERE id = $1', [userId])
  const { fullname, contact_id } = user.rows[0]

  const defaultBillingMethod = 'credit card'
  const defaultDeliveryMethod = 'standard shipping' //ANCHOR[id=defaultMethod] - change some other selection method.

  const createdBilling = await pool.query('INSERT INTO billing (payer_name, method, contact_id) VALUES ($1, $2, $3) RETURNING *;',
  [ fullname, defaultBillingMethod, contact_id, ]);

  const createdDelivery = await pool.query('INSERT INTO delivery (receiver_name, method, contact_id) VALUES ($1, $2, $3) RETURNING *;',
  [ fullname, defaultDeliveryMethod, contact_id, ]);

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

  const billing  = await pool.query(sql, [orderId]);

  const info = {
    id: billing.rows[0].billing_id,
    payerName: billing.rows[0].payer_name,
    paymentMethod: billing.rows[0].method,
    contact: {
      id: billing.rows[0].contact_id,
      phone: billing.rows[0].phone,
      address: billing.rows[0].address,
      city: billing.rows[0].city,
      state: billing.rows[0].state,
      zip: billing.rows[0].zip,
      email: billing.rows[0].email
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

  const delivery  = await pool.query(sql, [orderId]);

  const info = {
    id: delivery.rows[0].delivery_id,
    receiverName: delivery.rows[0].receiver_name,
    deliveryMethod: delivery.rows[0].method,
    contact: {
      id: delivery.rows[0].contact_id,
      phone: delivery.rows[0].phone,
      address: delivery.rows[0].address,
      city: delivery.rows[0].city,
      state: delivery.rows[0].state,
      zip: delivery.rows[0].zip,
      email: delivery.rows[0].email
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

  return results.rows[0]
}

//change the values of the billing table entry as specified by the billing ID.
//values are determined by a billing object (updates) and the contact ID.
//returns the updated billing object.
const updateBilling = async (billingId, updates, contactId) => {
  const { payerName, paymentMethod } = updates
  const sql = 'UPDATE billing SET payer_name = $1, method = $2, contact_id = $3 WHERE id = $4 RETURNING *;';

  const results = await pool.query(sql, [payerName, paymentMethod, contactId, billingId])

  return results.rows[0]
}

//a way to add creditcard info, but not really. just a flourish in that direction.
const addCCToBilling = async (cc, billingId) => {
  const sql = 'UPDATE billing SET cc_placeholder = $1 WHERE id = $2'

  const  results = pool.query(sql, [cc, billingId]);
  
  return results;
}

const findAllOrders = async () => {
  const sql = 'SELECT * FROM orders ORDER BY id ASC';
  const results = await pool.query(sql)
  return results.rows
}

const findOrderById = async (id) => {
  const sql = 'SELECT * FROM orders WHERE id = $1';
  const results = await pool.query(sql, [id]);
  const orderObj = results.rows[0];
  if (results.rows.length === 0) {
    return 'No orders started';
  } else {
    return results.rows[0];
  }
}

const findOrderByUserId = async (id) => {
  const  sql = 'SELECT * FROM orders WHERE user_id = $1';
  const results = await pool.query(sql, [id]);
  const  orderObj = results.rows[0]; //TODO only returns the first order, What is the point of this?
  return orderObj;
}

const findOpenOrderByUserId = async (userId) => {
  const sql = 'SELECT * FROM orders WHERE user_id = $1 AND date_completed IS NULL;';
  const results = await pool.query(sql, [userId]);
  if (results.rows.length === 0) {
    return 'No orders started';
  } else {
    return results.rows[0];
  }
}

const addOrder = async (newOrder) => {
  const { user_id, billing_id, delivery_id } = newOrder //TODO: clarifiy snake case vs camel case
  const sql = 'INSERT INTO orders (user_id, date_started, billing_id, delivery_id) VALUES ($1, NOW(), $2, $3) RETURNING *'
  const results = await pool.query(sql, [user_id, billing_id, delivery_id]);
  const orderObj = results.rows[0];
  return orderObj;
}

const addOrderOnUser = async (userId) => {
  const isOpen = await isOrderOpen(userId);
  if (isOpen) {
    return `This user already has an order open. Open order ID: ${isOpen}`
    } else {
    const { billingId, deliveryId } = await defaultBillingAndDelivery(userId); //DONE: PASS should create rows with primary keys in the new tables: 'billing' and 'delivery'
    const newOrder = {
      user_id: userId,
      billing_id: billingId,
      delivery_id: deliveryId
    }
    const orderObj = await addOrder(newOrder);
    return orderObj;
  }
}

//TODO check for consistency with column name variables.
const changeOrder = async (id, updates) => {
  const existingOrder = await findOrderById(id);

  for (key in existingOrder) {
    if (updates[key]) { existingOrder[key] = updates[key] }
  }

  const { user_id, date_started, date_completed, billing_id, delivery_id } = existingOrder;
  const sql = 'UPDATE orders SET user_id = $1, date_started = $2, date_completed = $3, billing_id = $4, delivery_id = $5 \
    WHERE id = $6 RETURNING *';
  const results = await pool.query(sql, [user_id, date_started, date_completed, billing_id, delivery_id, id]);

  const orderObj = results.rows[0];
  return orderObj;
}

const completeOrderNow = async (amount, orderId) => {
  const sql = 'UPDATE orders SET date_completed = NOW(), amount = $1 WHERE id = $2 RETURNING *;'
  const results = await pool.query(sql, [amount, orderId]);
  const orderObj = results.rows[0];
  return orderObj;
}

const removeOrder = async (id) => {
  const sql = 'DELETE FROM orders WHERE id = $1 RETURNING *';
  const results = await pool.query(sql, [id]);
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
  findOrderByUserId,
  findOpenOrderByUserId,
  addOrder,
  addOrderOnUser,
  changeOrder,
  removeOrder,
  completeOrderNow
}