require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('passport');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const randomString = require('randomstring')
const sessionPool = require('pg').Pool

const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

//use pool.js just like with queries
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

//app.use(passport.initialize())
app.use(session(sessionConfig))
//app.use(passport.session());
//app.use(passport.authenticate('session'));


/*const userRoutes = require('./src/routes/users');
const orderRoutes = require('./src/routes/orders');
const vendorRoutes = require('./src/routes/vendors');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');*/

const routes = require('./src/routes/index')
const authRouter = require('./src/routes/auth/auth');
app.use('/', authRouter);
app.use(passport.initialize())
app.use(passport.session());

app.use(routes.userRoutes);
app.use(routes.orderRoutes);
app.use(routes.vendorRoutes);
app.use(routes.productRoutes);
app.use(routes.cartRoutes);


app.get('/', (req, res) => {
  res.send('home')
})
/*
const models = require('./src/models/index')

app.get('/test', (req, res) => {
  //models.users.getUsers(req, res)
  //models.orders.getOrders(req, res)
  //models.cart.getCart(req, res)
  //models.vendors.getVendors(req, res)
  models.products.getProducts(req, res)
  //models.orders.getOrders(req, res)
  //models.orders.getOrders(req, res)
  //res.json(models.users.getUsers(req, res))
})*/

app.listen(PORT, () => {
    console.log(`App running on port ${PORT}.`)
    console.log(process.env.MY_SECRET)
  })