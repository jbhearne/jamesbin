const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const pool = require('./util/pool');

passport.use(new LocalStrategy(function verify(username, password, cb) {
  pool.query('SELECT * FROM users WHERE username = ?', [ username ], (err, row) => {
    if (err) { return cb(err); }
    if (!row) { return cb(null, false, { message: 'Incorrect username or password.' }); }
    if (row.password !== password) {return cb(null, false, { message: 'Incorrect username or password.' })}
    return cb(null, row);
  })
}))

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, username: user.username });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});