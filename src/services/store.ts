import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './ingredientsSlice';
import { burgerSlice } from './burgerSlice';
import { feedsSlice } from './feedsSlice';
import { userSlice } from './userSlice';
import { userOrdersSlice } from './userOrdersSlice';

const rootReducer = combineSlices(
  ingredientsSlice,
  burgerSlice,
  feedsSlice,
  userSlice,
  userOrdersSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
