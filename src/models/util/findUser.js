///////////////////////////////////////////////  
//Functions related to querying users table//

//import and create pool
const pool = require('./pool');


const { formatUserOutput, formatContactOutput } = require('./formatOutput')

const findAllUsers = async () => {
  const sql = 'SELECT users.id, users.fullname, users.username, users.contact_id, \
    contact.phone, contact.address, contact.city, contact.state, contact.zip, contact.email \
    FROM users JOIN contact ON users.contact_id = contact.id ORDER BY id ASC'
  const results = await pool.query(sql);
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
  const userRes = await pool.query('SELECT fullname, username, contact_id FROM users WHERE id = $1', [id])  //NOTE does not include password column
  if (userRes.rows.length > 0) {
  const userObj = userRes.rows[0]
  const contactRes = await pool.query('SELECT * FROM contact WHERE id = $1', [userObj.contact_id])
  const contactObj = contactRes.rows[0]
  const user = formatUserOutput(userObj, contactObj);

  return user;
} else {
  return false;
}
}

//queries users to see if username is already in database an returns true if it is unique (not in database) OR false if the username already exists
const isUsernameUnique = async (username) => {
  const results = await pool.query('SELECT username FROM users WHERE username = $1', [username]) 
  return results.rows.length === 0;
}

//creates new new user in database
const addUser = async (newUser) => {
  const { fullname, username, password, contact } = newUser;
  
  const { phone, address, city, state, zip, email } = contact;
  const contactSql = 'INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *';
  const contactRes = await pool.query(contactSql, [phone, address, city, state, zip, email]);

  const contactId = contactRes.rows[0].id;
  const userSql = 'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *'; 
  const userRes = await pool.query(userSql, [fullname, username, password, contactId]);

  const userObj = userRes.rows[0];
  const contactObj = contactRes.rows[0];
  const user = formatUserOutput(userObj, contactObj);

  return user;
};

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
    const userRes = await pool.query(userSql, [fullname, username, id]);

    const contactId = userRes.rows[0].contact_id;
    const { phone, address, city, state, zip, email } = existingUser.contact;
    const contactSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7 RETURNING *';
    const contactRes = await pool.query(contactSql, [phone, address, city, state, zip, email, contactId]);

    const userObj = userRes.rows[0];
    const contactObj = contactRes.rows[0];
    const updatedUser = formatUserOutput(userObj, contactObj);
    return updatedUser;
  }
}

const removeUser = async (id) => {
  const existingUser = await findUserById(id);
  if (!existingUser) {
    return `No such user with id: ${id}`
  } else {
    const deletedUser = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    const contactId = deletedUser.contactId;
    const deletedContact = await pool.query('DELETE FROM contact WHERE id = $1', [contactId]); //IDEA add a mark for deletion boolean column to contact table, set it to true instead of deleting.

    const deletedUserObj = formatUserOutput(deletedUser, deletedContact);
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