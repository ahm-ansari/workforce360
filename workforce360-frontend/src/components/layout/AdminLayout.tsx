'use client';
import React from 'react';
import { Box, Toolbar, CssBaseline, ThemeProvider } from '@mui/material';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import theme from '@/styles/theme';
import { User } from '@/types/user';

const drawerWidth = 240;

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  user: User;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title, user }) => {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Navbar title={title} user={user} />
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            bgcolor: 'background.default',
            p: 3,
            ml: 0 /*|| `${drawerWidth}px`*/,
            mt: '64px',
          }}
        >
          {children}
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default AdminLayout;
