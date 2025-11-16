import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#f50057' },
    background: { default: '#f5f6fa', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 56,
      '@media (min-width: 600px)': { minHeight: 64 },
    },
  },
  spacing: 8,
  transitions: {
    easing: { easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)', easeOut: 'cubic-bezier(0.0, 0, 0.2, 1)', easeIn: 'cubic-bezier(0.4, 0, 1, 1)' },
    duration: { shorter: 150, short: 200, standard: 250, complex: 300 },
  },

});

export default theme;
