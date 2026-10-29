import {
  ApiMessage,
  CourseProgressType,
  WorkoutProgressResponse,
  WorkoutType,
} from '@/sharedTypes/sharedTypes';
import api from '../api';

export const getWorkoutById = async (
  workoutId: string,
  token: string,
): Promise<WorkoutType> => {
  const response = await api.get(`/workouts/${workoutId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getWorkoutProgress = async (
  courseId: string,
  token: string,
): Promise<CourseProgressType> => {
  const response = await api.get('/users/me/progress', {
    params: { courseId },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const saveWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  progressData: number[],
  token: string,
): Promise<WorkoutProgressResponse> => {
  const response = await api.patch(
    `/courses/${courseId}/workouts/${workoutId}`,
    { progressData },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': false,
      },
    },
  );
  return response.data;
};

export const resetWorkoutProgress = async (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<ApiMessage> => {
  const response = await api.patch(
    `/courses/${courseId}/workouts/${workoutId}/reset`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
