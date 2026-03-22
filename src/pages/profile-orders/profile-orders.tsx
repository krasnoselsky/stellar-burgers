import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  getUserOrders,
  loadingOrderSelector,
  userOrdersSelector
} from '../../services/userOrdersSlice';
import { Preloader } from '@ui';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  const loading = useSelector(loadingOrderSelector);
  const orders = useSelector(userOrdersSelector);

  return <>{loading ? <Preloader /> : <ProfileOrdersUI orders={orders} />}</>;
};
