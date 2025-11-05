import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Roboto } from "next/font/google";
import ThemeRegistry from "@/app/ThemeRegistry";
import { usePathname } from 'next/navigation'; // Import to track active page
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Account from '@mui/icons-material/AccountCircle';
import Dashboard from '@mui/icons-material/Dashboard';
import Profile from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';

import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';


const drawerWidth = 282;

const settings = [
  { name: 'Profile', path: '/profile', icon: Profile, type: 'link' },
  { name: 'Account', path: '/account', icon: Account, type: 'link' },
  { name: 'Dashboard', path: '/dashboard', icon: Dashboard, type: 'link' },
  { name: 'Logout', path: '/', icon: LogoutIcon, type: 'action' },
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Get the current URL path
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);


  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  const handleNavClick = (setting) => {
    if (setting.type === 'action' && setting.name === 'Logout') {
      handleLogout();
    } else if (setting.type === 'link') {
      router.push(setting.path);
    }
    // Close the menu after click (you will have a state for the anchor element to close the menu)
    handleCloseUserMenu();
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  

  return (
    <ThemeRegistry>
      <Box className="flex">
        <AppBar
          position="fixed"
          sx={{
            width: `calc(100% - ${drawerWidth}px)`,
            ml: `${drawerWidth}px`,
            bgcolor: 'background.paper',
            boxShadow: 'none',
          }}
        // --- No props needed! Theme handles it. ---
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 0 }}>
            <Toolbar>
              <Typography variant="h6" component="h4" gutterBottom>
                Welcome, {capitalizeFirstLetter(user?.first_name || "User")}!
              </Typography>
            </Toolbar>
            <Typography variant="h5" component="h1" noWrap>
              Security Agency Management
            </Typography>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="User Name" src="/static/images/avatar/2.jpg" />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => handleNavClick(setting)}
                  // Use component prop with Link for actual navigation
                  > <Link
                    href={setting.path}
                    passHref
                    // Prevents default anchor styling from showing
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >

                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {setting.icon && <setting.icon sx={{ mr: 1 }} />} {setting.name}
                      </Box>
                    </Link>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Box>

        </AppBar>
        <Drawer
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              boxSizing: 'border-box',
            },
          }}
          variant="permanent"
          anchor="left"
        >
          {/* Make divider cleaner */}
          <Divider sx={{ mx: 2 }} />
          <Sidebar />
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, bgcolor: 'background.default' }}>
          <Toolbar /> {/* Spacer */}
          {children}
        </Box>
      </Box>
    </ThemeRegistry>
  );
}