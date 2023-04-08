//imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiPost } from '../../../utils/apiFetch';

//Thunk used to get a list of orders from the database. Takes an (user) id arg.
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

//Thunk used to get a list of items that are on a singal order. Takes an (order) id arg.
export const fetchItems = createAsyncThunk(
  'cart/fetchItems',
  async (id) => {
    const token = localStorage.getItem("id_token");
    const items = await apiFetch(`/cart/order/${id}`, token);
    //testlog console.log(items)
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

//Thunk used to get a checkout object to be used during the checkout process. no args.
export const fetchCheckout = createAsyncThunk(
  'cart/fetchCheckout',
  async () => {
    const token = localStorage.getItem("id_token");
    const checkout = await apiFetch(`/checkout`, token);
    //testlog console.log(orders)
    //testlog console.log('fetchCheckout')
    //testlog console.log(checkout)
    return {
      id: checkout.items[0].order_id,
      items: checkout.items,
      total: checkout.total,
      billing: {
        id: checkout.billing.id,
        payerName: checkout.billing.payerName,
        paymentMethod: checkout.billing.paymentMethod,
        contact: {
          id: checkout.billing.contact.id,
          phone: checkout.billing.contact.phone,
          address: checkout.billing.contact.address,
          city: checkout.billing.contact.city,
          state: checkout.billing.contact.state,
          zip: checkout.billing.contact.zip,
          email: checkout.billing.contact.email,
        },
      },
      delivery: {
        id: checkout.delivery.id,
        receiverName: checkout.delivery.receiverName,
        deliveryMethod: checkout.delivery.deliveryMethod,
        notes: checkout.delivery.notes,
        contact: {
          id: checkout.delivery.contact.id,
          phone: checkout.delivery.contact.phone,
          address: checkout.delivery.contact.address,
          city: checkout.delivery.contact.city,
          state: checkout.delivery.contact.state,
          zip: checkout.delivery.contact.zip,
          email: checkout.delivery.contact.email,
        },
      },
    }
});


//Thunk used get used to complete the order and get final order info, 
//takes: an completeCheckout object {useDefaultBilling, useDefaultDelivery, billing, delivery, ccPlaceholder} and a cart object
export const fetchCompleteOrder = createAsyncThunk(
  'cart/fetchCompleteOrder',
  async ({ completeCheckout: completeCheckout, cart: cart }) => {
    const token = localStorage.getItem("id_token");
    const completeOrder = await apiPost('/checkout', completeCheckout, token);
    return {
        id: completeOrder.order.id,
        billing: completeCheckout.billing,
        delivery: completeCheckout.delivery,
        cart: cart,
        total: completeOrder.order.amount,
        dateCompleted: completeOrder.order.date_completed,
      }
  });

//Orders slice of the state
export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    orders: [],
    orderItems: [],
    checkoutOrder: {},
    ccPlaceholder: null,
    useDefaultBilling: true,
    useDefaultDelivery: true,
    completeOrder: {},
    isLoading: false,
    hasError: false,
  },
  reducers: {
    removeOrders: (state, action) => {
      state.orders = [];
      state.orderItems = [];
    },
    setBilling: (state, action) => {
      state.checkoutOrder.billing = action.payload;
    },
    setDelivery: (state, action) => {
      state.checkoutOrder.delivery = action.payload;
    },
    setCcPlaceholder: (state, action) => {
      state.ccPlaceholder = action.payload;
    },
    setUseDefaultBilling: (state, action) => {
      state.useDefaultBilling = action.payload;
    },
    setUseDefaultDelivery: (state, action) => {
      state.useDefaultDelivery = action.payload;
    },
    removeOrderItems: (state, action) => {
      state.orderItems = [];
    },
    removeCheckoutOrder: (state, action) => {
      state.checkoutOrder = {};
    },
    removeCompleteOrder: (state, action) => {
      state.completeOrder = {};
    },
  },
  //TODO: I keep getting a warning that this use of extraReducers is depreciated and will soon need to change to "builder callback notation" https://redux-toolkit.js.org/api/createSlice.
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
    [fetchCheckout.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchCheckout.fulfilled]: (state, action) => {
      state.checkoutOrder = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchCheckout.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [fetchCompleteOrder.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchCompleteOrder.fulfilled]: (state, action) => {
      state.completeOrder = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchCompleteOrder.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  }
})

//Redux Selectors for useSelector
export const selectOrders = (state) => state.orders.orders;
export const selectOrderItems = (state) => state.orders.orderItems;
export const selectCheckoutOrder = (state) => state.orders.checkoutOrder;
export const selectIsOrderLoading = (state) => state.orders.isLoading;
export const selectCcPlaceholder = (state) => state.orders.ccPlaceholder;
export const selectUseDefaultBilling = (state) => state.orders.useDefaultBilling;
export const selectUseDefaultDelivery = (state) => state.orders.useDefaultDelivery;
export const selectCompleteOrder = (state) => state.orders.completeOrder;

//Actions defined in reducers 
export const removeOrders = ordersSlice.actions.removeOrders;
export const setBilling = ordersSlice.actions.setBilling;
export const setDelivery = ordersSlice.actions.setDelivery;
export const setCcPlaceholder = ordersSlice.actions.setCcPlaceholder;
export const setUseDefaultBilling = ordersSlice.actions.setUseDefaultBilling;
export const setUseDefaultDelivery = ordersSlice.actions.setUseDefaultDelivery;
export const removeOrderItems = ordersSlice.actions.removeOrderItems;
export const removeCheckoutOrder = ordersSlice.actions.removeCheckoutOrder;
export const removeCompleteOrder = ordersSlice.actions.removeCompleteOrder;

//Export the reducer for use in the store 
export default ordersSlice.reducer;