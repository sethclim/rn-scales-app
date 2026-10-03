import React, { useState, type PropsWithChildren } from 'react';
import { ThemeContext } from './ThemeContext';
import { toyoNightsTheme, lighttheme, rosePineTheme, catppuccinLatteTheme, catppuccinMochaTheme } from '../../theme/';

export const ThemeProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [theme, setTheme] = useState(lighttheme);
  const [mode, setMode] = useState('light');

  const requestTheme = (nextTheme : string) => {
    console.log('toogle called ' + theme);
    setMode(nextTheme);

    if (nextTheme == 'light')
      setTheme(lighttheme);
    else if (nextTheme == 'tokyo')
      setTheme(toyoNightsTheme);
    else if (nextTheme == 'rosepine')
      setTheme(rosePineTheme);
    else if (nextTheme == 'latte')
      setTheme(catppuccinLatteTheme);
    else if (nextTheme == 'mocha')
      setTheme(catppuccinMochaTheme);
  };

  return (
    <ThemeContext.Provider value={{ ...theme, requestTheme, mode }}>
      {children}
    </ThemeContext.Provider>
  );
};
