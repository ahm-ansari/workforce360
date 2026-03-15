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
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EngineeringIcon from '@mui/icons-material/Engineering';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import HistoryToggleOffIcon from '@mui/icons-material/HistoryToggleOff';
import SpeedIcon from '@mui/icons-material/Speed';
import BoltIcon from '@mui/icons-material/Bolt';
import ConstructionIcon from '@mui/icons-material/Construction';
import api from '@/services/api';

const COLORS = ['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff', '#4f46e5'];

export default function AnalysisPage() {
    const [hiringData, setHiringData] = useState<any>(null);
    const [resourceData, setResourceData] = useState<any>(null);
    const [leadData, setLeadData] = useState<any>(null);
    const [marketData, setMarketData] = useState<any>(null);
    const [projectRiskData, setProjectRiskData] = useState<any>(null);
    const [financeData, setFinanceData] = useState<any>(null);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [cafmData, setCafmData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [hiringRes, resourceRes, leadRes, marketRes, riskRes, financeRes, summaryRes, cafmRes] = await Promise.all([
                    api.get('analysis/hiring/'),
                    api.get('analysis/availability/'),
                    api.get('analysis/leads/'),
                    api.get('analysis/market/'),
                    api.get('analysis/projects/risk/'),
                    api.get('analysis/finance/cashflow/'),
                    api.get('analysis/summary/'),
                    api.get('analysis/cafm/')
                ]);
                setHiringData(hiringRes.data);
                setResourceData(resourceRes.data);
                setLeadData(leadRes.data);
                setMarketData(marketRes.data);
                setProjectRiskData(riskRes.data);
                setFinanceData(financeRes.data);
                setSummaryData(summaryRes.data);
                setCafmData(cafmRes.data);
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
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%', bgcolor: '#fffcfc' }}>
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

                {/* 8. NEW: CAFM Predictive Intelligence */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Card sx={{ 
                        borderRadius: 4, 
                        border: '1px solid rgba(0,0,0,0.05)', 
                        height: '100%',
                        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                    }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <EngineeringIcon color="primary" /> Asset Failure Prediction (CAFM)
                            </Typography>
                            <Grid container spacing={2}>
                                {cafmData?.asset_failure_predictions?.map((asset: any, idx: number) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={idx}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, bgcolor: asset.risk_level === 'HIGH' ? 'rgba(239, 68, 68, 0.02)' : 'white' }}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                <Typography variant="subtitle2" fontWeight={700}>{asset.name}</Typography>
                                                <Chip label={`${asset.failure_probability}%`} size="small" color={asset.risk_level === 'HIGH' ? 'error' : 'warning'} variant="soft" />
                                            </Stack>
                                            <Typography variant="caption" color="text.secondary" display="block">Cat: {asset.category} | Loc: {asset.location}</Typography>
                                            <Typography variant="caption" sx={{ mt: 1, display: 'block', fontWeight: 700, color: asset.risk_level === 'HIGH' ? 'error.main' : 'warning.main' }}>
                                                Action: {asset.recommendation}
                                            </Typography>
                                        </Paper>
                                    </Grid>
                                ))}
                            </Grid>

                            <Box sx={{ mt: 4 }}>
                                <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <BoltIcon sx={{ color: '#eab308' }} /> 7-Day Energy Load Forecast
                                </Typography>
                                <Box sx={{ height: 180 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={cafmData?.energy_efficiency_forecast || []}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                            <XAxis dataKey="day" fontSize={10} stroke="#94a3b8" />
                                            <YAxis fontSize={10} stroke="#94a3b8" />
                                            <RechartsTooltip />
                                            <Line type="monotone" dataKey="load_kw" stroke="#eab308" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                                            <Line type="monotone" dataKey="efficiency" stroke="#10b981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </Box>
                                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#eab308' }}>● Load (kW)</Typography>
                                    <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#10b981' }}>○ Efficiency (%)</Typography>
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 9. NEW: Recruitment Intelligence */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ borderRadius: 4, border: '1px solid rgba(0,0,0,0.05)', height: '100%', bgcolor: '#f5f3ff' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={800} sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 1, color: '#6d28d9' }}>
                                <GroupAddIcon /> Recruitment AI Insights
                            </Typography>
                            
                            <Box sx={{ p: 3, borderRadius: 4, bgcolor: 'white', mb: 3, border: '1px solid rgba(139, 92, 246, 0.1)' }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={800}>PREDICTED TIME TO FILL</Typography>
                                <Typography variant="h3" fontWeight={900} color="#6d28d9" sx={{ my: 1 }}>
                                    {hiringData?.prediction?.predicted_time_to_fill_days || 0} <Typography component="span" variant="h5">Days</Typography>
                                </Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                                    Target Position: <strong>{hiringData?.prediction?.job_title}</strong>
                                </Typography>
                            </Box>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 6 }}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: 'center', border: '1px solid #ddd6fe' }}>
                                        <Typography variant="h5" fontWeight={900}>{hiringData?.stats?.total_candidates || 0}</Typography>
                                        <Typography variant="caption" fontWeight={700} color="text.secondary">TOTAL APPLICANTS</Typography>
                                    </Paper>
                                </Grid>
                                <Grid size={{ xs: 6 }}>
                                    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, textAlign: 'center', border: '1px solid #ddd6fe' }}>
                                        <Typography variant="h5" fontWeight={900} color="#10b981">{hiringData?.stats?.conversion_rate?.toFixed(1) || 0}%</Typography>
                                        <Typography variant="caption" fontWeight={700} color="text.secondary">HIRE RATE</Typography>
                                    </Paper>
                                </Grid>
                            </Grid>

                            <Box sx={{ mt: 3 }}>
                                <Typography variant="subtitle2" fontWeight={800} gutterBottom>Application Sources</Typography>
                                <Box sx={{ height: 160 }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={hiringData?.stats?.by_source?.map((s: any) => ({ name: s.source, value: s.count })) || []}
                                                innerRadius={40}
                                                outerRadius={60}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {hiringData?.stats?.by_source?.map((_: any, index: number) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <RechartsTooltip />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* 10. NEW: Operational Summary Grid */}
                <Grid size={{ xs: 12 }}>
                    <Card sx={{ 
                        borderRadius: 5, 
                        border: 'none', 
                        boxShadow: '0 4px 25px rgba(0,0,0,0.05)',
                        bgcolor: '#1e293b',
                        color: 'white',
                        mt: 2
                    }}>
                        <CardContent sx={{ p: 4 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                                <DashboardCustomizeIcon sx={{ color: '#38bdf8' }} />
                                <Typography variant="h5" fontWeight={800}>Cross-Module Operational Pulse</Typography>
                            </Box>
                            <Grid container spacing={4}>
                                {summaryData?.counts && Object.entries(summaryData.counts).map(([key, value], idx) => (
                                    <Grid size={{ xs: 12, sm: 4 }} key={key}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Typography variant="h2" fontWeight={900} color={['#38bdf8', '#818cf8', '#f472b6'][idx % 3]}>
                                                {value as number}
                                            </Typography>
                                            <Typography variant="h6" sx={{ opacity: 0.6, textTransform: 'uppercase', fontSize: '0.9rem', fontWeight: 800, letterSpacing: 1 }}>
                                                {key.replace('_', ' ')}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
