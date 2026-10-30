'use client';

import Image from 'next/image';
import styles from '@/components/MainBlock/MainBlock.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import { getAllCourses } from '@/services/courses/coursesApi';
import { setAllCourses } from '@/store/features/courseSlice';
import { getApiErrorMessage } from '@/services/getApiErrorMessage';
import { toast } from 'react-toastify';
import CourseItem from '../CourseItem/CourseItem';

export default function MainBlock() {
  const dispatch = useAppDispatch();
  const { allCourses } = useAppSelector((state) => state.courses);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (allCourses.length > 0) {
      return;
    }

    let isActive = true;

    const loadCourses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const courses = await getAllCourses();

        if (isActive) {
          dispatch(setAllCourses(courses));
        }
      } catch (err) {
        const message = getApiErrorMessage(
          err,
          'Не удалось загрузить список курсов',
        );

        if (isActive) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadCourses();

    return () => {
      isActive = false;
    };
  }, [dispatch, allCourses.length]);

  return (
    <div className={styles.MainBlock}>
      <div className={styles.MainBlock__titleGroup}>
        <h1 className={styles.MainBlock__title}>
          Начните заниматься спортом и улучшите качество жизни
        </h1>

        <div className={styles.MainBloch__imgGroup}>
          <Image
            src="/messages.png"
            alt="Измени своё тело"
            width={288}
            height={120}
          />
          <span>Измени своё тело за полгода!</span>
        </div>
      </div>

      {isLoading && <p>Загрузка курсов...</p>}

      {error && <p>{error}</p>}

      <div className={styles.MainBlock__courses}>
        {allCourses.map((course) => (
          <CourseItem key={course._id} course={course} />
        ))}
      </div>

      <div className={styles.MainBlock__btnWrapper}>
        <button
          type="button"
          className={styles.MainBlock__button}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          Наверх ↑
        </button>
      </div>
    </div>
  );
}
