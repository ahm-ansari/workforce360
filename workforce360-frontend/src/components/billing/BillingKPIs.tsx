// /components/billing/BillingKPIs.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import { CardUX } from '../ui/card';
import { MoneyOffRounded, ReviewsOutlined, Paid, BrowserNotSupported } from '@mui/icons-material';
import { Typography } from '@mui/material';


const KPIS = [
    { title: 'Total Revenue (YTD)', value: '$124,560', icon:'', color:''},
    { title: 'Outstanding', value: '$8,420', icon:'', color:''},
    { title: 'Paid Invoices', value: 213, icon:<Paid/>, color:''},
    { title: 'Overdue Invoices', value: 6, icon:<BrowserNotSupported/>, color:''},
];


export default function BillingKPIs() {
    return (
        <Grid container spacing={2}>
            {KPIS.map((k) => (
                <Grid size={{xs: 12, sm: 6, md: 3}} key={k.title}>
                    <CardUX title={k.title} value={k.value} icon={k.icon} color={k.color} >
                        <Typography>    </Typography>
                    </CardUX>
                </Grid>
            ))}
        </Grid>
    );
}