import Image from 'next/image';
import { CourseType } from '@/sharedTypes/sharedTypes';
import SkillCard from '../SkillCard/SkillCard';
import Link from 'next/link';
import styles from '@/components/CourseBlock/CourseBlock.module.css';

type CourseBlockProps = {
  course: CourseType;
};

export default function CourseBlock({ course }: CourseBlockProps) {
  return (
    <div className={styles.CourseBlock}>
      <SkillCard course={course} />
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
          <Link href={''} className={styles.CourseBlock__startbtn}>
            Добавить курс
          </Link>
        </div>
        <div className={styles.CourseBlock__startImg}>
          <Image
            className={styles.CourseBlock__startBg}
            alt="runner-bg"
            src={'/runner-bg.svg'}
            width={1160}
            height={536}
          />
          <Image
            className={styles.CourseBlock__startRunner}
            alt="runner"
            src={'/runner.png'}
            width={515}
            height={568}
          />
        </div>
      </div>
    </div>
  );
}
