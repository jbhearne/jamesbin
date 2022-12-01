const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const pool = require('../../models/util/pool');
var router = express.Router();


passport.use(new LocalStrategy((username, password, cb) => {
  console.log('is local running?'); 
  pool.query('SELECT * FROM users WHERE username = $1', [ username ], (err, res) => {
    console.log('is pool running?')
    if (err) { console.log('error is running'); return cb(err); }
    if (!res.rows[0]) { console.log('no user' + res.rows[0]); return cb(null, false, { message: 'Incorrect username or password.' }); }
    if (res.rows[0].password !== password) {console.log(res.rows[0] + ' wrong password ' + res.rows[0] + ' not ' + password); return cb(null, false, { message: 'Incorrect username or password.' })}
    return cb(null, res.rows[0]);
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
router.get('/login', function(req, res, next) {
  res.send('login');
});


router.post('/login/password', (req, res, next) => {console.log('howdy'); next()}, passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

module.exports = router