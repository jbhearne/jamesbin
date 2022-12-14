const express = require('express');
const router = express.Router();
const { cart } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

//routes related to shopping cart items
//LINK ../models/cart.js#additem
router.get('/cart', isAdmin, cart.getCartItems); //PASS REFACTOR - plural
router.post('/cart', loggedIn, cart.createCartItem);  //REVIEW: had to move some things up in the order for it to not parse as an :id. should review all routes
router.get('/cart/:id', isAdmin, cart.getCartItemById); //PASS REFACTOR -  ITem
router.put('/cart/:id', isAdmin, cart.updateCartItem);
router.delete('/cart/:id', isAdmin, cart.deleteCartItem);
router.get('/cart/order/:id', isAdmin, cart.getCartByOrderId); //PASS REFACTOR - remove item
router.post('/cart/order/:id', isAdmin, cart.createCartItemOnOrder);
router.get('/cart/user/:id', adminOrCurrentUser, cart.getCartWithProductsByUser);
router.put('/user/cart/:id', loggedIn, cart.updateCartItemIfUser); //LINK ../models/cart.js:97
router.delete('/user/cart/:id', loggedIn, cart.deleteCartItemIfUser); //LINK ../models/cart.js#deleteCartItemIfUser


module.exports = router;
