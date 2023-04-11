//import
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';

//Thunk that fetches all product info from the database. 
//Takes no args.
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => { 
    const response = await apiFetch('/products'); //TODO this needs to be limited on the server app so that the user does not have to download the entire catalog, but it would require serverside pagination and syncronization with redux.

    //Builds an array returned to fetchProducts action.payload and sets the products:[] state.
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

//Thunk that fetchs product details from the database
//Takes: an (product) id
export const fetchProduct = createAsyncThunk(
  'product/fetchProduct',
  async (id) => {
    const product = await apiFetch('/product/' + id);
    const vendor = {
      name: '',
      description: '',
    }
    if (product.vendor_id) {
      const vendorId = parseInt(product.vendor_id);
      const v = await apiFetch('/vendor/' + vendorId);
      vendor.name = v.name;
      vendor.description = v.description;
    }
    
    //Builds a product object and returns it to the fetchProduct action.payload used to set the product:{} state.
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

//Products slice of the state
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
  //TODO: I keep getting a warning that this use of extraReducers is depreciated and will soon need to change to "builder callback notation" https://redux-toolkit.js.org/api/createSlice.
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

//Redux Selectors for useSelector
export const selectProducts = (state) => state.products.products;
export const selectProduct = (state) => state.products.product;

//Actions defined in reducers 
export const setProductsProduct = productsSlice.actions.setProductsProduct

//Export the reducer for use in the store
export default productsSlice.reducer