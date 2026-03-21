import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TAuthResponse,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { TOrder, TUser } from '@utils-types';
import { deleteCookie, getCookie, setCookie } from '../utils/cookie';

type userState = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
  orders: TOrder[];
  ordersLoading: boolean;
  ordersError: string | null;
};

const initialState: userState = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null,
  orders: [],
  ordersLoading: false,
  ordersError: null
};

export const getUser = createAsyncThunk<TUser>('user/getUser', async () => {
  const data = await getUserApi();
  return data.user;
});

export const checkUserAuth = createAsyncThunk(
  'user/checkUserAuth',
  async (_, { dispatch }) => {
    if (getCookie('accessToken')) {
      dispatch(getUser()).finally(() => {
        dispatch(authChecked());
      });
    } else {
      dispatch(authChecked());
    }
  }
);

export const registerUser = createAsyncThunk<TAuthResponse, TRegisterData>(
  'user/registerUser',
  async (userData) =>
    await registerUserApi(userData).then((data) => {
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);
      return data;
    })
);

export const updateUser = createAsyncThunk<TUser, TRegisterData>(
  'user/updateUser',
  async (userData) => {
    const data = await updateUserApi(userData);
    return data.user;
  }
);

export const loginUser = createAsyncThunk<TAuthResponse, TLoginData>(
  'user/loginUser',
  async (userData) =>
    await loginUserApi(userData).then((data) => {
      localStorage.setItem('refreshToken', data.refreshToken);
      setCookie('accessToken', data.accessToken);
      return data;
    })
);

export const logoutUser = createAsyncThunk('user/logoutUser', async () => {
  await logoutApi().then(() => {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  });
});

export const getUserOrders = createAsyncThunk<TOrder[]>(
  'user/getUserOrders',
  async () => {
    const data = await getOrdersApi();
    return data;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось получить данные о пользователе';
      })
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось зарегистрировать пользователя';
      })
      .addCase(updateUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось изменить данные пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось войти в учетную запись';
      })
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось войти в учетную запись';
      })
      .addCase(getUserOrders.pending, (state) => {
        state.ordersLoading = true;
        state.ordersError = null;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.ordersLoading = false;
        state.orders = action.payload;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.ordersLoading = false;
        state.ordersError =
          action.error.message || 'Не удалось загрузить заказы пользователя';
      });
  }
});

export const { authChecked } = userSlice.actions;
export default userSlice.reducer;
