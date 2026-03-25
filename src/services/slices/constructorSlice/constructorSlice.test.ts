import constructorReducer, {
  addToConstructor,
  removeFromConstructor,
  reorderConstructor,
  resetConstructor,
  initialState
} from './constructorSlice';
import { TIngredient } from '@utils-types';

// Мокаем nanoid, чтобы получать предсказуемые id
jest.mock('@reduxjs/toolkit', () => {
  const original = jest.requireActual('@reduxjs/toolkit');
  return {
    ...original,
    nanoid: jest.fn(() => 'test-id')
  };
});

describe('burgerConstructor slice', () => {
  const bunIngredient: TIngredient = {
    _id: 'bun1',
    name: 'Булка',
    type: 'bun',
    proteins: 1,
    fat: 1,
    carbohydrates: 1,
    calories: 1,
    price: 100,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  };

  const mainIngredient: TIngredient = {
    _id: 'main1',
    name: 'Котлета',
    type: 'main',
    proteins: 2,
    fat: 2,
    carbohydrates: 2,
    calories: 2,
    price: 200,
    image: 'image',
    image_large: 'image_large',
    image_mobile: 'image_mobile'
  };

  it('должен вернуть начальное состояние', () => {
    expect(constructorReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // ✅ Добавление ингредиента (булка)
  it('добавление ингредиента bun устанавливает bun в состояние', () => {
    const action = addToConstructor(bunIngredient);
    const state = constructorReducer(initialState, action);
    expect(state.bun).toEqual({ ...bunIngredient, id: 'test-id' });
    expect(state.ingredients).toHaveLength(0);
  });

  // ✅ Добавление ингредиента (начинка)
  it('добавление обычного ингредиента добавляет его в ingredients', () => {
    const action = addToConstructor(mainIngredient);
    const state = constructorReducer(initialState, action);
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toEqual({ ...mainIngredient, id: 'test-id' });
    expect(state.bun).toBeNull();
  });

  // ✅ Удаление ингредиента
  it('удаление ингредиента по индексу', () => {
    const stateWithIngredient = constructorReducer(
      initialState,
      addToConstructor(mainIngredient)
    );
    const stateAfterRemove = constructorReducer(
      stateWithIngredient,
      removeFromConstructor(0)
    );
    expect(stateAfterRemove.ingredients).toHaveLength(0);
  });

  // ✅ Изменение порядка ингредиентов
  it('изменение порядка ингредиентов', () => {
    const ingredient1: TIngredient = { ...mainIngredient, _id: 'main1' };
    const ingredient2: TIngredient = { ...mainIngredient, _id: 'main2' };

    let state = constructorReducer(initialState, addToConstructor(ingredient1));
    state = constructorReducer(state, addToConstructor(ingredient2));

    expect(state.ingredients[0]._id).toBe('main1');
    expect(state.ingredients[1]._id).toBe('main2');

    const stateAfterReorder = constructorReducer(
      state,
      reorderConstructor({ from: 0, to: 1 })
    );
    expect(stateAfterReorder.ingredients[0]._id).toBe('main2');
    expect(stateAfterReorder.ingredients[1]._id).toBe('main1');
  });

  // ⚠️ Сброс конструктора
  it('сброс конструктора', () => {
    let state = constructorReducer(
      initialState,
      addToConstructor(bunIngredient)
    );
    state = constructorReducer(state, addToConstructor(mainIngredient));
    state = constructorReducer(state, resetConstructor());
    expect(state).toEqual(initialState);
  });
});
