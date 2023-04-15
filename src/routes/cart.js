///////////////////////////////////////////////////////////////////////////////
///Router for routes related to the shopping cart

//imports
const express = require('express');
const router = express.Router();
const { cart } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/jwt-ensure');

//routes related to shopping cart items
router.get('/cart', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, cart.getCartItems); //DONE - 
router.post('/cart', (req, res, next) => {loggedIn(req, res, next)}, cart.createCartItem); 
router.get('/cart/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, cart.getCartItemById);
router.put('/cart/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, cart.updateCartItem);
router.delete('/cart/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, cart.deleteCartItem);
router.post('/cart/order/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, cart.createCartItemOnOrder);
router.get('/cart/user/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrCurrentUser, cart.getCartWithProductsByUser); //DONE - 
router.put('/user/cart/:id', (req, res, next) => {loggedIn(req, res, next)}, cart.updateCartItemIfUser); //DONE - 
router.delete('/user/cart/:id', (req, res, next) => {loggedIn(req, res, next)}, cart.deleteCartItemIfUser); //DONE - 

module.exports = router;
