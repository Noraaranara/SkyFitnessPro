import styles from '@/components/PopAuth/PopAuth.module.css';
import Image from 'next/image';
import { useState } from 'react';
import LoginForm from './LoginForm/LoginForm';
import RegisterForm from './RegisterForm/RegisterForm';

type AuthModalProps = {
  onClose: () => void;
};

export default function PopAuth({ onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <section className={styles.PopAuth}>
      <div
        className={styles.PopAuth__container}
        onClick={() => {
          onClose();
        }}
      >
        <div
          className={styles.PopAuth__Block}
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            alt="logo"
            src={'/logo.png'}
            width={220}
            height={34}
            className={styles.PopAuth__logo}
          />
          {isLogin ? (
            <LoginForm onClose={onClose} />
          ) : (
            <RegisterForm onRegisterSuccess={() => setIsLogin(true)} />
          )}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className={styles.PopAuth__btn}
          >
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>{' '}
        </div>
      </div>
    </section>
  );
}
