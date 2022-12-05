const pool = require('./util/pool');
const updateColumns = require('./util/update-columns')
//GARBAGE: const ensure = require('../routes/auth/ensure')

//TODO: change so that it uses the same logic for getting contact info as below
const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows); //??? should all responses be moved to routes?
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
    response.status(200).json(userObj); 
  });
};


//DONE: simple fix is to remove the POST /users route and only use register FIXME: 
//this is causing postman to hang up. not retturning values becuase response was moved to register
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
    //NOTE: must nest calls to pool and use an async function due to the foreign key constraint in users table.
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

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  /*GARBAGE: if (!request.user.admin) {
    if (request.user.id !== id) {
      return response.status(401).send('no access')
    }
  }*/

  const { fullname, username, password, contact } = request.body;
  //FIXME: fix  this flawed uses of template literals
  const userColumns = updateColumns({ fullname, username, password } );
  const userSql = userColumns ? 
    `UPDATE users SET${userColumns} WHERE id = $1 RETURNING *` :
    `SELECT * FROM users WHERE id = $1`;

  pool.query(
    userSql,
    [id],
    async (error, results) => {
      if (error) {
        throw error;
      }
      const contactId = await results.rows[0].contact_id;
      if(contact) {
        if (Object.keys(contact).length > 0) {
          const { phone, address, city, state, zip, email } = contact;
          const contactColumns = updateColumns({ phone, address, city, state, zip, email })
          const contactSql = contactColumns ? 
          `UPDATE contact SET${contactColumns} WHERE id = $1` :
            `SELECT * FROM contact WHERE id = $1`;

          pool.query(
            contactSql,
            [contactId],
            (error, results) => {
              if (error) {
                throw error;
              }
              response.status(200).send(`User modified with ID: ${id}`); 
          });
        };
      } else {
        response.status(200).send(`User modified with ID: ${id}`)
      }
  });
};


//FIXME: need to add cascade to orders table and then to cart table
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
  