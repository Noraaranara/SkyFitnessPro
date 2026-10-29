'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { clearWorkout } from '@/store/features/workoutSlice';
import { fetchWorkout, saveWorkoutProgress } from '@/utils/fetchWorkout';
import styles from './WorkoutBlock.module.css';
import WorkoutProgressModal from '../WorkoutProgressModal/WorkoutProgressModal';
import { toast } from 'react-toastify';

export default function WorkoutBlock() {
  const params = useParams<{
    courseId: string;
    workoutId: string;
  }>();

  const { courseId, workoutId } = params;
  const dispatch = useAppDispatch();

  const token = useAppSelector((state) => state.auth.token);

  const { workout, progressData, isLoading, isSaving, error } = useAppSelector(
    (state) => state.workout,
  );

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formProgress, setFormProgress] = useState<number[]>([]);

  useEffect(() => {
    if (!token || !courseId || !workoutId) return;

    dispatch(fetchWorkout({ courseId, workoutId, token }));

    return () => {
      dispatch(clearWorkout());
    };
  }, [dispatch, courseId, workoutId, token]);

  if (!token) {
    return (
      <main className={styles.WorkoutBlock}>
        <p>Войдите в аккаунт, чтобы открыть тренировку.</p>
      </main>
    );
  }

  if (isLoading) {
    return <main className={styles.WorkoutBlock}>Загрузка тренировки...</main>;
  }

  if (error || !workout) {
    return (
      <main className={styles.WorkoutBlock}>
        <p>{error || 'Тренировка не найдена.'}</p>
      </main>
    );
  }

  const nameParts = workout.name.split(' / ');
  const workoutTitle = nameParts[0];

  const getExerciseProgress = (index: number) => {
    const completed = progressData[index] ?? 0;
    const quantity = workout.exercises[index].quantity;

    if (quantity <= 0) return 0;

    return Math.min(100, Math.round((completed / quantity) * 100));
  };

  const handleProgressChange = (index: number, value: string) => {
    setFormProgress((current) => {
      const updated = [...current];

      if (value === '') {
        updated[index] = -1;
        return updated;
      }

      const numberValue = Number(value);

      updated[index] = Math.max(
        0,
        Math.min(
          workout.exercises[index].quantity,
          Number.isFinite(numberValue) ? numberValue : 0,
        ),
      );

      return updated;
    });
  };

  const handleSaveProgress = async () => {
    if (!token) return;

    try {
      await dispatch(
        saveWorkoutProgress({
          courseId,
          workoutId,
          token,
          progressData: workout.exercises.map((exercise, index) =>
            Math.max(
              0,
              Math.min(
                exercise.quantity,
                Math.max(0, Number(formProgress[index] ?? 0)),
              ),
            ),
          ),
        }),
      ).unwrap();

      setIsFormOpen(false);
      toast.success('Прогресс тренировки сохранён!');
    } catch {
      toast.error('Не удалось сохранить прогресс. Попробуйте ещё раз.');
    }
  };

  return (
    <main className={styles.WorkoutBlock}>
      <h3 className={styles.WorkoutBlock__title}>{workoutTitle}</h3>

      <div className={styles.WorkoutBlock__video}>
        <iframe
          src={workout.video}
          title={workoutTitle}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>

      <div className={styles.WorkoutBlock__exercises}>
        <div className={styles.WorkoutBlock__info}>
          <h4>Упражнения тренировки</h4>
          <div className={styles.WorkoutBlock__wrapper}>
            {workout.exercises.map((exercise, index) => {
              const percentage = getExerciseProgress(index);
              return (
                <div
                  className={styles.WorkoutBlock__exercise}
                  key={exercise._id}
                >
                  <div className={styles.WorkoutBlock__exerciseInfo}>
                    <span className={styles.WorkoutBlock__exerciseName}>
                      {exercise.name}
                    </span>

                    <span className={styles.WorkoutBlock__percentage}>
                      {percentage}%
                    </span>
                  </div>

                  <div
                    className={styles.ProgressTrack}
                    role="progressbar"
                    aria-label={`Прогресс: ${exercise.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                  >
                    <div
                      className={styles.ProgressFill}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}

            {workout.exercises.length === 0 && (
              <p>Для этой тренировки упражнения не указаны.</p>
            )}
          </div>

          <button
            type="button"
            className={styles.WorkoutBlock__progressButton}
            onClick={() => {
              setFormProgress(
                workout.exercises.map((_, index) =>
                  (progressData[index] ?? 0) > 0 ? progressData[index] : -1,
                ),
              );
              setIsFormOpen(true);
            }}
          >
            Заполнить свой прогресс
          </button>

          {isFormOpen && (
            <WorkoutProgressModal
              exercises={workout.exercises}
              progress={formProgress}
              isSaving={isSaving}
              onProgressChange={handleProgressChange}
              onClose={() => setIsFormOpen(false)}
              onSave={handleSaveProgress}
            />
          )}
        </div>
      </div>
    </main>
  );
}
