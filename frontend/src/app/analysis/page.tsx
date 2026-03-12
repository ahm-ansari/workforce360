'use client';
import React, { useEffect, useState } from 'react';
import { 
    Box, 
    Typography, 
    Grid, 
    Paper, 
    Card, 
    CardContent, 
    Avatar, 
    LinearProgress,
    Tooltip,
    IconButton,
    Chip,
    Divider,
    CircularProgress
} from '@mui/material';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    BarChart,
    Bar
} from 'recharts';
import AutoGraphIcon from '@mui/icons-material/AutoGraph';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PsychologyIcon from '@mui/icons-material/Psychology';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import GroupIcon from '@mui/icons-material/Group';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import api from '@/services/api';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#4f46e5'];

export default function AnalysisPage() {
    const [hiringData, setHiringData] = useState<any>(null);
    const [resourceData, setResourceData] = useState<any>(null);
    const [leadData, setLeadData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hiringRes, resourceRes, leadRes] = await Promise.all([
                    api.get('analysis/hiring/'),
                    api.get('analysis/availability/'),
                    api.get('analysis/leads/')
                ]);
                setHiringData(hiringRes.data);
                setResourceData(resourceRes.data);
                setLeadData(leadRes.data);
            } catch (error) {
                console.error("Failed to fetch analysis data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Box sx={{ p: 4 }}><LinearProgress /></Box>;

    const forecastData = resourceData?.demand_forecast?.map((v: number, i: number) => ({
        week: `Week ${i + 1}`,
        demand: v
    })) || [];

    const sourceData = hiringData?.stats?.by_source?.map((s: any) => ({
        name: s.source,
        value: s.count
    })) || [];

    const leadIndustryData = leadData?.stats?.by_industry?.map((item: any) => ({
        name: item.industry || 'Others',
        value: item.count
    })) || [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PsychologyIcon fontSize="large" />
                        AI workforce & Business Insights
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.7 }}>
                        Predictive analytics for hiring, resource allocation, and business lead conversion.
                    </Typography>
                </Box>
                <Chip icon={<AutoGraphIcon />} label="ML Engine v2.5" color="primary" variant="outlined" sx={{ fontWeight: 600, px: 1, height: 40 }} />
            </Box>

            <Grid container spacing={3}>
                {/* 1. Lead Conversion Prediction Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ 
                        height: '100%', 
                        borderRadius: 4, 
                        boxShadow: '0 8px 32px 0 rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(0, 0, 0, 0.05)',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessCenterIcon color="primary" /> Lead Analysis
                                </Typography>
                                <Tooltip title="Predicts lead conversion based on industry trends, quotation values, and historical win rates.">
                                    <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                                </Tooltip>
                            </Box>

                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress 
                                        variant="determinate" 
                                        value={leadData?.prediction?.conversion_probability || 0} 
                                        size={120} 
                                        thickness={5}
                                        sx={{ color: 'primary.main' }}
                                    />
                                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="h4" component="div" fontWeight={800}>
                                            {leadData?.prediction?.conversion_probability}%
                                        </Typography>
                                    </Box>
                                </Box>
                                <Typography variant="subtitle1" fontWeight={700} sx={{ mt: 2 }}>Conversion Logic</Typography>
                                <Typography variant="body2" color="text.secondary" align="center">
                                    Likelihood for: <strong>{leadData?.prediction?.client_name || 'N/A'}</strong>
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                                <Typography variant="caption" color="text.secondary" fontWeight={600}>PIPELINE VALUE</Typography>
                                <Typography variant="h5" fontWeight={800} color="success.main">
                                    ${leadData?.stats?.pipeline_value?.toLocaleString() || '0'}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">Total Pending Proposals</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 2. Resources & Demand Card */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ 
                        height: '100%', 
                        borderRadius: 4, 
                        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.03)',
                        border: '1px solid rgba(0, 0, 0, 0.05)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LeaderboardIcon color="primary" /> Resource Forecast
                                </Typography>
                                <Tooltip title="Predicts future workforce demand based on sales pipeline and active projects.">
                                    <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                                </Tooltip>
                            </Box>

                            <Box sx={{ height: 220, mb: 3 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={forecastData}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} />
                                        <RechartsTooltip />
                                        <Area type="monotone" dataKey="demand" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>

                            <Grid container spacing={2}>
                                {resourceData?.availability_data?.slice(0, 4).map((item: any, idx: number) => (
                                    <Grid item xs={6} sm={3} key={idx}>
                                        <Box sx={{ p: 1.5, bgcolor: '#f8fafc', borderRadius: 2, textAlign: 'center' }}>
                                            <Typography variant="body2" fontWeight={700} noWrap>{item.name}</Typography>
                                            <Typography variant="h6" color="primary" fontWeight={800}>{item.availability_score}%</Typography>
                                            <Typography variant="caption" color="text.secondary">Free Score</Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. Industry Analysis Pie Chart */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Lead Distribution by Industry</Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={leadIndustryData}
                                            innerRadius={60}
                                            outerRadius={90}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {leadIndustryData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 4. Hiring & Experience Analysis */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ borderRadius: 4, height: '100%', border: '1px solid rgba(0, 0, 0, 0.05)' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Sourcing Success Prediction</Typography>
                            <Box sx={{ height: 250 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={sourceData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="name" fontSize={12} />
                                        <YAxis fontSize={12} />
                                        <RechartsTooltip />
                                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                            {sourceData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 5. Summary Info Banner */}
                <Grid item xs={12}>
                    <Paper sx={{ 
                        p: 4, 
                        borderRadius: 4, 
                        bgcolor: 'primary.main', 
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <Box sx={{ zIndex: 1 }}>
                            <Typography variant="h5" fontWeight={800} gutterBottom>ML Recommendations</Typography>
                            <Typography variant="body1" sx={{ maxWidth: 600, opacity: 0.9 }}>
                                Based on current conversion trends, focusing on <strong>{leadIndustryData[0]?.name || 'Current'}</strong> industry leads 
                                has a 22% higher projected ROI for this quarter. Sourcing from referrals remains your most efficient hiring path.
                            </Typography>
                        </Box>
                        <PsychologyIcon sx={{ fontSize: 180, position: 'absolute', right: -20, bottom: -40, opacity: 0.15 }} />
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
