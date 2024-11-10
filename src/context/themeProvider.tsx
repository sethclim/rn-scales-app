import React, { useState, type PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';
import { darktheme, lighttheme } from '../../theme/';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(lighttheme);
  const [mode, setMode] = useState('light');

  const toggleTheme = () => {
    const nextMOde = mode === 'light';
    console.log('toogle called ' + nextMOde);
    setMode(nextMOde ? 'dark' : 'light');
    setTheme(nextMOde ? darktheme : lighttheme);
  };

  return (
    <ThemeContext.Provider value={{ ...theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
