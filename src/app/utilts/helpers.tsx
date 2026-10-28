import { CourseType } from "@/sharedTypes/sharedTypes";

export function formatDailyDuration(course: CourseType): string {
  return `${course.dailyDurationInMinutes.from}-${course.dailyDurationInMinutes.to} мин/день`
}