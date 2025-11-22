import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AppSettings {
  notifications: boolean;
  restTimerSound: boolean;
  autoStartRest: boolean;
  defaultRestTime: number;
  darkMode: boolean;
  hapticFeedback: boolean;
  showCompletedSets: boolean;
  units: 'metric' | 'imperial';
  language: string;
}

const SETTINGS_KEY = '@app_settings';

const defaultSettings: AppSettings = {
  notifications: true,
  restTimerSound: true,
  autoStartRest: true,
  defaultRestTime: 90,
  darkMode: true,
  hapticFeedback: true,
  showCompletedSets: true,
  units: 'metric',
  language: 'en',
};

export const settingsStorage = {
  // Get settings
  async getSettings(): Promise<AppSettings> {
    try {
      const data = await AsyncStorage.getItem(SETTINGS_KEY);
      if (!data) return defaultSettings;
      return { ...defaultSettings, ...JSON.parse(data) };
    } catch (error) {
      console.error('Error loading settings:', error);
      return defaultSettings;
    }
  },

  // Save settings
  async saveSettings(settings: AppSettings): Promise<void> {
    try {
      await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
      throw error;
    }
  },

  // Update single setting
  async updateSetting<K extends keyof AppSettings>(
    key: K,
    value: AppSettings[K]
  ): Promise<void> {
    try {
      const settings = await this.getSettings();
      settings[key] = value;
      await this.saveSettings(settings);
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    }
  },

  // Reset to defaults
  async resetSettings(): Promise<void> {
    try {
      await AsyncStorage.removeItem(SETTINGS_KEY);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  },
};