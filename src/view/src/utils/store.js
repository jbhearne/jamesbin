import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../components/features/products/productsSlice'


export const store = configureStore({
  reducer: {
    products: productsReducer
  }
});

export default store;