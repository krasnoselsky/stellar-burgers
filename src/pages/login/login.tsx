import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  isAuthenticatedSelector,
  loginErrorSelector,
  loginUser
} from '../../services/userSlice';
import { Navigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const errorMessage = useSelector(loginErrorSelector);

  if (isAuthenticated) {
    return <Navigate to={'/profile'} replace />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    if (!email || !password) {
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorMessage}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
