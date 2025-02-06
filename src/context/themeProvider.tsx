import React, { useState, type PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';
import { toyoNightsTheme, lighttheme } from '../../theme/';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(lighttheme);
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    const nextMOde = mode === 'light';
    console.log('toogle called ' + mode);
    setMode(nextMOde ? 'dark' : 'light');
    setTheme(nextMOde ? toyoNightsTheme : lighttheme);
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};
