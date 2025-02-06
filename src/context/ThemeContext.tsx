import { createContext } from 'react';

export type ThemeContextType = {
  primary: any;
  secondary: any;
  background : string | null;
  toggleTheme: () => void;
};

const defaultThemeContext : ThemeContextType = {
  primary: null,
  secondary: null,
  background : null,
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
