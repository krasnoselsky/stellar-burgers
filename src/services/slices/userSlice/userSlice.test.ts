// Мокаем getCookie
jest.mock('../../../utils/cookie', () => ({
  getCookie: jest.fn(() => null),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// Мокаем getCookie
jest.mock('../../../utils/cookie', () => ({
  getCookie: jest.fn(() => null),
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

// Мокаем localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

import userReducer, {
  initialState,
  registerUser,
  loginUser,
  fetchUser,
  updateUser,
  logoutUser,
  forgotPassword,
  resetPassword
} from './userSlice';
import { TUser } from '@utils-types';

describe('userSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(userReducer(undefined, { type: '' })).toEqual(initialState);
  });

  const asyncActions = [
    registerUser,
    loginUser,
    fetchUser,
    updateUser,
    logoutUser,
    forgotPassword,
    resetPassword
  ];

  asyncActions.forEach((action) => {
    it(`${action.typePrefix}.pending - isLoading=true`, () => {
      const state = userReducer(initialState, { type: action.pending.type });
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it(`${action.typePrefix}.rejected - isLoading=false и error сохраняется`, () => {
      const state = userReducer(initialState, {
        type: action.rejected.type,
        payload: 'Ошибка'
      });
      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Ошибка');
    });
  });

  it('registerUser.fulfilled - сохраняет user, токены и isAuthChecked', () => {
    const payload = {
      user: { name: 'Max', email: 'max@mail.com' } as TUser,
      accessToken: 'access123',
      refreshToken: 'refresh123'
    };
    const state = userReducer(initialState, {
      type: registerUser.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe(payload.accessToken);
    expect(state.refreshToken).toBe(payload.refreshToken);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('loginUser.fulfilled - сохраняет user, токены и isAuthChecked', () => {
    const payload = {
      user: { name: 'Anna', email: 'anna@mail.com' } as TUser,
      accessToken: 'access456',
      refreshToken: 'refresh456'
    };
    const state = userReducer(initialState, {
      type: loginUser.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(payload.user);
    expect(state.accessToken).toBe(payload.accessToken);
    expect(state.refreshToken).toBe(payload.refreshToken);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchUser.fulfilled - сохраняет user и isAuthChecked', () => {
    const user = { name: 'Test', email: 'test@mail.com' } as TUser;
    const state = userReducer(initialState, {
      type: fetchUser.fulfilled.type,
      payload: user
    });
    expect(state.isLoading).toBe(false);
    expect(state.user).toEqual(user);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBeNull();
  });
});
