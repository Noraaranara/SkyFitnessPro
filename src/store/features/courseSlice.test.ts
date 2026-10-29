import { describe, it, expect } from 'vitest';
import {
  courseSliceReducer,
  setAllCourses,
  setCurrentCourse,
} from './courseSlice';
import { CourseType } from '@/sharedTypes/sharedTypes';

const testCourse = {
  _id: 'course-1',
  nameEN: 'Yoga',
  nameRU: 'Йога',
} as CourseType;

const secondCourse = {
  _id: 'course-2',
  nameEN: 'Fitness',
  nameRU: 'Фитнес',
} as CourseType;

describe('courseSlice', () => {
  it('возвращает начальное состояние', () => {
    const state = courseSliceReducer(undefined, { type: 'unknown' });

    expect(state).toEqual({
      allCourses: [],
      currentCourse: null,
    });
  });

  it('сохраняет список курсов', () => {
    const courses = [testCourse, secondCourse];

    const state = courseSliceReducer(
      undefined,
      setAllCourses(courses),
    );

    expect(state.allCourses).toEqual(courses);
  });

  it('заменяет старый список курсов новым', () => {
    const initialState = courseSliceReducer(
      undefined,
      setAllCourses([testCourse]),
    );

    const state = courseSliceReducer(
      initialState,
      setAllCourses([secondCourse]),
    );

    expect(state.allCourses).toEqual([secondCourse]);
  });

  it('сохраняет текущий курс', () => {
    const state = courseSliceReducer(
      undefined,
      setCurrentCourse(testCourse),
    );

    expect(state.currentCourse).toEqual(testCourse);
  });
});