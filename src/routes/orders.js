const express = require('express');
const router = express.Router();
const { orders } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure');

router.get('/orders', isAdmin, orders.getOrders);
router.post('/orders', loggedIn, orders.createOrder); //REVIEW: does authorization need to be more restricitve?
router.get('/orders/:id', orders.getOrderById); //TODO: needs to be admin or current user?
router.put('/orders/:id', isAdmin, orders.updateOrder);
router.delete('/orders/:id',  isAdmin, orders.deleteOrder);
//must decide how this works. is it thru the route or is it thru authorization?
router.get('/orders/user/:id', adminOrCurrentUser, orders.getOrdersByUser);
//??? do I need more routes for alterering orders by user id?
//do I add more state to the session? or create more SQL querying methods?

module.exports = router;