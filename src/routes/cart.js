const express = require('express');
const router = express.Router();
const { cart } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/cart', isAdmin, cart.getCart);
router.post('/cart', loggedIn, cart.createCart);
router.get('/cart/:id', isAdmin, cart.getCartById);
router.put('/cart/:id', isAdmin, cart.updateCart);//TODO: need to add a way for current user to update and delete cart.
router.delete('/cart/:id', isAdmin, cart.deleteCart);
//must decide how this works. is it thru the route or is it thru authorization?
router.get('/cart/order/:id', isAdmin, cart.getCartByOrder); //REVIEW: I think that I was thinking in a more stateful way when I first thought about routes...
//...that I could get the order id from the user and the cart from the order, but in a nearly stateless application...
//...either I would have to write functions for querying the database to constantly make these connections...
//...and write every function so that it relates back to the user or I need to query more at one time and store it in the session
//???: ... in the cookie or on the datebase??? Still a little fuzzy on sessions.
router.get('/cart/user/:id', adminOrCurrentUser, cart.getCartWithProductsByUser);

module.exports = router;
