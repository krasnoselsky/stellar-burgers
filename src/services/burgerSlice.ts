import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';

interface TBurgerState {
  constructorItems: {
    bun: TIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

const initialState: TBurgerState = {
  constructorItems: {
    bun: null,
    ingredients: []
  }
};

export const burgerSlice = createSlice({
  name: 'burger',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (
        state,
        action: PayloadAction<TIngredient | TConstructorIngredient>
      ) => {
        if (action.payload.type === 'bun') {
          state.constructorItems.bun = action.payload as TIngredient;
        } else {
          state.constructorItems.ingredients.push(
            action.payload as TConstructorIngredient
          );
        }
      },
      prepare: (ingredient: TIngredient) => {
        if (ingredient.type === 'bun') {
          return { payload: ingredient };
        } else {
          const id = nanoid();
          return { payload: { ...ingredient, id } };
        }
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients =
        state.constructorItems.ingredients.filter(
          (item) => item.id !== action.payload
        );
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;

      state.constructorItems.ingredients.splice(
        to,
        0,
        state.constructorItems.ingredients.splice(from, 1)[0]
      );
    },

    clearIngredients: (state) => {
      state.constructorItems.bun = null;
      state.constructorItems.ingredients = [];
    }
  },
  selectors: {
    constructorItemsSelector: (state) => state.constructorItems
  }
});

export const {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearIngredients
} = burgerSlice.actions;

export const { constructorItemsSelector } = burgerSlice.selectors;
