import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { RootState } from '../../store';

interface IOrderState {
  currentOrder: TOrder | null;
  orderNumber: number | null;
  isOrderLoading: boolean;
  error: string | null;
}

export const initialState: IOrderState = {
  currentOrder: null,
  orderNumber: null,
  isOrderLoading: false,
  error: null
};

export const createOrder = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('order/createOrder', async (itemsForApi, { rejectWithValue }) => {
  try {
    if (!itemsForApi || itemsForApi.length === 0) {
      return rejectWithValue('Нет ингредиентов для заказа');
    }
    const response = await orderBurgerApi(itemsForApi);
    return response.order;
  } catch (err) {
    return rejectWithValue('Ошибка создания заказа');
  }
});

export const fetchOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('order/fetchOrderByNumber', async (orderNumber, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(orderNumber);
    if (!response.orders || response.orders.length === 0) {
      return rejectWithValue('Заказ не найден');
    }
    return response.orders[0];
  } catch (err) {
    return rejectWithValue('Ошибка получения заказа');
  }
});

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.currentOrder = null;
      state.orderNumber = null;
      state.isOrderLoading = false;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(
        createOrder.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isOrderLoading = false;
          state.currentOrder = action.payload;
          state.orderNumber = action.payload.number;
        }
      )
      .addCase(createOrder.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });

    builder
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.isOrderLoading = true;
        state.error = null;
      })
      .addCase(
        fetchOrderByNumber.fulfilled,
        (state, action: PayloadAction<TOrder>) => {
          state.isOrderLoading = false;
          state.currentOrder = action.payload;
          state.orderNumber = action.payload.number;
        }
      )
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.payload ?? 'Неизвестная ошибка';
      });
  }
});

export const selectCurrentOrder = (state: RootState) =>
  state.order.currentOrder;
export const selectIsOrderLoading = (state: RootState) =>
  state.order.isOrderLoading;

export const { closeOrderModal } = orderSlice.actions;

export default orderSlice.reducer;
