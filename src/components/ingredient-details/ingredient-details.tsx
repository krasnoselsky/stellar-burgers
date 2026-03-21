import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../services/store';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { fetchIngredientsById } from '../../services/ingredientsSlice';
import { useParams } from 'react-router-dom';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const dispatch = useDispatch<AppDispatch>();
  const ingredientData = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id || ingredientData) return;
    dispatch(fetchIngredientsById(id));
  }, [id, dispatch]);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
