const express = require('express');
const router = express.Router();
const { users } = require('../api/index');
const { loggedIn, isAdmin, adminOrCurrentUser } = require('./auth/jwt-ensure')
const passport = require('passport')

//router.get('/user', passport.authenticate('jwt', {session: false}), users.getCurrentUser);
router.get('/user', (req, res, next) => {loggedIn(req, res, next)}, (req, res, next) => {console.log(req.user); next()}, users.getCurrentUser);
router.get('/users', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, users.getUsers);
router.get('/users/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrCurrentUser, users.getUserById);
router.put('/users/:id', (req, res, next) => {loggedIn(req, res, next)}, adminOrCurrentUser, users.updateUser);
router.delete('/users/:id', (req, res, next) => {loggedIn(req, res, next)}, isAdmin, users.deleteUser);

module.exports = router;