import { ChangeEvent, useState } from 'react';
import AuthForm from '../AuthForm/AuthForm';
import Input from '../Input/Input';
import { useAppDispatch } from '@/store/store';
import {
  setError,
  setLoading,
  setToken,
  setUser,
} from '@/store/features/authSlice';
import { authUser, getCurrentUser } from '@/services/auth/authApi';
import axios from 'axios';

type LoginFormProps = {
  onClose: () => void;
};

export default function LoginForm({ onClose }: LoginFormProps) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');

  const [localError, setLocalError] = useState('');

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError('');

    if (!email.trim() || !password.trim()) {
      return setLocalError('Заполните все поля');
    }

    try {
      dispatch(setLoading(true));
      dispatch(setError(null));

      const response = await authUser({
        email: email.trim(),
        password,
      });

      const userResponse = await getCurrentUser(response.token);
      const user = userResponse.user;

      dispatch(setToken(response.token));
      dispatch(setUser(user));

      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(user));

      onClose();
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;

      setLocalError(
        message || 'Не удалось зарегистрироваться. Попробуйте ещё раз.',
      );
    }
  };

  return (
    <AuthForm buttonText="Войти" onSubmit={onSubmit}>
      <Input
        onChange={onChangeEmail}
        placeholder="Эл. почта"
        type="email"
        error={fieldErrors.email}
        invalid={Boolean(fieldErrors.email)}
      />
      <Input onChange={onChangePassword} placeholder="Пароль" type="password" />
    </AuthForm>
  );
}
