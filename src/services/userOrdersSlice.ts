import { getOrderByNumberApi, getOrdersApi, orderBurgerApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrdersState = {
  userOrders: TOrder[];
  newOrder: TOrder | null;
  orders: TOrder[];
  loading: boolean;
  error: string | undefined;
};

const initialState: TOrdersState = {
  userOrders: [],
  newOrder: null,
  orders: [],
  loading: false,
  error: undefined
};

export const createNewOrder = createAsyncThunk(
  'userOrders/createNewOrder',
  orderBurgerApi
);

export const getUserOrders = createAsyncThunk(
  'userOrders/getUserOrders',
  getOrdersApi
);

export const getOrderbyNumber = createAsyncThunk(
  'userOrders/getOrderbyNumber',
  getOrderByNumberApi
);

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {
    clearNewOrder: (state) => {
      state.newOrder = null;
    }
  },
  selectors: {
    userOrdersSelector: (state) => state.userOrders,
    newOrderSelector: (state) => state.newOrder,
    ordersByNumberSelector: (state) => state.orders,
    loadingOrderSelector: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createNewOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.newOrder = action.payload.order;
        state.error = undefined;
      })
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
        state.error = undefined;
      })
      .addCase(getOrderbyNumber.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(getOrderbyNumber.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderbyNumber.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.error = undefined;
      });
  }
});

export const {
  userOrdersSelector,
  newOrderSelector,
  loadingOrderSelector,
  ordersByNumberSelector
} = userOrdersSlice.selectors;
export const { clearNewOrder } = userOrdersSlice.actions;
