//imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiDelete, multiPost, apiPut} from '../../../utils/apiFetch';
import './cart.css';

//Async thunk used to set the state of the cart array state. It also sycronizes the database and redux.
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ id: id, cart: cart }) => {
    //testlog console.log('startfetchcartbeforeselectuser')
    //testlog console.log('startfetchcart' + (parseInt(Date.now()) - 1678800000000))

    const token = localStorage.getItem("id_token");

    //testlog console.log(cart)
    //testlog console.log('fectch')

    //if there are any cart items that are present locally in state, but not on the database,
    //those get added to the database then the all the datbase items are fetched and a new cart array is built.
    if (cart.length > 0) {
      const localItems = cart.filter(item => item.id < 0);
      const bodies = localItems.map(body => {
        return { productId: body.productId, quantity: body.quantity };
      });

      //testlog console.log(bodies)
      //testlog console.log('before multi ' + (parseInt(Date.now()) - 1678800000000))

      if (localItems.length > 0) {
        await multiPost('/cart', bodies, 0, token); //TODO: need to create an API call to post multiple cart items in one call.
      }
      //testlog console.log('after multi ' + (parseInt(Date.now()) - 1678800000000))
    }
    const newCart = await apiFetch(`/cart/user/${id}`, token);
    return newCart.map(item =>{
      return {
        id: item.id,
        productName: item.name,
        productId: item.product_id,
        orderId: item.order_id,
        price: item.price,
        quantity: item.quantity,
      };
    });
  }
);


//TODO make this update the store
//Used to remove an item from the cart on the database
export const deleteUserCartItem = createAsyncThunk(
  'cart/deleteUserCartItem',
  async (id) => {
    const token = localStorage.getItem('id_token');
    const deleted = await apiDelete(`/user/cart/${id}`, token)
  }
)


//TODO make this update the store
//Used change the quantitiy of an item in the cart on the database
export const updateUserCartItem = createAsyncThunk(
  'cart/updateUserCartItem',
  async ({id: id, body: body}) => {
    const token = localStorage.getItem('id_token');
    const updated = await apiPut(`/user/cart/${id}`, body, token)
  })


//Cart slice of the state
export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    tempCart: [],
    tempCartId: -1,
    orderId: -1,
    isLoading: false,
    hasError: false,
  },
  reducers: {
    addItemToCart: (state, action) => {
      state.cart.push(action.payload);
    },
    addItemToTempCart: (state, action) => {
      state.tempCart.push(action.payload);
    },
    removeItemFromCart: (state, action) => {
      state.cart = state.cart.filter(item => item.id !== action.payload);
    },
    removeCart: (state, action) => {
      state.cart = [];
      state.orderId = -1;
    },
    incrementTempCartId: (state, action) => {
      state.tempCartId = state.tempCartId - 1;
    },
  },
  //TODO: I keep getting a warning that this use of extraReducers is depreciated and will soon need to change to "builder callback notation" https://redux-toolkit.js.org/api/createSlice.
  extraReducers: {
    [fetchCart.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchCart.fulfilled]: (state, action) => {
      state.cart = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchCart.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  }
})


//Redux Selectors for useSelector
export const selectCart = (state) => state.cart.cart;
export const selectTempCartId = (state) => state.cart.tempCartId;

//Actions defined in reducers 
export const addItemToCart = cartSlice.actions.addItemToCart;
export const removeItemFromCart = cartSlice.actions.removeItemFromCart;
export const removeCart = cartSlice.actions.removeCart;
export const incrementTempCartId = cartSlice.actions.incrementTempCartId;

//Export the reducer for use in the store 
export default cartSlice.reducer;