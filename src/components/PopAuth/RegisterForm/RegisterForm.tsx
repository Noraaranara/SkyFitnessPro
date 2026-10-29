
import { ChangeEvent, useState, FormEvent } from 'react';
import AuthForm from '../AuthForm/AuthForm';
import Input from '../Input/Input';
import { registerUser } from '@/services/auth/authApi';
import axios from 'axios';
import { getApiErrorMessage } from '@/services/getApiErrorMessage';

type RegisterFormProps = {
  onRegisterSuccess: () => void;
};

type FieldErrors = {
  email?: string;
  password?: string;
  repeatPassword?: string;
};

export default function RegisterForm({
  onRegisterSuccess,
}: RegisterFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
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

  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
    setFieldErrors((prev) => ({ ...prev, repeatPassword: undefined }));
    setServerError('');
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setFieldErrors({});
    setServerError('');

    const errors: FieldErrors = {};

    if (!email.trim()) {
      errors.email = 'Введите электронную почту';
    }

    if (!password.trim()) {
      errors.password = 'Введите пароль';
    } else if (password.length < 6) {
      errors.password = 'Минимум 6 символов';
    } else if ((password.match(/[^a-zA-Z0-9]/g) || []).length < 2) {
      errors.password = 'Не менее 2 спецсимволов';
    } else if (!/[A-Z]/.test(password)) {
      errors.password = 'Добавьте хотя бы одну заглавную букву';
    }

    if (!repeatPassword.trim()) {
      errors.repeatPassword = 'Повторите пароль';
    } else if (password !== repeatPassword) {
      errors.repeatPassword = 'Пароли не совпадают';
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await registerUser({
        email: email.trim(),
        password,
      });

      onRegisterSuccess();
    } catch (error) {
      const message = getApiErrorMessage(error, 'Не удалось зарегистрироваться. Попробуйте ещё раз.')
      setServerError(
        message
      );
    }
  };

  return (
    <AuthForm
      buttonText="Зарегистрироваться"
      onSubmit={onSubmit}
    >
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

      <Input
        onChange={onChangeRepeatPassword}
        placeholder="Повторите пароль"
        type="password"
        error={fieldErrors.repeatPassword}
        invalid={Boolean(fieldErrors.repeatPassword)}
      />

      {serverError && (
        <p className="formError" role="alert">
          {serverError}
        </p>
      )}
    </AuthForm>
  );
}
