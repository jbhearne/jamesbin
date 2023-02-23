const express = require('express');
const router = express.Router();
const { products } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/jwt-ensure');

//routes related to products
router.get('/products', products.getProducts);
router.post('/products', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, products.createProduct);
router.get('/product/:id', products.getProductById);
router.put('/product/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, products.updateProduct);
router.delete('/product/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, products.deleteProduct);
router.get('/products/vendor/:id', products.getProductsByVendor);

module.exports = router;
