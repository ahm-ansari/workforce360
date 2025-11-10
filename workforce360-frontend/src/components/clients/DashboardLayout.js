// components/DashboardLayout.js
import * as React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, IconButton, List, ListItem, ListItemText } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Link from 'next/link';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box>
      <Toolbar />
      <List display="flex" flexDirection="row">
        <ListItem button component={Link} href="/clients">
          <ListItemText primary="Dashboard" />
        </ListItem>
        <ListItem button component={Link} href="/clients/staff">
          <ListItemText primary="My Staff" />
        </ListItem>
        <ListItem button component={Link} href="/clients/invoices">
          <ListItemText primary="Invoices" />
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', top: 64 }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { sm: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Company Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box component="div" sx={{ flexShrink: { sm: 0 } }}>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{ display: { xs: 'block', sm: 'none' }, '& .MuiDrawer-paper': { boxSizing: 'border-box' } }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{ display: { xs: 'none', sm: 'block' }, '& .MuiDrawer-paper': { boxSizing: 'border-box' } }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3}}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
