import { Workout } from '../types';

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Push Day',
    description: 'Chest, Shoulders, Triceps',
    exercises: [
      {
        id: '1-1',
        name: 'Bench Press',
        sets: 4,
        reps: 8,
        weight: 80,
      },
      {
        id: '1-2',
        name: 'Shoulder Press',
        sets: 3,
        reps: 10,
        weight: 30,
      },
      {
        id: '1-3',
        name: 'Tricep Dips',
        sets: 3,
        reps: 12,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Pull Day',
    description: 'Back, Biceps',
    exercises: [
      {
        id: '2-1',
        name: 'Pull-ups',
        sets: 4,
        reps: 10,
      },
      {
        id: '2-2',
        name: 'Barbell Rows',
        sets: 4,
        reps: 8,
        weight: 60,
      },
      {
        id: '2-3',
        name: 'Bicep Curls',
        sets: 3,
        reps: 12,
        weight: 15,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Leg Day',
    description: 'Quads, Hamstrings, Calves',
    exercises: [
      {
        id: '3-1',
        name: 'Squats',
        sets: 4,
        reps: 8,
        weight: 100,
      },
      {
        id: '3-2',
        name: 'Leg Press',
        sets: 3,
        reps: 12,
        weight: 150,
      },
      {
        id: '3-3',
        name: 'Calf Raises',
        sets: 4,
        reps: 15,
        weight: 40,
      },
    ],
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];