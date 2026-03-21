import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addIngredient } from '../../services/constructorSlice';
import { setSelectedIngredient } from '../../services/ingredientsSlice';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    const handleAdd = () => {
      dispatch(addIngredient(ingredient));
    };

    const handleClick = () => {
      dispatch(setSelectedIngredient(ingredient));
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: location }}
        handleAdd={handleAdd}
        handleClick={handleClick}
      />
    );
  }
);
