// /components/settings/NotificationSettings.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Button from '@mui/material/Button';
import { settingsMock } from '@/utils/mockSettingsData';
import Box from '@mui/material/Box';
import { useState } from 'react';


export default function NotificationSettings() {
    const [form, setForm] = useState(settingsMock.notifications);
    const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));
    const handleSave = () => alert('Notification settings saved!');
    const handleReset = () => setForm(settingsMock.notifications);

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Notification Settings</Typography>
                <FormControlLabel control={<Switch checked={form.email} onChange={handleChange('email')} />} label="Email Notifications" />
                <FormControlLabel control={<Switch checked={form.inApp} onChange={handleChange('inApp')} />} label="In-app Alerts" />
                <FormControlLabel control={<Switch checked={form.sms} onChange={handleChange('sms')} />} label="SMS Notifications" />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                    <Button variant="outlined" onClick={handleReset}>Reset</Button>
                </Box>
            </CardContent>
        </Card>
    );
}