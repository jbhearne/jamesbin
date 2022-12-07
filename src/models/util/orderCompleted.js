const pool = require('./pool');


const orderComplete = async id => {
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


module.exports = orderComplete;
