// /components/utilities/UtilitiesLogs.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { utilitiesMock } from '../../utils/mockUtilitiesData';


const columns = [
{ field: 'id', headerName: 'ID', width: 80 },
{ field: 'action', headerName: 'Action', width: 200 },
{ field: 'user', headerName: 'User', width: 150 },
{ field: 'status', headerName: 'Status', width: 120 },
{ field: 'date', headerName: 'Date', width: 180 },
];


export default function UtilitiesLogs() {
return (
<Card>
<CardContent>
<Typography variant="h6" gutterBottom>System Logs</Typography>
<div style={{ height: 400, width: '100%' }}>
<DataGrid rows={utilitiesMock.logs} columns={columns} pageSize={10} rowsPerPageOptions={[5,10,20]} />
</div>
</CardContent>
</Card>
);
}