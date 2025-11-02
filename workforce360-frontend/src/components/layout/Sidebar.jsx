import Link from "next/link";
import { List, ListItem, ListItemIcon, ListItemText, Typography, Box } from "@mui/material";
import {
  Apps, People, Business, Assignment, ReceiptLong, AccountBalanceWallet,
  Payments, Description, Inventory2, ManageAccounts, Assessment, Build, Settings
} from "@mui/icons-material";
import Divider from '@mui/material/Divider';
import ListItemButton from '@mui/material/ListItemButton';
import LogoutIcon from '@mui/icons-material/Logout';
import SecurityIcon from '@mui/icons-material/Security';


import { usePathname } from 'next/navigation'; // Import to track active page

const menuItems = [
  { text: "Applications", icon: <Apps />, path: "/applications" },
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
  return (
    <Box sx={{ width: 280, height: '100vh', bgcolor: 'background.paper', borderRight: '1px solid rgba(0, 0, 0, 0.12)' }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
          <SecurityIcon className="mr-2" />WorkForce360
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
                component={Link}
                href={item.path}
                // --- APPLY NEW STYLES ---
                sx={S_NAV_ITEM}
                selected={pathname === item.path} // Set selected based on path
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
        ))}
      </List>
      
        <Divider sx={{ mx: 2 }} />
        <List className="mt-auto">
          <ListItem disablePadding>
            <ListItemButton sx={S_NAV_ITEM}>
              <ListItemIcon>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
    </Box>
  );
}