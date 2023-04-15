//imports
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';

//Thunk that fetches all the vendors from the database. 
//Takes no args.
export const fetchVendors = createAsyncThunk(
  'products/fetchVendors',
  async () => {
    const response = await apiFetch('/vendors');

    //Builds an array and returns it to fetchVendors action.payload used to set vendors: [] state
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

//Vendors slice of the state
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
    //TODO: I keep getting a warning that this use of extraReducers is depreciated and will soon need to change to "builder callback notation" https://redux-toolkit.js.org/api/createSlice.
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

//Redux Selectors for useSelector
export const selectVendors = (state) => state.vendors.vendors;

//Export the reducer for use in the store 
export default vendorsSlice.reducer;