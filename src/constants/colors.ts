export interface ThemeColors {
  background: string;
  backgroundElevated: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  primary: string;
  secondary: string;
  accent: string;
  border: string;
  separator: string;
  error: string;
  success: string;
  warning: string;
  tabBarBackground: string;
  tabBarBorder: string;
}

export interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  isCustom: boolean;
}

// Grayscale (Default)
export const GrayscaleTheme: Theme = {
  id: 'grayscale',
  name: 'Grayscale',
  isCustom: false,
  colors: {
    background: '#0A0A0A',
    backgroundElevated: '#141414',
    card: '#1A1A1A',
    text: '#FFFFFF',
    textSecondary: '#A0A0A0',
    textTertiary: '#6B6B6B',
    primary: '#FFFFFF',
    secondary: '#D4D4D4',
    accent: '#B8B8B8',
    border: '#2A2A2A',
    separator: '#2A2A2A',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    tabBarBackground: '#0A0A0A',
    tabBarBorder: '#2A2A2A',
  },
};

// Blue Theme
export const BlueTheme: Theme = {
  id: 'blue',
  name: 'Ocean Blue',
  isCustom: false,
  colors: {
    background: '#0F172A',
    backgroundElevated: '#1E293B',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',
    primary: '#3B82F6',
    secondary: '#60A5FA',
    accent: '#93C5FD',
    border: '#334155',
    separator: '#334155',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    tabBarBackground: '#0F172A',
    tabBarBorder: '#334155',
  },
};

// Green Theme
export const GreenTheme: Theme = {
  id: 'green',
  name: 'Forest Green',
  isCustom: false,
  colors: {
    background: '#052E16',
    backgroundElevated: '#14532D',
    card: '#14532D',
    text: '#F0FDF4',
    textSecondary: '#86EFAC',
    textTertiary: '#4ADE80',
    primary: '#22C55E',
    secondary: '#4ADE80',
    accent: '#86EFAC',
    border: '#166534',
    separator: '#166534',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    tabBarBackground: '#052E16',
    tabBarBorder: '#166534',
  },
};

// Purple Theme
export const PurpleTheme: Theme = {
  id: 'purple',
  name: 'Royal Purple',
  isCustom: false,
  colors: {
    background: '#1E1B4B',
    backgroundElevated: '#2E1065',
    card: '#2E1065',
    text: '#EDE9FE',
    textSecondary: '#C4B5FD',
    textTertiary: '#A78BFA',
    primary: '#8B5CF6',
    secondary: '#A78BFA',
    accent: '#C4B5FD',
    border: '#4C1D95',
    separator: '#4C1D95',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    tabBarBackground: '#1E1B4B',
    tabBarBorder: '#4C1D95',
  },
};

// Red Theme
export const RedTheme: Theme = {
  id: 'red',
  name: 'Crimson Red',
  isCustom: false,
  colors: {
    background: '#450A0A',
    backgroundElevated: '#7F1D1D',
    card: '#7F1D1D',
    text: '#FEF2F2',
    textSecondary: '#FCA5A5',
    textTertiary: '#F87171',
    primary: '#EF4444',
    secondary: '#F87171',
    accent: '#FCA5A5',
    border: '#991B1B',
    separator: '#991B1B',
    error: '#EF4444',
    success: '#10B981',
    warning: '#F59E0B',
    tabBarBackground: '#450A0A',
    tabBarBorder: '#991B1B',
  },
};

export const DefaultThemes: Theme[] = [
  GrayscaleTheme,
  BlueTheme,
  GreenTheme,
  PurpleTheme,
  RedTheme,
];

// Export Colors from active theme (default to Grayscale)
export const Colors = { ...GrayscaleTheme.colors };

// Function to update active colors
export const setActiveColors = (colors: ThemeColors) => {
  Object.keys(colors).forEach((key) => {
    (Colors as any)[key] = (colors as any)[key];
  });
};