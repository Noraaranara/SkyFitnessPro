'use client';

import Image from 'next/image';
import Link from 'next/link';
import styles from '@/components/Header/Header.module.css';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { ROUTER } from '@/app/routes';
import {
  clearUser,
  closeAuthModal,
  openAuthModal,
} from '@/store/features/authSlice';
import PopAuth from '../PopAuth/PopAuth';
import { useRouter } from 'next/navigation';
import Button from '../Button/Button';

export default function Header() {
  const dispatch = useAppDispatch();
  const { isAuth, user } = useAppSelector((state) => state.auth);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { isAuthModalOpen } = useAppSelector((state) => state.auth);
  const route = useRouter();

  const handleLogout = () => {
    dispatch(clearUser());

    localStorage.removeItem('token');
    localStorage.removeItem('user');

    route.push(ROUTER.main);
  };

  const closeProfileMenu = () => {
    setIsProfileOpen(false);
  };
  return (
    <>
      <header className={styles.header}>
        <Link
          href={'/'}
          className={styles.header__logoGroup}
          onClick={closeProfileMenu}
        >
          <Image
            src={'/logo.png'}
            width={220}
            height={36}
            alt="logo"
            loading="eager"
          />
          <span>Онлайн-тренировки для занятий дома</span>
        </Link>
        {isAuth ? (
          <div
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className={styles.header__profile}
          >
            <Image
              alt="profile pic"
              src={'/icons/profile.svg'}
              width={42}
              height={42}
              className={styles.header__profileImg}
            ></Image>
            <h4 className={styles.header__profileName}>
              {user?.email ?? 'Мой аккаунт'}
            </h4>
            <Image
              alt="arrow"
              src={'/icons/arrow.svg'}
              width={8}
              height={8}
              className={`${styles.header__profileArrow} ${
                isProfileOpen ? styles.header__profileArrow_open : ''
              }`}
            />
            {isProfileOpen && (
              <div className={styles.header__profileBlock}>
                <div className={styles.header__profileBlockWrapper}>
                  <div className={styles.header__profileBlockInfo}>
                    <h4 className={styles.header__profileBlockName}>
                      {user?.email}
                    </h4>
                    <span className={styles.header__profileBlockMail}>
                      {user?.email}
                    </span>
                  </div>
                  <div className={styles.header__profileBlockButtons}>
                    <Link
                      href={ROUTER.profile}
                      className={styles.header__profileBlockProfile}
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsProfileOpen(false);
                      }}
                    >
                      Мой профиль
                    </Link>
                    <Button
                      variant="secondary"
                      padding="16px 76px"
                      onClick={handleLogout}
                    >
                      Выйти
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Button
            variant="primary"
            padding="16px 26px"
            onClick={() => dispatch(openAuthModal())}
          >
            Войти
          </Button>
        )}
      </header>
      {isAuthModalOpen && (
        <PopAuth onClose={() => dispatch(closeAuthModal())} />
      )}
    </>
  );
}
