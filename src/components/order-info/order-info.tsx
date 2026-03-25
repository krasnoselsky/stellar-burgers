import { FC, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '@ui';
import { OrderInfoUI } from '@ui';
import { TIngredient, TOrder } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { selectAllIngredients } from '../../services/slices/ingredientsSlice/ingredientsSlice';
import {
  fetchProfileOrderByNumber,
  ordersInfoDataSelector
} from '../../services/slices/profileOrdersSlice/profileOrdersSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();

  const ingredients: TIngredient[] = useSelector(selectAllIngredients);

  const [orderData, setOrderData] = useState<TOrder | null>(null);

  const orderFromStore = useSelector(ordersInfoDataSelector(number ?? ''));

  useEffect(() => {
    if (!orderFromStore && number) {
      dispatch(fetchProfileOrderByNumber(+number));
    }
  }, [dispatch, number, orderFromStore]);

  useEffect(() => {
    if (orderFromStore) {
      setOrderData(orderFromStore);
    }
  }, [orderFromStore]);

  const orderInfo =
    orderData && ingredients.length
      ? (() => {
          const date = new Date(orderData.createdAt);

          type TIngredientsWithCount = {
            [key: string]: TIngredient & { count: number };
          };

          const ingredientsInfo = orderData.ingredients.reduce(
            (acc: TIngredientsWithCount, item) => {
              const ingredient = ingredients.find((ing) => ing._id === item);
              if (!ingredient) return acc;

              if (!acc[item]) {
                acc[item] = { ...ingredient, count: 1 };
              } else {
                acc[item].count++;
              }

              return acc;
            },
            {}
          );

          const total = Object.values(ingredientsInfo).reduce(
            (acc, item) => acc + item.price * item.count,
            0
          );

          return {
            ...orderData,
            ingredientsInfo,
            date,
            total
          };
        })()
      : null;

  if (!orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={orderInfo} />;
};
