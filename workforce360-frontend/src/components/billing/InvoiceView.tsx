// /components/billing/InvoiceView.tsx
import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';


export default function InvoiceView({invoice}) {
    // invoice: { id, customer, date, dueDate, amount, status }
    const inv = invoice || { id: '—', customer: '—', date: '—', dueDate: '—', amount: '—', status: '—' };


    return (
        <Box sx={{ p: 4, width: 800 }}>
            <Typography variant="h4" gutterBottom>Invoice #{inv.id}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Box>
                    <Typography variant="subtitle2">Bill To</Typography>
                    <Typography>{inv.customer}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                    <Typography>Date: {inv.date}</Typography>
                    <Typography>Due: {inv.dueDate}</Typography>
                    <Typography>Status: {inv.status}</Typography>
                </Box>
            </Box>
            <Box sx={{ mt: 2 }}>
                <Typography variant="h6">Amount Due</Typography>
                <Typography variant="h5">{inv.amount}</Typography>
            </Box>
            <Box sx={{ mt: 6 }}>
                <Typography variant="body2">Thank you for your business.</Typography>
            </Box>
        </Box>
    );
}