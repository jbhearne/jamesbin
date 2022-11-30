const express = require('express');
const router = express.Router();
const { cart } = require('../models/index');

router.get('/cart', cart.getCart);
router.post('/cart', cart.createCart);
router.get('/cart/:id', cart.getCartById);
router.put('/cart/:id', cart.updateCart);
router.delete('/cart/:id', cart.deleteCart);
//must decide how this works. is it thru the route or is it thru authorization?
router.get('/cart/order/:id', cart.getCartByOrder);

module.exports = router;
