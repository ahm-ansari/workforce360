'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Stack,
    Button, IconButton, LinearProgress, Chip, Avatar, Divider
} from '@mui/material';
import {
    RequestQuote as QuoteIcon,
    Assignment as WorkOrderIcon,
    ReceiptLong as InvoiceIcon,
    MonetizationOn as MoneyIcon,
    TrendingUp as TrendingIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function SalesOverview() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({
        quotations: 0,
        workOrders: 0,
        totalInvoiced: 0,
        totalPaid: 0,
        pendingReceivables: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            try {
                const [qRes, woRes, iRes] = await Promise.all([
                    axios.get('sales/quotations/'),
                    axios.get('sales/work-orders/'),
                    axios.get('sales/invoices/')
                ]);

                const invoiced = iRes.data.reduce((acc: number, inv: any) => acc + parseFloat(inv.total_amount), 0);
                const paid = iRes.data.reduce((acc: number, inv: any) => acc + parseFloat(inv.amount_paid), 0);

                setStats({
                    quotations: qRes.data.length,
                    workOrders: woRes.data.length,
                    totalInvoiced: invoiced,
                    totalPaid: paid,
                    pendingReceivables: invoiced - paid
                });
            } catch (error) {
                console.error('Error fetching sales stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (!mounted) return null;

    const summaryCards = [
        { title: 'Total Invoiced', value: `$${stats.totalInvoiced.toLocaleString()}`, icon: <InvoiceIcon />, color: '#6366f1' },
        { title: 'Total Collected', value: `$${stats.totalPaid.toLocaleString()}`, icon: <MoneyIcon />, color: '#10b981' },
        { title: 'Outstanding', value: `$${stats.pendingReceivables.toLocaleString()}`, icon: <TrendingIcon />, color: '#f59e0b' },
    ];

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Commercial Dashboard
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track your revenue, proposals, and delivery orders in real-time.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/sales/quotations')}
                        sx={{ borderRadius: 2 }}
                    >
                        New Quotation
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/sales/invoices')}
                        sx={{ borderRadius: 2 }}
                    >
                        New Invoice
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {summaryCards.map((card) => (
                    <Grid size= xs={12} md={4} key={card.title}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${card.color}15`, color: card.color }}>
                                        {card.icon}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" color="text.secondary" fontWeight={600}>
                                            {card.title}
                                        </Typography>
                                        <Typography variant="h5" fontWeight={700}>
                                            {card.value}
                                        </Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size= xs={12} md={8}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Recent Financial Activity</Typography>
                            <Stack spacing={3}>
                                {[
                                    { label: 'Quotations sent this month', value: stats.quotations, color: '#6366f1' },
                                    { label: 'Work Orders in progress', value: stats.workOrders, color: '#10b981' },
                                ].map((item) => (
                                    <Box key={item.label}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{item.label}</Typography>
                                            <Typography variant="body2" fontWeight={700}>{item.value}</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={item.value * 10}
                                            sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: item.color } }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                            <Divider sx={{ my: 4 }} />
                            <Grid container spacing={2}>
                                <Grid size= xs={6}>
                                    <Button
                                        fullWidth
                                        variant="light"
                                        sx={{ borderRadius: 3, py: 2, bgcolor: '#f1f5f9' }}
                                        onClick={() => router.push('/sales/quotations')}
                                    >
                                        View Quotations
                                    </Button>
                                </Grid>
                                <Grid size= xs={6}>
                                    <Button
                                        fullWidth
                                        variant="light"
                                        sx={{ borderRadius: 3, py: 2, bgcolor: '#f1f5f9' }}
                                        onClick={() => router.push('/sales/invoices')}
                                    >
                                        View Invoices
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size= xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, bgcolor: '#1e293b', color: 'white', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Collection Status</Typography>
                            <Box sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight={800} color="#10b981">
                                    {stats.totalInvoiced ? Math.round((stats.totalPaid / stats.totalInvoiced) * 100) : 0}%
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.7 }}>Payment Realization Rate</Typography>
                            </Box>
                            <Stack spacing={2}>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.6 }}>UNCOLLECTED</Typography>
                                    <Typography variant="h6" fontWeight={700}>${stats.pendingReceivables.toLocaleString()}</Typography>
                                </Box>
                                <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                                    <Typography variant="caption" sx={{ opacity: 0.6 }}>NEXT MILESTONE</Typography>
                                    <Typography variant="body2">Follow up on 4 overdue invoices to reach 90% collection target.</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
