const express = require('express');
const router = express.Router();
const { cart } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/cart', isAdmin, cart.getCart);
router.post('/cart', loggedIn, cart.createCartItem);  //REVIEW: had to move some things up in the order for it to not parse as an :id. should review all routes
router.get('/cart/:id', isAdmin, cart.getCartById);
router.put('/cart/:id', isAdmin, cart.updateCart);
router.delete('/cart/:id', isAdmin, cart.deleteCart);
router.get('/cart/order/:id', isAdmin, cart.getCartByOrder);
router.post('/cart/order/:id', isAdmin, cart.createCartItemOnOrder);
router.get('/cart/user/:id', adminOrCurrentUser, cart.getCartWithProductsByUser);
router.put('/user/cart/:id', loggedIn, cart.updateCartWithUser); //LINK ../models/cart.js:97
router.delete('/user/cart/:id', loggedIn, cart.deleteCartWithUser); //LINK ../models/cart.js#deleteCartWithUser


module.exports = router;
