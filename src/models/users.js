const pool = require('./util/pool');
const updateColumns = require('./util/update-columns')
const { findUserById, isUsernameUnique } = require('./util/findUser')
//GARBAGE: const ensure = require('../routes/auth/ensure')

//DONE: PASS TODO: change so that it uses the same logic for getting contact info as below
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
      /*const userObj = {
        id: user.id,
        username: user.username,
        fullname: user.fullname,
        contact: contact.rows[0]
      }*/
    }
    response.status(200).json(users); //??? should all responses be moved to routes?
  });
};

//DONE: TODO: need to add a way get the contact info, I have methods for adding and updating it as part of the user, but not displaying it.
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
    response.status(200).json(userObj); //ANCHOR[id=response] was going to remove response a move to route, but decided to abstract the logic, but still need to apply that abstraction to this method
    //request.userQuery = userObj;
    
  });
};


//DONE: simple fix is to remove the POST /users route and only use /register FIXME: 
//is causing postman to hang up. not retturning values becuase response was moved to register
//also not hashing the pasword. because this is done in auth.js on /register route.
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
    pool.query(
      'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullname, username, password, contactId],
      (error, results) => {
        if (error) {
          throw error;
        }
        //GARBAGE: response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        request.body.id = results.rows[0].id;
        console.log(`created user${request.body.id}`)
        //GARBAGE: response.redirect('login')
    });
  });
};

//DONE: PASS: TODO: need to add a check on  username uniquenes
//DONE: PASS: TODO: need to check if user exists 
const updateUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  /*GARBAGE: if (!request.user.admin) {
    if (request.user.id !== id) {
      return response.status(401).send('no access')
    }
  }*/
  //const { fullname, username, password, contact } = request.body;
  //DONE: PASS: FIXME: fix  this flawed uses of template literals
  //IDEA 1: function with select case and a separate SQL string for every possible combination of columns
  //        PRO: less querying should be faster. CON: requires more code. mo code mo problems.
  //IDEA< 2: use a database SELECT to get current info from the user and use the info to fill in the the variables that are not supplied in the request.
  //        PRO: More logic based, less wrote, more Elegant? means less can go wrong. CON: More queies slow things down. Though not by much.
  //        //LINK - #response
  //IDEA 3: Store all user info in the session. It is not much data. 
  //        PRO: less querying. Could also be useful for checkout. CON: excess baggage on the user object. Security issues?
 

  //WARN: const userColumns = updateColumns({ fullname, username, password } );
  //const userSql = userColumns ? 
  //  `UPDATE users SET${userColumns} WHERE id = $1 RETURNING *` :
  //  `SELECT * FROM users WHERE id = $1`;
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
        console.log(updates.contact[key])
        console.log(userObj.contact[key])
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
      /*GARBAGE if(contact) {
          if (Object.keys(contact).length > 0) {
            const { phone, address, city, state, zip, email } = contact;
            const contactColumns = updateColumns({ phone, address, city, state, zip, email })
            const contactSql = contactColumns ? 
            `UPDATE contact SET${contactColumns} WHERE id = $1` :
              `SELECT * FROM contact WHERE id = $1`;*/
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
          //}; //GARBAGE - 
        //} else {
          //response.status(200).send(`User modified with ID: ${id}`)
        //}
    });
  }
};


//DONE:FIXME: need to add cascade to orders table and then to cart table
//DONE: added username UNIQUE constraint TODO: also need to add several unique constraints, but this is all in POSTGRESS.
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
  