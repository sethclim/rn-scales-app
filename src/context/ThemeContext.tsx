import { createContext } from 'react';

export type ThemeContextType = {
  primary: any;
  secondary: any;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | null>(null);
