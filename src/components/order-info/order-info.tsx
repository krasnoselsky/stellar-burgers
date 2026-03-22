import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredientsSlice';
import { useParams } from 'react-router-dom';
import {
  getOrderbyNumber,
  ordersByNumberSelector,
  userOrdersSelector
} from '../../services/userOrdersSlice';
import { ordersSelector } from '../../services/feedsSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const feedOrders = useSelector(ordersSelector);
  const userOrders = useSelector(userOrdersSelector);
  const ordersByNumber = useSelector(ordersByNumberSelector);

  // Ищем заказ в сторе: сначала в feed orders, затем в user orders, затем в ordersByNumber
  const orderData = useMemo(() => {
    if (!number) return undefined;
    const orderNumber = Number(number);
    
    return (
      feedOrders.find((order) => order.number === orderNumber) ||
      userOrders.find((order) => order.number === orderNumber) ||
      ordersByNumber.find((order) => order.number === orderNumber)
    );
  }, [number, feedOrders, userOrders, ordersByNumber]);

  // Запрос на сервер только если заказ не найден в сторе
  useEffect(() => {
    if (number && !orderData) {
      dispatch(getOrderbyNumber(Number(number)));
    }
  }, [number, orderData, dispatch]);

  const ingredients = useSelector(ingredientsSelector);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
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
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return (
    <>
      {number && (
        <p className='text text_type_digits-default pb-10'>
          #{String(number).padStart(6, '0')}
        </p>
      )}
      <OrderInfoUI orderInfo={orderInfo} />
    </>
  );
};
