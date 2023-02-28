import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';

export const fetchOrders = createAsyncThunk(
  'cart/fetchOrders',
  async (id) => {
    const token = localStorage.getItem("id_token");
    const orders = await apiFetch(`/orders/user/${id}`, token);
    return orders;
  }
);

export const fetchItems = createAsyncThunk(
  'cart/fetchItems',
  async (id) => {
    const token = localStorage.getItem("id_token");
    const items = await apiFetch(`/cart/order/${id}`, token);
    return items;
  }
);

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderItems: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {

  },
  extraReducers: {
    [fetchOrders.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchOrders.fulfilled]: (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchOrders.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [fetchItems.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchItems.fulfilled]: (state, action) => {
      state.orderItems = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchItems.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  }
})

export const selectOrders = (state) => state.orders.orders;
export const selectOrderItems = (state) => state.orders.orderItems;

export default ordersSlice.reducer;