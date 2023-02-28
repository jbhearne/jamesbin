import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../components/features/products/productsSlice';
import userReducer from '../components/features/user/userSlice';
import cartSlice from '../components/features/cart/cartSlice';
import ordersSlice from '../components/features/orders/ordersSlice';


export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    cart: cartSlice,
    orders: ordersSlice,
  }
});

export default store;