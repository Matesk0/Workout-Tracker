import AsyncStorage from '@react-native-async-storage/async-storage';
import { Theme, DefaultThemes, GrayscaleTheme } from '../constants/colors';

const THEME_KEY = '@active_theme';
const CUSTOM_THEMES_KEY = '@custom_themes';

export const themeStorage = {
  // Get active theme
  async getActiveTheme(): Promise<Theme> {
    try {
      const data = await AsyncStorage.getItem(THEME_KEY);
      if (!data) return GrayscaleTheme;
      return JSON.parse(data);
    } catch (error) {
      console.error('Error loading theme:', error);
      return GrayscaleTheme;
    }
  },

  // Set active theme
  async setActiveTheme(theme: Theme): Promise<void> {
    try {
      await AsyncStorage.setItem(THEME_KEY, JSON.stringify(theme));
    } catch (error) {
      console.error('Error saving theme:', error);
      throw error;
    }
  },

  // Get all themes (default + custom)
  async getAllThemes(): Promise<Theme[]> {
    try {
      const customData = await AsyncStorage.getItem(CUSTOM_THEMES_KEY);
      const customThemes = customData ? JSON.parse(customData) : [];
      return [...DefaultThemes, ...customThemes];
    } catch (error) {
      console.error('Error loading themes:', error);
      return DefaultThemes;
    }
  },

  // Save custom theme
  async saveCustomTheme(theme: Omit<Theme, 'id' | 'isCustom'>): Promise<Theme> {
    try {
      const customThemes = await this.getCustomThemes();
      const newTheme: Theme = {
        ...theme,
        id: `custom-${Date.now()}`,
        isCustom: true,
      };
      customThemes.push(newTheme);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(customThemes));
      return newTheme;
    } catch (error) {
      console.error('Error saving custom theme:', error);
      throw error;
    }
  },

  // Get custom themes only
  async getCustomThemes(): Promise<Theme[]> {
    try {
      const data = await AsyncStorage.getItem(CUSTOM_THEMES_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading custom themes:', error);
      return [];
    }
  },

  // Delete custom theme
  async deleteCustomTheme(id: string): Promise<void> {
    try {
      const customThemes = await this.getCustomThemes();
      const filtered = customThemes.filter(t => t.id !== id);
      await AsyncStorage.setItem(CUSTOM_THEMES_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Error deleting theme:', error);
      throw error;
    }
  },
};