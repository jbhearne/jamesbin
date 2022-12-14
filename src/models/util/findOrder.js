///////////////////////////////////////////////  
//Functions related to querying orders table//

//import and create pool
const pool = require('./pool');

//import for accessing the contact table
const { addContactInfo } = require('./findContact')

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

//PASS
//REFACTOR create a formatting module
/*
//creates a new contact in the contact table. Returns a contact object.
const formatNewContact = (newContact) => {
  //newContact = await addContactInfo(contactObj) //REVIEW - if this should even be in a formatting function. probably not since it makes it different than the funcitons below.
  
  contact = {
    id: newContact.id,
    phone: newContact.phone,
    address: newContact.address,
    city: newContact.city,
    state: newContact.state,
    zip: newContact.zip,
    email: newContact.email
  }
  return contact
}

//formats a delivery object with specified ID, a previous or requested delivery object, and a contact object. No queries. Returns the object.
const formatNewDelivery =  (deliveryId, deliveryObj, contactObj) => {
  const delivery = {
    id: deliveryId,
    receiverName: deliveryObj.receiverName,
    deliveryMethod: deliveryObj.deliveryMethod,
    notes: deliveryObj.notes,
    contact: contactObj
  }
  return delivery
}

//formats a billing object with specified ID, a previous or requested billing object, and a contact object. No queries. Returns the object.
const formatNewBilling =  (billingId, billingObj, contactObj) => {
  const billing = {
    id: billingId,
    payerName: billingObj.payerName,
    paymentMethod: billingObj.paymentMethod,
    contact: contactObj
  }
  return billing
}
*/
//!REFACTOR

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
  sql = 'UPDATE billing SET cc_placeholder = $1 WHERE id = $2'

  results = pool.query(sql, [cc, billingId]);
  
  return results;
}

module.exports = {
  isOrderOpen,
  defaultBillingAndDelivery,
  findBillingInfo,
  findDeliveryInfo,
  updateDelivery,
  updateBilling,
  addCCToBilling,
  isItemOnCompleteOrder
}