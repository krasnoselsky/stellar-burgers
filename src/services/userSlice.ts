import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import { setCookie } from '../utils/cookie';

type TUserState = {
  isAuthChecked: boolean;
  isAuthenticated: boolean;
  userData: TUser | null;
  loginUserError: string | undefined;
  registerUserError: string | undefined;
  updateUserError: string | undefined;
  logoutError: string | undefined;
};

const initialState: TUserState = {
  isAuthChecked: false,
  isAuthenticated: false,
  userData: null,
  loginUserError: undefined,
  registerUserError: undefined,
  updateUserError: undefined,
  logoutError: undefined
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (data: TLoginData) => {
    const response = await loginUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const getUser = createAsyncThunk('user/getUser', getUserApi);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const updateUser = createAsyncThunk('user/updateUser', updateUserApi);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  const response = await logoutApi();
  return response;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  selectors: {
    userDataSelector: (state) => state.userData,
    isAuthenticatedSelector: (state) => state.isAuthenticated,
    isAuthCheckedSelector: (state) => state.isAuthChecked,
    loginErrorSelector: (state) => state.loginUserError,
    registerErrorSelector: (state) => state.registerUserError,
    updateErrorSelector: (state) => state.updateUserError,
    logoutErrorSelector: (state) => state.logoutError
  },
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isAuthChecked = false;
        state.loginUserError = undefined;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loginUserError = action.error.message;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = true;
        state.userData = action.payload;
      })
      .addCase(registerUser.pending, (state) => {
        state.isAuthChecked = false;
        state.registerUserError = undefined;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.registerUserError = action.error.message;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.userData = action.payload;
      })
      .addCase(getUser.pending, (state) => {
        state.isAuthChecked = false;
        state.loginUserError = undefined;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loginUserError = action.error.message;
        state.isAuthChecked = true;
        state.isAuthenticated = false;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.userData = action.payload.user;
      })
      .addCase(updateUser.pending, (state) => {
        state.isAuthChecked = false;
        state.updateUserError = undefined;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.updateUserError = action.error.message;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.isAuthChecked = true;
        state.userData = action.payload.user;
      })
      .addCase(logoutUser.pending, (state) => {
        state.isAuthChecked = false;
        state.logoutError = undefined;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.logoutError = action.error.message;
        state.isAuthChecked = true;
        state.isAuthenticated = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isAuthChecked = true;
        state.isAuthenticated = false;
        state.userData = null;
        state.loginUserError = undefined;
        state.registerUserError = undefined;
        state.updateUserError = undefined;
        state.logoutError = undefined;
      });
  }
});

export const { authChecked } = userSlice.actions;
export const {
  userDataSelector,
  isAuthenticatedSelector,
  isAuthCheckedSelector,
  loginErrorSelector,
  registerErrorSelector,
  updateErrorSelector,
  logoutErrorSelector
} = userSlice.selectors;
