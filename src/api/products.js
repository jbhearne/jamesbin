////////////////////////////////////////////////////////////
///Product based HTTP requests/response for RESTful API///////

//imports
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
  const products = await findAllProducts();
  response.status(200).json(products);
}

//get all the products from a particular vender as specified in the parameter. sends a response object
const getProductsByVendor = async (request, response) => {
  const id = parseInt(request.params.id);
  const products = await findProductsByVendor(id);
  response.status(200).json(products);
}

//get a product using id parameter sends a response object
const getProductById = async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await findProductById(id);
  response.status(200).json(product);
}

//add a new product expects a request object
const createProduct = async (request, response) => {
  const newProduct = request.body;
  const product = await addProduct(newProduct);
  response.status(201).send(`Product added with ID: ${product.id}`);
}

//update a product with the id parameter. expects a request object.
const updateProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const updates = request.body;
  const product = await changeProduct(id, updates);
  response.status(200).send(`Product modified with ID: ${product.id}`)
}

//deletes a product from the database. sends a response object
const deleteProduct = async (request, response) => {
  const id = parseInt(request.params.id);
  const product = await removeProduct(id);
  response.status(200).send(`Product deleted with ID: ${product.id}`)
}

module.exports = {
    getProducts,
    getProductsByVendor,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
}
  