'use client';

import Image from 'next/image';
import styles from '@/components/CourseItem/CourseItem.module.css';
import { formatDailyDuration } from '@/app/utilts/helpers';
import { CourseType, WorkoutType } from '@/sharedTypes/sharedTypes';
import Link from 'next/link';
import { ROUTER } from '@/app/routes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react';
import {
  addCourseToUser,
  getCourseProgress,
  getCourseWorkouts,
  removeCourseFromUser,
} from '@/services/courses/coursesApi';
import { openAuthModal, setUser } from '@/store/features/authSlice';
import { useRouter } from 'next/navigation';
import WorkoutSelectModal from '../WorkoutSelectModal/WorkoutSelectModal';
import { toast } from 'react-toastify';
import { getApiErrorMessage } from '@/services/getApiErrorMessage';

export type CourseItemProps = {
  course: CourseType;
  showProgress?: boolean;
};

export default function CourseItem({
  course,
  showProgress = false,
}: CourseItemProps) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);
  const [isLoading, setIsLoading] = useState(false);

  const duration = formatDailyDuration(course);
  const isAdded = user?.selectedCourses.includes(course._id) ?? false;

  const [progress, setProgress] = useState<number | null>(null);

  const router = useRouter();

  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [workouts, setWorkouts] = useState<WorkoutType[]>([]);
  const [isWorkoutsLoading, setIsWorkoutsLoading] = useState(false);

  useEffect(() => {
    if (!showProgress || !token) {
      return;
    }

    let cancelled = false;

    const loadProgress = async () => {
      try {
        const [workouts, courseProgress] = await Promise.all([
          getCourseWorkouts(course._id, token),
          getCourseProgress(course._id, token),
        ]);

        if (cancelled) return;

        const totalWorkouts = workouts.length;
        const workoutsProgress = courseProgress?.workoutsProgress ?? [];

        const completedWorkouts = workoutsProgress.filter(
          (workout) => workout.workoutCompleted,
        ).length;

        const percentage =
          totalWorkouts > 0
            ? Math.round((completedWorkouts / totalWorkouts) * 100)
            : 0;

        setProgress(percentage);
      } catch (error) {
        const message = getApiErrorMessage(
          error,
          'Не удалось загрузить прогресс курса:',
        );
        toast.error(message);
        if (!cancelled) {
          setProgress(null);
        }
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [course._id, showProgress, token]);

  const handleToggleCourse = async (e: React.MouseEvent<HTMLSpanElement>) => {
    e.preventDefault();
    e.stopPropagation();

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
        toast.success('Курс удалён из вашего списка');
      } else {
        await addCourseToUser(course._id, token);

        dispatch(
          setUser({
            ...user,
            selectedCourses: [...user.selectedCourses, course._id],
          }),
        );
        toast.success('Курс добавлен в ваш список');
      }
    } catch (error) {
      const message = getApiErrorMessage(
        error,
        'Не удалось изменить список курсов',
      );
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (!token) {
      dispatch(openAuthModal());
      return;
    }

    try {
      setIsWorkoutsLoading(true);
      const data = await getCourseWorkouts(course._id, token);

      setWorkouts(data);
      setIsWorkoutModalOpen(true);
    } catch (error) {
      const message = getApiErrorMessage(error, 'Не удалось добавить курс');
      toast.error(message);
    } finally {
      setIsWorkoutsLoading(false);
    }
  };
  return (
    <>
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

          {showProgress && (
            <>
              <div className={styles.Course__progress}>
                <div className={styles.Course__progressInfo}>
                  <span>Прогресс</span>
                  <span>{progress !== null ? `${progress}%` : '—'}</span>
                </div>

                <div
                  className={styles.Course__progressTrack}
                  role="progressbar"
                  aria-label={`Прогресс курса ${course.nameRU}`}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={progress ?? 0}
                >
                  <div
                    className={styles.Course__progressFill}
                    style={{ width: `${progress ?? 0}%` }}
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleProgressClick}
                className={styles.Course__progressBtn}
                disabled={isWorkoutsLoading}
              >
                {isWorkoutsLoading
                  ? 'Загрузка...'
                  : progress === null || progress === 0
                    ? 'Начать тренировки'
                    : progress === 100
                      ? 'Начать заново'
                      : 'Продолжить'}
              </button>
            </>
          )}
        </div>
      </Link>
      {isWorkoutModalOpen && (
        <WorkoutSelectModal
          workouts={workouts}
          onClose={() => setIsWorkoutModalOpen(false)}
          onSelect={(workoutIds) => {
            const firstWorkoutId = workoutIds[0];

            if (!firstWorkoutId) return;

            setIsWorkoutModalOpen(false);
            router.push(
              `${ROUTER.course}/${course._id}/workout/${firstWorkoutId}`,
            );
          }}
        />
      )}
    </>
  );
}
