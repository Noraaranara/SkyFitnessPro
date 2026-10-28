import { ChangeEvent, useState } from 'react';
import AuthForm from '../AuthForm/AuthForm';
import Input from '../Input/Input';
import { registerUser } from '@/services/auth/authApi';
import axios from 'axios';

type RegisterFormProps = {
  onRegisterSuccess: () => void;
};

export default function RegisterForm({onRegisterSuccess}: RegisterFormProps) {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [error, setError] = useState('');

  const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };
  const onChangeRepeatPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setRepeatPassword(e.target.value);
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password.trim() || !repeatPassword.trim()) {
      return setError('Заполните все поля');
    }

    if (password.length < 6) {
      return setError('Пароль должен содержать минимум 6 символов');
    }

    if ((password.match(/[^a-zA-Z0-9]/g) || []).length < 2) {
      setError('Пароль должен содержать не менее 2 спецсимволов');
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError('Пароль должен содержать как минимум одну заглавную букву');
      return;
    }

    if (password !== repeatPassword) {
      return setError('Пароли не совпадают');
    }

    try {
      await registerUser({
        email: email.trim(),
        password,
      });
      onRegisterSuccess()
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;

        setError(message || 'Не удалось зарегистрироваться. Попробуйте ещё раз.')
    }
  };

  return (
    <AuthForm buttonText="Зарегистрироваться" onSubmit={onSubmit}>
      <Input onChange={onChangeEmail} placeholder="Эл. почта" type="email" />
      <Input onChange={onChangePassword} placeholder="Пароль" type="password" />
      <Input
        onChange={onChangeRepeatPassword}
        placeholder="Повторите пароль"
        type="password"
      />
    </AuthForm>
  );
}
