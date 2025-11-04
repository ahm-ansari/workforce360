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
import LogoutIcon from '@mui/icons-material/Logout';
import Link from 'next/link';

const drawerWidth = 282;

export default function DashboardLayout({ children }) {
  const pathname = usePathname(); // Get the current URL path
  const router = useRouter();
  const [user, setUser] = useState(null);

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
          <Toolbar><Typography variant="h4" component="h1" gutterBottom>
            Welcome, {user?.username || "User"}!
          </Typography></Toolbar>
          <Typography variant="h6" noWrap component="div">
            Security Agency Management
          </Typography>
          <Button onClick={handleLogout} variant="contained" color="primary">
            Logout
          </Button>
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