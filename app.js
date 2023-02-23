//imports
require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
//GARBAGE const { sessionConfig, session } = require('./src/models/util/sessionConfig');
const cors = require('cors')
//GARBAGE const session = require('express-session');
//GARBAGE const pgSession = require('connect-pg-simple')(session);
//GARBAGE const randomString = require('randomstring')
//GARBAGE const sessionPool = require('./src/models/util/pool')

//create server
const app = express()
const PORT = process.env.PORT

//middleware
//app.use(cors({credentials: true, origin: ['http://api.app.localhost:3002', 'http://localhost:3000']}))
app.use(cors())
/*app.use((req, res, next) => {
  res.set('Access-Control-Allow-Origin', ['http://api.app.localhost:3002']);
  next();
});*/
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//start session and passport
//app.use(passport.initialize()) //??? do id need this for JWT? Don't think so.
//GARBAGE app.use(session(sessionConfig))
//GARBAGE app.use(passport.session());
//GARBAGE app.use(passport.authenticate('session'));

//import and use authentication routes
const authRouter = require('./src/routes/auth/jwt-auth');
app.use('/', authRouter);

//import and use app routes
const routes = require('./src/routes/index')
app.use(routes.userRoutes);
app.use(routes.orderRoutes);
app.use(routes.vendorRoutes);
app.use(routes.productRoutes);
app.use(routes.cartRoutes);

//Home route
app.get('/', (req, res) => {
  res.send('home')
})

//start server
app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
  })