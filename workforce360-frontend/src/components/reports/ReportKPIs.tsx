// /components/reports/ReportKPIs.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { reportsMock } from '../../utils/mockReportsData';


export default function ReportKPIs() {
    const k = reportsMock.kpis;
    const KPIS = [
        { title: 'Total Employees', value: k.employees },
        { title: 'Open Jobs', value: k.jobs },
        { title: 'Revenue (YTD)', value: `$${k.revenue.toLocaleString()}` },
        { title: 'Inventory Value', value: `$${k.inventoryValue.toLocaleString()}` },
    ];


    return (
        <Grid container spacing={2}>
            {KPIS.map((p) => (
                <Grid item xs={12} sm={6} md={3} key={p.title}>
                    <Card>
                        <CardContent>
                            <Typography variant="subtitle2" gutterBottom>{p.title}</Typography>
                            <Typography variant="h5">{p.value}</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}