import { createContext } from 'react';

export type ThemeContextType = {
  scheme : string;
  primary: any;
  // Text/icon colour that reads on top of primary
  onPrimary: string;
  secondary: any;
  background : string | null;
  secondaryBackground : string | null;
  text : string;
  danger : string;
  chart : string[];
  // Solid fill for the whole stats page, graph and legend
  chartBackground : string;
  // track: fill behind the Week/Year pill, a step off chartBackground
  toggle : { gradient: string[], activeText: string, text: string, track: string };
  requestTheme: (theme : string) => void;
  mode : string;
};

const defaultThemeContext : ThemeContextType = {
  scheme : 'light',
  primary: null,
  onPrimary: 'white',
  secondary: null,
  background : null,
  secondaryBackground : null,
  text : '#2E3440',
  danger : '#BF616A',
  chart : [],
  chartBackground : '#2E3440',
  toggle : { gradient: ['#31CBD1', '#61E0A1'], activeText: 'black', text: 'white', track: '#3B4252' },
  requestTheme: () => {},
  mode : 'light'
}

export const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);
