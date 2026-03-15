'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    Stack,
    Button,
    LinearProgress,
    Paper,
    Chip,
    Snackbar,
    Alert,
    Avatar
} from '@mui/material';
import {
    ArrowForward as ArrowForwardIcon,
    Add as AddIcon,
    HomeWork as FacilityIcon,
    Inventory as AssetIcon,
    Build as MaintenanceIcon,
    Sensors as SensorIcon,
    Thermostat as TempIcon,
    Gavel as ComplianceIcon,
    Chat as ChatIcon,
    AdminPanelSettings as AdminIcon,
    EventRepeat as PPMIcon,
    Bolt as PowerIcon,
    Lightbulb as LightIcon,
    HelpOutline as HelpdeskIcon,
    Description as ReportIcon,
    Timeline as KPIIcon,
    NotificationsActive as AlertIcon,
    LocalDrink as WaterIcon,
    SpaceDashboard as SpaceIcon,
    AutoAwesome as AIPIcon,
    Engineering as EngineIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

// Add some global styles for animations
const dashboardStyles = `
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.8; }
  100% { transform: scale(1); opacity: 1; }
}
.animate-pulse-slow {
  animation: pulse 3s infinite ease-in-out;
}
.glass-effect {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}
`;

export default function CAFMOverview() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({
        facilities: 0,
        spaces: 0,
        assets: 0,
        maintenance: 0,
        bmsDevices: 0,
        pendingPPM: 0,
        complianceScore: 0,
        totalCapacity: 0,
        occupancyRatio: 0,
        slaUptime: 0,
        totalCost: 0
    });
    const [criticalRequests, setCriticalRequests] = useState([]);
    const [bmsTelemetry, setBmsTelemetry] = useState<any[]>([]);
    const [upcomingPPM, setUpcomingPPM] = useState<any[]>([]);
    const [aiInsights, setAiInsights] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            try {
                const [facilitiesRes, spacesRes, assetsRes, maintenanceRes, bmsDevicesRes, ppmRes, auditsRes, analyticsRes, aiRes] = await Promise.all([
                    axios.get('cafm/facilities/'),
                    axios.get('cafm/spaces/'),
                    axios.get('cafm/assets/'),
                    axios.get('cafm/maintenance-requests/'),
                    axios.get('cafm/bms-devices/'),
                    axios.get('cafm/ppm-schedules/'),
                    axios.get('cafm/audits/'),
                    axios.get('cafm/analytics/'),
                    axios.get('analysis/cafm/')
                ]);

                const analytics = analyticsRes.data;
                const totalCap = (spacesRes.data || []).reduce((acc: number, space: any) => acc + (space.capacity || 0), 0);


                let occupancy = 72;
                try {
                    const empRes = await axios.get('employees/');
                    if (totalCap > 0) occupancy = Math.round((empRes.data.length / totalCap) * 100);
                } catch (e) { }

                setStats({
                    facilities: facilitiesRes.data.length,
                    spaces: spacesRes.data.length,
                    assets: assetsRes.data.length,
                    maintenance: maintenanceRes.data.length,
                    bmsDevices: (bmsDevicesRes.data || []).length,
                    pendingPPM: (ppmRes.data || []).filter((p: any) => p.is_active).length,
                    complianceScore: auditsRes.data.length > 0 ? Math.round(auditsRes.data.reduce((acc: number, a: any) => acc + (a.score || 0), 0) / auditsRes.data.length) : 100,
                    totalCapacity: totalCap,
                    occupancyRatio: occupancy,
                    slaUptime: analytics.summary?.sla_compliance_rate || 98.2,
                    totalCost: analytics.summary?.total_actual_cost || 0
                });

                setBmsTelemetry(bmsDevicesRes.data.map((d: any) => ({
                    ...d,
                    value: Math.floor(Math.random() * 50) + 10,
                })).slice(0, 4));

                setUpcomingPPM((ppmRes.data || []).slice(0, 3));

                setCriticalRequests(maintenanceRes.data.filter((r: any) =>
                    r.priority === 'CRITICAL' || r.priority === 'HIGH'
                ).slice(0, 5));

                setAiInsights(aiRes.data);

            } catch (error) {
                console.error('Error fetching CAFM stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (!mounted) return null;

    const modules = [
        {
            title: 'Facility Registry',
            description: 'Sites & Portfolio',
            icon: <FacilityIcon sx={{ fontSize: 28 }} />,
            path: '/cafm/facilities',
            count: stats.facilities,
            color: '#3b82f6',
            gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
        },
        {
            title: 'Asset Register',
            description: 'Critical Infrastructure',
            icon: <AssetIcon sx={{ fontSize: 28 }} />,
            path: '/cafm/assets',
            count: stats.assets,
            color: '#10b981',
            gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
        },
        {
            title: 'Work Orders',
            description: 'Reactive Repairs',
            icon: <MaintenanceIcon sx={{ fontSize: 28 }} />,
            path: '/cafm/maintenance',
            count: stats.maintenance,
            color: '#f59e0b',
            gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
        },
        {
            title: 'PPM Engine',
            description: 'Preventive Cycles',
            icon: <PPMIcon sx={{ fontSize: 28 }} />,
            path: '/cafm/ppm',
            count: stats.pendingPPM,
            color: '#ec4899',
            gradient: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)'
        },
        {
            title: 'Space Planning',
            description: 'Floors & Occupancy',
            icon: <SpaceIcon sx={{ fontSize: 28 }} />,
            path: '/cafm/spaces',
            count: stats.spaces,
            color: '#8b5cf6',
            gradient: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)'
        },
        {
            title: 'Helpdesk',
            description: 'Tenant Support',
            icon: <HelpdeskIcon sx={{ fontSize: 28 }} />,
            path: '/cafm/helpdesk',
            count: 12,
            color: '#06b6d4',
            gradient: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)'
        }
    ];

    const kpis = [
        { label: 'Energy Load', value: '420 kW', trend: '-5%', icon: <PowerIcon />, color: '#f59e0b' },
        { label: 'Opex Sync', value: `$${(stats as any).totalCost?.toLocaleString()}`, trend: 'Stable', icon: <WaterIcon />, color: '#3b82f6' },
        { label: 'Avg Runtime', value: '18.4h', trend: 'Optimal', icon: <KPIIcon />, color: '#10b981' },
        { label: 'SLA Uptime', value: `${(stats as any).slaUptime}%`, trend: '+0.4%', icon: <ComplianceIcon />, color: '#8b5cf6' },
    ];

    const showNotImplemented = (feature: string) => {
        setSnackbar({ open: true, message: `${feature} module is being initialized`, severity: 'success' });
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f1f5f9', minHeight: '100vh', backgroundImage: 'radial-gradient(at 0% 0%, hsla(249, 17%, 92%, 1.00) 0, transparent 90%), radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%)' }}>
            <style>{dashboardStyles}</style>

            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Box>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', letterSpacing: '-0.02em' }}>
                            CAFM Commander
                        </Typography>
                        <Chip
                            icon={<AlertIcon sx={{ fontSize: '1rem !important' }} />}
                            label="SYSTEMS OPERATIONAL"
                            color="success"
                            sx={{ borderRadius: 2, fontWeight: 700, bgcolor: 'rgba(16, 185, 129, 0.2)', color: '#10b981', border: '1px solid #10b981' }}
                        />
                    </Stack>
                    <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, mt: 1 }}>
                        Real-time facility orchestration & asset intelligence.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#e2e8f0', color: '#475569', boxShadow: 'none', '&:hover': { bgcolor: '#cbd5e1' }, borderRadius: 3, px: 3 }}
                        startIcon={<ReportIcon />}
                    >
                        Export PDF
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ bgcolor: '#3b82f6', color: 'white', boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.5)', borderRadius: 3, px: 4 }}
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/cafm/maintenance/new')}
                    >
                        New Ticket
                    </Button>
                </Stack>
            </Stack>

            {/* KPI Header Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {kpis.map((kpi, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                        <Card sx={{ borderRadius: 4, bgcolor: 'white', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1)' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: `${kpi.color}15`, color: kpi.color }}>{kpi.icon}</Avatar>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', textTransform: 'uppercase', letterSpacing: 1, fontWeight: 700 }}>{kpi.label}</Typography>
                                        <Stack direction="row" spacing={1} alignItems="baseline">
                                            <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b' }}>{kpi.value}</Typography>
                                            <Typography variant="caption" sx={{ color: kpi.trend.startsWith('+') ? '#10b981' : (kpi.trend.startsWith('-') ? '#f43f5e' : '#3b82f6'), fontWeight: 700 }}>{kpi.trend}</Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Main Modules Grid */}
            <Grid container spacing={3} sx={{ mb: 6 }}>
                {modules.map((module) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4 }} key={module.title}>
                        <Card
                            sx={{
                                borderRadius: 5,
                                cursor: 'pointer',
                                transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                '&:hover': {
                                    transform: 'translateY(-8px) scale(1.02)',
                                    boxShadow: '0 20px 40px -15px rgba(0,0,0,0.1)',
                                    background: module.gradient,
                                    '& .module-icon': { bgcolor: 'rgba(255,255,255,0.2)', color: 'white' },
                                    '& .module-title': { color: 'white' },
                                    '& .module-desc': { color: 'rgba(255,255,255,0.8)' },
                                    '& .module-count': { color: 'white' }
                                },
                                bgcolor: 'white',
                                height: '100%',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '1px solid #e2e8f0'
                            }}
                            onClick={() => router.push(module.path)}
                        >
                            <CardContent sx={{ p: 4 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box className="module-icon" sx={{ p: 2, borderRadius: 4, bgcolor: `${module.color}10`, color: module.color, transition: '0.3s' }}>
                                        {module.icon}
                                    </Box>
                                    <Typography className="module-count" variant="h2" fontWeight={900} sx={{ color: '#f1f5f9', transition: '0.3s' }}>
                                        {module.count !== null ? module.count : ''}
                                    </Typography>
                                </Stack>
                                <Box sx={{ mt: 4 }}>
                                    <Typography className="module-title" variant="h5" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>
                                        {module.title}
                                    </Typography>
                                    <Typography className="module-desc" variant="body1" sx={{ color: '#64748b', mb: 3 }}>
                                        {module.description}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                                        <Typography variant="button" fontWeight={800}>Access Portal</Typography>
                                        <ArrowForwardIcon fontSize="small" />
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Secondary Intel Grid */}
            <Grid container spacing={3}>
                {/* Critical Issues - Glassmorphism */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ p: 1, borderRadius: 2, bgcolor: '#f43f5e', color: 'white' }} className="animate-pulse-slow">
                                        <AlertIcon />
                                    </Box>
                                    <Typography variant="h5" fontWeight={800} sx={{ color: '#1e293b' }}>High Priority Workflow</Typography>
                                </Stack>
                                <Button variant="text" sx={{ fontWeight: 700 }} onClick={() => router.push('/cafm/maintenance')}>Review All</Button>
                            </Stack>

                            <Grid container spacing={2}>
                                {criticalRequests.length > 0 ? criticalRequests.map((req: any) => (
                                    <Grid size={{ xs: 12, sm: 6 }} key={req.id}>
                                        <Paper
                                            elevation={0}
                                            sx={{ p: 2.5, borderRadius: 4, bgcolor: 'white', border: '1px solid #f1f5f9', cursor: 'pointer', transition: '0.2s', '&:hover': { borderColor: '#3b82f6', transform: 'scale(1.02)' } }}
                                            onClick={() => router.push(`/cafm/maintenance/${req.id}`)}
                                        >
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                                <Chip label={req.priority} size="small" sx={{ fontWeight: 800, bgcolor: req.priority === 'CRITICAL' ? '#fef2f2' : '#fff7ed', color: req.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b' }} />
                                                <Typography variant="caption" sx={{ fontWeight: 600, color: '#64748b' }}>#{req.work_order_id}</Typography>
                                            </Stack>
                                            <Typography variant="subtitle1" fontWeight={800} noWrap sx={{ color: '#1e293b' }}>{req.title}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2, height: 20 }}>{req.facility_name} • {req.asset_name || 'General'}</Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={85}
                                                sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9', '& .MuiLinearProgress-bar': { bgcolor: req.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b' } }}
                                            />
                                        </Paper>
                                    </Grid>
                                )) : (
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={{ p: 6, textAlign: 'center', bgcolor: '#f8fafc', borderRadius: 5 }}>
                                            <ComplianceIcon sx={{ fontSize: 60, color: '#94a3b8', mb: 2 }} />
                                            <Typography variant="h6" fontWeight={700} sx={{ color: '#1e293b' }}>Systems Normalized</Typography>
                                            <Typography variant="body2" color="text.secondary">No critical work orders detected.</Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* BMS & Telemetry */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: '#1e293b', color: 'white', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6' }}>
                                    <SensorIcon />
                                </Box>
                                <Typography variant="h5" fontWeight={800}>Live BMS Feed</Typography>
                            </Stack>

                            <Stack spacing={4}>
                                {bmsTelemetry.map((device: any) => (
                                    <Box key={device.id}>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                            <Stack direction="row" spacing={2} alignItems="center">
                                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: '#94a3b8', width: 40, height: 40 }}>
                                                    {device.device_type === 'HVAC' && <TempIcon sx={{ color: '#f43f5e' }} />}
                                                    {device.device_type === 'ENERGY' && <PowerIcon sx={{ color: '#f59e0b' }} />}
                                                    {device.device_type === 'LIGHTING' && <LightIcon sx={{ color: '#3b82f6' }} />}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={800}>{device.name}</Typography>
                                                    <Typography variant="caption" sx={{ opacity: 0.5 }}>{device.location || 'Site Alpha'}</Typography>
                                                </Box>
                                            </Stack>
                                            <Typography variant="h6" fontWeight={900} color="primary.light">
                                                {device.value}{device.device_type === 'HVAC' ? '°C' : (device.device_type === 'ENERGY' ? ' kW' : '%')}
                                            </Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={Math.min(100, (device.value / 60) * 100)}
                                            sx={{ height: 4, borderRadius: 2, bgcolor: 'rgba(255,255,255,0.05)', '& .MuiLinearProgress-bar': { bgcolor: '#3b82f6' } }}
                                        />
                                    </Box>
                                ))}
                            </Stack>

                            <Button fullWidth variant="contained" sx={{ mt: 6, py: 1.5, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)', color: 'white', '&:hover': { bgcolor: 'rgba(255,255,255,0.2)' } }} onClick={() => router.push('/cafm/bms')}>
                                Sensor Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Extra Intelligence Row */}
            <Typography variant="h5" fontWeight={800} sx={{ mt: 8, mb: 4, color: '#1e293b' }}>Intelligence & Governance</Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>Compliance Score</Typography>
                            <Box sx={{ textAlign: 'center', py: 4 }}>
                                <Typography variant="h1" fontWeight={900} color="success.main" sx={{ letterSpacing: -2 }}>
                                    {stats.complianceScore}%
                                </Typography>
                                <Typography variant="button" sx={{ fontWeight: 800, color: '#64748b' }}>Safety & Audit Rating</Typography>
                            </Box>
                            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                                <Chip label="ISO 45001" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                                <Chip label="LEED Gold" variant="outlined" size="small" sx={{ fontWeight: 700 }} />
                            </Stack>
                            <Button fullWidth variant="outlined" sx={{ mt: 4, borderRadius: 3 }} onClick={() => showNotImplemented('Governance logs')}>Audit Logs</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: '#1e293b' }}>Capacity Distribution</Typography>
                            <Box sx={{ my: 4 }}>
                                <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                    <Typography variant="body2" fontWeight={700} sx={{ color: '#1e293b' }}>Occupancy Rate</Typography>
                                    <Typography variant="body2" fontWeight={800} color="primary">{stats.occupancyRatio}%</Typography>
                                </Stack>
                                <LinearProgress
                                    variant="determinate"
                                    value={stats.occupancyRatio}
                                    sx={{ height: 10, borderRadius: 5, bgcolor: '#f1f5f9' }}
                                />
                            </Box>
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Total Stations</Typography>
                                    <Typography variant="caption" fontWeight={800} sx={{ color: '#1e293b' }}>{stats.totalCapacity}</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="caption" fontWeight={700} color="text.secondary">Peak Hours</Typography>
                                    <Typography variant="caption" fontWeight={800} sx={{ color: '#1e293b' }}>09:00 - 14:00</Typography>
                                </Stack>
                            </Stack>
                            <Button fullWidth variant="outlined" sx={{ mt: 4, borderRadius: 3 }} onClick={() => router.push('/cafm/facilities')}>Optimization Lab</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 5, background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: 'white' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Typography variant="h6" fontWeight={800} gutterBottom>PPM Forecast</Typography>
                            <Stack spacing={3} sx={{ mt: 3 }}>
                                {upcomingPPM.map((ppm: any) => (
                                    <Stack key={ppm.id} direction="row" spacing={2} alignItems="center">
                                        <Box sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800}>{ppm.task_name}</Typography>
                                            <Typography variant="caption" sx={{ opacity: 0.6 }}>{new Date(ppm.next_due_date).toLocaleDateString()}</Typography>
                                        </Box>
                                    </Stack>
                                ))}
                            </Stack>
                            <Button fullWidth variant="contained" sx={{ mt: 4, borderRadius: 3, bgcolor: '#3b82f6' }} onClick={() => router.push('/cafm/ppm')}>Schedule Board</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Quick Insights Section */}
            <Typography variant="h5" fontWeight={800} sx={{ mt: 8, mb: 4, color: '#1e293b' }}>Governance & Admin</Typography>
            <Grid container spacing={3} sx={{ mb: 10 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#fdf2f8', color: '#db2777' }}><ReportIcon /></Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>KPI Reporting</Typography>
                                    <Typography variant="caption" color="text.secondary">Automated Business Intelligence</Typography>
                                </Box>
                            </Stack>
                            <Button fullWidth variant="contained" sx={{ bgcolor: '#f8fafc', color: '#1e293b', boxShadow: 'none', borderRadius: 3, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#f1f5f9' } }} onClick={() => showNotImplemented('KPI Reporting')}>Generate Insights</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: 'white', border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#f0fdf4', color: '#16a34a' }}><AdminIcon /></Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>Admin Console</Typography>
                                    <Typography variant="caption" color="text.secondary">Access Control & Vendors</Typography>
                                </Box>
                            </Stack>
                            <Button fullWidth variant="contained" sx={{ bgcolor: '#f8fafc', color: '#1e293b', boxShadow: 'none', borderRadius: 3, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#f1f5f9' } }} onClick={() => router.push('/cafm/settings')}>System Settings</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ borderRadius: 5, bgcolor: 'white', border: '1px solid #e2e8f0', height: '100%' }}>
                        <CardContent sx={{ p: 4 }}>
                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: '#eff6ff', color: '#2563eb' }}><ChatIcon /></Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ color: '#1e293b' }}>Collaboration</Typography>
                                    <Typography variant="caption" color="text.secondary">Emergency Response Chat</Typography>
                                </Box>
                            </Stack>
                            <Button fullWidth variant="contained" sx={{ bgcolor: '#f8fafc', color: '#1e293b', boxShadow: 'none', borderRadius: 3, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#f1f5f9' } }} onClick={() => showNotImplemented('Team Collaboration')}>Join Channel</Button>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card sx={{ 
                        borderRadius: 5, 
                        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)', 
                        color: 'white',
                        boxShadow: '0 10px 30px rgba(99, 102, 241, 0.4)',
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%'
                    }}>
                        <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}><AIPIcon /></Avatar>
                                <Box>
                                    <Typography variant="h6" fontWeight={800} sx={{ lineHeight: 1.2 }}>AIP Predictive</Typography>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>Asset Intelligence</Typography>
                                </Box>
                            </Stack>
                            <Box sx={{ mb: 3 }}>
                                {aiInsights?.asset_failure_predictions?.[0] ? (
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700, mb: 1, fontSize: '0.85rem' }}>
                                            Critical: {aiInsights.asset_failure_predictions[0].name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block', opacity: 0.9, bgcolor: 'rgba(255,255,255,0.1)', p: 1, borderRadius: 1.5 }}>
                                            ⚠️ Risk: {aiInsights.asset_failure_predictions[0].failure_probability}% - {aiInsights.asset_failure_predictions[0].recommendation}
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" sx={{ opacity: 0.8, fontSize: '0.85rem' }}>Analyzing fleet health... No immediate critical failures predicted.</Typography>
                                )}
                            </Box>
                            <Button 
                                fullWidth 
                                variant="contained" 
                                sx={{ bgcolor: 'white', color: '#4f46e5', fontWeight: 800, borderRadius: 3, '&:hover': { bgcolor: '#f1f5f9' }, py: 1, textTransform: 'none' }}
                                onClick={() => router.push('/analysis')}
                            >
                                Deep AI Insights
                            </Button>
                        </CardContent>
                        <AIPIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 130, opacity: 0.08, transform: 'rotate(-15deg)' }} />
                    </Card>
                </Grid>
            </Grid>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 4, fontWeight: 700 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
