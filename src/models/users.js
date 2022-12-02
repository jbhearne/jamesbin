const pool = require('./util/pool');
const updateColumns = require('./util/update-columns')

const getUsers = (request, response) => {
  pool.query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getUserById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM users WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

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
        //response.status(201).send(`User added with ID: ${results.rows[0].id}`);
        request.body.id = results.rows[0].id;
        console.log(`created user${request.body.id}`)
        //response.redirect('login')
    });
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  if (!request.user.admin) {
    if (request.user.id !== id) {
      return response.status(401).send('no access')
    }
  }
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
      if (Object.keys(contact).length > 0) {
        const { phone, address, city, state, zip, email } = contact;
        const contactColumns = updateColumns({ phone, address, city, state, zip, email })

        pool.query(
          `UPDATE contact SET${contactColumns} WHERE id = $1`,
          [contactId],
          (error, results) => {
            if (error) {
              throw error;
            }
            response.status(200).send(`User modified with ID: ${id}`);
        });
      };
  });
};

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
  