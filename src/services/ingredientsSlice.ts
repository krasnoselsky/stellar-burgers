import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient, TConstructorIngredient } from '@utils-types';

type ingredientsState = {
  ingredients: TIngredient[];
  selectedIngredient: TIngredient | null;
  isLoading: boolean;
  error: string | null;
};

const initialState: ingredientsState = {
  ingredients: [],
  selectedIngredient: null,
  isLoading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk<TIngredient[]>(
  'ingredients/fetchIngredients',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

export const fetchIngredientsById = createAsyncThunk<
  TConstructorIngredient,
  string
>('ingredients/fetchIngredientById', async (id: string) => {
  const data = await getIngredientsApi();
  const ingredient = data.find((elem) => elem._id === id);
  if (!ingredient) throw new Error('Ингредиент не найден');
  return ingredient;
});

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    setSelectedIngredient: (state, action: PayloadAction<TIngredient>) => {
      state.selectedIngredient = action.payload;
    },
    clearSelectedIngredient: (state) => {
      state.selectedIngredient = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.error.message || 'Не удалось загрузить ингредиенты';
      })
      .addCase(fetchIngredientsById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedIngredient = action.payload;
      })
      .addCase(fetchIngredientsById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Ингредиент не найден';
      });
  }
});

export const { setSelectedIngredient, clearSelectedIngredient } =
  ingredientsSlice.actions;
export default ingredientsSlice.reducer;
