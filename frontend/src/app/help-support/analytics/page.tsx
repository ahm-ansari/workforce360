'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    IconButton,
    CircularProgress,
    Alert,
    Paper,
    Divider,
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    BarChart as AnalyticsIcon,
    Timeline as TrendIcon,
    PieChart as PieIcon,
    Speed as SpeedIcon,
    DoneAll as SLACheckIcon,
    Timer as ResponseIcon,
    TaskAlt as ResolutionIcon
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as ChartTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
    PieChart,
    Pie,
    Cell,
    Legend
} from 'recharts';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

const PRIORITY_COLORS: any = {
    'CRITICAL': '#ef4444',
    'HIGH': '#f97316',
    'MEDIUM': '#eab308',
    'LOW': '#3b82f6'
};

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function SupportAnalytics() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const response = await axios.get('support/tickets/analytics/');
                setData(response.data);
            } catch (err) {
                console.error('Error fetching analytics:', err);
                setError('Failed to load performance analytics. Please ensure you have staff permissions.');
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    const formatDuration = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="#1e293b">
                        Support Performance Insights
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive metrics for response efficiency and SLA monitoring.
                    </Typography>
                </Box>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: '#4f46e5', color: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle2" sx={{ opacity: 0.8, fontWeight: 700 }}>SLA COMPLIANCE RATE</Typography>
                                    <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>{data.performance.sla_compliance_rate}%</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}><SLACheckIcon /></Avatar>
                            </Stack>
                            <Box sx={{ mt: 3 }}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={data.performance.sla_compliance_rate} 
                                    sx={{ height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', '& .MuiLinearProgress-bar': { bgcolor: 'white' } }} 
                                />
                                <Typography variant="caption" sx={{ mt: 1, display: 'block', opacity: 0.8 }}>Target: 95.0% for Critical Tickets</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}><ResponseIcon /></Avatar>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>AVG RESPONSE TIME</Typography>
                                    <Typography variant="h4" fontWeight={800}>{formatDuration(data.performance.avg_response_seconds)}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#f0fdf4', color: '#10b981' }}><ResolutionIcon /></Avatar>
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" fontWeight={700}>AVG RESOLUTION TIME</Typography>
                                    <Typography variant="h4" fontWeight={800}>{formatDuration(data.performance.avg_resolution_seconds)}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <TrendIcon color="primary" /> Ticket Volume Trend
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 3 }}>Daily incoming ticket volume for the last 30 days</Typography>
                        <Box sx={{ height: 350, width: '100%' }}>
                            <ResponsiveContainer>
                                <AreaChart data={data.volume_trend}>
                                    <defs>
                                        <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                                    <ChartTooltip 
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area type="monotone" dataKey="count" name="Tickets" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', height: '100%' }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <PieIcon color="error" /> Priority Distribution
                        </Typography>
                        <Box sx={{ height: 300, width: '100%', mt: 2 }}>
                            <ResponsiveContainer>
                                <PieChart>
                                    <Pie
                                        data={data.priority_distribution}
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="count"
                                        nameKey="priority"
                                    >
                                        {data.priority_distribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={PRIORITY_COLORS[entry.priority] || '#cbd5e1'} />
                                        ))}
                                    </Pie>
                                    <ChartTooltip />
                                    <Legend verticalAlign="bottom" height={36}/>
                                </PieChart>
                            </ResponsiveContainer>
                        </Box>
                        <Stack spacing={2} sx={{ mt: 2 }}>
                            {data.priority_distribution.map((item: any) => (
                                <Box key={item.priority} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: PRIORITY_COLORS[item.priority] }} />
                                        <Typography variant="body2" fontWeight={700}>{item.priority}</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary">{item.count} Tickets</Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 3, borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', mt: 3 }}>
                        <Typography variant="h6" fontWeight={800} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <AnalyticsIcon color="secondary" /> Category Wise Ticket Analysis
                        </Typography>
                        <Box sx={{ height: 350, width: '100%', mt: 4 }}>
                            <ResponsiveContainer>
                                <BarChart data={data.category_distribution} layout="vertical" margin={{ left: 40, right: 40 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                                    <XAxis type="number" hide />
                                    <YAxis 
                                        dataKey="category__name" 
                                        type="category" 
                                        width={150} 
                                        axisLine={false} 
                                        tickLine={false} 
                                        tick={{ fontSize: 12, fill: '#1e293b', fontWeight: 600 }} 
                                    />
                                    <ChartTooltip 
                                        cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                                    />
                                    <Bar dataKey="count" name="Tickets" radius={[0, 8, 8, 0]} barSize={32}>
                                        {data.category_distribution.map((entry: any, index: number) => (
                                            <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
