'use client';

import { useEffect } from 'react';
import type { ExerciseType } from '@/sharedTypes/sharedTypes';
import styles from './WorkoutProgressModal.module.css';

type WorkoutProgressModalProps = {
  exercises: ExerciseType[];
  progress: number[];
  isSaving: boolean;
  onProgressChange: (index: number, value: string) => void;
  onSave: () => void;
  onClose: () => void;
};

export default function WorkoutProgressModal({
  exercises,
  progress,
  isSaving,
  onProgressChange,
  onSave,
  onClose,
}: WorkoutProgressModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div
      className={styles.Overlay}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className={styles.Modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="progress-modal-title"
      >
        <h2 id="progress-modal-title" className={styles.Modal__title}>
          Мой прогресс
        </h2>

        <form
          className={styles.Modal__form}
          onSubmit={(event) => {
            event.preventDefault();
            onSave();
          }}
        >
          <div className={styles.Modal__list}>
            {exercises.map((exercise, index) => (
              <div className={styles.Modal__exercise} key={exercise._id}>
                <label
                  className={styles.Modal__label}
                  htmlFor={`exercise-${exercise._id}`}
                >
                  {exercise.name}
                </label>

                <div className={styles.Modal__inputWrapper}>
                  <input
                    className={styles.Modal__input}
                    id={`exercise-${exercise._id}`}
                    type="number"
                    min={0}
                    max={exercise.quantity}
                    step={1}
                    value={
                      progress[index] === -1 ? '' : (progress[index] ?? '')
                    }
                    onChange={(event) =>
                      onProgressChange(index, event.target.value)
                    }
                  />

                  {progress[index] === -1 && (
                    <span className={styles.Modal__placeholder}>0</span>
                  )}
                </div>
              </div>
            ))}

            {exercises.length === 0 && (
              <p>Для этой тренировки упражнения не указаны.</p>
            )}
          </div>

          <button
            className={styles.Modal__saveButton}
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить'}
          </button>
        </form>
      </div>
    </div>
  );
}
