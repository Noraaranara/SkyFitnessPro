import { CourseType } from '@/sharedTypes/sharedTypes';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type initialStateType = {
  allCourses: CourseType[];
  currentCourse: null | CourseType;
};

const initialState: initialStateType = {
  allCourses: [],
  currentCourse: null,
};

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setAllCourses: (state, action: PayloadAction<CourseType[]>) => {
state.allCourses = action.payload
    },
    setCurrentCourse: (state, action: PayloadAction<CourseType>) => {
      state.currentCourse = action.payload;
    },
  },
});

export const { setAllCourses, setCurrentCourse } = courseSlice.actions;
export const courseSliceReducer = courseSlice.reducer;
