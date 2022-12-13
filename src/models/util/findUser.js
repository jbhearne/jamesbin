///////////////////////////////////////////////  
//Functions related to querying users table//

//import and create pool
const pool = require('./pool');


const { formatUserOutput } = require('./formatOutput')

//queries user using user ID and returns a user object with contact info OR false if user not in database.
const findUserById = async (id) => {
  const results = await pool.query('SELECT fullname, username, contact_id FROM users WHERE id = $1', [id])  //NOTE does not include password column
  if (results.rows.length > 0) {
  const user = results.rows[0]
  const contact = await pool.query('SELECT * FROM contact WHERE id = $1', [user.contact_id])
  const userObj = {
    username: user.username,
    fullname: user.fullname,
    contact: contact.rows[0]
  }
  return userObj;
} else {
  return false;
}
}

//queries users to see if username is already in database an returns true if it is unique (not in database) OR false if the username already exists
const isUsernameUnique = async (username) => {
  const results = await pool.query('SELECT username FROM users WHERE username = $1', [username]) 
  return results.rows.length === 0;
}

//PASS
//creates new new user in database
const createUser = async (newUser) => {
  const { fullname, username, password, contact } = newUser.body;
  const { phone, address, city, state, zip, email } = contact;
  const contactSql = 'INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

  const contactRes = await pool.query(userSql, [phone, address, city, state, zip, email]);

  const contactId = userRes.rows[0].id;

  const userSql = 'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *';
  
  const userRes = await pool.query(contactSql, [fullname, username, password, contactId]);

  const userObj = userRes.rows[0];
  const contactObj = contactRes.rows[0];
  const user = formatUserOutput(userObj, contactObj);

  return user;
};


module.exports = {
  findUserById,
  isUsernameUnique,
  createUser
}