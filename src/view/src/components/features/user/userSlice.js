import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiPost } from '../../../utils/apiFetch';


const EP = {
  login: '/login',
  register: '/register',
  user: '/user'
}

export const login = createAsyncThunk(
  'user/login',
  async (request) => {
    console.log('test beofore request')
    const logged = await apiPost(EP.login, request)
    console.log('test after request')
  }
);

/*export const register = createAsyncThunk(
  'user/register',
  async (request) => {
    const registered = await apiFetch(EP.register, {
      method: 'POST',
      body: JSON.stringify(request)
    })
  }
);*/

export const fetchUser = createAsyncThunk(
  'user/fetchUser',
  async () => {
    const user = await apiFetch(EP.user)
    return user
  }
);

/*export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({id, request}) => {
    const updated = await apiFetch(EP.user + id, {
      method: 'PUT',
      body: JSON.stringify(request)
    }) 
  }
);*/

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: {},
    loginMessage: '',
    updateMessage: '',
    isLoading: false,
    hasError: false
  },
  reducers: {

  },
  extraReducers: {
    [login.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [login.fulfilled]: (state, action) => {
      state.loginMessage = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [login.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },/*
    [register.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [register.fulfilled]: (state, action) => {
      state.loginMessage = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [register.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },*/
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
    },/*
    [updateUser.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.updateMessage = action.payload;
      state.isLoading = false;
      state.hasError = false;
    },
    [updateUser.rejected]: (state, action) => {
      state.isLoading = false;
      state.hasError = true;
    },*/
  }
})

export const selectUser = (state) => state.user.user;
export const selectLoginMessage = (state) => state.user.loginMessage;
export const selectUpdateMessage = (state) => state.user.updateMessage;


export default userSlice.reducer;