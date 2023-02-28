import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiPost} from '../../../utils/apiFetch';
import EP from '../../../dataEndpoints';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (id) => {
    console.log('startfetchcartbeforeselectuser')
    //const user = useSelector(selectUser);
    console.log('startfetchcart')
    const token = localStorage.getItem("id_token");
    const cart = await apiFetch(`/cart/user/${id}`, token);
    console.log(cart)
    console.log('fectch')
    return cart;
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: [],
    orderId: -1,
    isLoading: false,
    hasError: false,
  },
  reducers: {

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
//export const removeUser = userSlice.actions.removeUser;
//export const setIsloggedIn = userSlice.actions.setIsloggedIn;

export default cartSlice.reducer;