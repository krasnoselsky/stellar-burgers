import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { v4 as uuid } from 'uuid';

type ConstructorState = {
  items: {
    ingredients: TConstructorIngredient[];
    bun: TConstructorIngredient | null;
  };
  isLoading: boolean;
  error: string | null;
  orderConstructorData: TOrder | null;
  orderFeedData: TOrder | null;
};

const initialState: ConstructorState = {
  items: { bun: null, ingredients: [] },
  isLoading: false,
  error: null,
  orderConstructorData: null,
  orderFeedData: null
};

export const createOrder = createAsyncThunk(
  'burgerConstructor/createOrder',
  (items: string[], { dispatch }) =>
    orderBurgerApi(items).then(({ order }) => {
      dispatch(resetConstructor());
      return { ...order, ingredients: items };
    })
);

export const getOrderByNumber = createAsyncThunk(
  'burgerConstructor/getOrderByNumber',
  async (number: number) => {
    const order = await getOrderByNumberApi(number);
    return order.orders[0];
  }
);

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        const item = payload;
        if (item.type === 'bun') {
          state.items.bun = payload;
        } else {
          state.items.ingredients.splice(
            Math.floor(state.items.ingredients.length / 2),
            0,
            payload
          );
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.items.ingredients = state.items.ingredients.filter(
        (elem) => elem.id !== action.payload.id
      );
    },
    moveUpIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.items.ingredients.findIndex(
        (elem) => elem.id === action.payload.id
      );
      const deletedElem = state.items.ingredients.splice(index, 1)[0];
      state.items.ingredients.splice(index - 1, 0, deletedElem);
    },
    moveDownIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const index = state.items.ingredients.findIndex(
        (elem) => elem.id === action.payload.id
      );
      const deletedElem = state.items.ingredients.splice(index, 1)[0];
      state.items.ingredients.splice(index + 1, 0, deletedElem);
    },
    resetConstructor: () => initialState,
    clearFeedModal: (state) => {
      state.orderFeedData = null;
    },
    clearConstructorModal: (state) => {
      state.orderConstructorData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderConstructorData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Не удалось создать заказ';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderFeedData = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не загрузить информацию о заказе';
      });
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveUpIngredient,
  moveDownIngredient,
  resetConstructor,
  clearFeedModal,
  clearConstructorModal
} = constructorSlice.actions;
export default constructorSlice.reducer;
