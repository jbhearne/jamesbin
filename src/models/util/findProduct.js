///////////////////////////////////////////////  
//Functions related to querying products table//

//import and create pool
const pool = require('./pool');

//queries products using product ID to see if a product exists. Returns true if it does OR false if not.
const isProductExtant = async (id) => {
  const sql = 'SELECT id FROM products WHERE id = $1';
  const results = await pool.query(sql, [id]);
  return results.rows.length === 1;// ? true : false;
};

module.exports = {
  isProductExtant
}