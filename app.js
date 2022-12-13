//imports
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const randomString = require('randomstring')
const sessionPool = require('./src/models/util/pool')

//create server
const app = express()
const PORT = process.env.PORT

//middleware
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
//REFACTOR[id=session]
//Session setup
//??? should i move this to another file?
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
//!REFACTOR

//start session and passport
app.use(passport.initialize())
app.use(session(sessionConfig))
app.use(passport.session());
app.use(passport.authenticate('session'));

//import and use authentication routes
const authRouter = require('./src/routes/auth/auth');
app.use('/', authRouter);

//import and use app routes
const routes = require('./src/routes/index')
app.use(routes.userRoutes);
app.use(routes.orderRoutes);
app.use(routes.vendorRoutes);
app.use(routes.productRoutes);
app.use(routes.cartRoutes);

//Home route //REVIEW: add more home routes
app.get('/', (req, res) => {
  res.send('home')
})

//start server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
  })