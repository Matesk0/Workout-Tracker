import AsyncStorage from '@react-native-async-storage/async-storage';
import { LibraryExercise } from '../types';
import { defaultExercises } from '../data/exerciseLibrary';

const LIBRARY_KEY = '@exercise_library';

export const exerciseLibraryStorage = {
  // Get all exercises (default + custom)
  async getExercises(): Promise<LibraryExercise[]> {
    try {
      const data = await AsyncStorage.getItem(LIBRARY_KEY);
      if (!data) {
        // First time: save default exercises
        await this.saveExercises(defaultExercises);
        return defaultExercises;
      }
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading exercise library:', error);
      return defaultExercises;
    }
  },

  // Save all exercises
  async saveExercises(exercises: LibraryExercise[]): Promise<void> {
    try {
      await AsyncStorage.setItem(LIBRARY_KEY, JSON.stringify(exercises));
    } catch (error) {
      console.error('Error saving exercise library:', error);
      throw error;
    }
  },

  // Add custom exercise
  async addCustomExercise(
    exercise: Omit<LibraryExercise, 'id' | 'isCustom'>
  ): Promise<LibraryExercise> {
    try {
      const exercises = await this.getExercises();
      const newExercise: LibraryExercise = {
        ...exercise,
        id: `custom-${Date.now()}`,
        isCustom: true,
      };
      exercises.push(newExercise);
      await this.saveExercises(exercises);
      return newExercise;
    } catch (error) {
      console.error('Error adding custom exercise:', error);
      throw error;
    }
  },

  // Delete custom exercise
  async deleteExercise(id: string): Promise<void> {
    try {
      const exercises = await this.getExercises();
      const exercise = exercises.find((ex) => ex.id === id);
      
      if (!exercise) {
        throw new Error('Exercise not found');
      }
      
      if (!exercise.isCustom) {
        throw new Error('Cannot delete default exercises');
      }
      
      const filtered = exercises.filter((ex) => ex.id !== id);
      await this.saveExercises(filtered);
    } catch (error) {
      console.error('Error deleting exercise:', error);
      throw error;
    }
  },

  // Search exercises
  async searchExercises(query: string): Promise<LibraryExercise[]> {
    try {
      const exercises = await this.getExercises();
      const lowerQuery = query.toLowerCase();
      return exercises.filter(
        (ex) =>
          ex.name.toLowerCase().includes(lowerQuery) ||
          ex.muscleGroup.toLowerCase().includes(lowerQuery) ||
          ex.equipment?.toLowerCase().includes(lowerQuery)
      );
    } catch (error) {
      console.error('Error searching exercises:', error);
      return [];
    }
  },
};