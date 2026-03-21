import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { getUserOrders } from '../../services/userSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  const orders: TOrder[] = useSelector((state: RootState) => state.user.orders);
  const ordersLoading = useSelector(
    (state: RootState) => state.user.ordersLoading
  );
  useEffect(() => {
    dispatch(getUserOrders());
  }, []);
  if (ordersLoading) return <Preloader />;
  return <ProfileOrdersUI orders={orders} />;
};
