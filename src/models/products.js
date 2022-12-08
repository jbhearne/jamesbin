////////////////////////////////////////////////////////////
///functions for accessing the the products table//////////

//imports
const pool = require('./util/pool');
const updateColumns = require('./util/update-columns');

//gets all the products in the database and sends a response object
const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//get all the products from a particular vender as specified in the parameter. sends a response object
const getProductsByVendor = (request, response) => {
  const id = parseInt(request.params.id);
  pool.query('SELECT * FROM products WHERE vendor_id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//get a product using id parameter sends a response object
const getProductById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

//add a new product expects a request object
const createProduct = (request, response) => {
  const { name, description, price, vendorId } = request.body;

  pool.query(
    'INSERT INTO products (name, description, price, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *', 
    [name, description, price, vendorId], 
    (error, results) => {
      if (error) {
        throw error;
      }
    response.status(201).send(`Product added with ID: ${results.rows[0].id}`);
  });
};

//FIXME still need to fix this use of template literals
//update a product with the id parameter. expects a request object.
const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, description, price, vendorId } = request.body;
  const productColumns = updateColumns({ name, description, price, vendorId });
  const userSql = `UPDATE products SET${productColumns} WHERE id = $1 RETURNING *`;

  pool.query(
    userSql,
    [id],
    (error, results) => {
    if (error) {
        throw error;
    }
    response.status(200).send(`Product modified with ID: ${id}`)
  });
};

//deletes a product from the database. sends a response object
const deleteProduct = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Product deleted with ID: ${id}`);
  });
};

module.exports = {
    getProducts,
    getProductsByVendor,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
  