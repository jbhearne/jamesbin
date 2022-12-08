const express = require('express');
const router = express.Router();
const { products } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

//routes related to products
router.get('/products', products.getProducts);
router.post('/products', isAdmin, products.createProduct);
router.get('/products/:id', products.getProductById);
router.put('/products/:id', isAdmin, products.updateProduct);
router.delete('/products/:id', isAdmin, products.deleteProduct);
router.get('/products/vendor/:id', products.getProductsByVendor);

module.exports = router;
