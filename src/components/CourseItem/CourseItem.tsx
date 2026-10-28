'use client';

import Image from 'next/image';
import styles from '@/components/CourseItem/CourseItem.module.css';
import { formatDailyDuration } from '@/app/utilts/helpers';
import { CourseType } from '@/sharedTypes/sharedTypes';
import Link from 'next/link';
import { ROUTER } from '@/app/routes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useState } from 'react';
import {
  addCourseToUser,
  removeCourseFromUser,
} from '@/services/courses/coursesApi';
import { openAuthModal, setUser } from '@/store/features/authSlice';
import axios from 'axios';

export type CourseItemProps = {
  course: CourseType;
};

export default function CourseItem({ course }: CourseItemProps) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const duration = formatDailyDuration(course);
  const isAdded = user?.selectedCourses.includes(course._id) ?? false;

  const handleToggleCourse = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setError('');

    if (!token || !user) {
      dispatch(openAuthModal());
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      if (isAdded) {
        await removeCourseFromUser(course._id, token);

        dispatch(
          setUser({
            ...user,
            selectedCourses: user.selectedCourses.filter(
              (id) => id !== course._id,
            ),
          }),
        );
      } else {
        await addCourseToUser(course._id, token);

        dispatch(
          setUser({
            ...user,
            selectedCourses: [...user.selectedCourses, course._id],
          }),
        );
      }
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;

      setError(message || 'Не удалось изменить список курсов');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Link href={`${ROUTER.course}/${course._id}`} className={styles.Course}>
      <div className={styles.Course__imgBox}>
        <Image
          className={styles.Course__img}
          src={`/courses-square/${course.nameEN}.jpg`}
          alt={course.nameRU}
          width={360}
          height={324}
        />
        <span
          role="button"
          tabIndex={0}
          title={isAdded ? 'Удалить курс' : 'Добавить курс'}
          aria-label={isAdded ? 'Удалить курс' : 'Добавить курс'}
          onClick={handleToggleCourse}
          className={styles.Course__btn}
        >
          <Image
            src={isAdded ? '/icons/minus.svg' : '/icons/plus.svg'}
            alt={''}
            width={26}
            height={26}
          />
        </span>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className={styles.Course__info}>
        <h3 className={styles.Course__title}>{course.nameRU}</h3>
        <div className={styles.Course__items}>
          <div className={styles.Course__days}>
            <Image
              src={'/icons/days.svg'}
              alt={'days'}
              width={15}
              height={15}
            />
            <span>{course.durationInDays} дней</span>
          </div>
          <div className={styles.Course__time}>
            <Image
              src={'/icons/time.svg'}
              alt={'time'}
              width={15}
              height={15}
            />
            <span>{duration}</span>
          </div>
          <div className={styles.Course__difficulty}>
            <Image
              src={'/icons/difficulty.svg'}
              alt={'difficulty'}
              width={15}
              height={15}
            />
            <span>{course.difficulty}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
