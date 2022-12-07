const pool = require('./pool');
const { findBillingInfo, findDeliveryInfo, isOrderOpen } = require('./findOrder')


const collectCart = async (userId) => {
  const sql = "SELECT cart.order_id, cart.id, products.name, products.price, cart.quantity, (products.price * cart.quantity) AS qty_total\
  FROM cart JOIN products ON cart.product_id = products.id JOIN orders ON cart.order_id = orders.id\
  WHERE orders.user_id = $1 AND orders.date_completed IS NULL;"

  const cart = await pool.query(sql, [userId])

  let items = []
  let total = 0

  if (cart.rows.length === 0) {
    const isOrder = await  isOrderOpen(userId);
    
    if (isOrder) {
      items[0] = { order_id: isOrder }  //REVIEW I should probably move the order_id out of the item and into the return object.
    } else {
      return 'No order started';
    }
  } else {
    items = cart.rows;
    const sum = items.reduce((sum, row) => sum + Number(row.qty_total.replace(/[^0-9.-]+/g,"")), 0);
    total = Math.trunc(sum * 100) / 100; //25246.350000000002 changes to 25246.35
  }

  const billing = await findBillingInfo(items[0].order_id); 
  const delivery = await findDeliveryInfo(items[0].order_id);

  const checkout = { items, total, billing, delivery}
  return checkout;
}



module.exports = {
  collectCart
}