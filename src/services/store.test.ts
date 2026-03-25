// Мок для localStorage
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn()
  }
});

// Мок для cookie
jest.mock('../utils/cookie', () => ({
  getCookie: jest.fn(() => null),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

import store from './store';
import constructorReducer from './slices/constructorSlice/constructorSlice';
import ingredientsReducer from './slices/ingredientsSlice/ingredientsSlice';
import orderReducer from './slices/orderSlice/orderSlice';
import feedReducer from './slices/feedSlice/feedSlice';
import profileOrdersReducer from './slices/profileOrdersSlice/profileOrdersSlice';
import userReducer from './slices/userSlice/userSlice';

describe('rootReducer', () => {
  it('должен иметь правильное начальное состояние всех слайсов', () => {
    const state = store.getState();

    expect(state.burgerConstructor).toEqual(
      constructorReducer(undefined, { type: '' })
    );
    expect(state.ingredients).toEqual(
      ingredientsReducer(undefined, { type: '' })
    );
    expect(state.order).toEqual(orderReducer(undefined, { type: '' }));
    expect(state.feed).toEqual(feedReducer(undefined, { type: '' }));
    expect(state.profileOrders).toEqual(
      profileOrdersReducer(undefined, { type: '' })
    );
    expect(state.user).toEqual(userReducer(undefined, { type: '' }));
  });
});
