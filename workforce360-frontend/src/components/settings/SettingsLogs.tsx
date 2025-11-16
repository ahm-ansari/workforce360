// /components/settings/SettingsLogs.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { settingsMock } from '@/utils/mockSettingsData';

const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'setting', headerName: 'Setting', width: 180 },
    { field: 'changedBy', headerName: 'Changed By', width: 150 },
    { field: 'date', headerName: 'Date', width: 180 },
];


export default function SettingsLogs() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Settings Change Logs</Typography>
                <div style={{ height: '70vh', width: '100%' }}>
                    <DataGrid rows={settingsMock.logs} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} />
                </div>
            </CardContent>
        </Card>
    );
}