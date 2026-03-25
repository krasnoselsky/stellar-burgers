import ingredientsReducer, {
  fetchIngredients,
  initialState
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice', () => {
  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Булка',
      type: 'bun',
      proteins: 1,
      fat: 1,
      carbohydrates: 1,
      calories: 100,
      price: 50,
      image: 'img1',
      image_large: 'img1_large',
      image_mobile: 'img1_mobile'
    },
    {
      _id: '2',
      name: 'Котлета',
      type: 'main',
      proteins: 2,
      fat: 2,
      carbohydrates: 2,
      calories: 200,
      price: 100,
      image: 'img2',
      image_large: 'img2_large',
      image_mobile: 'img2_mobile'
    }
  ];

  it('должен вернуть начальное состояние', () => {
    expect(ingredientsReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('fetchIngredients.pending устанавливает isLoading в true', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.fulfilled сохраняет данные и устанавливает isLoading в false', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  it('fetchIngredients.rejected сохраняет ошибку и устанавливает isLoading в false', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeDefined();
  });
});
