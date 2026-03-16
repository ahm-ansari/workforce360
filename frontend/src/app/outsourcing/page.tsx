'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Button,
    CircularProgress,
    Divider
} from '@mui/material';
import {
    Assignment as AssignmentIcon,
    AssignmentInd as AssignmentIndIcon,
    Description as DescriptionIcon,
    EventNote as EventNoteIcon,
    ArrowForward as ArrowForwardIcon,
    Add as AddIcon,
    PersonAdd as PersonAddIcon,
    AttachMoney as MoneyIcon,
    Business as BusinessIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const StatCard = ({ title, value, icon, color, onClick, subtitle }: any) => (
    <Card
        sx={{
            height: '100%',
            cursor: 'pointer',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
                transform: 'translateY(-6px)',
                boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                '& .icon-bg': {
                    transform: 'scale(1.2)'
                }
            }
        }}
        onClick={onClick}
    >
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={700} sx={{ letterSpacing: 1.2 }}>
                        {title}
                    </Typography>
                    <Typography variant="h3" fontWeight={800} sx={{ my: 1, color: 'text.primary' }}>
                        {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value}
                    </Typography>
                    {subtitle && (
                        <Typography variant="caption" color="text.secondary">
                            {subtitle}
                        </Typography>
                    )}
                </Box>
                <Box
                    className="icon-bg"
                    sx={{
                        p: 2,
                        borderRadius: '16px',
                        bgcolor: `${color}.lighter`,
                        color: `${color}.main`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'transform 0.3s'
                    }}
                >
                    {icon}
                </Box>
            </Stack>
        </CardContent>
    </Card>
);

export default function OutsourcingOverview() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('outsourcing/requests/stats/');
                setStats(response.data);
            } catch (err) {
                console.error('Error fetching stats:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress thickness={2} size={60} />
            </Box>
        );
    }

    const statConfig = [
        {
            title: 'Active Placements',
            value: stats?.active_placements || 0,
            icon: <AssignmentIndIcon fontSize="large" />,
            color: 'primary',
            path: '/outsourcing/staff',
            subtitle: 'Ongoing contracts'
        },
        {
            title: 'Open Requests',
            value: stats?.open_requests || 0,
            icon: <AssignmentIcon fontSize="large" />,
            color: 'warning',
            path: '/outsourcing/requests',
            subtitle: 'Pending fulfillment'
        },
        {
            title: 'Active Contracts',
            value: stats?.active_contracts || 0,
            icon: <DescriptionIcon fontSize="large" />,
            color: 'success',
            path: '/outsourcing/contracts',
            subtitle: 'Master agreements'
        },
        {
            title: 'Total Revenue',
            value: stats?.total_revenue || 0,
            icon: <MoneyIcon fontSize="large" />,
            color: 'info',
            path: '/outsourcing/timesheets',
            subtitle: 'From invoiced hours'
        },
    ];

    const chartData = stats?.trends?.map((t: any) => ({
        name: new Date(t.month).toLocaleDateString(undefined, { month: 'short' }),
        requests: t.requests
    })) || [];

    const pieData = stats?.client_breakdown?.map((c: any) => ({
        name: c.client__name,
        value: c.count
    })) || [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default', minHeight: '100vh' }}>
            <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} sx={{ mb: 6 }} spacing={2}>
                <Box>
                    <Typography variant="h3" fontWeight={800} gutterBottom sx={{ background: 'linear-gradient(45deg, #1e3a8a, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Outsourcing Hub
                    </Typography>
                    <Typography variant="h6" color="text.secondary" fontWeight={400}>
                        Performance analytics and workforce management
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => router.push('/outsourcing/staff/new')}
                        sx={{ borderRadius: 3, px: 3, py: 1, borderWidth: 2, '&:hover': { borderWidth: 2 } }}
                    >
                        Assign Staff
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/outsourcing/requests/new')}
                        sx={{ borderRadius: 3, px: 3, py: 1, boxShadow: 6 }}
                    >
                        New Request
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                {statConfig.map((stat) => (
                    <Grid item xs={12} sm={6} md={3} key={stat.title}>
                        <StatCard
                            {...stat}
                            onClick={() => router.push(stat.path)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                {/* Trends Chart */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 3, p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                            Staffing Request Trends
                        </Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af' }} />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="requests"
                                        stroke="#3b82f6"
                                        strokeWidth={4}
                                        dot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
                                        activeDot={{ r: 8 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </Box>
                    </Card>
                </Grid>

                {/* Client Breakdown */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, p: 3, height: '100%' }}>
                        <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>
                            Top Clients by Placements
                        </Typography>
                        <Box sx={{ height: 300, position: 'relative' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                <Typography variant="h5" fontWeight={800}>{stats?.active_placements || 0}</Typography>
                                <Typography variant="caption" color="text.secondary">Active</Typography>
                            </Box>
                        </Box>
                        <Stack spacing={1} sx={{ mt: 2 }}>
                            {pieData.map((client: any, index: number) => (
                                <Stack key={client.name} direction="row" justifyContent="space-between" alignItems="center">
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: COLORS[index % COLORS.length] }} />
                                        <Typography variant="body2">{client.name}</Typography>
                                    </Stack>
                                    <Typography variant="body2" fontWeight={600}>{client.value}</Typography>
                                </Stack>
                            ))}
                        </Stack>
                    </Card>
                </Grid>

                {/* Actionable Sections */}
                <Grid item xs={12}>
                    <Card sx={{ borderRadius: 3, overflow: 'hidden' }}>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Box sx={{ p: 4 }}>
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        Management Quick Access
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                                        Complete pending administrative tasks and review operational status across all clients.
                                    </Typography>
                                    <Grid container spacing={2}>
                                        {[
                                            { icon: <AssignmentIcon />, title: 'Review Requests', path: '/outsourcing/requests' },
                                            { icon: <EventNoteIcon />, title: 'Timesheets', path: '/outsourcing/timesheets' },
                                            { icon: <AssignmentIndIcon />, title: 'Staff Directory', path: '/outsourcing/staff' },
                                            { icon: <DescriptionIcon />, title: 'Contracts', path: '/outsourcing/contracts' },
                                        ].map((item) => (
                                            <Grid item xs={6} key={item.title}>
                                                <Button
                                                    fullWidth
                                                    variant="outlined"
                                                    startIcon={item.icon}
                                                    onClick={() => router.push(item.path)}
                                                    sx={{ justifyContent: 'flex-start', p: 2, borderRadius: 2 }}
                                                >
                                                    {item.title}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            </Grid>
                            <Grid item xs={12} md={6} sx={{ bgcolor: 'primary.main', color: 'primary.contrastText', p: 4, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                <Typography variant="h4" fontWeight={800} gutterBottom>
                                    Grow Your Network
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9, mb: 4 }}>
                                    Fill {stats?.open_requests || 0} open positions to maximize utility and revenue. Our AI-matching engine suggests checking the candidate pool first.
                                </Typography>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        size="large"
                                        onClick={() => router.push('/outsourcing/requests')}
                                        sx={{ borderRadius: 2, fontWeight: 700 }}
                                    >
                                        View All Requests
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
