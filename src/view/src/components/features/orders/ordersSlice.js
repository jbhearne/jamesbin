import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';

export const fetchOrders = createAsyncThunk(
  'cart/fetchOrders',
  async (id) => {
    const token = localStorage.getItem("id_token");
    const orders = await apiFetch(`/orders/user/${id}`, token);
    //testlog console.log(orders)
    return orders.map(order => {
      return {
        id: order.id,
        userId: order.user_id,
        dateStarted: order.date_started,
        dateCompleted: order.date_completed,
        amount: order.amount,
        billingId: order.billing_id,
        deliveryId: order.delivery_id,
      }
    });
  }
);

export const fetchItems = createAsyncThunk(
  'cart/fetchItems',
  async (id) => {
    const token = localStorage.getItem("id_token");
    const items = await apiFetch(`/cart/order/${id}`, token);
    console.log(items)
    return items.map(item => {
      return {
        id: item.id,
        productName: item.name,
        orderId: item.order_id,
        price: item.price,
        productId: item.product_id,
        quantity: item.quantity,
        subtotal: item.subtotal,
      }
    });
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
    removeOrders: (state, action) => {
      state.orders = [];
      state.orderItems = [];
    },
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
export const removeOrders = ordersSlice.actions.removeOrders;

export default ordersSlice.reducer;