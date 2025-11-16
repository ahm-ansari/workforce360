import { Typography, Box} from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';
import SystemSettings from '@/components/settings/SystemSettings';
import UserSettings from '@/components/settings/UserSettings';
import NotificationSettings from '@/components/settings/NotificationSettings';

import SettingsLogs from '@/components/settings/SettingsLogs';
import { Grid } from '@mui/material';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { useState } from 'react';
import { SpaceBar } from '@mui/icons-material';


export default function Page() {
  const [tab, setTab] = useState(0);
  const handleChange = (_, newValue) => setTab(newValue);

  return (
    <AdminLayout>
        <Tabs value={tab} onChange={handleChange} sx={{ mb: 4 }} size={{ xs: 12 }}>
          <Tab label="System" />
          <Tab label="Users" />
          <Tab label="Notifications" />
        </Tabs>
        
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            {tab === 0 && <SystemSettings />}
            {tab === 1 && <UserSettings />}
            {tab === 2 && <NotificationSettings />}
          </Grid>
          <Grid size={{xs: 12, md: 8}}>
            <SettingsLogs />
          </Grid>
        </Grid>
    </AdminLayout>
  );
}
