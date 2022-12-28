///////////////////////////////////////////////  
//Functions related to querying products table//

//import and create pool
const pool = require('./util/pool');

//queries products using product ID to see if a product exists. Returns true if it does OR false if not.
const isProductExtant = async (id) => {
  const sql = 'SELECT id FROM products WHERE id = $1';
  const results = await pool.query(sql, [id]);
  return results.rows.length === 1;// ? true : false;
};

//returns an array of all products from the database
const findAllProducts = async () => {
  const sql = 'SELECT * FROM products ORDER BY id ASC';
  const results = await pool.query(sql)
  return results.rows
}

//returns a product object from the database as specified by the product id
//TODO need to add conditional for handling no existing product
const findProductById = async (id) => {
  const sql = 'SELECT * FROM products WHERE id = $1';
  const results = await pool.query(sql, [id]);
  const productObj = results.rows[0];
  return productObj;
}


//returns an array of all products from a single vendor as specified by the vendor id
//TODO need to add conditional for handling no existing vendor
const findProductsByVendor = async (id) => {
  const sql = 'SELECT * FROM products WHERE vendor_id = $1';
  const results = await pool.query(sql, [id]);
  const productArr = results.rows[0];
  return productArr;
}

//takes a new product object and inserts it into the products table.
const addProduct = async (newProduct) => {
  const { name, description, price, vendorId } = newProduct;
  const sql = 'INSERT INTO products (name, description, price, vendor_id) VALUES ($1, $2, $3, $4) RETURNING *';
  const results = await pool.query(sql, [name, description, price, vendorId]);
  const productObj = results.rows[0];
  return productObj;
}

//takes an product object (with partial or complete properties) and updates the row indicated by the product id.
const changeProduct = async (id, updates) => {
  const existingProduct = await findProductById(id);

  for (key in existingProduct) {
    if (updates[key]) { existingProduct[key] = updates[key] }
  }

  const { name, description, price, vendor_id } = existingProduct;
  const sql = 'UPDATE products SET name = $1, description = $2, price = $3, vendor_Id = $4 WHERE id = $5 RETURNING *' 
  const results = await pool.query(sql, [name, description, price, vendor_id, id]);

  const productObj = results.rows[0];
  return productObj;
};

//deletes the product indicated by the product id from the database.
const removeProduct = async (id) => {
  const sql = 'DELETE FROM products WHERE id = $1 RETURNING *';
  const results = await pool.query(sql, [id]);
  const deletedProductObj = results.rows[0];

  return deletedProductObj;
}

module.exports = {
  isProductExtant,
  findAllProducts,
  findProductById,
  findProductsByVendor,
  addProduct,
  changeProduct,
  removeProduct
}