import axios from 'axios';
import { BASE__URL } from '../constants';

import { CourseProgressType, CourseType } from '@/sharedTypes/sharedTypes';

type ApiMessage = {
  message: string;
};

export const getAllCourses = (): Promise<CourseType[]> => {
  return axios(BASE__URL + '/courses/').then((res) => {
    return res.data;
  });
};

export const getCourseById = (_id: string): Promise<CourseType> => {
  return axios(BASE__URL + '/courses/' + _id).then((res) => {
    return res.data;
  });
};

export const addCourseToUser = (
  courseId: string,
  token: string,
): Promise<ApiMessage> => {
  return axios
    .post(
      `${BASE__URL}/users/me/courses`,
      { courseId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': false,
        },
      },
    )
    .then((res) => res.data);
};

export const removeCourseFromUser = (
  courseId: string,
  token: string,
): Promise<ApiMessage> => {
  return axios
    .delete(`${BASE__URL}/users/me/courses/${courseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getCourseWorkouts = (courseId: string, token: string) => {
  return axios
    .get(`${BASE__URL}/courses/${courseId}/workouts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getCourseProgress = (
  courseId: string,
  token: string,
): Promise<CourseProgressType> => {
  return axios
    .get(`${BASE__URL}/users/me/progress`, {
      params: { courseId },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};
