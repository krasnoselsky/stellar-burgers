import { FC, SyntheticEvent, useState } from 'react';
import { RegisterUI } from '@ui-pages';

import { useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

type LocationState = {
  from?: {
    pathname: string;
  };
};

export const Register: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as LocationState | undefined;
  const from = state?.from?.pathname || '/';

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    try {
      await dispatch(
        registerUser({
          email,
          password,
          name: userName
        })
      ).unwrap();

      navigate(from, { replace: true });
    } catch (err) {
      console.error('Register failed', err);
    }
  };

  return (
    <RegisterUI
      errorText=''
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
