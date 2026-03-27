import '../../index.css';
import styles from './app.module.css';
import { AppHeader } from '@components';
import {
  HashRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
  useMatch
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  fetchIngredients,
  selectAllIngredients,
  selectIngredientsIsLoading
} from '../../services/slices/ingredientsSlice/ingredientsSlice';
import {
  fetchUser,
  selectIsAuthChecked
} from '../../services/slices/userSlice/userSlice';
import { Preloader } from '@ui';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  ProfileOrders,
  NotFound404,
  Profile
} from '@pages';
import { ProtectedRoute } from '../protected-route/ProtectedRoute';
import { Modal } from '../modal';
import { OrderInfo } from '../order-info';
import { IngredientDetails } from '../ingredient-details';

const AppRoutes = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as { background?: Location };
  const backgroundLocation = state?.background;

  const ingredients = useSelector(selectAllIngredients);
  const isIngredientsLoading = useSelector(selectIngredientsIsLoading);
  const isAuthChecked = useSelector(selectIsAuthChecked);

  // Для feed/:number
  const feedMatch = useMatch('/feed/:number');
  const feedNumber = feedMatch?.params.number;

  // Для profile/orders/:number
  const profileOrderMatch = useMatch('/profile/orders/:number');
  const profileOrderNumber = profileOrderMatch?.params.number;

  useEffect(() => {
    dispatch(fetchIngredients());
    dispatch(fetchUser());
  }, [dispatch]);

  if (isIngredientsLoading || !ingredients.length || !isAuthChecked) {
    return <Preloader />;
  }

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path='/' element={<ConstructorPage />} />

        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />

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
        <Route
          path='/profile/orders/:number'
          element={
            <ProtectedRoute>
              <OrderInfo />
            </ProtectedRoute>
          }
        />

        <Route path='/ingredients/:id' element={<IngredientDetails />} />

        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path='/ingredients/:id'
            element={
              <Modal title='' onClose={() => navigate(-1)}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path='/feed/:number'
            element={
              <Modal
                title={feedNumber ? `#${feedNumber}` : ''}
                onClose={() => navigate(-1)}
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
                  title={profileOrderNumber ? `#${profileOrderNumber}` : ''}
                  onClose={() => navigate(-1)}
                >
                  <OrderInfo />
                </Modal>
              </ProtectedRoute>
            }
          />
        </Routes>
      )}
    </>
  );
};

const App = () => (
  <HashRouter>
    <div className={styles.app}>
      <AppHeader />
      <AppRoutes />
    </div>
  </HashRouter>
);

export default App;
