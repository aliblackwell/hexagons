import { createTheme } from '@mui/material/styles';
import { red, purple, pink, cyan, teal, grey, deepPurple } from '@mui/material/colors';

// Create a theme instance.
const theme = createTheme({
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    secondaryFamily: ['Bree Serif'].join(','),
    // Overwrite too-big Material UI defaults
    // https://material-ui.com/customization/typography/
    h1: {
      fontSize: '3rem',
      fontWeight: 400,
      letterSpacing: '0em',
      lineHeight: 1.167,
    },
    h2: {
      fontSize: '2.125rem',
      fontWeight: 400,
      letterSpacing: '0.00735em',
      lineHeight: 1.235,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 400,
      letterSpacing: '0em',
      lineHeight: 1.334,
    },
    h4: {
      fontSize: '1.25rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
      lineHeight: 1.6,
    },
    h5: {
      fontSize: '1rem',
      fontWeight: 500,
      letterSpacing: '0.0075em',
      lineHeight: 1.6,
    },
    h6: {
      fontSize: '0.9rem',
      fontWeight: 500,
      letterSpacing: '0.0095em',
      lineHeight: 1.8,
    },
  },
  palette: {
    primary: {
      main: cyan['500'],
    },
    secondary: {
      main: purple['A200'],
    },
    error: {
      main: red.A400,
    },
    background: {
      default: grey['50'],
    },
    text: {
      secondary: 'rgb(85, 85, 85)',
    },
  },
});

export default theme;
