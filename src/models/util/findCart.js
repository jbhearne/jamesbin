const pool = require('./pool');
const { findBillingInfo, findDeliveryInfo } = require('./findOrder')


const collectCart = async (userId) => {
  const sql = "SELECT cart.order_id, cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) AS qty_total\
  FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
  WHERE orders.user_id = $1 AND orders.date_completed IS NULL;"

  const cart = await pool.query(sql, [userId]/*, (error, results) => { //REVIEW - at some point i need to look into error handling without the callback or returning values with it, but for now I can't seem to do both.
  if (error) {
    throw error;
  }
  }*/)

  //GARBAGE: console.log(cart)
  //console.log('cart')
  const items = cart.rows;
  const total = items.reduce((sum, row) => sum + Number(row.qty_total.replace(/[^0-9.-]+/g,"")), 0); //DONE: PASS should convert dollar string to number.

  const billing = await findBillingInfo(items[0].order_id); //PASS: should add these objects to the response
  const delivery = await findDeliveryInfo(items[0].order_id);

  const checkout = { items, total, billing, delivery}
  console.log(checkout)
  return checkout;
}

module.exports = {
  collectCart
}