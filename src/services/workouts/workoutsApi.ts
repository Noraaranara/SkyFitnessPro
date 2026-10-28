import {  ApiMessage, CourseProgressType, WorkoutProgressResponse, WorkoutType } from "@/sharedTypes/sharedTypes";
import axios from "axios";
import { BASE__URL } from "../constants";

export const getWorkoutById = (
  workoutId: string,
  token: string,
): Promise<WorkoutType> => {
  return axios
    .get(`${BASE__URL}/workouts/${workoutId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
};

export const getWorkoutProgress = (
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

export const saveWorkoutProgress = (
  courseId: string,
  workoutId: string,
  progressData: number[],
  token: string,
): Promise<WorkoutProgressResponse> => {
  return axios
    .patch(
      `${BASE__URL}/courses/${courseId}/workouts/${workoutId}`,
      { progressData },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': false,
        },
      },
    )
    .then((res) => res.data);
};

export const resetWorkoutProgress = (
  courseId: string,
  workoutId: string,
  token: string,
): Promise<ApiMessage> => {
  return axios
    .patch(
      `${BASE__URL}/courses/${courseId}/workouts/${workoutId}/reset`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    .then((res) => res.data);
};