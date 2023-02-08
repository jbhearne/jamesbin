import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';
import Product from './product/Product';

const EP = {
  products: '/products',
  product: '/product/',
  vendor: '/vendor/'
}

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (endpoint = EP.products) => {
    const response = await apiFetch(endpoint);
    return response.map(product => {
      return {
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        vendorId: product.vendor_id
      }
    });
  }
);

export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id) => {
    const product = await apiFetch(EP.product + id);
    const vendor = {
      name: '',
      description: '',
    }
    if (product.vendor_id) {
      const vendorId = parseInt(product.vendor_id);
      const v = await apiFetch(EP.vendor + vendorId);
      vendor.name = v.name;
      vendor.description = v.description;
    }
    
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      vendorId: product.vendor_id,
      vendorName: vendor.name,
      vendorDescription: vendor.description
    }
  }
);

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    product: {},
    isLoading: false,
    hasError: false
  },
  reducers: {
    setProductsProduct: (state, action) => {
      state.product = action.payload
    }
  },
  extraReducers: {
    [fetchProducts.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchProducts.fulfilled]: (state, action) => {
      state.products = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchProducts.pending]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
    [fetchProduct.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchProduct.fulfilled]: (state, action) => {
      state.product = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchProduct.pending]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    }
  }
});

export const selectProducts = (state) => state.products.products;
export const selectProduct = (state) => state.products.product;
export const setProductsProduct = productsSlice.actions.setProductsProduct

export default productsSlice.reducer