import { configureStore } from '@reduxjs/toolkit';
import ingredientsSlice from './ingredientsSlice';
import constructorSlice from './constructorSlice';
import feedsSlice from './feedsSlice';
import userSlice from './userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const store = configureStore({
  reducer: {
    ingredients: ingredientsSlice,
    burgerConstructor: constructorSlice,
    feeds: feedsSlice,
    user: userSlice
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
