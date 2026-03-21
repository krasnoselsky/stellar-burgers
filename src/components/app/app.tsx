import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Modal, OrderInfo, IngredientDetails } from '@components';
import { AppDispatch, RootState } from '../../services/store';
import { fetchIngredients } from '../../services/ingredientsSlice';
import '../../index.css';
import styles from './app.module.css';

import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { AppHeader } from '@components';
import { Preloader } from '@ui';
import { ProtectedRoute } from '../protectedRoutes/protectedRoute';
import { checkUserAuth } from '../../services/userSlice';

const App = () => {
  /** TODO: взять переменные из стора */
  const isIngredientsLoading = useSelector(
    (state: RootState) => state.ingredients.isLoading
  );
  const ingredients = useSelector(
    (state: RootState) => state.ingredients.ingredients
  );
  const selectedIngredient = useSelector(
    (state: RootState) => state.ingredients.selectedIngredient
  );
  const error = useSelector((state: RootState) => state.ingredients.error);
  const dispatch = useDispatch<AppDispatch>();

  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();

  const handleClose = () => {
    if (background) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(checkUserAuth());
  }, []);

  const profileMatch = useMatch('/profile/orders/:number')?.params.number;
  const feedMatch = useMatch('/feed/:number')?.params.number;
  const orderNumber = profileMatch || feedMatch;

  return (
    <div className={styles.app}>
      <AppHeader />
      {isIngredientsLoading ? (
        <Preloader />
      ) : error ? (
        <div className={`${styles.error} text text_type_main-medium pt-4`}>
          {error}
        </div>
      ) : ingredients.length > 0 ? (
        <>
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/login'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Login />
                </ProtectedRoute>
              }
            />
            <Route
              path='/register'
              element={
                <ProtectedRoute onlyUnAuth>
                  <Register />
                </ProtectedRoute>
              }
            />
            <Route
              path='/forgot-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ForgotPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/reset-password'
              element={
                <ProtectedRoute onlyUnAuth>
                  <ResetPassword />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile'
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path='/profile/orders'
              element={
                <ProtectedRoute>
                  <ProfileOrders />
                </ProtectedRoute>
              }
            />
            <Route path='*' element={<NotFound404 />} />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={handleClose}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/feed/:number'
              element={
                <Modal
                  title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                  onClose={handleClose}
                >
                  <OrderInfo />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <ProtectedRoute>
                  <Modal
                    title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                    onClose={handleClose}
                  >
                    <OrderInfo />
                  </Modal>
                </ProtectedRoute>
              }
            />
          </Routes>
          {background && (
            <Routes>
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                    onClose={handleClose}
                  >
                    <OrderInfo />
                  </Modal>
                }
              />
              <Route
                path='/ingredients/:id'
                element={
                  <Modal title='Детали ингредиента' onClose={handleClose}>
                    <IngredientDetails />
                  </Modal>
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <ProtectedRoute>
                    <Modal
                      title={`#${orderNumber && orderNumber.padStart(6, '0')}`}
                      onClose={handleClose}
                    >
                      <OrderInfo />
                    </Modal>
                  </ProtectedRoute>
                }
              />
            </Routes>
          )}
        </>
      ) : (
        <div className={`${styles.title} text text_type_main-medium pt-4`}>
          Нет игредиентов
        </div>
      )}
    </div>
  );
};

export default App;
