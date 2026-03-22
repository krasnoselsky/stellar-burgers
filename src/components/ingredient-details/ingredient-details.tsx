import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { ingredientsSelector } from '../../services/ingredientsSlice';

export const IngredientDetails: FC = () => {
  const { id } = useParams();
  const ingredients = useSelector(ingredientsSelector);
  const ingredientData = ingredients.find((item) => item._id === id);

  if (!ingredientData) {
    return <Preloader />;
  }

  return (
    <>
      <p className='text text_type_main-large pb-10'>Детали ингредиента</p>
      <IngredientDetailsUI ingredientData={ingredientData} />
    </>
  );
};
