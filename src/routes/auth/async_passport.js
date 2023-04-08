////////////////////////////////////////////////////////////////
///Functions for creating and using JWT authentication

//imports
const passport = require('passport');
const pool = require('../../models/util/pool');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const s3Keys = require('./get_s3_keys')
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

//isLocal  is a flag that switchs between filesystem storage and S3 storage
let isLocal = false;
let PUB_KEY;
let PRV_KEY;

//sets the options and initiates passport's JWT strategy using a public key aquiled locally or from the cloud.
const initJWT = async () => {
  if (isLocal) {
    const pathToPubKey = path.join(__dirname, '../../../', 'public.pem')//'../../../../public.pem'
    PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');
  } else {
    PUB_KEY = await s3Keys.getPublic();
  }
  //testlog console.log(PUB_KEY)

  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
  }
  
  passport.use(new JwtStrategy(options, (jwt_payload, done) => {
    console.log('JWTsTRAT')
    //testlog console.log(jwt_payload)
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
  }))
}

//creates a JWT using a private key aquired locally or through the cloud.
const issueJWT = async (user) => {
  if (isLocal) {
    const pathToPrvKey = path.join(__dirname, '../../../', 'private.pem')//'../../../../public.pem'
    PRV_KEY = fs.readFileSync(pathToPrvKey, 'utf8');
  } else {
    PRV_KEY = await s3Keys.getPrivate();
  }


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
}

module.exports = {
  initJWT,
  issueJWT,
}