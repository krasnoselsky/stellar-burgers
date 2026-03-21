import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import {
  createOrder,
  clearConstructorModal
} from '../../services/constructorSlice';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch<AppDispatch>();
  const constructorItems = useSelector(
    (state: RootState) =>
      state.burgerConstructor?.items ?? { bun: null, ingredients: [] }
  );

  const orderRequest = useSelector(
    (state: RootState) => state.burgerConstructor.isLoading
  );

  const orderModalData = useSelector(
    (state: RootState) => state.burgerConstructor.orderConstructorData
  );
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const onOrderClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!constructorItems.bun || orderRequest) return;
    const ingredients = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((elem) => elem._id),
      constructorItems.bun._id
    ];
    dispatch(createOrder(ingredients));
  };

  const closeOrderModal = () => {
    dispatch(clearConstructorModal());
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
