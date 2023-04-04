const express = require('express');
const passport = require('passport');
const router = express.Router();
const validate = require('./validate');


const pool = require('../../models/util/pool');

const bcrypt = require('bcrypt');

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const fs = require('fs');
const { initJWT, issueJWT } = require('./async_passport')
//const fs = require('@cyclic.sh/s3fs')("cyclic-gentle-yoke-fish-us-west-1") //IDEA - fs for AWS for cyclic deploy
const path = require('path');
const jsonwebtoken = require('jsonwebtoken');

const { addUser } = require('../../models/findUser');
const { loggedIn } = require('./jwt-ensure')

const pathToPubKey = path.join(__dirname, '../../../', 'public.pem')//'../../../../public.pem'
//const pathToPubKey = 'public.pem' //??? tried to get this is the path, but the readFileSync keeps turning it into a  absolute system path. Not sure how this is suppoded to wort with cyclic/AWS.
//const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');
//const PUB_KEY = process.env.JWT_PUBLIC; //LEARNED - 255 character limit to environmental variables

initJWT();

/*console.log(PUB_KEY)

const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
}

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  console.log('JWTsTRAT')
  //console.log(jwt_payload)
  const id = jwt_payload.sub;
  const isCurrent = jwt_payload.exp > Date.now();
  const sql = 'SELECT * FROM users WHERE id = $1';
  pool.query(sql, [id], async (err, res) => {
    if (err) { return done(err, false) }
    if (res.rows[0] && isCurrent) {
      console.log('DONE+USER')
      return done(null, res.rows[0], { msg: 'JWT user found.' });
    } else {
      console.log('DONE+FALSE')
      const expires = new Date(jwt_payload.exp);
      return done(null, false, { msg: 'JWT does not match database or is expired', JWTexpires: expires });
    }
  });
}))*/

//IDEA issue JWT, this should go in another file
//const pathToPrvKey = path.join(__dirname, '../../../', 'private.pem')//'../../../../private.pem';
/*const pathToPrvKey = 'private.pem'
const PRV_KEY = fs.readFileSync(pathToPrvKey, 'utf8');
//const PRV_KEY = process.env.JWT_PRIVATE; //LEARNED - 255 character limit to environmental variables

const issueJWT = (user) => {
  const id = user.id;
  const expiresIn = 24 * 60 * 60 * 1000;

  const payload = {
    sub: id,
    iat: Date.now(),
    admin: user.admin,
  }

  const signedToken = jsonwebtoken.sign(payload, PRV_KEY, {
    expiresIn: expiresIn,
    algorithm: 'RS256',
  });

  return {
    token: 'Bearer ' + signedToken,
    expiresIn: expiresIn,
  }
}*/

//placeholder route for a login page
router.get('/login', function(req, res, next) {
  res.send('login');
});

//IDEA new login route for JWT
router.post('/login', (req, res, next) => {console.log(req.body); next()}, async (req, res, next) => {
  const sql = 'SELECT * FROM users WHERE username = $1';
  pool.query(sql, [req.body.username], async (err, results) => {
    const user = results.rows[0]
    if (err) { res.status(401).json({ success: false, msg: "error" }); }
    if (!!!user?.password) {
      return res.status(401).json({ success: false, msg: "could not find user" });
    } 
    const isValidPassword = await bcrypt.compare(req.body.password, user.password);

    if (isValidPassword) {
      const tokenObject = await issueJWT(user); //CHANGED - now importing this from module as async, added await keyword
      res.status(200).json({
        msg: 'logged in',
        success: true,
        token: tokenObject.token,
        expiresIn: tokenObject.expiresIn,
      });
    } else {
      res
          .status(401)
          .json({ success: false, msg: "you entered the wrong password" });
    }
  })
});

//IDEA testing default jwt authenicate route 
router.get('/authenticate', passport.authenticate('jwt', { session: false }), (req, res, next) => {
  console.log(req.user)
  res.status(200).json({
    user: req.user,
    success: true,
    msg: 'authenticated',
  })
});

//placeholder route for a registration page
router.get('/register', function(req, res, next) {
  res.send('register');
});

//route to create a new user, checks if there is already a username in the database, uses bcrypt to salt and hash password before adding it to the database.
router.post("/register", async (req, res, next) => {
  const { username, password } = req.body
  
  pool.query('SELECT * FROM users WHERE username = $1', [username], async (error, results) => {
    if (error) { next(error) }
    const rows = await results.rows;
    if (rows.length > 0) {
      console.log('User already exists.')
      return res.status(400).json({ msg: 'User already exists.', success: false })
    }

    const validPassword = validate.password(password, { min: 3, include: ',.', exclude: 'a' })

    if (!validPassword.isValid) {
      return res.status(400).json({ msg: validPassword.msg, success: false })
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    req.body.password = hash;
    const user = await addUser(req.body);
    console.log(`created user${await req.body.id}`)
    res.status(200).json({ msg: 'user registed', success: true, user: user })
  })
})

router.put('/user/password', (req, res, next) => {loggedIn(req, res, next)}, async (req, res, next) => {
  const { password } = req.body;
  const userId = req.user.id;
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  const sql = 'UPDATE users SET password = $1 WHERE id = $2';
  pool.query(sql, [hash, userId], (error, results) => {
    if (error) { next(error) };
    res.status(200).json({ msg: 'Password updated.', success: true })
  })
})

module.exports = router