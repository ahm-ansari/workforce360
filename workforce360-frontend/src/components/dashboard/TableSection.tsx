// /components/TableSection.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { DataGrid } from '@mui/x-data-grid';


const rows = Array.from({ length: 25 }).map((_, i) => ({
    id: i + 1,
    name: `Employee ${i + 1}`,
    department: ['Engineering', 'Sales', 'Design', 'HR', 'QA'][i % 5],
    tenure: `${Math.floor(Math.random() * 8) + 1} yrs`,
    location: ['Doha', 'Remote', 'Riyadh', 'Dubai'][i % 4],
}));


const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'department', headerName: 'Department', width: 160 },
    { field: 'tenure', headerName: 'Tenure', width: 120 },
    { field: 'location', headerName: 'Location', width: 140 },
];


export default function TableSection() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>Employee Directory</Typography>
                <div style={{ height: 480, width: '100%' }}>
                    <DataGrid rows={rows} columns={columns} pageSize={10} rowsPerPageOptions={[5, 10, 20]} />
                </div>
            </CardContent>
        </Card>
    );
}