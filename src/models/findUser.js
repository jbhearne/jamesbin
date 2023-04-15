///////////////////////////////////////////////  
//Functions related to querying users table//

//import and create pool
const pool = require('./util/pool');
const { messageNoResults, checkNoResults } = require('./util/checkFind');

const { formatUserOutput, formatContactOutput } = require('./util/formatOutput')

//gets all user objects from the database
const findAllUsers = async () => {
  const sql = 'SELECT users.id, users.fullname, users.username, users.contact_id, \
    contact.phone, contact.address, contact.city, contact.state, contact.zip, contact.email \
    FROM users JOIN contact ON users.contact_id = contact.id ORDER BY id ASC'
  
  const client = await pool.connect();
  const results = await client.query(sql);
  client.release();
  
  const noResults = checkNoResults(results);
  if (noResults) return noResults;

  const tableOutput = results.rows;
  let contactObj;
  let user;
  const users = [];
  for (rowIdx in tableOutput) {
    contactObj = formatContactOutput(tableOutput[rowIdx], tableOutput[rowIdx].contact_id);
    user = formatUserOutput(tableOutput[rowIdx], contactObj);
    users.push(user);
  }
  
  return users;
}

//queries user using user ID and returns a user object with contact info OR false if user not in database.
const findUserById = async (id) => {
  const sql = 'SELECT id, fullname, username, contact_id FROM users WHERE id = $1';

  const client = await pool.connect();
  const userRes = await client.query(sql, [id]);  //NOTE does not include password column

  const noUserResults = checkNoResults(userRes);
  if (noUserResults) return noUserResults;
  const userObj = userRes.rows[0];

  const contactRes = await client.query('SELECT * FROM contact WHERE id = $1', [userObj.contact_id]);
  client.release();
 
  const noContactResults = checkNoResults(contactRes);
  if (noContactResults) return noContactResults;
  const contactObj = contactRes.rows[0];
  const user = formatUserOutput(userObj, contactObj);
  return user;
}

//queries users to see if username is already in database an returns true if it is unique (not in database) OR false if the username already exists
const isUsernameUnique = async (username) => {
  const sql = 'SELECT username FROM users WHERE username = $1';

  const client = await pool.connect();
  const results = await client.query(sql, [username]);
  client.release();
  
  const noResults = checkNoResults(results);
  return noResults;
}

//creates new user in database
const addUser = async (newUser) => {
  const { fullname, username, password, contact } = newUser;
  const { phone, address, city, state, zip, email } = contact;
  const contactSql = 'INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';

  const client = await pool.connect();
  const contactRes = await client.query(contactSql, [phone, address, city, state, zip, email]);

  const noContactResults = checkNoResults(contactRes);
  if (noContactResults) return noContactResults;
  const contactId = contactRes.rows[0].id;
  const userSql = 'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *'; 

  const userRes = await client.query(userSql, [fullname, username, password, contactId]);
  client.release();

  const noUserResults = checkNoResults(userRes);
  if (noUserResults) return noUserResults;
  const userObj = userRes.rows[0];
  const contactObj = contactRes.rows[0];
  const user = formatUserOutput(userObj, contactObj);
  return user;
};

//takes a user ID and a user update object that may or may not include properties: fullname, username, contact 
const changeUser = async (id, updates) => {
  const existingUser = await findUserById(id);
  const isUnique = await isUsernameUnique(updates.username);

  if (!existingUser) {
    return `No such user with id: ${id}`
  } else if (!isUnique) {
    return (`Username already exists.`)
  } 
  else 
  {
    if (updates.contact) {
      for (key in existingUser.contact) {
        if (updates.contact[key]) { existingUser.contact[key] = updates.contact[key] }
      }
    }
    for (key in existingUser) {
      if (updates[key] && typeof updates[key] !== 'object') { existingUser[key] = updates[key] }
    }

    const { fullname, username } = existingUser;
    const userSql = 'UPDATE users SET fullname = $1, username = $2 WHERE id = $3 RETURNING *'

    const client = await pool.connect();
    const userRes = await client.query(userSql, [fullname, username, id]);

    const noUserResults = checkNoResults(userRes);
    if (noUserResults) return noUserResults;
    const contactId = userRes.rows[0].contact_id;
    const { phone, address, city, state, zip, email } = existingUser.contact;
    const contactSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7 RETURNING *';

    const contactRes = await client.query(contactSql, [phone, address, city, state, zip, email, contactId]);
    client.release();

    const noContactResults = checkNoResults(contactRes);
    if (noContactResults) return noContactResults;
    const userObj = userRes.rows[0];
    const contactObj = contactRes.rows[0];
    const updatedUser = formatUserOutput(userObj, contactObj);
    return updatedUser;
  }
}

//removes a user from the database
const removeUser = async (id) => {
  const existingUser = await findUserById(id);
  if (!existingUser) {
    return `No such user with id: ${id}`
  } else {
    const client = await pool.connect();
    const userRes = await client.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    
    const noUserResults = checkNoResults(userRes);
    if (noUserResults) return noUserResults;
    const contactId = userRes.contact_id;

    const contactRes = await client.query('DELETE FROM contact WHERE id = $1', [contactId]); //IDEA add a mark for deletion boolean column to contact table, set it to true instead of deleting.
    client.release();

    const noContactResults = checkNoResults(contactRes);
    if (noContactResults) return noContactResults;
    const deletedUserObj = formatUserOutput(userRes.rows[0], contactRes.rows[0]);
    return deletedUserObj;
  }
}

module.exports = {
  findAllUsers,
  findUserById,
  isUsernameUnique,
  addUser,
  changeUser,
  removeUser
}