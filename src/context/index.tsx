import { useContext } from 'react';
import { ThemeContext } from './ThemeContext';
import { ThemeProvider } from './themeProvider';

export { ThemeProvider };
export const useTheme = () => useContext(ThemeContext);
