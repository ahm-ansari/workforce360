// /components/utilities/UtilitiesKPIs.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { utilitiesMock } from '@/utils/mockUtilitiesData'

export default function UtilitiesKPIs() {
    const KPIS = [
        { title: 'Active Users', value: utilitiesMock.kpis.activeUsers },
        { title: 'Pending Tasks', value: utilitiesMock.kpis.pendingTasks },
        { title: 'Storage Used', value: `${utilitiesMock.kpis.storageUsed} GB` },
        { title: 'System Alerts', value: utilitiesMock.kpis.alerts },
    ];


    return (
        <Grid container spacing={2}>
            {KPIS.map((p) => (
                <Grid size={{ xs: 12, sm: 6, md: 3 }} key={p.title}>
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