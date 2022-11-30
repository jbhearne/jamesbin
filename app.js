require('dotenv/config')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const PORT = process.env.PORT

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

/*const userRoutes = require('./src/routes/users');
const orderRoutes = require('./src/routes/orders');
const vendorRoutes = require('./src/routes/vendors');
const productRoutes = require('./src/routes/products');
const cartRoutes = require('./src/routes/cart');*/

const routes = require('./src/routes/index')

app.use(routes.userRoutes);
app.use(routes.orderRoutes);
app.use(routes.vendorRoutes);
app.use(routes.productRoutes);
app.use(routes.cartRoutes);

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