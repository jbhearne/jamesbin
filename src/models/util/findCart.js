const pool = require('./pool');
const { findBillingInfo, findDeliveryInfo, isOrderOpen } = require('./findOrder')


const collectCart = async (userId) => {
  const sql = "SELECT cart.order_id, cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) AS qty_total\
  FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
  WHERE orders.user_id = $1 AND orders.date_completed IS NULL;"
 //console.log(sql)
  const cart = await pool.query(sql, [userId]/*, (error, results) => { //REVIEW - at some point i need to look into error handling without the callback or returning values with it, but for now I can't seem to do both.
  if (error) {
    throw error;
  }
  }*/)

  //GARBAGE: console.log(cart)
  //console.log('cart')
  let items = []
  let total = 0
  if (cart.rows.length === 0) {
    const isOrder = await  isOrderOpen(userId);
    console.log('1if no cart')
    if (isOrder) {
      console.log('2if yes order')
      items[0] = { order_id: isOrder }  //REVIEW I should probably move the order_id out of the item and into the return object.
    } else {
      console.log('2else no order')
      return 'No order started';
    }
  } else {
    ('1else yes cart')
    items = cart.rows;
    const sum = items.reduce((sum, row) => sum + Number(row.qty_total.replace(/[^0-9.-]+/g,"")), 0);
    total = Math.trunc(sum * 100) / 100; //25246.350000000002 changes to 25246.35
  }

  //const items = cart.rows;
   //DONE: PASS should convert dollar string to number.
  
  //console.log(cart) 
  //DONE: FIXME error when no items in cart?
  const billing = await findBillingInfo(items[0].order_id); //DONE: PASS: should add these objects to the response
  const delivery = await findDeliveryInfo(items[0].order_id);

  const checkout = { items, total, billing, delivery}
  //console.log(checkout)
  return checkout;
}



module.exports = {
  collectCart
}