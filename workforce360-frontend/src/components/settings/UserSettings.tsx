// /components/settings/UserSettings.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { settingsMock } from '@/utils/mockSettingsData';
import Box from '@mui/material/Box';


export default function UserSettings() {
const [form, setForm] = React.useState(settingsMock.users);
const handleChange = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.checked }));
const handleSave = () => alert('User settings saved!');
const handleReset = () => setForm(settingsMock.users);


return (
<Card>
<CardContent>
<Typography variant="h6" gutterBottom>User Settings</Typography>
<FormControlLabel control={<Switch checked={form.defaultRoles} onChange={handleChange('defaultRoles')} />} label="Default Roles Enabled" />
<FormControlLabel control={<Switch checked={form.passwordPolicy} onChange={handleChange('passwordPolicy')} />} label="Password Policy Enforced" />
<FormControlLabel control={<Switch checked={form.accessControl} onChange={handleChange('accessControl')} />} label="Access Control Enabled" />
<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
<Button variant="contained" onClick={handleSave}>Save</Button>
<Button variant="outlined" onClick={handleReset}>Reset</Button>
</Box>
</CardContent>
</Card>
);
}