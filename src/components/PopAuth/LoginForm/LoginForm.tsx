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
import { getApiErrorMessage } from '@/services/getApiErrorMessage';

type LoginFormProps = {
  onClose: () => void;
};

type FieldErrors = {
  email?: string;
  password?: string;
};

export default function LoginForm({ onClose }: LoginFormProps) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState('');

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setFieldErrors((prev) => ({ ...prev, email: undefined }));
    setServerError('');
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setFieldErrors((prev) => ({ ...prev, password: undefined }));
    setServerError('');
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFieldErrors({});
    setServerError('');

    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = 'Введите email';
    }

    if (!password.trim()) {
      errors.password = 'Введите пароль';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
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
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Не удалось Войти. Попробуйте ещё раз.',
      );
      setServerError(message);
    } finally {
      dispatch(setLoading(false));
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
      <Input
        onChange={onChangePassword}
        placeholder="Пароль"
        type="password"
        error={fieldErrors.password}
        invalid={Boolean(fieldErrors.password)}
      />
      {serverError && (
        <p className="formError" role="alert">
          {serverError}
        </p>
      )}
    </AuthForm>
  );
}
