//import
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch } from '../../../utils/apiFetch';

//Thunk that fetches user info from the database. 
//Takes no args.
export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const expires = new Date(parseInt(localStorage.getItem("expires_at")));
    //testlog console.log(expires)
    const current = new Date(Date.now())
    if (expires < current) return {};

    const token = localStorage.getItem("id_token");
    const user = await apiFetch("/user", token);

    //Builds an object and returns it to fetchUser action.payload used to set user: {} state.
    return {
      id: user.id,
      fullname: user.fullname,
      username: user.username,
      contact: {
        id: user.contact.id,
        phone: user.contact.phone,
        address: user.contact.address,
        city: user.contact.city,
        state: user.contact.state,
        zip: user.contact.zip,
        email: user.contact.email,
      },
      tokenExpires: expires.toString(),
      fetchedAt: current.toString(),
    }
  }
);

//User slice of the state
export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    isLoggedIn: false,
    updateMessage: '',
    isLoading: false,
    hasError: false
  },
  reducers: {
    removeUser: (state, action) => {
      state.user = {};
    },
    setLoginMessage: (state, action) => {
      state.loginMessage = action.payload;
    },
    setIsloggedIn: (state, action) => {
      state.isLoggedIn = action.payload;
    },
  },
  extraReducers: {
    //TODO: I keep getting a warning that this use of extraReducers is depreciated and will soon need to change to "builder callback notation" https://redux-toolkit.js.org/api/createSlice.
    [fetchUser.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [fetchUser.fulfilled]: (state, action) => {
      state.user = action.payload
      state.isLoading = false;
      state.hasError = false;
    },
    [fetchUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },
  }
})

//Redux Selectors for useSelector
export const selectUser = (state) => state.user.user;
export const selectLoginMessage = (state) => state.user.loginMessage;
export const selectUpdateMessage = (state) => state.user.updateMessage;
export const selectIsloggedIn = (state) => state.user.isLoggedIn;

//Actions defined in reducers
export const removeUser = userSlice.actions.removeUser;
export const setIsloggedIn = userSlice.actions.setIsloggedIn;

//Export the reducer for use in the store 
export default userSlice.reducer;