const express = require('express');
const router = express.Router();
const { users } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/ensure')
const passport = require('passport')

//router.get('/user', passport.authenticate('jwt', {session: false}), users.getCurrentUser);
router.get('/user', loggedIn(), (req, res, next) => {console.log(req.user); next()}, users.getCurrentUser);
router.get('/users', isAdmin, users.getUsers);
router.get('/users/:id', adminOrCurrentUser, users.getUserById);
router.put('/users/:id', adminOrCurrentUser, users.updateUser);
router.delete('/users/:id', isAdmin, users.deleteUser);

module.exports = router;