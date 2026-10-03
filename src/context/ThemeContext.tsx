import { createContext } from 'react';

export type ThemeContextType = {
  primary: any;
  secondary: any;
  background : string | null;
  secondaryBackground : string | null;
  chart : string[];
  chartBackground : string;
  toggle : { gradient: string[], activeText: string, text: string };
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
  toggle : { gradient: ['#31CBD1', '#61E0A1'], activeText: 'black', text: 'white' },
  requestTheme: () => {},
  mode : 'light'
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
