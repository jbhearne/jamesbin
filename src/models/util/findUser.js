const pool = require('./pool');

const findUserById = async (id) => {
  const results = await pool.query('SELECT fullname, username, contact_id FROM users WHERE id = $1', [id])  //NOTE does not include password column
  const user = results.rows[0]
  const contact = await pool.query('SELECT * FROM contact WHERE id = $1', [user.contact_id])
  const userObj = {
    id: user.id,
    username: user.username,
    fullname: user.fullname,
    contact: contact.rows[0]
  }
  return userObj
}

module.exports = {
  findUserById
}