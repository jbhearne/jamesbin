const express = require('express');
const router = express.Router();
const { cart } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

//routes related to shopping cart items
router.get('/cart', isAdmin, cart.getCartItems); 
router.post('/cart', loggedIn, cart.createCartItem); 
router.get('/cart/:id', isAdmin, cart.getCartItemById);
router.put('/cart/:id', isAdmin, cart.updateCartItem);
router.delete('/cart/:id', isAdmin, cart.deleteCartItem);
router.get('/cart/order/:id', isAdmin, cart.getCartByOrderId);
router.post('/cart/order/:id', isAdmin, cart.createCartItemOnOrder);
router.get('/cart/user/:id', adminOrCurrentUser, cart.getCartWithProductsByUser);
router.put('/user/cart/:id', loggedIn, cart.updateCartItemIfUser); 
router.delete('/user/cart/:id', loggedIn, cart.deleteCartItemIfUser);


module.exports = router;
