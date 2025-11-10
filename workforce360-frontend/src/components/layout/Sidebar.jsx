import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box, Drawer, Toolbar } from "@mui/material";
import {
  Apps, People, Business, Assignment, ReceiptLong, AccountBalanceWallet,
  Payments, Description, Inventory2, ManageAccounts, Assessment, Build, Settings
} from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import LogoutIcon from '@mui/icons-material/Logout';


import { usePathname } from 'next/navigation'; // Import to track active page


const drawerWidth = 240;

const menuItems = [
  { text: "Applications", icon: <Apps />, path: "/jobs" },
  { text: "Employees", icon: <People />, path: "/employees" },
  { text: "Clients", icon: <Business />, path: "/clients" },
  { text: "Projects", icon: <Assignment />, path: "/projects" },
  { text: "Transactions", icon: <ReceiptLong />, path: "/transactions" },
  { text: "Accounts", icon: <AccountBalanceWallet />, path: "/accounts" },
  { text: "Payrolls", icon: <Payments />, path: "/payrolls" },
  { text: "Bills and Invoices", icon: <Description />, path: "/invoices" },
  { text: "Inventory List", icon: <Inventory2 />, path: "/inventory" },
  { text: "Executives", icon: <ManageAccounts />, path: "/executives" },
  { text: "Reports", icon: <Assessment />, path: "/reports" },
  { text: "Utilities", icon: <Build />, path: "/utilities" },
  { text: "Settings", icon: <Settings />, path: "/settings" },
];


// --- NEW: Stylish Nav Item Styles ---
const S_NAV_ITEM = {
  margin: '4px 12px', // Add horizontal margin
  padding: '8px 16px',
  borderRadius: '8px', // Make it rounded 
  textDecoration: 'none', 
  '&.Mui-selected': {
    // Style for the active item
    backgroundColor: '#e3f2fd', // A light blue background
    color: '#1976d2', // Primary blue text
    '& .MuiListItemIcon-root': {
      color: '#1976d2', // Primary blue icon
    },
    // Remove hover effect for selected item
    '&:hover': {
      backgroundColor: '#e3f2fd',
    },
  },
};

export default function Sidebar() {
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
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#f9f9f9',
        },
      }}
    >
      <Toolbar />
      <List>
        {menuItems.map((item) => (
          <Link key={item.text} href={item.path} passHref style={{ textDecoration: 'none', color: 'inherit' }}>
            <ListItemButton  sx={S_NAV_ITEM} 
                selected={router.pathname === item.path}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </Link>
        ))}
      </List>
      <Divider sx={{ mx: 2 }} />
        <List className="mt-auto">
          <ListItem disablePadding>            
            <ListItemButton sx={S_NAV_ITEM} onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
    </Drawer>
  );
}