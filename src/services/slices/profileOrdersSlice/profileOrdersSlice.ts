import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getOrdersApi, getOrderByNumberApi } from '@api';
import { RootState } from '../../store';

export type ProfileOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
  currentOrder: TOrder | null;
};

export const initialState: ProfileOrdersState = {
  orders: [],
  isLoading: false,
  error: null,
  currentOrder: null
};

export const fetchProfileOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('profileOrders/fetchProfileOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    return rejectWithValue('Ошибка загрузки истории заказов');
  }
});

export const fetchProfileOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>(
  'profileOrders/fetchProfileOrderByNumber',
  async (number, { rejectWithValue }) => {
    try {
      const response = await getOrderByNumberApi(number);
      if (!response.orders || response.orders.length === 0) {
        return rejectWithValue('Заказ не найден');
      }
      return response.orders[0];
    } catch (error) {
      return rejectWithValue('Ошибка загрузки заказа');
    }
  }
);

const profileOrdersSlice = createSlice({
  name: 'profileOrders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfileOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchProfileOrders.fulfilled,
        (state, action: PayloadAction<TOrder[]>) => {
          state.isLoading = false;
          state.orders = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchProfileOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      })

      .addCase(fetchProfileOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentOrder = null;
      })
      .addCase(
        fetchProfileOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isLoading = false;
          state.currentOrder = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchProfileOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
        state.currentOrder = null;
      });
  }
});

export const selectProfileOrders = (state: RootState) =>
  state.profileOrders.orders;
export const selectProfileOrdersLoading = (state: RootState) =>
  state.profileOrders.isLoading;

export const ordersInfoDataSelector =
  (number: string) => (state: RootState) => {
    if (state.profileOrders.orders.length) {
      const data = state.profileOrders.orders.find(
        (item) => item.number.toString() === number
      );
      if (data) return data;
    }
    if (state.feed.orders.length) {
      const data = state.feed.orders.find(
        (item) => item.number.toString() === number
      );
      if (data) return data;
    }
    if (state.profileOrders.currentOrder?.number.toString() === number) {
      return state.profileOrders.currentOrder;
    }
    return null;
  };

export default profileOrdersSlice.reducer;
