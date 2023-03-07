import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../components/features/products/productsSlice';
import userReducer from '../components/features/user/userSlice';
import cartReducer from '../components/features/cart/cartSlice';
import ordersReducer from '../components/features/orders/ordersSlice';


export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    cart: cartReducer,
    orders: ordersReducer,
  }
});

export default store;