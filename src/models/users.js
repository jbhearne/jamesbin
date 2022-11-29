const pool = require('./pool');

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
    //must nest calls to pool and use an async function due to the foreign key constraint in users table.
    //the contact_id must exist in contact table BEFORE it can be created in users table.
    pool.query(
      'INSERT INTO users (fullname, username, password, contact_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [fullname, username, password, contactId],
      (error, results) => {
        if (error) {
          throw error;
        }
        response.status(201).send(`User added with ID: ${results.rows[0].id}`);
    });
  });
};

const updateUser = (request, response) => {
  const id = parseInt(request.params.id);
  const { fullname, username, password, contact } = request.body;
  const { phone, address, city, state, zip, email } = contact;

  pool.query(
    //note on UPDATE, since each column is specified in the query, the App logic needs to fill in the the unchanged values
    'UPDATE users SET fullname = $1, username = $2, password = $3 WHERE id = $4 RETURNING *',
    [fullname, username, password, id],
    async (error, results) => {
      if (error) {
        throw error;
      }
      const contactId = await results.rows[0].contact_id;

      pool.query(
        'UPDATE contact SET phone = $1, address = $2, city = $3, state = $4, zip = $5, email = $6 WHERE id = $7',
        [phone, address, city, state, zip, email, contactId],
        (error, results) => {
          if (error) {
            throw error;
          }
          response.status(200).send(`User modified with ID: ${id}`);
      });
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
  