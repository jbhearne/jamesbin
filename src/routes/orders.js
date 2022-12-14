const express = require('express');
const router = express.Router();
const { orders, cart } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

//routes for handling orders and checkout
router.get('/orders', isAdmin, orders.getOrders);
router.post('/orders', loggedIn, orders.createOrder); 
router.get('/orders/:id', isAdmin, orders.getOrderById);
router.put('/orders/:id', isAdmin, orders.updateOrder);
router.delete('/orders/:id',  isAdmin, orders.deleteOrder);
router.get('/orders/user/:id', adminOrCurrentUser, orders.getOrdersByUser); 
router.get('/checkout', loggedIn, cart.getCartForCheckout); 
router.post('/checkout', loggedIn, orders.checkout); 

module.exports = router;