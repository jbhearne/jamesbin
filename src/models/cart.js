//////////////////////////////////////////////
////functions for accessing the cart table///

//inport
const pool = require('./util/pool');
const { isItemOnCompleteOrder } = require('./util/findOrder');
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
} = require('./util/findCart');
const { isProductExtant } = require('./util/findProduct');

//gets all cart items sends a response object
const getCartItems = async (request, response) => {
  const cartItems = await findAllCartItems();
  response.status(200).json(cartItems);
};


//gets all cart items for a specidfied order. sends a response object.
const getCartByOrderId = async (request, response) => {
  const id = parseInt(request.params.id);
  const cart = await findCartByOrderId(id);
  response.status(200).json(cart);
};

//gets a cart item by its id. sends a response object
const getCartItemById = async (request, response) => {
  const id = parseInt(request.params.id);
  const cartItem = await findCartItemById(id);
  response.status(200).json(cartItem);
};

//gets all items on an order and the coresponding product info from products table. Sends a response object. this is what a "cart" is.
const getCartWithProductsByUser = async (request, response) => {
  const id = parseInt(request.params.id);
  const cartItems = await findAllCurrentCartItemsWithProductsByUser(id);
  response.status(200).json(cartItems);
}

//similar to above with subtotals and total plus delivery and billing info
const getCartForCheckout = async (request, response) => { 
  const user = request.user;
  //TODO: add check constraint to database to ensure there is only one open order for a given user.
  const checkoutCart = await collectCart(user.id)

  if (typeof checkoutCart === 'string') { //REVIEW: I know i need to work on this so that it works more through a traditional error handling
    response.status(400).send(checkoutCart);
  } else {
  response.status(200).send(checkoutCart);
  }
}

//create a cart item on the current user's open order. expects a request.
const createCartItem = async (request, response) => {
  const newCartItem = request.body;
  const userId =  request.user.id
  const cartItem = await addCartItemToUserOrder(userId, newCartItem);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item added with ID: ${cartItem.id}`);
  }
};

//create a cart item on an arbitary order as specified. send a response.
const createCartItemOnOrder = async (request, response) => { 
  const id = parseInt(request.params.id);
  const newCartItem = request.body;
  const cartItem = await addCartItemOnOrder(id, newCartItem);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item added with ID: ${cartItem.id}`);
  }
};

//updates the quantity of an item in the cart as specified by cart id.
const updateCartItem = async (request, response, next) => {
  //console.log('\x1B[31mtest updateCartItem \x1B[37m')  //LEARNED how to color text in BASH console.
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const cartItem = await changeCartItemQuantity(id, quantity);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item ID: ${cartItem.id} updated.`);
  }
}

//similar to above, but checks if the cart belongs to current user and the order is still open.
const updateCartItemIfUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const { quantity } = request.body;
  const userId = request.user.id
  const cartItem = await changeCartItemQuantityIfUser(id, quantity, userId);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(201).send(`Cart item ID: ${cartItem.id} updated.`);
  }
}

//deletes a cart item. 
const deleteCartItem = async (request, response) => {
  const id = parseInt(request.params.id);
  const cartItem = await removeCartItem(id);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(200).send(`Cart item ID: ${cartItem.id} deleted.`);
  }
}

//same as above, but checks to make sure cart items belong to current user.
const deleteCartItemIfUser = async (request, response, next) => {
  const id = parseInt(request.params.id);
  const userId = request.user.id
  const cartItem = await removeCartItemIfUser(id, userId);
  if (typeof cartItem === 'string') {
    response.status(400).send(cartItem);
  } else {
    response.status(200).send(`Cart item ID: ${cartItem.id} deleted.`);
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
