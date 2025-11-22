import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutLog } from '../types';

const WORKOUT_LOGS_KEY = '@workout_logs';

export const workoutLogStorage = {
  // Get all workout logs
  async getWorkoutLogs(): Promise<WorkoutLog[]> {
    try {
      const data = await AsyncStorage.getItem(WORKOUT_LOGS_KEY);
      if (!data) return [];
      
      const logs = JSON.parse(data);
      // Convert date strings back to Date objects
      return logs.map((log: any) => ({
        ...log,
        startTime: new Date(log.startTime),
        endTime: new Date(log.endTime),
      }));
    } catch (error) {
      console.error('Error loading workout logs:', error);
      return [];
    }
  },

  // Save all workout logs
  async saveWorkoutLogs(logs: WorkoutLog[]): Promise<void> {
    try {
      await AsyncStorage.setItem(WORKOUT_LOGS_KEY, JSON.stringify(logs));
    } catch (error) {
      console.error('Error saving workout logs:', error);
      throw error;
    }
  },

  // Add a new workout log
  async addWorkoutLog(log: Omit<WorkoutLog, 'id'>): Promise<WorkoutLog> {
    try {
      const logs = await this.getWorkoutLogs();
      const newLog: WorkoutLog = {
        ...log,
        id: Date.now().toString(),
      };
      logs.unshift(newLog); // Add to beginning (most recent first)
      await this.saveWorkoutLogs(logs);
      return newLog;
    } catch (error) {
      console.error('Error adding workout log:', error);
      throw error;
    }
  },

  // Get logs for a specific date range
  async getLogsByDateRange(startDate: Date, endDate: Date): Promise<WorkoutLog[]> {
    try {
      const allLogs = await this.getWorkoutLogs();
      return allLogs.filter(
        (log) => log.startTime >= startDate && log.startTime <= endDate
      );
    } catch (error) {
      console.error('Error getting logs by date range:', error);
      return [];
    }
  },

  // Delete a workout log
  async deleteWorkoutLog(id: string): Promise<void> {
    try {
      const logs = await this.getWorkoutLogs();
      const filtered = logs.filter((log) => log.id !== id);
      await this.saveWorkoutLogs(filtered);
    } catch (error) {
      console.error('Error deleting workout log:', error);
      throw error;
    }
  },
};