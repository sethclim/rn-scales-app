// import {extendTheme, NativeBaseProvider} from 'native-base';

// import Checkbox from './components/CheckBoxStyle';

// const CustomTheme = extendTheme({
//   components: {
//     Checkbox,
//     Button: {
//       defaultProps: {
//         bg: 'nord.primary.1',
//         _pressed: {
//           bg: 'nord.primary.2',
//         },
//       },
//     },
//   },
//   colors: {
//     nord: {
//       primary: {
//         1: '#5E81AC',
//         2: '#79A5DB',
//       },
//       background: '#ECEFF4',
//       secondaryBackground: '#E5E9F0',
//       danger: '#BF616A',
//     },
//   },
//   config: {
//     // Changing initialColorMode to 'dark'
//     initialColorMode: 'dark',
//   },
// });

// // 2. Get the type of the CustomTheme
// type CustomThemeType = typeof CustomTheme;

// // 3. Extend the internal NativeBase Theme
// declare module 'native-base' {
//   interface ICustomTheme extends CustomThemeType {}
// }

export const lighttheme = {
  primary: '#5E81AC',
  secondary: '#6B8F71',
  background: 'white',
  secondaryBackground: '#E5E9F0',
};

export const toyoNightsTheme = {
  primary: '#ff9e64',
  secondary: '#2ac3de',
  background: '#1a1b26',
  secondaryBackground: '#414868',
};
