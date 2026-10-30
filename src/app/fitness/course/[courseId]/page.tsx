'use client';

import CourseBlock from '@/components/CourseBlock/CourseBlock';
import { getCourseById } from '@/services/courses/coursesApi';
import { getApiErrorMessage } from '@/services/getApiErrorMessage';
import { setCurrentCourse } from '@/store/features/courseSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function CoursePage() {
  const dispatch = useAppDispatch();
  const { currentCourse } = useAppSelector((state) => state.courses);

  const params = useParams<{ courseId: string }>();
  const _id = String(params.courseId);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    const loadCourse = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const course = await getCourseById(_id);

        if (isActive) {
          dispatch(setCurrentCourse(course));
        }
      } catch (err) {
        const message = getApiErrorMessage(
          err,
          'Не удалось загрузить информацию о курсе',
        );

        if (isActive) {
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadCourse();

    return () => {
      isActive = false;
    };
  }, [_id, dispatch]);

  if (isLoading) {
    return <p>Загрузка курса...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!currentCourse || currentCourse._id !== _id) {
    return <p>Курс не найден</p>;
  }

  return <CourseBlock course={currentCourse} />;
}
