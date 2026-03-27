import { Preloader } from '@ui';
import { Navigate, useLocation } from 'react-router-dom';
import {
  selectAccessToken,
  selectIsAuthChecked
} from '../../services/slices/userSlice/userSlice';
import { ReactElement } from 'react';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  children
}: ProtectedRouteProps) => {
  const accessToken = useSelector(selectAccessToken);
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && accessToken) {
    return <Navigate to='/' replace />;
  }

  if (!onlyUnAuth && !accessToken) {
    return <Navigate to='/login' state={{ from: location }} replace />;
  }

  return children;
};
