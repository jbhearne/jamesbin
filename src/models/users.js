////////////////////////////////////////////////////////////
///database funtions for interacting with users table///////

//imports
const pool = require('./util/pool');
const { findUserById, isUsernameUnique } = require('./util/findUser')

//gets all users from the database and sends a response object
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', async (error, results) => { //REVIEW probably should not return hashed password, even for admin.
    if (error) {
      throw error;
    }
    const users = await results.rows
    console.log(users)
    for (let idx in users) {
      const contact = await pool.query('SELECT * FROM contact WHERE id = $1', [users[idx].contact_id]) //REVIEW this queries for every user. this is a not a great idea.
      users[idx].contact = contact.rows[0]
    }
    response.status(200).json(users); //??? should all responses be moved to routes? no, but I do need to move more of the logic out of here and reclassify this folder from models to soemthing else
  });
};

//gets a user from the database using id parameter and sends a response object.
const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], async (error, results) => {
    if (error) {
      throw error;
    }
    const user = await results.rows[0]
    const contact = await pool.query('SELECT * FROM contact WHERE id = $1', [user.contact_id])
    const userObj = {
      id: user.id,
      username: user.username,
      fullname: user.fullname,
      contact: contact.rows[0]
    }
    response.status(200).json(userObj); 
  });
};

//REFACTOR[id=createuser] 
//creates new new user in database, but does not send a response object. Currently that is handled in the register logic //LINK ../routes/auth/auth.js#register 
//also creates a new contact entry in the contact table which due to forein key constraint must be created first
const createUser = async (request, response) => {
  const { fullname, username, password, contact } = request.body;
  const { phone, address, city, state, zip, email } = contact;
  
  pool.query('INSERT INTO contact (phone, address, city, state, zip, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *', 
  [phone, address, city, state, zip, email], 
  async (error, results) => {
    if (error) {
      throw error;
    }
    const contactId = await results.rows[0].id;
    console.log(contactId);
    //NOTE: nest calls to pool and use an async function due to the foreign key constraint in users table. 
    //the contact_id must exist in contact table BEFORE it can be created in users table.
    //REVIEW I ended up finding different ways of doing this. I should probably find a way of making it consistent.
    pool.query(
      'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullname, username, password, contactId],
      (error, results) => {
        if (error) {
          throw error;
        }
        request.body.id = results.rows[0].id;
        console.log(`created user${request.body.id}`)
    });
  });
};
//!REFACTOR

//updates user and contact databases. request body can be any combination of properties as long as it follows the correct user object structure
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const userObj = await findUserById(id);
  const isUnique = await isUsernameUnique(updates.username);
  
  if (!userObj) {
    response.status(400).send(`No such user with id: ${id}`);
  } else if (!isUnique) {
    response.status(400).send(`Username already exists.`);
  } 
  else 
  {
    if (updates.contact) {
      for (key in userObj.contact) {
        if (updates.contact[key]) { userObj.contact[key] = updates.contact[key] }
      }
    }
    for (key in userObj) {
      if (updates[key] && typeof updates[key] !== 'object') { userObj[key] = updates[key] }
    }

    const { fullname, username, contact } = userObj;
    const userSql = 'UPDATE users SET fullname = $1, username = $2 WHERE id = $3 RETURNING *' //NOTE: probably shoud not return hashed password, but since this is not production...

    pool.query(
      userSql,
      [fullname, username, id],
      async (error, results) => {
        if (error) {
          throw error;
        }
        const contactId = await results.rows[0].contact_id;
        const { phone, address, city, state, zip, email } = contact;
        const contactSql = 'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7';

        pool.query(
          contactSql,
          [phone, address, city, state, zip, email, contactId],
          (error, results) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`); 
        });
    });
  }
};

//deletes a user and their coresponding contact info in database
const deleteUser = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM users WHERE id = $1 RETURNING *', 
  [id],
  async (error, results) => {
    if (error) {
      throw error;
    }
    const contactId = await results.rows[0].contact_id;
    
    //NOTE: probably should not delete these in a real database I might add a flag so that childless addresses could be easily culled
    //technical 'contact' is the parent so it could belong to multiple users, like roomates or families.
    //but here I am treeting this as a one-to-on relationship.
    pool.query('DELETE FROM contact WHERE id = $1', 
    [contactId],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).send(`User deleted with ID: ${id}`); 
    });
  }); 
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
  