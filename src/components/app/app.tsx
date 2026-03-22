import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  NotFound404,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';

import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/ingredientsSlice';
import { ProtectedRoute } from '../protected-route/protected-route';
import { getUser, authChecked } from '../../services/userSlice';

const App = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  useEffect(() => {
    const token = localStorage.getItem('refreshToken');
    if (token) {
      dispatch(getUser());
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  const background = location.state?.background;

  const handleClose = () => {
    navigate(-1);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <Routes location={background || location}>
        <Route path='/' element={<ConstructorPage />} />
        <Route path='/feed' element={<Feed />} />
        <Route path='/feed/:number' element={<OrderInfo />} />
        <Route
          path='/login'
          element={<ProtectedRoute onlyUnAuth component={<Login />} />}
        />
        <Route
          path='/register'
          element={<ProtectedRoute onlyUnAuth component={<Register />} />}
        />
        <Route
          path='/forgot-password'
          element={<ProtectedRoute onlyUnAuth component={<ForgotPassword />} />}
        />
        <Route
          path='/reset-password'
          element={<ProtectedRoute onlyUnAuth component={<ResetPassword />} />}
        />
        <Route
          path='/profile'
          element={<ProtectedRoute component={<Profile />} />}
        />
        <Route
          path='/profile/orders'
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />
        <Route
          path='/profile/orders/:number'
          element={<ProtectedRoute component={<OrderInfo />} />}
        />
        <Route path='/ingredients/:id' element={<IngredientDetails />} />
        <Route path='*' element={<NotFound404 />} />
      </Routes>

      {background && (
        <Routes>
          <Route
            path='/feed/:number'
            element={
              <Modal title={''} onClose={handleClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path='/profile/orders/:number'
            element={
              <ProtectedRoute
                component={
                  <Modal title={''} onClose={handleClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
          <Route
            path='/ingredients/:id'
            element={
              <Modal title={''} onClose={handleClose}>
                <IngredientDetails />
              </Modal>
            }
          />
        </Routes>
      )}
    </div>
  );
};

export default App;
