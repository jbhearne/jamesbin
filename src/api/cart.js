//////////////////////////////////////////////
////Order based HTTP requests/response for RESTful API///

//import
const { checkForFoundRowObj, checkForFoundRowsArr } = require('../models/util/checkFind');
const { 
  collectCart,
  findAllCartItems,
  findCartItemById,
  findCartByOrderId,
  findAllCurrentCartItemsWithProductsByUser,
  addCartItemToUserOrder,
  addCartItemOnOrder,
  changeCartItemQuantity,
  changeCartItemQuantityIfUser,
  removeCartItem,
  removeCartItemIfUser
} = require('../models/findCart');

//gets all cart items sends a response object
const getCartItems = async (request, response) => {
  try {
    const cartItems = await findAllCartItems();
    const check = checkForFoundRowsArr(cartItems);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
};


//gets all cart items for a specidfied order. sends a response object.
const getCartByOrderId = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const cartItems = await findCartByOrderId(id);
    const check = checkForFoundRowsArr(cartItems);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
};

//gets a cart item by its id. sends a response object
const getCartItemById = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const cartItem = await findCartItemById(id);
    const check = checkForFoundRowObj(cartItem);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
};

//gets all items on an order and the coresponding product info from products table. Sends a response object array. this is what a "cart" is.
const getCartWithProductsByUser = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const cartItems = await findAllCurrentCartItemsWithProductsByUser(id);
    const check = checkForFoundRowsArr(cartItems);
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//similar to above with subtotals and total plus delivery and billing info
const getCartForCheckout = async (request, response) => { 
  const user = request.user;
  //TODO: add check constraint to database to ensure there is only one open order for a given user.
  try {
    const checkoutCart = await collectCart(user.id);
    const check = checkForFoundRowObj(checkoutCart); //collectCart returns an object not an array
    response.status(check.status).json(check.results);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//create a cart item on the current user's open order. expects a request.
const createCartItem = async (request, response) => {
  const newCartItem = request.body;
  const userId =  request.user.id
  try {
    const cartItem = await addCartItemToUserOrder(userId, newCartItem);
    const check = checkForFoundRowObj(cartItem);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Cart item added with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
};

//create a cart item on an arbitary order as specified. send a response.
const createCartItemOnOrder = async (request, response) => { 
  const id = parseInt(request.params.id);
  const newCartItem = request.body;
  try {
    const cartItem = await addCartItemOnOrder(id, newCartItem);
    const check = checkForFoundRowObj(cartItem);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Cart item added with ID: ${check.results.id}`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
};

//updates the quantity of an item in the cart as specified by cart id.
const updateCartItem = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  try {
    const cartItem = await changeCartItemQuantity(id, quantity);
    const check = checkForFoundRowObj(cartItem);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Cart item ID: ${check.results.id} updated.`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//similar to above, but checks if the cart belongs to current user and the order is still open.
const updateCartItemIfUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const userId = request.user.id;
  try {
    const cartItem = await changeCartItemQuantityIfUser(id, quantity, userId);
    const check = checkForFoundRowObj(cartItem);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Cart item ID: ${check.results.id} updated.`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//deletes a cart item. 
const deleteCartItem = async (request, response) => {
  const id = parseInt(request.params.id);
  try {
    const cartItem = await removeCartItem(id);
    const check = checkForFoundRowObj(cartItem);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Cart item ID: ${check.results.id} deleted.`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

//same as above, but checks to make sure cart items belong to current user.
const deleteCartItemIfUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const userId = request.user.id;
  try {
    const cartItem = await removeCartItemIfUser(id, userId);
    const check = checkForFoundRowObj(cartItem);
    if (check.status >= 400 && check.status < 500) response.status(check.status).json(check.results);
    if (check.status >= 200 && check.status < 300) response.status(check.status).json(`Cart item ID: ${check.results.id} deleted.`);
  } catch (err) {
    console.error(err);
    throw new Error('API failure: ' + err);
  }
}

module.exports = {
    getCartItems,
    getCartByOrderId,
    getCartItemById,
    createCartItem,
    updateCartItem,
    deleteCartItem,
    getCartWithProductsByUser,
    updateCartItemIfUser,
    createCartItemOnOrder,
    deleteCartItemIfUser,
    getCartForCheckout
}
