import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';

const EP = {
  products: '/products',
  product: '/product/',
  vendor: '/vendor/'
}

export const fetchVendors = createAsyncThunk(
  'products/fetchVendors',
  async () => {
    const response = await apiFetch('/vendors');
    return response.map(vendor => {
      return {
        id: vendor.id,
        name: vendor.name,
        description: vendor.description,
        contact: {
          id: vendor.contact.id,
          phone: vendor.contact.phone,
          address: vendor.contact.address,
          city: vendor.contact.city,
          state: vendor.contact.state,
          zip: vendor.contact.zip,
          email: vendor.contact.email,
        },
      }
    });
  }
);

/*export const fetchProduct = createAsyncThunk(
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
);*/

export const vendorsSlice = createSlice({
  name: 'vendors',
  initialState: {
    vendors: [],
    isLoading: false,
    hasError: false
  },
  reducers: {
  },
  extraReducers: {
    [fetchVendors.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchVendors.fulfilled]: (state, action) => {
      state.vendors = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchVendors.pending]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  }
});

export const selectVendors = (state) => state.vendors.vendors;
//export const setProductsProduct = productsSlice.actions.setProductsProduct

export default vendorsSlice.reducer;