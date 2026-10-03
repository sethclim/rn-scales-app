export const lighttheme = {
  primary: '#5E81AC',
  secondary: '#6B8F71',
  background: 'white',
  secondaryBackground: '#E5E9F0',
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
  primary: '#7aa2f7',
  secondary: '#2ac3de',
  background: '#1a1b26',
  secondaryBackground: '#414868',
  // Tokyo Night accents, one per exercise (scale, octave, arpeggio, solidChord, brokenChord)
  chart: ['#7dcfff', '#9ece6a', '#e0af68', '#f7768e', '#bb9af7'],
  chartBackground: '#00000055',
  toggle: {
    gradient: ['#7aa2f7', '#bb9af7'],
    activeText: '#1a1b26',
    text: '#c0caf5',
  },
};
