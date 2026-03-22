import { Preloader } from '@ui';

import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import {
  isAuthCheckedSelector,
  userDataSelector
} from '../../services/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  component
}: ProtectedRouteProps): React.JSX.Element => {
  const user = useSelector(userDataSelector);
  const isAuthChecked = useSelector(isAuthCheckedSelector);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    // Маршрут для авторизованного пользователя, но он не авторизован
    return <Navigate to={'/login'} state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    // Маршрут для неавторизованного пользователя, но он авторизован
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  // onlyUnAuth = false && user
  // onlyUnAuth = true && !user
  return component;
};
