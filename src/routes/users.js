const express = require('express');
const router = express.Router();
const { users } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure')


router.get('/users', isAdmin, users.getUsers);
//router.post('/users', isAdmin, users.createUser); //LINK ../models/users.js#createuser
//LINK ./auth/auth.js#register
router.get('/users/:id', adminOrCurrentUser, users.getUserById);
router.put('/users/:id', adminOrCurrentUser, users.updateUser);
//TODO: create a route for just changing password.
router.delete('/users/:id', isAdmin, users.deleteUser);

module.exports = router;