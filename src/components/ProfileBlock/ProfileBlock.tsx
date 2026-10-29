'use client';

import Image from 'next/image';
import styles from '@/components/ProfileBlock/ProfileBlock.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { clearUser } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';
import { ROUTER } from '@/app/routes';
import { useEffect } from 'react';
import CourseItem from '../CourseItem/CourseItem';
import { getAllCourses } from '@/services/courses/coursesApi';
import { setAllCourses } from '@/store/features/courseSlice';
import Button from '../Button/Button';

export default function ProfileBlock() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { allCourses } = useAppSelector((state) => state.courses);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      if (allCourses.length > 0) return;

      try {
        const courses = await getAllCourses();
        dispatch(setAllCourses(courses));
      } catch (error) {
        console.error('Не удалось загрузить курсы:', error);
      }
    };

    fetchCourses();
  }, [dispatch, allCourses.length]);

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push(ROUTER.main);
  };

  const myCourses = allCourses.filter((course) =>
    user?.selectedCourses.includes(course._id),
  );

  return (
    <section className={styles.ProfileBlock}>
      <h3 className={styles.ProfileBlock__title}>Профиль</h3>
      <div className={styles.ProfileBlock__wrapper}>
        <div className={styles.ProfileBlock__profile}>
          <Image
            alt="profile-pic"
            src={'/profile.jpg'}
            width={197}
            height={197}
            className={styles.ProfileBlock__img}
          />
          <div className={styles.ProfileBlock__info}>
            <h4 className={styles.ProfileBlock__name}>{user?.email}</h4>
            <span className={styles.ProfileBlock__login}>
              Логин: {user?.email}
            </span>
            <Button variant='secondary' padding='16px 68px' onClick={handleLogout}>
              Выйти
            </Button>
          </div>
        </div>
      </div>
      <div className={styles.ProfileBlock__courses}>
        <h3 className={styles.ProfileBlock__title}>Мои курсы</h3>

        {myCourses.length === 0 ? (
          <p>У вас пока нет добавленных курсов.</p>
        ) : (
          <div className={styles.ProfileBlock__coursesList}>
            {myCourses.map((course) => (
              <CourseItem key={course._id} course={course} showProgress/>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
