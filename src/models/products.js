////////////////////////////////////////////////////////////
///Product based HTTP requests/response for RESTful API///////

//imports
const pool = require('./util/pool');
const updateColumns = require('./util/update-columns');
const { 
  findAllProducts,
  findProductById,
  addProduct,
  changeProduct,
  removeProduct
} = require('./util/findProduct');

//gets all the products in the database and sends a response object
const getProducts = async (request, response) => {
  const products = await findAllProducts();
  response.status(200).json(products);
  /*pool.query('SELECT * FROM products ORDER BY id ASC', (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });*/
};

//TODO forgot to move this one to findProduct.js
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
const getProductById = async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await findProductById(id);
  response.status(200).json(product);
  /*pool.query('SELECT * FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });*/
}

//add a new product expects a request object
const createProduct = async (request, response) => {
  const newProduct = request.body;
  const product = await addProduct(newProduct);
  response.status(201).send(`Product added with ID: ${product.id}`);
  /*const { name, description, price, vendorId } = request.body;

  pool.query(
    'INSERT INTO products (name, description, price, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *', 
    [name, description, price, vendorId], 
    (error, results) => {
      if (error) {
        throw error;
      }
    response.status(201).send(`Product added with ID: ${results.rows[0].id}`);
  });*/
};

//DONE FIXME still need to fix this use of template literals
//update a product with the id parameter. expects a request object.
const updateProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const product = await changeProduct(id, updates);
  response.status(200).send(`Product modified with ID: ${product.id}`)

  /*
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
  });*/
};

//deletes a product from the database. sends a response object
const deleteProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await removeProduct(id);
  response.status(200).send(`Product deleted with ID: ${product.id}`)
  /*pool.query('DELETE FROM products WHERE id = $1', [id], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).send(`Product deleted with ID: ${id}`);
  });*/
};

module.exports = {
    getProducts,
    getProductsByVendor,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};
  