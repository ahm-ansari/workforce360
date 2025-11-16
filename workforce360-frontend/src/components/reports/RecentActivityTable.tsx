// /components/reports/RecentActivityTable.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';
import { reportsMock } from '@/utils/mockReportsData';


const columns = [
    { field: 'id', headerName: 'ID', width: 80 },
    { field: 'type', headerName: 'Type', width: 160 },
    { field: 'description', headerName: 'Description', width: 400 },
    { field: 'user', headerName: 'User', width: 160 },
    { field: 'date', headerName: 'Date', width: 160 },
];


export default function RecentActivityTable() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Recent Activity</Typography>
                <div style={{ height: 420, width: '100%' }}>
                    <DataGrid rows={reportsMock.recentActivities} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} />
                </div>
            </CardContent>
        </Card>
    );
}