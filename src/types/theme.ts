export interface Theme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  backgroundElevated: string;
  card: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  border: string;
  separator: string;
  inputBackground: string;
  error: string;
  success: string;
  warning: string;
  tabBarBackground: string;
  tabBarBorder: string;
}

export interface ColorSetting {
  key: keyof Theme;
  label: string;
  category: 'Primary' | 'Background' | 'Text' | 'UI' | 'Status' | 'TabBar';
}

export const colorSettings: ColorSetting[] = [
  // Primary colors
  { key: 'primary', label: 'Primary', category: 'Primary' },
  { key: 'secondary', label: 'Secondary', category: 'Primary' },
  { key: 'accent', label: 'Accent', category: 'Primary' },
  
  // Backgrounds
  { key: 'background', label: 'Background', category: 'Background' },
  { key: 'backgroundElevated', label: 'Elevated Background', category: 'Background' },
  { key: 'card', label: 'Card', category: 'Background' },
  { key: 'inputBackground', label: 'Input Background', category: 'Background' },
  
  // Text
  { key: 'text', label: 'Primary Text', category: 'Text' },
  { key: 'textSecondary', label: 'Secondary Text', category: 'Text' },
  { key: 'textTertiary', label: 'Tertiary Text', category: 'Text' },
  
  // UI Elements
  { key: 'border', label: 'Border', category: 'UI' },
  { key: 'separator', label: 'Separator', category: 'UI' },
  
  // Status
  { key: 'error', label: 'Error', category: 'Status' },
  { key: 'success', label: 'Success', category: 'Status' },
  { key: 'warning', label: 'Warning', category: 'Status' },
  
  // Tab Bar
  { key: 'tabBarBackground', label: 'Tab Bar Background', category: 'TabBar' },
  { key: 'tabBarBorder', label: 'Tab Bar Border', category: 'TabBar' },
];