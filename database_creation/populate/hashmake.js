const bcrypt = require('bcrypt');
const pool = require('../../src/models/util/pool');
const { messageNoResults, checkNoResults } = require('../../src/models/util/checkFind');

const hashMake = async (password, id) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const sql = 'UPDATE users SET password = $1 WHERE id = $2 RETURNING *';
  const results = await pool.query(sql, [hash, id]);
  const noResults = checkNoResults(results);
  if (noResults) return noResults;
  return results.rows[0];
}

const popPasswords = async (password, ids) => {
  for (let i = 0; i <= ids; i++) {
    hashMake(password, i);
  }
} 

//popPasswords('password', 10);

module.exports = {
  popPasswords
}