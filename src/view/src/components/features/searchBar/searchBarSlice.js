//TODO this slice has not been implemented yet
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const searchBarSlice =  createSlice({
  name: 'searchBar',
  initialState: {
    search: '',
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
    },
    clearSearch: (state, action) => {
      state.search = ''
    },
  }
})

export const selectSearch = (state) => state.searchBar.search;
export const setSearch = searchBarSlice.actions.setSearch;
export const clearSearch = searchBarSlice.actions.clearSearch;

export default searchBarSlice.reducer;