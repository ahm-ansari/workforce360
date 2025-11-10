// components/DashboardLayout.js
import * as React from 'react';
import { Box, Toolbar, BottomNavigation, BottomNavigationAction} from '@mui/material';
import Link from 'next/link';
import { DashboardCustomizeOutlined, InsertInvitation, PeopleAlt } from '@mui/icons-material';


export default function TabLayout({ children }) {
  
  const [value, setValue] = React.useState(0);

  return (
    <Box sx={{ display: 'flex', width: '100%'
     }}>      
      <Toolbar />
      <BottomNavigation 
        sx={{ position: 'fixed', right: 0 }}
        orientation="horizontal"
        defaultValue={0}
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Dashboard" icon={<DashboardCustomizeOutlined />} component={Link} href="/clients" />
        <BottomNavigationAction label="My Staff" icon={<PeopleAlt />} component={Link} href="/clients/staff" />
        <BottomNavigationAction label="Invoices" icon={<InsertInvitation />} component={Link} href="/clients/invoices"/>
      </BottomNavigation>
    </Box>
  );
}
