import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../components/features/products/productsSlice'
import userReducer from '../components/features/user/userSlice'


export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer
  }
});

export default store;