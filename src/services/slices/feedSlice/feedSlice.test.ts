import feedReducer, {
  fetchFeedOrders,
  clearFeed,
  initialState
} from './feedSlice';
import { TOrdersData } from '@utils-types';

describe('feedSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(feedReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('fetchFeedOrders.pending - isLoading = true', () => {
    const state = feedReducer(initialState, {
      type: fetchFeedOrders.pending.type
    });
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchFeedOrders.fulfilled - сохраняет заказы и total, totalToday', () => {
    const payload: TOrdersData = {
      orders: [
        {
          _id: '1',
          number: 1,
          name: 'Order1',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          ingredients: []
        }
      ],
      total: 10,
      totalToday: 5
    };
    const state = feedReducer(initialState, {
      type: fetchFeedOrders.fulfilled.type,
      payload
    });
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(payload.orders);
    expect(state.total).toBe(payload.total);
    expect(state.totalToday).toBe(payload.totalToday);
    expect(state.error).toBeNull();
  });

  it('fetchFeedOrders.rejected - сохраняет ошибку и isLoading = false', () => {
    const errorMessage = 'Ошибка загрузки ленты заказов';
    const state = feedReducer(initialState, {
      type: fetchFeedOrders.rejected.type,
      payload: errorMessage
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
  });

  it('fetchFeedOrders.rejected - использует сообщение по умолчанию если payload отсутствует', () => {
    const state = feedReducer(initialState, {
      type: fetchFeedOrders.rejected.type
    });
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Неизвестная ошибка');
  });

  it('clearFeed - сбрасывает состояние в начальное', () => {
    const modifiedState = {
      orders: [
        {
          _id: '1',
          number: 1,
          name: 'Order1',
          status: 'done',
          createdAt: '',
          updatedAt: '',
          ingredients: []
        }
      ],
      total: 10,
      totalToday: 5,
      isLoading: true,
      error: 'Ошибка'
    };
    const state = feedReducer(modifiedState, clearFeed());
    expect(state).toEqual(initialState);
  });
});
