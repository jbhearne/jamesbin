const express = require('express');
const router = express.Router();
const { users } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure')


router.get('/users', isAdmin, users.getUsers);
router.get('/users/:id', adminOrCurrentUser, users.getUserById);
router.put('/users/:id', adminOrCurrentUser, users.updateUser);
router.delete('/users/:id', isAdmin, users.deleteUser);

module.exports = router;