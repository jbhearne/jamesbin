const passport = require('passport');
const pool = require('../../models/util/pool');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const s3Keys = require('./get_s3_keys')
const jsonwebtoken = require('jsonwebtoken');

const initJWT = async () => {
  const PUB_KEY = await s3Keys.getPublic();

  console.log(PUB_KEY)

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
  }))
}

const issueJWT = async (user) => {
  const PRV_KEY = await s3Keys.getPrivate();

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