// src/app/ThemeRegistry.tsx
'use client';

import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Define your Material Design light theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f9fafb', // A softer, lighter grey
      paper: '#ffffff',
    },
  },
  // --- NEW: Add a global border radius ---
  shape: {
    borderRadius: 12, // More rounded corners
  },
  // --- NEW: Override component defaults ---
  components: {
    MuiPaper: {
      defaultProps: {
        elevation: 0, // Disable all shadows by default
      },
      styleOverrides: {
        root: {
          // Use a border instead of shadow
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          border: '1px solid #e0e0e0',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'inherit', // Make it white
      },
      styleOverrides: {
        root: {
          // Add a clean bottom border
          borderBottom: '1px solid #e0e0e0',
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          // Use a border instead of a shadow
          borderRight: '1px solid #e0e0e0',
        },
      },
    },
  },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
  );
}