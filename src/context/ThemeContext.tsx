import { createContext } from 'react';

export type ThemeContextType = {
  primary: any;
  secondary: any;
  background : string | null;
  secondaryBackground : string | null;
  toggleTheme: () => void;
  mode : string;
};

const defaultThemeContext : ThemeContextType = {
  primary: null,
  secondary: null,
  background : null,
  secondaryBackground : null,
  toggleTheme: () => {},
  mode : 'light'
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
