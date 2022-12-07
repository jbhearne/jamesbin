const express = require('express');
const router = express.Router();
const { orders, cart } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/orders', isAdmin, orders.getOrders);
router.post('/orders', loggedIn, orders.createOrder); 
router
router.get('/orders/:id', isAdmin, orders.getOrderById); //REVIEW: needs to be admin or current user?
router.put('/orders/:id', isAdmin, orders.updateOrder);
router.delete('/orders/:id',  isAdmin, orders.deleteOrder);
router.get('/orders/user/:id', adminOrCurrentUser, orders.getOrdersByUser); //LINK - ../models/orders.js:15
//??? do I need more routes for alterering orders by user id?
router.get('/checkout', loggedIn, cart.getCartForCheckout); 
router.post('/checkout', loggedIn, orders.checkout); 
module.exports = router;