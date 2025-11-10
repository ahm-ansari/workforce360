'use client';
import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Menu, MenuItem, Badge } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { HomeWorkRounded as Work} from '@mui/icons-material';
import { User } from '@/types/user';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import  LogoutIcon from '@mui/icons-material/Logout';
import Dashboard from '@mui/icons-material/Dashboard';
import Profile from '@mui/icons-material/Person'
import Account from '@mui/icons-material/AccountCircle';
import api from '@/lib/api';

interface NavbarProps {
  title: string;
  user: User;
}

const Navbar: React.FC<NavbarProps> = ({ title, user }) => {
    const router = useRouter()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handleMenuClose = () => setAnchorEl(null);
  
    const [user_data, setUser] = useState(null);

    function capitalizeFirstLetter(string: string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const handleNavClick = (path: string) => {
        router.push(path);
        // Close the menu after click (you will have a state for the anchor element to close the menu)
        handleMenuClose();
    };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1300, backgroundColor: '#1976d2' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}><Work className="mr-1" />WorkForce360</Typography>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>{title}</Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <Typography variant="body1">Hi, {capitalizeFirstLetter(user?.first_name || "User")}!</Typography>
          <IconButton color="inherit">
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton onClick={handleMenuOpen}>
            <Avatar alt={user?.first_name || "User"}  src={user?.avatarUrl || ''} />
            <ArrowDropDownIcon sx={{ color: 'white' }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleNavClick.bind(this, '/dashboard')}><Dashboard/> Dashboard</MenuItem>
            <MenuItem onClick={handleNavClick.bind(this, '/profile')}><Profile /> Profile</MenuItem>
            <MenuItem onClick={handleNavClick.bind(this, '/settings')}><Account /> Account Settings</MenuItem>
            <MenuItem onClick={handleLogout}><LogoutIcon /> Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
