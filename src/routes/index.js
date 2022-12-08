
//API Routes

const userRoutes = require('./users');
const orderRoutes = require('./orders');
const vendorRoutes = require('./vendors');
const productRoutes = require('./products');
const cartRoutes = require('./cart');

module.exports = {
    userRoutes,
    orderRoutes,
    vendorRoutes,
    productRoutes,
    cartRoutes
}