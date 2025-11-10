import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#9c27b0' },
    background: { default: '#f4f6f8', paper: '#ffffff' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h6: { fontWeight: 600 },
  },
  components: {
    MuiAppBar: { styleOverrides: { root: { boxShadow: 'none' } } },
  },
});

export default theme;
