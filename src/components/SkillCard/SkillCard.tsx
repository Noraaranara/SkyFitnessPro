import { CourseType } from '@/sharedTypes/sharedTypes';
import Image from 'next/image';
import styles from '@/components/SkillCard/SkillCard.module.css'

export const COURSE_COLORS: Record<string, string> = {
  Yoga: '#FFC700',
  Stretching: '#2491D2',
  Fitness: '#F7A012',
  StepAirobic: '#FF7E65',
  BodyFlex: '#7D458C',
};

const COURSE_IMAGE_SIZES: Record<string, {width: number; height: number}> = {
  Yoga: { width: 792, height: 310},
  Stretching: { width: 360, height: 310},
  Fitness: { width: 830, height: 310},
  StepAirobic: { width: 530, height: 310},
  BodyFlex:{ width: 668, height: 310},
}

type SkillCardType = {
  course: CourseType;
};

export default function SkillCard({ course }: SkillCardType) {
  const backgroundColor = COURSE_COLORS[course.nameEN] ?? '#FAFAFA';
  const imageSize = COURSE_IMAGE_SIZES[course.nameEN] ?? { width: 360, height:310}
  return (
    <article className={styles.SkillCard} style={{ backgroundColor }}>
      <span className={styles.SkillCard__title}>{course.nameRU}</span>
      <Image width={imageSize.width} height={imageSize.height} alt={course.nameEN} src={`/courses-long/${course.nameEN}.jpg`} className={styles.SkillCard__img} />
    </article>
  );
}
