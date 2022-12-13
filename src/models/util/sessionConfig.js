////////////////////////////////////////
//Session Configuration //

const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const randomString = require('randomstring')
const sessionPool = require('./pool')

const sessionDBaccess = sessionPool;

const sessionConfig = {
  store: new pgSession({
      pool: sessionDBaccess,
      tableName: 'session'
  }),
  name: 'SID',
  secret: randomString.generate({
      length: 14,
      charset: 'alphanumeric'
  }),
  resave: false,
  saveUninitialized: true,
  cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      aameSite: true,
      secure: false // ENABLE ONLY ON HTTPS
  }}

module.exports = {
  sessionConfig: sessionConfig,
  session: session
}
