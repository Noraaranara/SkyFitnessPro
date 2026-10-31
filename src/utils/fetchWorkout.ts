
import { createAsyncThunk } from '@reduxjs/toolkit';
import type {
  WorkoutProgressType,
  WorkoutType,
} from '@/sharedTypes/sharedTypes';
import {
  getWorkoutById,
  getWorkoutProgress,
  saveWorkoutProgress as saveWorkoutProgressApi,
} from '@/services/workouts/workoutsApi';

type FetchWorkoutArgs = {
  courseId: string;
  workoutId: string;
  token: string;
};

type SaveWorkoutProgressArgs = FetchWorkoutArgs & {
  progressData: number[];
};

type FetchWorkoutResult = {
  workout: WorkoutType;
  progressData: number[];
};

export const fetchWorkout = createAsyncThunk<
  FetchWorkoutResult,
  FetchWorkoutArgs,
  { rejectValue: string }
>(
  'workout/fetchWorkout',
  async ({ courseId, workoutId, token }, { rejectWithValue }) => {
    try {
      const [workout, courseProgress] = await Promise.all([
        getWorkoutById(workoutId, token),
        getWorkoutProgress(courseId, token),
      ]);

      const savedProgress = (courseProgress.workoutsProgress ?? []).find(
        (item: WorkoutProgressType) => item.workoutId === workoutId,
      );

      return {
        workout,
        progressData: savedProgress?.progressData ?? [],
      };
    } catch (error) {
      console.error('Ошибка загрузки тренировки:', error);
      return rejectWithValue('Не удалось загрузить тренировку');
    }
  },
);

export const saveWorkoutProgress = createAsyncThunk<
  number[],
  SaveWorkoutProgressArgs,
  { rejectValue: string }
>(
  'workout/saveProgress',
  async (
    { courseId, workoutId, token, progressData },
    { rejectWithValue },
  ) => {
    try {
      const result = await saveWorkoutProgressApi(
        courseId,
        workoutId,
        progressData,
        token,
      );

      return result.progressData ?? progressData;
    } catch (error) {
      console.error('Ошибка сохранения прогресса:', error);
      return rejectWithValue('Не удалось сохранить прогресс');
    }
  },
);
