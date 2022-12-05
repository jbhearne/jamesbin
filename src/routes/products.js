const express = require('express');
const router = express.Router();
const { products } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/products', products.getProducts);
router.post('/products', isAdmin, products.createProduct);
router.get('/products/:id', products.getProductById);
router.put('/products/:id', isAdmin, products.updateProduct);
router.delete('/products/:id', isAdmin, products.deleteProduct);
//DONE: not sure what i meant. REVIEW: must decide how this works. is it thru the route or is it thru authorization?
router.get('/products/vendor/:id', products.getProductsByVendor);

module.exports = router;
