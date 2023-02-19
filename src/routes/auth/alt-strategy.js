//REVIEW this will end up querying the database everytime passport.authenticate is called.
  //REVIEW i think you could change this so that you could save more user info in the JWT and then extract that and 
  //REVIEW then call done() using the extracted info which i think puts sets the req.user object.
  //REVIEW this was cited as a benifit of JWT, but it would mean that you are actual not checking the database, which could be less secure 
  //REVIEW and also could cause problems if there were changes to the database that were not synced to the JWT being used.
  //REVIEW maybe using multiple strategies would be best. like passport.authenticate on some routes and custom authentication on others.
  

  //IDEA this is an no lookup aproach to authentication. just trusting the token.


const pathToPubKey = path.join(__dirname, '../../../', 'public.pem')//'../../../../public.pem';
const PUB_KEY = fs.readFileSync(pathToPubKey, 'utf8');
  
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
}

passport.use(new JwtStrategy(options, (jwt_payload, done) => {
  try {
    const user = {
      id: jwt_payload.sub,
      username: jwt_payload.username,
      fullname: jwt_payload.fullname,
      admin: jwt_payload.admin,
    }
    const {id, username, fullname, admin} = user;
    if (id && username && fullname && admin) {
      return done(null, user)
    } else {
      return done(null, false)
    }
  } catch (err) {
    return done(err, false)
  }

}))


const pathToPrvKey = path.join(__dirname, '../../../', 'private.pem')//'../../../../private.pem';
const PRV_KEY = fs.readFileSync(pathToPrvKey, 'utf8');

const issueJWT = (user) => {
  const id = user.id;
  const expiresIn = 24 * 60 * 60 * 1000;

  const payload = {
    sub: id,
    iat: Date.now(),
    username: user.username,
    fullname: user.fullname,
    admin: user.admin
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