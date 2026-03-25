import orderReducer, {
  createOrder,
  fetchOrderByNumber,
  closeOrderModal,
  initialState
} from './orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(orderReducer(undefined, { type: '' })).toEqual(initialState);
  });

  it('при createOrder.pending isOrderLoading становится true', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('при createOrder.fulfilled сохраняет заказ и isOrderLoading=false', () => {
    const mockOrder: TOrder = {
      _id: '1',
      status: 'done',
      name: 'Заказ 1',
      createdAt: '2025-10-31T10:00:00Z',
      updatedAt: '2025-10-31T10:05:00Z',
      number: 123,
      ingredients: ['1', '2']
    };
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.orderNumber).toBe(mockOrder.number);
    expect(state.error).toBeNull();
  });

  it('при createOrder.rejected сохраняет ошибку и isOrderLoading=false', () => {
    const action = { type: createOrder.rejected.type, payload: 'Ошибка' };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('при fetchOrderByNumber.pending isOrderLoading становится true', () => {
    const action = { type: fetchOrderByNumber.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('при fetchOrderByNumber.fulfilled сохраняет заказ и isOrderLoading=false', () => {
    const mockOrder: TOrder = {
      _id: '2',
      status: 'pending',
      name: 'Заказ 2',
      createdAt: '2025-10-31T11:00:00Z',
      updatedAt: '2025-10-31T11:05:00Z',
      number: 124,
      ingredients: ['3', '4']
    };
    const action = {
      type: fetchOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.orderNumber).toBe(mockOrder.number);
    expect(state.error).toBeNull();
  });

  it('при fetchOrderByNumber.rejected сохраняет ошибку и isOrderLoading=false', () => {
    const action = {
      type: fetchOrderByNumber.rejected.type,
      payload: 'Ошибка'
    };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  it('closeOrderModal сбрасывает состояние', () => {
    const preState = {
      currentOrder: {
        _id: '1',
        status: 'done',
        name: 'Заказ',
        createdAt: '',
        updatedAt: '',
        number: 1,
        ingredients: []
      },
      orderNumber: 1,
      isOrderLoading: true,
      error: 'Ошибка'
    };
    const state = orderReducer(preState, closeOrderModal());
    expect(state).toEqual(initialState);
  });
});
