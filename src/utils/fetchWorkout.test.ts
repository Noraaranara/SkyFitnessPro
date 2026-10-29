import { describe, it, expect, vi, beforeEach } from 'vitest';
import { configureStore } from '@reduxjs/toolkit';

import {
  getWorkoutById,
  getWorkoutProgress,
  saveWorkoutProgress as saveWorkoutProgressApi,
} from '@/services/workouts/workoutsApi';

import { fetchWorkout, saveWorkoutProgress } from './fetchWorkout';

import { workoutSliceReducer } from '@/store/features/workoutSlice';

import type { WorkoutType } from '@/sharedTypes/sharedTypes';

vi.mock('@/services/workouts/workoutsApi', () => ({
  getWorkoutById: vi.fn(),
  getWorkoutProgress: vi.fn(),
  saveWorkoutProgress: vi.fn(),
}));

const testWorkout = {
  _id: 'workout-1',
  name: 'Первая тренировка',
  video: 'https://example.com/video',
  exercises: [],
} as WorkoutType;

const args = {
  courseId: 'course-1',
  workoutId: 'workout-1',
  token: 'test-token',
};

const createTestStore = () =>
  configureStore({
    reducer: {
      workout: workoutSliceReducer,
    },
  });

describe('fetchWorkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('загружает тренировку и сохранённый прогресс', async () => {
    vi.mocked(getWorkoutById).mockResolvedValue(testWorkout);

    vi.mocked(getWorkoutProgress).mockResolvedValue({
      courseId: 'course-1',
      courseCompleted: false,
      workoutsProgress: [
        {
          workoutId: 'workout-1',
          workoutCompleted: false,
          progressData: [2, 5, 8],
        },
      ],
    });

    const store = createTestStore();

    await store.dispatch(fetchWorkout(args));

    expect(store.getState().workout.workout).toEqual(testWorkout);
    expect(store.getState().workout.progressData).toEqual([2, 5, 8]);
    expect(store.getState().workout.isLoading).toBe(false);
  });

  it('возвращает пустой прогресс, если сохранённых данных нет', async () => {
    vi.mocked(getWorkoutById).mockResolvedValue(testWorkout);

    vi.mocked(getWorkoutProgress).mockResolvedValue({
      courseId: 'course-1',
      courseCompleted: false,
      workoutsProgress: [],
    });

    const store = createTestStore();

    await store.dispatch(fetchWorkout(args));

    expect(store.getState().workout.workout).toEqual(testWorkout);
    expect(store.getState().workout.progressData).toEqual([]);
  });

  it('сохраняет ошибку при неудачной загрузке', async () => {
    vi.mocked(getWorkoutById).mockRejectedValue(new Error('Ошибка сервера'));

    vi.mocked(getWorkoutProgress).mockResolvedValue({
      courseId: 'course-1',
      courseCompleted: false,
      workoutsProgress: [],
    });

    const store = createTestStore();

    await store.dispatch(fetchWorkout(args));

    expect(store.getState().workout.error).toBe(
      'Не удалось загрузить тренировку',
    );
    expect(store.getState().workout.isLoading).toBe(false);
  });
});

describe('saveWorkoutProgress', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('сохраняет прогресс и получает данные сервера', async () => {
    vi.mocked(saveWorkoutProgressApi).mockResolvedValue({
      workoutId: 'workout-1',
      workoutCompleted: false,
      progressData: [3, 6, 9],
    });

    const store = createTestStore();

    await store.dispatch(
      saveWorkoutProgress({
        ...args,
        progressData: [3, 6, 9],
      }),
    );

    expect(store.getState().workout.progressData).toEqual([3, 6, 9]);
    expect(store.getState().workout.isSaving).toBe(false);
  });

  it('сохраняет ошибку при неудачном сохранении', async () => {
    vi.mocked(saveWorkoutProgressApi).mockRejectedValue(
      new Error('Ошибка сервера'),
    );

    const store = createTestStore();

    await store.dispatch(
      saveWorkoutProgress({
        ...args,
        progressData: [1, 5, 10],
      }),
    );

    expect(store.getState().workout.error).toBe(
      'Не удалось сохранить прогресс',
    );
    expect(store.getState().workout.isSaving).toBe(false);
  });
});
