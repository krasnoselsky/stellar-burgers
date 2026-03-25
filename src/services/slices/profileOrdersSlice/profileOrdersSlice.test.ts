import profileOrdersReducer, {
  fetchProfileOrders,
  fetchProfileOrderByNumber,
  initialState
} from './profileOrdersSlice';
import { TOrder } from '@utils-types';

describe('profileOrdersSlice', () => {
  it('должен возвращать начальное состояние', () => {
    expect(profileOrdersReducer(undefined, { type: '' })).toEqual(initialState);
  });

  // fetchProfileOrders
  it('fetchProfileOrders.pending - isLoading=true', () => {
    const action = { type: fetchProfileOrders.pending.type };
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('fetchProfileOrders.fulfilled - сохраняет orders и isLoading=false', () => {
    const mockOrders: TOrder[] = [
      {
        _id: '1',
        status: 'done',
        name: 'Заказ 1',
        createdAt: '',
        updatedAt: '',
        number: 101,
        ingredients: []
      }
    ];
    const action = {
      type: fetchProfileOrders.fulfilled.type,
      payload: mockOrders
    };
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  it('fetchProfileOrders.rejected - сохраняет ошибку и isLoading=false', () => {
    const action = {
      type: fetchProfileOrders.rejected.type,
      payload: 'Ошибка'
    };
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });

  // fetchProfileOrderByNumber
  it('fetchProfileOrderByNumber.pending - isLoading=true и currentOrder=null', () => {
    const action = { type: fetchProfileOrderByNumber.pending.type };
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.currentOrder).toBeNull();
  });

  it('fetchProfileOrderByNumber.fulfilled - сохраняет currentOrder и isLoading=false', () => {
    const mockOrder: TOrder = {
      _id: '2',
      status: 'pending',
      name: 'Заказ 2',
      createdAt: '',
      updatedAt: '',
      number: 102,
      ingredients: []
    };
    const action = {
      type: fetchProfileOrderByNumber.fulfilled.type,
      payload: mockOrder
    };
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  it('fetchProfileOrderByNumber.rejected - сохраняет ошибку, currentOrder=null и isLoading=false', () => {
    const action = {
      type: fetchProfileOrderByNumber.rejected.type,
      payload: 'Ошибка'
    };
    const state = profileOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
    expect(state.currentOrder).toBeNull();
  });
});
