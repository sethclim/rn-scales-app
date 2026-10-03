import { createContext } from 'react';

export type ThemeContextType = {
  primary: any;
  secondary: any;
  background : string | null;
  secondaryBackground : string | null;
  chart : string[];
  chartBackground : string;
  requestTheme: (theme : string) => void;
  mode : string;
};

const defaultThemeContext : ThemeContextType = {
  primary: null,
  secondary: null,
  background : null,
  secondaryBackground : null,
  chart : [],
  chartBackground : '#00000055',
  requestTheme: () => {},
  mode : 'light'
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
