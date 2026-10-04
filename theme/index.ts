export const lighttheme = {
  scheme: 'light',
  primary: '#5E81AC',
  onPrimary: 'white',
  secondary: '#6B8F71',
  background: 'white',
  secondaryBackground: '#E5E9F0',
  text: '#2E3440',
  danger: '#BF616A',
  // Nord frost + aurora, one per exercise (scale, octave, arpeggio, solidChord, brokenChord)
  chart: ['#88C0D0', '#A3BE8C', '#EBCB8B', '#D08770', '#B48EAD'],
  // Nord polar night at 80% so the aurora colours keep >= 3.5:1 contrast on the blue page
  chartBackground: '#2E3440CC',
  // Week/Year toggle: frost gradient pill, polar night text on it, snow storm text off it
  toggle: {
    gradient: ['#88C0D0', '#81A1C1'],
    activeText: '#2E3440',
    text: '#ECEFF4',
  },
};

export const toyoNightsTheme = {
  scheme: 'dark',
  primary: '#7aa2f7',
  onPrimary: 'white',
  secondary: '#2ac3de',
  background: '#1a1b26',
  secondaryBackground: '#414868',
  text: '#c0caf5',
  danger: '#f7768e',
  // Tokyo Night accents, one per exercise (scale, octave, arpeggio, solidChord, brokenChord)
  chart: ['#7dcfff', '#9ece6a', '#e0af68', '#f7768e', '#bb9af7'],
  chartBackground: '#00000055',
  toggle: {
    gradient: ['#7aa2f7', '#bb9af7'],
    activeText: '#1a1b26',
    text: '#c0caf5',
  },
};

// Rosé Pine (main variant): https://rosepinetheme.com/palette/
export const rosePineTheme = {
  scheme: 'dark',
  primary: '#ebbcba', // rose
  onPrimary: '#191724', // base
  secondary: '#9ccfd8', // foam
  background: '#191724', // base
  secondaryBackground: '#26233a', // overlay
  text: '#e0def4',
  danger: '#eb6f92', // love
  // One per exercise (scale, octave, arpeggio, solidChord, brokenChord)
  chart: ['#9ccfd8', '#c4a7e7', '#f6c177', '#eb6f92', '#ebbcba'],
  chartBackground: '#00000055',
  toggle: {
    gradient: ['#ebbcba', '#c4a7e7'],
    activeText: '#191724',
    text: '#e0def4',
  },
};

// Catppuccin Latte: https://catppuccin.com/palette/
export const catppuccinLatteTheme = {
  scheme: 'light',
  primary: '#8839ef', // mauve
  onPrimary: '#eff1f5', // base
  secondary: '#179299', // teal
  background: '#eff1f5', // base
  secondaryBackground: '#dce0e8', // crust
  text: '#4c4f69',
  danger: '#d20f39', // red
  // Latte's accents are tuned for light backgrounds, so the dark chart panel borrows Mocha's
  chart: ['#89dceb', '#a6e3a1', '#f9e2af', '#fab387', '#f5c2e7'],
  // Mauve is too loud to fill the whole stats page like Nord's blue does,
  // so the page stays on Latte base and the panel is solid Mocha base
  chartBackground: '#1e1e2e',
  statsBackground: '#eff1f5',
  toggle: {
    gradient: ['#7287fd', '#8839ef'], // lavender -> mauve
    activeText: '#eff1f5',
    text: '#eff1f5',
  },
};

// Catppuccin Mocha: https://catppuccin.com/palette/
export const catppuccinMochaTheme = {
  scheme: 'dark',
  primary: '#cba6f7', // mauve
  onPrimary: '#1e1e2e', // base
  secondary: '#94e2d5', // teal
  background: '#1e1e2e', // base
  secondaryBackground: '#313244', // surface0
  text: '#cdd6f4',
  danger: '#f38ba8', // red
  // One per exercise (scale, octave, arpeggio, solidChord, brokenChord)
  chart: ['#89dceb', '#a6e3a1', '#f9e2af', '#fab387', '#f5c2e7'],
  chartBackground: '#00000055',
  toggle: {
    gradient: ['#89b4fa', '#cba6f7'], // blue -> mauve
    activeText: '#1e1e2e',
    text: '#cdd6f4',
  },
};
