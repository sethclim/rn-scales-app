import { createContext } from 'react';

export type ThemeContextType = {
  primary: any;
  secondary: any;
  background : string | null;
  secondaryBackground : string | null;
  toggleTheme: () => void;
};

const defaultThemeContext : ThemeContextType = {
  primary: null,
  secondary: null,
  background : null,
  secondaryBackground : null,
  toggleTheme: () => {},
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
