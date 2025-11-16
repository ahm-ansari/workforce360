// /components/KPISection.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {CardUX } from '@/components/ui/card'


const kpis = [
    { title: 'Products', value: 328, change: '+4.2%' },
    { title: 'Active Jobs', value: 12, change: '-1.0%' },
    { title: 'New Hires (30d)', value: 14, change: '+17%' },
    { title: 'Avg Tenure (yrs)', value: 3.6, change: '-0.1%' },
];


export default function KPISection() {
    return (
        <Grid container spacing={2}>
            {kpis.map((k) => (
                <Grid size={{xs: 12, md: 3, lg: 3}} key={k.title}>
                    
                        <CardUX title={k.title} value={k.value} icon={
                            <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {k.change.startsWith('+') ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />}
                                {k.change}
                            </Typography> }>
                        </CardUX>
                </Grid>
            ))}
        </Grid>
    );
}