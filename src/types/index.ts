export interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight?: number;
  notes?: string;
}

export interface Workout {
  id: string;
  name: string;
  description?: string;
  exercises: Exercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weight?: number;
  completed: boolean;
}

export interface ActiveExercise {
  exerciseId: string;
  name: string;
  plannedSets: number;
  plannedReps: number;
  plannedWeight?: number;
  sets: ExerciseSet[];
}

export interface WorkoutLog {
  id: string;
  workoutId: string;
  workoutName: string;
  startTime: Date;
  endTime: Date;
  duration: number;
  exercises: ActiveExercise[];
  notes?: string;
}

// New types for Exercise Library
export type MuscleGroup = 
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Arms'
  | 'Legs'
  | 'Core'
  | 'Cardio'
  | 'Full Body';

export interface LibraryExercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
  equipment?: string;
  description?: string;
  isCustom: boolean;
}