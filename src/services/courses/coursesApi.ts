import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';
import api from '../api';

type ApiMessage = {
  message: string;
};

export const getAllCourses = async (): Promise<CourseType[]> => {
  const response = await api.get('/courses/');
  return response.data;
};

export const getCourseById = async (_id: string): Promise<CourseType> => {
  const response = await api.get(`/courses/${_id}`);
  return response.data;
};

export const addCourseToUser = async (
  courseId: string,
  token: string,
): Promise<ApiMessage> => {
  const response = await api.post('/users/me/courses', courseId, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const removeCourseFromUser = async (
  courseId: string,
  token: string,
): Promise<ApiMessage> => {
  const response = await api.delete(`/users/me/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCourseWorkouts = async (courseId: string, token: string) => {
  const response = await api.get(`/courses/${courseId}/workouts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const getCourseProgress = async (
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
