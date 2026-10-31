import Image from 'next/image';
import { CourseType } from '@/sharedTypes/sharedTypes';
import SkillCard from '../SkillCard/SkillCard';
import styles from '@/components/CourseBlock/CourseBlock.module.css';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useState } from 'react';
import { openAuthModal, setUser } from '@/store/features/authSlice';
import { addCourseToUser } from '@/services/courses/coursesApi';
import axios from 'axios';
import { toast } from 'react-toastify';

type CourseBlockProps = {
  course: CourseType;
};

export default function CourseBlock({ course }: CourseBlockProps) {
  const dispatch = useAppDispatch();
  const { user, token } = useAppSelector((state) => state.auth);

  const [isLoading, setIsLoading] = useState(false);

  const isAdded = user?.selectedCourses.includes(course._id) ?? false;

  const handleAddCourse = async () => {
    if (!token || !user) {
      toast.info('Войдите, чтобы добавить курс');
      dispatch(openAuthModal());
      return;
    }

    if (isAdded) {
      toast.info('Этот курс уже добавлен');
      return;
    }

    if (isLoading) return;

    try {
      setIsLoading(true);

      await addCourseToUser(course._id, token);

      dispatch(
        setUser({
          ...user,
          selectedCourses: [...user.selectedCourses, course._id],
        }),
      );

      toast.success('Курс успешно добавлен!');
    } catch (err) {
      const errorMessage = axios.isAxiosError(err)
        ? err.response?.data?.message
        : null;

      toast.error(errorMessage || 'Не удалось добавить курс');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.CourseBlock}>
      <SkillCard course={course} />
      <div className={styles.CourseBlock__mobWrapper}>
        <Image
          src={`/courses-square/${course.nameEN}.jpg`}
          alt={course.nameRU}
          width={344}
          height={326}
          sizes="(max-width: 768px) 100vw, 0px"
          className={styles.CourseBlock__mobImg}
        />
      </div>
      <div className={styles.CourseBlock__info}>
        <h3 className={styles.CourseBlock__title}>Подойдет для вас, если:</h3>
        <div className={styles.CourseBlock__fittingsBox}>
          {course.fitting.map((fit, index) => (
            <div key={fit} className={styles.CourseBlock__fitting}>
              <span className={styles.CourseBlock__num}>{index + 1}</span>
              <span className={styles.CourseBlock__fit}>{fit}</span>
            </div>
          ))}
        </div>
        <h3 className={styles.CourseBlock__title}>Направления</h3>
        <div className={styles.CourseBlock__directionsBox}>
          {course.directions.map((direct) => (
            <div key={direct} className={styles.CourseBlock__direction}>
              <Image
                alt="spark"
                src={'/icons/spark.svg'}
                width={20}
                height={20}
                className={styles.CourseBlock__spark}
              />
              <span className={styles.CourseBlock__direct}>{direct}</span>
            </div>
          ))}
        </div>
      </div>
      <div className={styles.CourseBlock__start}>
        <div className={styles.CourseBlock__startWrapper}>
          <div className={styles.CourseBlock__startBlock}>
            <h3 className={styles.CourseBlock__startTitle}>
              Начните путь к новому телу
            </h3>
            <ul className={styles.CourseBlock__startInfo}>
              <li className={styles.CourseBlock__startList}>
                проработка всех групп мышц
              </li>
              <li className={styles.CourseBlock__startList}>
                тренировка суставов
              </li>
              <li className={styles.CourseBlock__startList}>
                улучшение циркуляции крови
              </li>
              <li className={styles.CourseBlock__startList}>
                упражнения заряжают бодростью
              </li>
              <li className={styles.CourseBlock__startList}>
                помогают противостоять стрессам
              </li>
            </ul>
            <button
              onClick={handleAddCourse}
              disabled={isLoading || isAdded}
              className={styles.CourseBlock__startbtn}
            >
              {isLoading
                ? 'Добавляем...'
                : isAdded
                  ? 'Курс добавлен'
                  : 'Добавить курс'}
            </button>
          </div>
        </div>
        <div className={styles.CourseBlock__startImg}>
          <Image
            className={styles.CourseBlock__startRunner}
            alt="runner"
            src={'/runner.png'}
            width={650}
            height={634}
          />
          
        </div>
      </div>
    </div>
  );
}
