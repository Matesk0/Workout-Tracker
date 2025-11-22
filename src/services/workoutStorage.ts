import AsyncStorage from '@react-native-async-storage/async-storage';
import { Workout } from '../types';

const WORKOUTS_KEY = '@workouts';

export const workoutStorage = {
  // Get all workouts
  async getWorkouts(): Promise<Workout[]> {
    try {
      const data = await AsyncStorage.getItem(WORKOUTS_KEY);
      if (!data) return [];
      
      const workouts = JSON.parse(data);
      // Convert date strings back to Date objects
      return workouts.map((w: any) => ({
        ...w,
        createdAt: new Date(w.createdAt),
        updatedAt: new Date(w.updatedAt),
      }));
    } catch (error) {
      console.error('Error loading workouts:', error);
      return [];
    }
  },

  // Save all workouts
  async saveWorkouts(workouts: Workout[]): Promise<void> {
    try {
      await AsyncStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    } catch (error) {
      console.error('Error saving workouts:', error);
      throw error;
    }
  },

  // Add a new workout
  async addWorkout(workout: Omit<Workout, 'id' | 'createdAt' | 'updatedAt'>): Promise<Workout> {
    try {
      const workouts = await this.getWorkouts();
      const newWorkout: Workout = {
        ...workout,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      workouts.push(newWorkout);
      await this.saveWorkouts(workouts);
      return newWorkout;
    } catch (error) {
      console.error('Error adding workout:', error);
      throw error;
    }
  },

  // Update a workout
  async updateWorkout(id: string, updates: Partial<Workout>): Promise<void> {
    try {
      const workouts = await this.getWorkouts();
      const index = workouts.findIndex((w) => w.id === id);
      if (index === -1) throw new Error('Workout not found');
      
      workouts[index] = {
        ...workouts[index],
        ...updates,
        updatedAt: new Date(),
      };
      await this.saveWorkouts(workouts);
    } catch (error) {
      console.error('Error updating workout:', error);
      throw error;
    }
  },

  // Delete a workout
  async deleteWorkout(id: string): Promise<void> {
    try {
      const workouts = await this.getWorkouts();
      const filtered = workouts.filter((w) => w.id !== id);
      await this.saveWorkouts(filtered);
    } catch (error) {
      console.error('Error deleting workout:', error);
      throw error;
    }
  },

  // Initialize with mock data (for first time users)
  async initializeWithMockData(mockWorkouts: Workout[]): Promise<void> {
    try {
      const existing = await this.getWorkouts();
      if (existing.length === 0) {
        await this.saveWorkouts(mockWorkouts);
      }
    } catch (error) {
      console.error('Error initializing mock data:', error);
    }
  },
};