import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiPost, apiDelete, multiPost, apiPut} from '../../../utils/apiFetch';
import EP from '../../../dataEndpoints';
import './cart.css';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async ({ id: id, cart: cart }) => {
    //console.log('startfetchcartbeforeselectuser')
    //GARBAGE const user = useSelector(selectUser);
    console.log('startfetchcart' + (parseInt(Date.now()) - 1678800000000))
    const token = localStorage.getItem("id_token");
    //console.log(cart)
    //console.log('fectch')
    if (cart.length > 0) {
      const localItems = cart.filter(item => item.id < 0);
      const bodies = localItems.map(body => {
        return { productId: body.productId, quantity: body.quantity };
      });
      console.log(bodies)
      console.log('before multi ' + (parseInt(Date.now()) - 1678800000000))
      if (localItems.length > 0) {
        await multiPost('/cart', bodies, 0, token); //TODO: need to create an API call to post multiple cart items in one call.
      }
      /*if (localItems.length > 0) {
        await localItems.forEach(async item => {
          console.log('top of loop ' + (parseInt(Date.now()) - 1678800000000))
          await apiPost('/cart', {
            productId: item.productId,
            quantity: item.quantity,
          }, token);
          console.log('bottom of loop' + (parseInt(Date.now()) - 1678800000000))
        });
        console.log('out of loop' + (parseInt(Date.now()) - 1678800000000))
      }*/

      console.log('after multi ' + (parseInt(Date.now()) - 1678800000000))
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
export const deleteUserCartItem = createAsyncThunk(
  'cart/deleteUserCartItem',
  async (id) => {
    const token = localStorage.getItem('id_token');
    const deleted = await apiDelete(`/user/cart/${id}`, token)
  }
)


//TODO make this update the store
export const updateUserCartItem = createAsyncThunk(
  'cart/updateUserCartItem',
  async ({id: id, body: body}) => {
    const token = localStorage.getItem('id_token');
    const updated = await apiPut(`/user/cart/${id}`, body, token)
  })

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

export const selectCart = (state) => state.cart.cart;
export const selectTempCartId = (state) => state.cart.tempCartId;

export const addItemToCart = cartSlice.actions.addItemToCart;
export const removeItemFromCart = cartSlice.actions.removeItemFromCart;
export const removeCart = cartSlice.actions.removeCart;
export const incrementTempCartId = cartSlice.actions.incrementTempCartId;


export default cartSlice.reducer;