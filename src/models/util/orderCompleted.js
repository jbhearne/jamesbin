const pool = require('./pool');

/*GARBAGE: const orderComplete = async id => {
  const pq = pool.query('SELECT orders.date_completed FROM cart JOIN orders ON cart.order_id = orders.id WHERE cart.id = $1',
    [id], async (err, res) => {
      console.log('1:: top of the pool.query callback')
      if (err) {
        throw err;
      }
      console.log('2:: ' + typeof res + ' is query results type')
      promise = new Promise((resolve, reject) => resolve(res.rows))
      const results = await promise;
      console.log(results)
      console.log('3:: the above is rows array after query results await')
      let notNull = false;
      if (results.length === 1) {
        if (results[0]) {
          notNull = true;
        } else if (results.length > 1) {
          throw Error('Multiple Rows.');
        }
      }
      console.log('4:: ' + notNull + ' is about to be returned to the pool.query')
      return notNull
    })
    console.log('5:: ' + pq + ' about to return orderComplete')
    return pq
}*/

/*GARBAGE: const orderComplete = async id => {
  let topNull = new Promise((res, rej) => {
  res(pool.query('SELECT orders.date_completed FROM cart JOIN orders ON cart.order_id = orders.id WHERE cart.id = $1',
    [id], async (err, res) => {
      console.log('1:: top of the pool.query callback')
      if (err) {
        throw err;
      }
      console.log('2:: ' + typeof res + ' is query results type')
      promise = new Promise((resolve, reject) => resolve(res.rows))
      const results = await promise;
      console.log(results)
      console.log('3:: the above is rows array after query results await')
      let notNull = false;
      if (results.length === 1) {
        if (results[0]) {
          notNull = true;
        } else if (results.length > 1) {
          throw Error('Multiple Rows.');
        }
      }
      console.log('4:: ' + notNull + ' is about to be returned to the pool.query')
      //topNull = notNull
      return notNull
    }))
    console.log('4.5:: ' + topNull + 'does this wait?')
    setTimeout(() => {console.log('4.6:: ' + topNull + ' how about now?')}, 1000 ) 
  })
  console.log('4.7:: ' + await topNull + 'return a promise?')
  return await topNull
}*/


/*GARBAGE: const orderComplete = async id => {
  console.log('1:: before of the pool.query call')
  const result = await pool.query(
    'SELECT orders.date_completed FROM cart JOIN orders ON cart.order_id = orders.id WHERE cart.id = $1',
    [id]); //no callback... pool.query returns the results and can be used with async/await to create asyncronous functions/modules.
  console.log('2:: after of the pool.query call')    
  console.log('3:: ' + typeof result + ' is query results type')
  console.log(result.rows)
  console.log('4:: the above is rows array after query results await')
  let notNull = false;
  if (result.rows.length === 1) {
    if (result.rows[0].date_completed) {
      notNull = true;
      console.log(result.rows[0].date_completed)
    } else if (result.rows.length > 1) {
      throw Error('Multiple Rows.');
    }
    }
  console.log('5:: ' + result.rows[0] + ' is about to be returned to the pool.query')
  //return  result.rows[0]
  return notNull
}*/

const orderComplete = async id => {
  const result = await pool.query(
    'SELECT orders.date_completed FROM cart JOIN orders ON cart.order_id = orders.id WHERE cart.id = $1',
    [id]); ////SECTION no callback... pool.query returns the results and can be used with async/await to create asyncronous functions/modules. SECTION 
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
