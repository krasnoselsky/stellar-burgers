import { getFeedsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type TFeedsState = {
  feeds: TOrdersData;
  loading: boolean;
  error: string | null;
};

const initialState: TFeedsState = {
  feeds: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const getFeeds = createAsyncThunk('feeds/getFeeds', getFeedsApi);

export const feedsSlice = createSlice({
  name: 'feeds',
  initialState,
  reducers: {},
  selectors: {
    ordersSelector: (state) => state.feeds.orders,
    totalSelector: (state) => state.feeds.total,
    totalTodaySelector: (state) => state.feeds.totalToday,
    loadingSelector: (state) => state.loading,
    errorSelector: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeeds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeeds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      })
      .addCase(getFeeds.fulfilled, (state, action) => {
        state.loading = false;
        state.feeds = action.payload;
      });
  }
});

export const {
  ordersSelector,
  totalSelector,
  totalTodaySelector,
  loadingSelector,
  errorSelector
} = feedsSlice.selectors;
