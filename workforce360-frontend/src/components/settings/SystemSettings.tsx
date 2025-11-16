// /components/settings/SystemSettings.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { settingsMock } from '@/utils/mockSettingsData';
import Box from '@mui/material/Box';


export default function SystemSettings() {
    const [form, setForm] = React.useState(settingsMock.system);
    const handleChange = (key) => (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setForm((f) => ({ ...f, [key]: value }));
    };
    const handleSave = () => alert('System settings saved!');
    const handleReset = () => setForm(settingsMock.system);


    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>System Settings</Typography>
                <TextField label="App Name" fullWidth sx={{ mb: 2 }} value={form.appName} onChange={handleChange('appName')} />
                <TextField label="Timezone" fullWidth sx={{ mb: 2 }} value={form.timezone} onChange={handleChange('timezone')} />
                <TextField label="Language" fullWidth sx={{ mb: 2 }} value={form.language} onChange={handleChange('language')} />
                <TextField label="Date Format" fullWidth sx={{ mb: 2 }} value={form.dateFormat} onChange={handleChange('dateFormat')} />
                <FormControlLabel control={<Switch checked={form.maintenanceMode} onChange={handleChange('maintenanceMode')} />} label="Maintenance Mode" sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" onClick={handleSave}>Save</Button>
                    <Button variant="outlined" onClick={handleReset}>Reset</Button>
                </Box>
            </CardContent>
        </Card>
    );
}