
'use client';

import { useEffect, useState } from 'react';
import styles from './WorkoutSelectModal.module.css';

export type WorkoutType = {
  _id: string;
  name: string;
  video: string;
  exercises: unknown[];
};

type WorkoutSelectModalProps = {
  workouts: WorkoutType[];
  onClose: () => void;
  onSelect: (workoutIds: string[]) => void;
};

export default function WorkoutSelectModal({
  workouts,
  onClose,
  onSelect,
}: WorkoutSelectModalProps) {
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const toggleWorkout = (workoutId: string) => {
    setSelectedWorkouts((prev) =>
      prev.includes(workoutId)
        ? prev.filter((id) => id !== workoutId)
        : [...prev, workoutId],
    );
  };

  const getWorkoutDetails = (name: string) => {
    const parts = name.split(' / ');

    if (parts.length >= 3) {
      return {
        title: parts[0],
        subtitle: parts.slice(1).join(' / '),
      };
    }

    return {
      title: name,
      subtitle: '',
    };
  };

  return (
    <div
      className={styles.Overlay}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className={styles.Modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="workout-modal-title"
      >
        <h2 id="workout-modal-title" className={styles.Title}>
          Выберите тренировку
        </h2>
        <div className={styles.List}>
          {workouts.map((workout) => {
            const isSelected = selectedWorkouts.includes(workout._id);
            const details = getWorkoutDetails(workout.name);

            return (
              <button
                key={workout._id}
                type="button"
                className={styles.Workout}
                onClick={() => toggleWorkout(workout._id)}
                aria-pressed={isSelected}
              >
                <span
                  className={`${styles.CheckCircle} ${
                    isSelected ? styles.CheckCircleSelected : ''
                  }`}
                  aria-hidden="true"
                >
                  {isSelected && (
                    <svg
                      viewBox="0 0 24 24"
                      className={styles.CheckIcon}
                    >
                      <path d="M5 12.5 10 17 19 7" />
                    </svg>
                  )}
                </span>

                <span className={styles.WorkoutText}>
                  <span className={styles.WorkoutName}>
                    {details.title}
                  </span>

                  {details.subtitle && (
                    <span className={styles.WorkoutSubtitle}>
                      {details.subtitle}
                    </span>
                  )}
                </span>
              </button>
            );
          })}

          {workouts.length === 0 && (
            <p className={styles.Empty}>
              В этом курсе пока нет тренировок.
            </p>
          )}
        </div>

        <button
          type="button"
          className={styles.StartButton}
          disabled={selectedWorkouts.length === 0}
          onClick={() => onSelect(selectedWorkouts)}
        >
          Начать ({selectedWorkouts.length})
        </button>
      </div>
    </div>
  );
}
