'use client';

import Image from 'next/image';
import styles from '@/components/MainBlock/MainBlock.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect } from 'react';
import { getAllCourses } from '@/services/courses/coursesApi';
import { setAllCourses } from '@/store/features/courseSlice';
import CourseItem from '../CourseItem/CourseItem';

export default function MainBlock() {
  const dispatch = useAppDispatch();
  const { allCourses } = useAppSelector((state) => state.courses);

  useEffect(() => {
    if (allCourses.length > 0) {
      return;
    }
    getAllCourses().then((res) => {
      dispatch(setAllCourses(res));
    });
  }, [dispatch, allCourses.length]);
  return (
    <div className={styles.MainBlock}>
      <div className={styles.MainBlock__titleGroup}>
        <h1 className={styles.MainBlock__title}>
          Начните заниматься спортом и улучшите качество жизни
        </h1>
        <div className={styles.MainBloch__imgGroup}>
          <Image
            src={'/messages.png'}
            alt={'Измени своё тело'}
            width={288}
            height={120}
          />
          <span>Измени своё тело за полгода!</span>
        </div>
      </div>
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
