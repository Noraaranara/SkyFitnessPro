'use client'

import CourseBlock from '@/components/CourseBlock/CourseBlock';
import { getCourseById } from '@/services/courses/coursesApi';
import { setCurrentCourse } from '@/store/features/courseSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';

export default function CoursePage() {
  const dispatch = useAppDispatch();
  const { currentCourse } = useAppSelector((state) => state.courses);
  const params = useParams<{ courseId: string }>();
  const _id = String(params.courseId);

  useEffect(() => {
    getCourseById(_id).then((res) => {
      console.log(_id)
      dispatch(setCurrentCourse(res));
    });
  }, [_id, dispatch]);

  if (!currentCourse || currentCourse._id !== _id) {
    return <p>Загрузка курса...</p>;
  }
  return <CourseBlock course={currentCourse} />;
}
