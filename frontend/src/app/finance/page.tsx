'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Paper,
    Divider,
    Stack,
    Chip,
    Avatar
} from '@mui/material';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import api from '@/lib/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie
} from 'recharts';

const COLORS = ['#4caf50', '#2196f3', '#ff9800', '#f44336', '#9c27b0'];

export default function FinanceDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState<any>(null);
    const [recentTx, setRecentTx] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, txRes] = await Promise.all([
                    api.get('finance/payrolls/stats/'),
                    api.get('finance/transactions/')
                ]);
                setStats(statsRes.data);
                setRecentTx(txRes.data?.slice(0, 5) || []);
            } catch (err) {
                console.error('Finance dashboard fetch error', err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !stats) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const cards = [
        { title: 'Total Payroll', value: `$${stats.total_payroll.toLocaleString()}`, icon: <AttachMoneyIcon />, color: '#1976d2' },
        { title: 'Pending Reimbursements', value: `$${stats.reimbursements.pending.toLocaleString()}`, icon: <ReceiptLongIcon />, color: '#ed6c02' },
        { title: 'Total Revenue', value: `$${stats.cash_flow.income.toLocaleString()}`, icon: <TrendingUpIcon />, color: '#2e7d32' },
        { title: 'Cash Balance', value: `$${stats.cash_flow.balance.toLocaleString()}`, icon: <AccountBalanceWalletIcon />, color: '#9c27b0' },
    ];

    const cashFlowData = [
        { name: 'Income', amount: stats.cash_flow.income },
        { name: 'Expense', amount: stats.cash_flow.expense },
    ];

    const payrollBreakdown = stats.status_breakdown.map((s: any) => ({
        name: s.status,
        value: s.count
    }));

    return (
        <Box sx={{ p: 4, bgcolor: '#f0f2f5', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary" sx={{ mb: 4 }}>
                Financial Intelligence
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {cards.map((c, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.05)',
                            transition: 'transform 0.3s',
                            '&:hover': { transform: 'scale(1.02)' }
                        }}>
                            <CardContent>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: `${c.color}15`, color: c.color, width: 60, height: 60 }}>
                                        {c.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {c.value}
                                        </Typography>
                                        <Typography color="text.secondary" variant="body2">{c.title}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Cash Flow Analysis (Historical)
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ height: 350 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={cashFlowData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="amount" fill="#4caf50" radius={[8, 8, 0, 0]} barSize={80}>
                                        {cashFlowData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={index === 1 ? '#f44336' : '#4caf50'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, mt: 3, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Recent Transactions
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={2}>
                            {recentTx.map((tx) => (
                                <Box key={tx.id} sx={{ p: 2, bgcolor: '#fafafa', borderRadius: '12px' }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography fontWeight="bold">{tx.description}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(tx.date).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Typography color={tx.type === 'INCOME' ? 'success.main' : 'error.main'} fontWeight="bold">
                                            {tx.type === 'INCOME' ? '+' : '-'}${tx.amount.toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', mb: 3 }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Payroll Status Breakdown
                        </Typography>
                        <Divider sx={{ mb: 1 }} />
                        <Box sx={{ height: 250 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={payrollBreakdown}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {payrollBreakdown.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3, borderRadius: '16px', background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)', color: 'white' }}>
                        <Typography variant="h6" gutterBottom fontWeight="600">
                            Reimbursement Overview
                        </Typography>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>PENDING APPROVAL</Typography>
                                <Typography variant="h5" fontWeight="bold">${stats.reimbursements.pending.toLocaleString()}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" sx={{ opacity: 0.8 }}>TOTAL PAID (YTD)</Typography>
                                <Typography variant="h5" fontWeight="bold">${stats.reimbursements.approved.toLocaleString()}</Typography>
                            </Box>
                            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="body2">Audit Coverage</Typography>
                                <Chip label="Healthy" size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }} />
                            </Box>
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
