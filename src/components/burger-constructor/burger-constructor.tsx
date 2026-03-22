import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  constructorItemsSelector,
  clearIngredients
} from '../../services/burgerSlice';
import {
  createNewOrder,
  newOrderSelector,
  loadingOrderSelector,
  clearNewOrder
} from '../../services/userOrdersSlice';
import { isAuthenticatedSelector } from '../../services/userSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const constructorItems = useSelector(constructorItemsSelector);
  const orderRequest = useSelector(loadingOrderSelector);
  const orderModalData = useSelector(newOrderSelector);
  const isAuthenticated = useSelector(isAuthenticatedSelector);

  // Очистка конструктора после успешного создания заказа
  useEffect(() => {
    if (orderModalData) {
      dispatch(clearIngredients());
    }
  }, [orderModalData, dispatch]);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;

    // Проверка авторизации перед созданием заказа
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id
    ];

    dispatch(createNewOrder(ingredients));
  };

  const closeOrderModal = () => {
    dispatch(clearNewOrder());
    dispatch(clearIngredients());
    navigate('/');
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
