import type { WorkoutType } from '@/sharedTypes/sharedTypes';
import { fetchWorkout, saveWorkoutProgress } from '@/utils/fetchWorkout';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type initialStateType = {
  workout: WorkoutType | null;
  progressData: number[];
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
};

const initialState: initialStateType = {
  workout: null,
  progressData: [],
  isLoading: false,
  isSaving: false,
  error: null,
};

const workoutSlice = createSlice({
  name: 'workout',
  initialState,

  reducers: {
    setWorkout: (state, action: PayloadAction<WorkoutType>) => {
      state.workout = action.payload;
    },

    setProgressData: (state, action: PayloadAction<number[]>) => {
      state.progressData = action.payload;
    },

    clearWorkout: (state) => {
      state.workout = null;
      state.progressData = [];
      state.isLoading = false;
      state.isSaving = false;
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWorkout.fulfilled, (state, action) => {
        state.isLoading = false;
        state.workout = action.payload.workout;
        state.progressData = action.payload.progressData;
      })
      .addCase(fetchWorkout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Не удалось загрузить тренировку';
      })
      .addCase(saveWorkoutProgress.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(saveWorkoutProgress.fulfilled, (state, action) => {
        state.isSaving = false;
        state.progressData = action.payload;
      })
      .addCase(saveWorkoutProgress.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload ?? 'Не удалось сохранить прогресс';
      });
  },
});

export const { setWorkout, setProgressData, clearWorkout } =
  workoutSlice.actions;

export const workoutSliceReducer = workoutSlice.reducer;
