const pool = require('./pool');

const isProductExtant = async (id) => {
  const sql = 'SELECT id FROM products WHERE id = $1';
  const results = await pool.query(sql, [id]);
  console.log(!!results.rows + ' isproduct')
  console.log(results.rows)
  return results.rows.length === 1 ? true : false;
};

module.exports = {
  isProductExtant
}