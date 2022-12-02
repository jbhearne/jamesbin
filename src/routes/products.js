const express = require('express');
const router = express.Router();
const { products } = require('../models/index');

router.get('/products', products.getProducts);
router.post('/products', products.createProduct);
router.get('/products/:id', products.getProductById);
router.put('/products/:id', products.updateProduct);
router.delete('/products/:id', products.deleteProduct);
//REVIEW: must decide how this works. is it thru the route or is it thru authorization?
router.get('/products/vendor/:id', products.getProductsByVendor);

module.exports = router;
