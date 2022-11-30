const pool = require('./pool');

const getProducts = (request, response) => {
  pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getProductsByVendor = (request, response) => {
  const { vendorId } = request.body;
  pool.query('SELECT * FROM products WHERE vendor_id = $1', [vendorId], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const getProductById = (request, response) => {
  const id = parseInt(request.params.id);

  pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

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

const updateProduct = (request, response) => {
  const id = parseInt(request.params.id);
  const { name, description, price, vendorId } = request.body;
  const productColumns = updateColumns({ name, description, price, vendorId });
  const userSql = `UPDATE users SET${productColumns} WHERE id = $1 RETURNING *`;

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
  