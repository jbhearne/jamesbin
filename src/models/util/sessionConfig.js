////////////////////////////////////////
//Session info //

//REVIEW: for now we will assume it is better to put it in the main app. TODO: either connect this to app.js or detete it.
//GARBAGE - ?
require('dotenv/config')

const sessionDBaccess = new sessionPool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT})

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

