////////////////////////////////////////////////////////////
///Product based HTTP requests/response for RESTful API///////

//imports
const { checkForFoundRowObj, checkForFoundRowsArr } = require('../models/util/checkFind')
const { 
  findAllProducts,
  findProductById,
  findProductsByVendor,
  addProduct,
  changeProduct,
  removeProduct
} = require('../models/findProduct');

//gets all the products in the database and sends a response object
const getProducts = async (request, response) => {
  try {
    const products = await findAllProducts();
    const check = checkForFoundRowsArr(products);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//get all the products from a particular vender as specified in the parameter. sends a response object
const getProductsByVendor = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const products = await findProductsByVendor(id);
    const check = checkForFoundRowsArr(products);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//get a product using id parameter sends a response object
const getProductById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const product = await findProductById(id);
    const check = checkForFoundRowObj(product);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//add a new product expects a request object
const createProduct = async (request, response) => {
  const newProduct = request.body;
  try {
    const product = await addProduct(newProduct);
    const check = checkForFoundRowObj(product);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Product added with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//update a product with the id parameter. expects a request object.
const updateProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  try {
    const product = await changeProduct(id, updates);
    const check = checkForFoundRowObj(product);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Product modified with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//deletes a product from the database. sends a response object
const deleteProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await removeProduct(id);
  response.status(200).send(`Product deleted with ID: ${product.id}`)
  try {
    const product = await removeProduct(id);
    const check = checkForFoundRowObj(product);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Product deleted with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

module.exports = {
    getProducts,
    getProductsByVendor,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
  