import { describe, it, expect } from 'vitest';
import {
  workoutSliceReducer,
  setWorkout,
  setProgressData,
  clearWorkout,
} from './workoutSlice';
import { fetchWorkout, saveWorkoutProgress } from '@/utils/fetchWorkout';
import type { WorkoutType } from '@/sharedTypes/sharedTypes';

const testWorkout = {
  _id: 'workout-1',
  name: 'Первая тренировка',
  video: 'https://example.com/video',
  exercises: [],
} as WorkoutType;

describe('workoutSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = workoutSliceReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      workout: null,
      progressData: [],
      isLoading: false,
      isSaving: false,
      error: null,
    });
  });

  it('сохраняет тренировку', () => {
    const state = workoutSliceReducer(
      undefined,
      setWorkout(testWorkout),
    );

    expect(state.workout).toEqual(testWorkout);
  });

  it('сохраняет данные прогресса', () => {
    const progress = [1, 5, 7, 10];

    const state = workoutSliceReducer(
      undefined,
      setProgressData(progress),
    );

    expect(state.progressData).toEqual(progress);
  });

  it('очищает данные тренировки и прогресса', () => {
    const initialState = {
      workout: testWorkout,
      progressData: [1, 5, 7],
      isLoading: true,
      isSaving: true,
      error: 'Ошибка',
    };

    const state = workoutSliceReducer(initialState, clearWorkout());

    expect(state).toEqual({
      workout: null,
      progressData: [],
      isLoading: false,
      isSaving: false,
      error: null,
    });
  });

  describe('fetchWorkout', () => {
    it('устанавливает состояние загрузки', () => {
      const state = workoutSliceReducer(undefined, {
        type: fetchWorkout.pending.type,
      });

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('сохраняет загруженную тренировку и прогресс', () => {
      const progress = [2, 5, 8];

      const state = workoutSliceReducer(undefined, {
        type: fetchWorkout.fulfilled.type,
        payload: {
          workout: testWorkout,
          progressData: progress,
        },
      });

      expect(state.workout).toEqual(testWorkout);
      expect(state.progressData).toEqual(progress);
      expect(state.isLoading).toBe(false);
    });

    it('сохраняет ошибку при неудачной загрузке', () => {
      const state = workoutSliceReducer(undefined, {
        type: fetchWorkout.rejected.type,
        payload: 'Не удалось загрузить тренировку',
      });

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Не удалось загрузить тренировку');
    });

    it('устанавливает стандартную ошибку, если сообщение отсутствует', () => {
      const state = workoutSliceReducer(undefined, {
        type: fetchWorkout.rejected.type,
      });

      expect(state.error).toBe('Не удалось загрузить тренировку');
    });
  });

  describe('saveWorkoutProgress', () => {
    it('устанавливает состояние сохранения', () => {
      const state = workoutSliceReducer(undefined, {
        type: saveWorkoutProgress.pending.type,
      });

      expect(state.isSaving).toBe(true);
      expect(state.error).toBeNull();
    });

    it('сохраняет обновлённый прогресс', () => {
      const progress = [3, 6, 9, 10];

      const state = workoutSliceReducer(undefined, {
        type: saveWorkoutProgress.fulfilled.type,
        payload: progress,
      });

      expect(state.progressData).toEqual(progress);
      expect(state.isSaving).toBe(false);
    });

    it('сохраняет ошибку при неудачном сохранении', () => {
      const state = workoutSliceReducer(undefined, {
        type: saveWorkoutProgress.rejected.type,
        payload: 'Не удалось сохранить прогресс',
      });

      expect(state.isSaving).toBe(false);
      expect(state.error).toBe('Не удалось сохранить прогресс');
    });

    it('устанавливает стандартную ошибку, если сообщение отсутствует', () => {
      const state = workoutSliceReducer(undefined, {
        type: saveWorkoutProgress.rejected.type,
      });

      expect(state.error).toBe('Не удалось сохранить прогресс');
    });
  });
});