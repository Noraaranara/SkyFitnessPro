export type CourseType = {
  _id: string;
  nameRU: string;
  nameEN: string;
  description: string;
  directions: string[];
  fitting: string[];
  order: number;
  difficulty: string;
  durationInDays: number;
  dailyDurationInMinutes: {
    from: number;
    to: number;
  };
  workouts: string[];
};

export type WorkoutProgressType = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};

export type CourseProgressType = {
  courseId: string;
  courseCompleted: boolean;
  workoutsProgress: WorkoutProgressType[];
};

export type WorkoutProgressResponse = {
  workoutId: string;
  workoutCompleted: boolean;
  progressData: number[];
};


export type ApiMessage = {
  message: string;
};

export type ExerciseType = {
  _id: string;
  name: string;
  quantity: number;
};

export type WorkoutType = {
  _id: string;
  name: string;
  video: string;
  exercises: ExerciseType[];
};

