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
    CircularProgress,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
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
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import BarChartIcon from '@mui/icons-material/BarChart';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import api from '@/services/api';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#4f46e5'];

export default function AnalysisPage() {
    const [hiringData, setHiringData] = useState<any>(null);
    const [resourceData, setResourceData] = useState<any>(null);
    const [leadData, setLeadData] = useState<any>(null);
    const [marketData, setMarketData] = useState<any>(null);
    const [projectRiskData, setProjectRiskData] = useState<any>(null);
    const [financeData, setFinanceData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hiringRes, resourceRes, leadRes, marketRes, riskRes, financeRes] = await Promise.all([
                    api.get('analysis/hiring/'),
                    api.get('analysis/availability/'),
                    api.get('analysis/leads/'),
                    api.get('analysis/market/'),
                    api.get('analysis/projects/risk/'),
                    api.get('analysis/finance/cashflow/')
                ]);
                setHiringData(hiringRes.data);
                setResourceData(resourceRes.data);
                setLeadData(leadRes.data);
                setMarketData(marketRes.data);
                setProjectRiskData(riskRes.data);
                setFinanceData(financeRes.data);
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

    const marketROI = marketData?.market_trends?.map((m: any) => ({
        platform: m.platform,
        roi: m.avg_roi
    })) || [];

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <PsychologyIcon fontSize="large" />
                        AI Strategic Intelligence Dashboard
                    </Typography>
                    <Typography variant="body1" sx={{ mt: 1, opacity: 0.7 }}>
                        Multi-dimensional predictive analytics: Sourcing, Leads, and AI-driven Market Strategy.
                    </Typography>
                </Box>
                <Chip icon={<AutoAwesomeIcon />} label="Google Gemini AI Integrated" color="secondary" variant="filled" sx={{ fontWeight: 600, px: 2, height: 44, bgcolor: '#f472b6', color: 'white' }} />
            </Box>

            <Grid container spacing={3}>
                {/* 1. AI Strategic Recommendation Banner */}
                <Grid size={{ xs: 12 }}>
                    <Card sx={{
                        borderRadius: 5,
                        border: 'none',
                        boxShadow: '0 20px 40px 0 rgba(99, 102, 241, 0.15)',
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                        color: 'white',
                        overflow: 'hidden',
                        position: 'relative'
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, zIndex: 1, position: 'relative' }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 64, height: 64 }}>
                                    <LightbulbIcon sx={{ fontSize: 32 }} />
                                </Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={800} sx={{ mb: 1, letterSpacing: '-0.01em' }}>
                                        AI generated Strategy Recommendation
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1.1rem', opacity: 0.95, lineHeight: 1.6, maxWidth: '900px' }}>
                                        {marketData?.strategy_recommendation || "Processing latest market analysis data..."}
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                        <AutoAwesomeIcon sx={{ position: 'absolute', right: -30, bottom: -30, fontSize: 240, opacity: 0.1, transform: 'rotate(-15deg)' }} />
                    </Card>
                </Grid>

                {/* 2. Business Leads Predictive Analysis */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.05)',
                        bgcolor: '#fafafa'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BusinessCenterIcon color="primary" /> Lead Score & Pipeline
                                </Typography>
                                <Tooltip title="Analyzes lead conversion probability based on industry, historical win rates and quotation values.">
                                    <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                                </Tooltip>
                            </Box>

                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                    <CircularProgress
                                        variant="determinate"
                                        value={leadData?.prediction?.conversion_probability || 0}
                                        size={140}
                                        thickness={5}
                                        sx={{ color: '#4f46e5' }}
                                    />
                                    <Box sx={{ top: 0, left: 0, bottom: 0, right: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <Typography variant="h3" fontWeight={900}>{leadData?.prediction?.conversion_probability}%</Typography>
                                    </Box>
                                </Box>
                                <Typography variant="h6" sx={{ mt: 2, mb: 0.5 }} fontWeight={700}>Win Probability</Typography>
                                <Typography variant="body2" color="text.secondary">Target: <strong>{leadData?.prediction?.client_name || 'N/A'}</strong></Typography>
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL PIPELINE</Typography>
                                    <Typography variant="h5" fontWeight={900} color="primary.main">
                                        ${leadData?.stats?.pipeline_value?.toLocaleString() || '0'}
                                    </Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="caption" color="text.secondary" fontWeight={700}>TOTAL LEADS</Typography>
                                    <Typography variant="h5" fontWeight={900}>{leadData?.stats?.total_leads || 0}</Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 3. Market Trends ROI Analysis */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{
                        height: '100%',
                        borderRadius: 4,
                        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                        border: '1px solid rgba(0,0,0,0.05)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                                <Typography variant="h6" fontWeight={700} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BarChartIcon color="primary" /> Marketing Channel ROI
                                </Typography>
                                <Tooltip title="Historic ROI analysis based on campaign budget vs outcomes achieved across platforms.">
                                    <IconButton size="small"><InfoOutlinedIcon fontSize="small" /></IconButton>
                                </Tooltip>
                            </Box>

                            <Box sx={{ height: 260 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={marketROI}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="platform" fontSize={12} stroke="#94a3b8" />
                                        <YAxis fontSize={12} stroke="#94a3b8" />
                                        <RechartsTooltip />
                                        <Bar dataKey="roi" name="Avg ROI" radius={[4, 4, 0, 0]}>
                                            {marketROI.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </Box>

                            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                                <Chip label="Top Performer: Social Media" size="small" variant="outlined" color="success" />
                                <Chip label="Focus Area: Professional Search" size="small" variant="outlined" color="primary" />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 4. Workforce Demand Prediction */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <TrendingUpIcon color="primary" /> 4-Week Workforce Demand
                            </Typography>
                            <Box sx={{ height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={forecastData}>
                                        <defs>
                                            <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="week" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} />
                                        <RechartsTooltip />
                                        <Area type="monotone" dataKey="demand" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorDemand)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 5. Resource Availability Quick List */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>High Availability Resources</Typography>
                            <List disablePadding>
                                {resourceData?.availability_data?.slice(0, 5).map((item: any, idx: number) => (
                                    <React.Fragment key={idx}>
                                        <ListItem sx={{ py: 1.5 }}>
                                            <ListItemIcon>
                                                <Avatar sx={{ bgcolor: COLORS[idx % COLORS.length] }}>{item.name[0]}</Avatar>
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={item.name}
                                                secondary={item.department}
                                                primaryTypographyProps={{ fontWeight: 600 }}
                                            />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Typography variant="h6" color="primary" fontWeight={800}>{item.availability_score}%</Typography>
                                                <Typography variant="caption" sx={{ display: 'block' }}>FREE</Typography>
                                            </Box>
                                        </ListItem>
                                        {idx < 4 && <Divider variant="inset" component="li" />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 6. Cash Flow Forecast */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AccountBalanceWalletIcon color="success" /> 14-Day Cash Flow Projection
                                </Typography>
                                <Chip label={`Health Score: ${financeData?.health_score || 0}/100`} color={financeData?.health_score > 70 ? 'success' : 'warning'} />
                            </Box>
                            <Box sx={{ height: 280 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={financeData?.cashflow_forecast || []}>
                                        <defs>
                                            <linearGradient id="colorCashflow" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.4} />
                                                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                                        <YAxis stroke="#94a3b8" fontSize={12} />
                                        <RechartsTooltip />
                                        <Area type="stepBefore" dataKey="amount" stroke="#16a34a" strokeWidth={3} fillOpacity={1} fill="url(#colorCashflow)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 7. Active Project Risks */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <WarningAmberIcon color="warning" /> Predicted Project Risks
                            </Typography>
                            <List disablePadding>
                                {projectRiskData?.project_risks?.slice(0, 5).map((risk: any, idx: number) => (
                                    <React.Fragment key={idx}>
                                        <ListItem sx={{ py: 1.5, px: 0 }}>
                                            <ListItemText
                                                primary={<Typography fontWeight={700}>{risk.name}</Typography>}
                                                secondary={`Delayed Milestones: ${risk.milestone_status} | Budget Use: ${risk.budget_utilization}%`}
                                            />
                                            <Box sx={{ textAlign: 'right' }}>
                                                <Chip 
                                                    label={risk.risk_level} 
                                                    size="small"
                                                    color={risk.risk_level === 'HIGH' ? 'error' : risk.risk_level === 'MEDIUM' ? 'warning' : 'success'} 
                                                    sx={{ fontWeight: 800 }}
                                                />
                                            </Box>
                                        </ListItem>
                                        {idx < (projectRiskData?.project_risks?.length - 1) && <Divider component="li" />}
                                    </React.Fragment>
                                ))}
                                {(!projectRiskData?.project_risks || projectRiskData.project_risks.length === 0) && (
                                    <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
                                        No high-risk active projects detected.
                                    </Typography>
                                )}
                            </List>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
