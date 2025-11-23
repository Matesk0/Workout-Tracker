import AsyncStorage from '@react-native-async-storage/async-storage';

export type LucideIconName = 
  | 'ClipboardList'
  | 'Dumbbell'
  | 'Activity'
  | 'User'
  | 'Home'
  | 'TrendingUp'
  | 'BarChart'
  | 'Heart'
  | 'Zap'
  | 'Target'
  | 'Calendar'
  | 'BookOpen';

export interface NavigationIcons {
  workoutLogs: LucideIconName;
  workouts: LucideIconName;
  recovery: LucideIconName;
  profile: LucideIconName;
}

const DEFAULT_ICONS: NavigationIcons = {
  workoutLogs: 'ClipboardList',
  workouts: 'Dumbbell',
  recovery: 'Activity',
  profile: 'User',
};

const ICONS_KEY = '@navigation_icons';

export const navigationIconsStorage = {
  async getIcons(): Promise<NavigationIcons> {
    try {
      const data = await AsyncStorage.getItem(ICONS_KEY);
      return data ? JSON.parse(data) : DEFAULT_ICONS;
    } catch (error) {
      console.error('Error loading navigation icons:', error);
      return DEFAULT_ICONS;
    }
  },

  async saveIcons(icons: NavigationIcons): Promise<void> {
    try {
      await AsyncStorage.setItem(ICONS_KEY, JSON.stringify(icons));
    } catch (error) {
      console.error('Error saving navigation icons:', error);
      throw error;
    }
  },

  async updateIcon(tab: keyof NavigationIcons, icon: LucideIconName): Promise<void> {
    try {
      const icons = await this.getIcons();
      icons[tab] = icon;
      await this.saveIcons(icons);
    } catch (error) {
      console.error('Error updating icon:', error);
      throw error;
    }
  },

  async resetToDefault(): Promise<void> {
    try {
      await AsyncStorage.removeItem(ICONS_KEY);
    } catch (error) {
      console.error('Error resetting icons:', error);
      throw error;
    }
  },
};

export const AvailableIcons: { name: LucideIconName; label: string }[] = [
  { name: 'ClipboardList', label: 'Clipboard' },
  { name: 'Dumbbell', label: 'Dumbbell' },
  { name: 'Activity', label: 'Activity' },
  { name: 'User', label: 'User' },
  { name: 'Home', label: 'Home' },
  { name: 'TrendingUp', label: 'Trending' },
  { name: 'BarChart', label: 'Chart' },
  { name: 'Heart', label: 'Heart' },
  { name: 'Zap', label: 'Zap' },
  { name: 'Target', label: 'Target' },
  { name: 'Calendar', label: 'Calendar' },
  { name: 'BookOpen', label: 'Book' },
];