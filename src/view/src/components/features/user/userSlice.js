import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiFetch, apiPost, setToken, fetchLogin } from '../../../utils/apiFetch';


const EP = {
  login: '/login',
  register: '/register',
  user: '/user',
  logout: '/logout',
}

//IDEA testing setting tokens some logic may need to get broken out
/*export const login = createAsyncThunk(
  'user/login',
  async (request) => {
    console.log('test beofore request')
    const jwtResponse = await apiPost(EP.login, request)
    //console.log(jwt);
    setToken(jwtResponse);
    const token = localStorage.getItem("id_token");
    //const auth = await apiFetch('/authenticate', token)
    //console.log(auth)
    const user = await apiFetch(EP.user, token)
    ///////////////console.log(localStorage.getItem("id_token"));
    console.log('test after request')
    const logonObj = {
      msg: jwtResponse.msg,
      user: user,
    }
    return logonObj;
  }
);*/

export const login = createAsyncThunk(
  'user/login',
  async (body) => {
    console.log('test beofore request')
    const isLoggedIn = await fetchLogin(body)

    //const user = await apiFetch(EP.user, token)
    ///////////////console.log(localStorage.getItem("id_token"));
    console.log('test after request')

    return isLoggedIn;
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
    const token = localStorage.getItem("id_token");
    const user = await apiFetch(EP.user, token)
    return user
  }
);

export const logout = createAsyncThunk(
  'user/logout',
  async () => {
    //const token = localStorage.getItem("id_token");
    const user = await apiPost(EP.logout)
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
    //loginMessage: '',
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
    [login.pending]: (state, action) => {
      state.isLoading = true;
      state.hasError = false;
    },
    [login.fulfilled]: (state, action) => {
      //state.loginMessage = action.payload.msg;
      //state.user = action.payload.user;
      state.isLoggedIn = action.payload;
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
export const removeUser = userSlice.actions.removeUser;
export const setIsloggedIn = userSlice.actions.setIsloggedIn;

export default userSlice.reducer;