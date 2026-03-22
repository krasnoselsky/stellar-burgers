import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import {
  isAuthenticatedSelector,
  registerErrorSelector,
  registerUser
} from '../../services/userSlice';
import { Navigate } from 'react-router-dom';

export const Register: FC = () => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isAuthenticatedSelector);
  const errorMessage = useSelector(registerErrorSelector);

  if (isAuthenticated) {
    return <Navigate to={'/profile'} replace />;
  }

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    if (!email || !password || !userName) {
      return;
    }
    dispatch(registerUser({ name: userName, email, password }));
  };

  return (
    <RegisterUI
      errorText={errorMessage}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
