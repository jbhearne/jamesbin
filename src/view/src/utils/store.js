//imports
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../components/features/products/productsSlice';
import userReducer from '../components/features/user/userSlice';
import cartReducer from '../components/features/cart/cartSlice';
import ordersReducer from '../components/features/orders/ordersSlice';
import vendorsReducer from '../components/features/vendors/vendorsSlice';
import searchBarReducer from '../components/features/searchBar/searchBarSlice'

//Creates the Redux store using configureStore from reduxjs toolkit
export const store = configureStore({
  reducer: {
    products: productsReducer,
    user: userReducer,
    cart: cartReducer,
    orders: ordersReducer,
    vendors: vendorsReducer,
    searchBar: searchBarReducer,
  }
});

export default store;