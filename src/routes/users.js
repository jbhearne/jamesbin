const express = require('express');
const router = express.Router();
const { users } = require('../models/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure')

router.get('/users', isAdmin, users.getUsers);
//DONE: there is a already a register route in auth and i removed the response from createUser function.
//router.post('/users', isAdmin, users.createUser); //LINK ./auth/auth.js:61
router.get('/users/:id', adminOrCurrentUser, users.getUserById);
router.put('/users/:id', adminOrCurrentUser, users.updateUser);
router.delete('/users/:id', isAdmin, users.deleteUser);

module.exports = router;