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
    LinearProgress,
    Paper,
    Chip,
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    ArrowForward as ArrowForwardIcon,
    Add as AddIcon,
    HomeWork as FacilityIcon,
    Room as SpaceIcon,
    Inventory as AssetIcon,
    Build as MaintenanceIcon,
    Sensors as SensorIcon,
    Thermostat as TempIcon,
    Gavel as ComplianceIcon,
    CalendarMonth as CalendarIcon,
    BarChart as AnalyticsIcon,
    Chat as ChatIcon,
    AdminPanelSettings as AdminIcon,
    FileUpload as ExportIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

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
        occupancyRatio: 0
    });
    const [criticalRequests, setCriticalRequests] = useState([]);
    const [bmsTelemetry, setBmsTelemetry] = useState<any[]>([]);
    const [upcomingPPM, setUpcomingPPM] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            try {
                const [facilitiesRes, spacesRes, assetsRes, maintenanceRes, bmsDevicesRes, ppmRes, auditsRes] = await Promise.all([
                    axios.get('cafm/facilities/'),
                    axios.get('cafm/spaces/'),
                    axios.get('cafm/assets/'),
                    axios.get('cafm/maintenance-requests/'),
                    axios.get('cafm/bms-devices/'),
                    axios.get('cafm/ppm-schedules/'),
                    axios.get('cafm/audits/')
                ]);

                const totalCap = (spacesRes.data || []).reduce((acc: number, space: any) => acc + (space.capacity || 0), 0);

                // For now, we simulate tenant count relative to capacity if we don't have a direct query
                // but we can also fetch employees count if the endpoint exists
                let employeeCount = 0;
                try {
                    const empRes = await axios.get('employees/');
                    employeeCount = empRes.data.length;
                } catch (e) {
                    employeeCount = Math.round(totalCap * 0.72); // simulation if endpoint fails
                }

                setStats({
                    facilities: facilitiesRes.data.length,
                    spaces: spacesRes.data.length,
                    assets: assetsRes.data.length,
                    maintenance: maintenanceRes.data.length,
                    bmsDevices: (bmsDevicesRes.data || []).length,
                    pendingPPM: (ppmRes.data || []).filter((p: any) => p.is_active).length,
                    complianceScore: auditsRes.data.length > 0 ? Math.round(auditsRes.data.reduce((acc: number, a: any) => acc + (a.score || 0), 0) / auditsRes.data.length) : 100,
                    totalCapacity: totalCap,
                    occupancyRatio: totalCap > 0 ? Math.round((employeeCount / totalCap) * 100) : 0
                });

                setBmsTelemetry(bmsDevicesRes.data.map((d: any) => ({
                    ...d,
                    value: Math.floor(Math.random() * 50) + 10, // Simulated real-time value
                })).slice(0, 4));

                setUpcomingPPM((ppmRes.data || []).slice(0, 3));

                setCriticalRequests(maintenanceRes.data.filter((r: any) =>
                    r.priority === 'CRITICAL' || r.priority === 'HIGH'
                ).slice(0, 5));

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
            title: 'Facilities',
            description: 'Manage buildings, sites, and locations',
            icon: <FacilityIcon sx={{ fontSize: 40, color: '#3b82f6' }} />,
            path: '/cafm/facilities',
            count: stats.facilities,
            color: '#3b82f6'
        },
        {
            title: 'Spaces',
            description: 'Rooms, floors, and specific functional areas',
            icon: <SpaceIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />,
            path: '/cafm/spaces',
            count: stats.spaces,
            color: '#8b5cf6'
        },
        {
            title: 'Assets',
            description: 'Track equipment and physical items',
            icon: <AssetIcon sx={{ fontSize: 40, color: '#10b981' }} />,
            path: '/cafm/assets',
            count: stats.assets,
            color: '#10b981'
        },
        {
            title: 'Maintenance',
            description: 'Work orders and facility upkeep',
            icon: <MaintenanceIcon sx={{ fontSize: 40, color: '#f59e0b' }} />,
            path: '/cafm/maintenance',
            count: stats.maintenance,
            color: '#f59e0b'
        }
    ];

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        CAFM Command Center
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Computer-Aided Facility Management. Oversee your physical assets, spaces, and maintenance.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/cafm/maintenance/new')}
                    sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                    New Request
                </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {modules.map((module) => (
                    <Grid size={{ xs: 12, md: 2.4 }} key={module.title}>
                        <Card
                            sx={{
                                borderRadius: 4,
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
                                }
                            }}
                            onClick={() => router.push(module.path)}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: `${module.color}15` }}>
                                        {module.icon}
                                    </Box>
                                    <Typography variant="h3" fontWeight={700} color="text.primary">
                                        {module.count}
                                    </Typography>
                                </Stack>
                                <Box sx={{ mt: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        {module.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        {module.description}
                                    </Typography>
                                    <Stack direction="row" spacing={1} alignItems="center" color="primary.main">
                                        <Typography variant="button" fontWeight={700}>Manage {module.title}</Typography>
                                        <ArrowForwardIcon fontSize="small" />
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
                <Grid size={{ xs: 12, md: 2.4 }}>
                    <Card
                        sx={{
                            borderRadius: 4,
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                                boxShadow: '0 12px 24px -10px rgba(0,0,0,0.1)'
                            },
                            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
                            color: 'white'
                        }}
                        onClick={() => router.push('/cafm/bms')}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                    <SensorIcon sx={{ fontSize: 40, color: '#f43f5e' }} />
                                </Box>
                                <Typography variant="h3" fontWeight={700} color="inherit">
                                    {stats.bmsDevices}
                                </Typography>
                            </Stack>
                            <Box sx={{ mt: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    BMS Sensors
                                </Typography>
                                <Typography variant="body2" sx={{ mb: 2, opacity: 0.8 }}>
                                    Real-time building management integration
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center" color="primary.light">
                                    <Typography variant="button" fontWeight={700}>Live Feeds</Typography>
                                    <ArrowForwardIcon fontSize="small" />
                                </Stack>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Content blocks, such as charts or list for quick monitoring */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 5 }}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight={700}>Priority Maintenance</Typography>
                                <Button size="small" onClick={() => router.push('/cafm/maintenance')}>View All</Button>
                            </Stack>

                            {criticalRequests.length > 0 ? (
                                <Stack spacing={2}>
                                    {criticalRequests.map((req: any) => (
                                        <Paper
                                            key={req.id}
                                            variant="outlined"
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                cursor: 'pointer',
                                                '&:hover': { bgcolor: 'action.hover' }
                                            }}
                                            onClick={() => router.push(`/cafm/maintenance/${req.id}`)}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="subtitle2" fontWeight={700}>{req.title}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {req.facility_name} • {req.asset_name || 'General'}
                                                    </Typography>
                                                </Box>
                                                <Chip
                                                    label={req.priority}
                                                    size="small"
                                                    color={req.priority === 'CRITICAL' ? 'error' : 'warning'}
                                                />
                                            </Stack>
                                        </Paper>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ bgcolor: '#f1f5f9', p: 4, borderRadius: 3, textAlign: 'center' }}>
                                    <MaintenanceIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                                    <Typography variant="h6" color="text.primary">No Priority Issues</Typography>
                                    <Typography variant="body2" color="text.secondary">All systems and facilities are running optimally.</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, height: '100%', bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Real-time Operations</Typography>
                            {bmsTelemetry.length > 0 ? (
                                <Stack spacing={2}>
                                    {bmsTelemetry.map((device: any) => (
                                        <Box key={device.id}>
                                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                                <Stack direction="row" spacing={1} alignItems="center">
                                                    {device.device_type === 'HVAC' && <TempIcon sx={{ color: '#ef4444' }} />}
                                                    {device.device_type === 'ENERGY' && <PowerIcon sx={{ color: '#f59e0b' }} />}
                                                    {device.device_type === 'LIGHTING' && <LightIcon sx={{ color: '#3b82f6' }} />}
                                                    <Typography variant="body2" fontWeight={600}>{device.name}</Typography>
                                                </Stack>
                                                <Typography variant="body2" fontWeight={700} color="primary">
                                                    {device.value}{device.device_type === 'HVAC' ? '°C' : (device.device_type === 'ENERGY' ? ' kW' : '%')}
                                                </Typography>
                                            </Stack>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(100, (device.value / 60) * 100)}
                                                sx={{ height: 6, borderRadius: 3, bgcolor: '#f1f5f9' }}
                                            />
                                        </Box>
                                    ))}
                                </Stack>
                            ) : (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <SensorIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                    <Typography variant="body2" color="text.secondary">No active BMS connections detected.</Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, height: '100%', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                        <CardContent sx={{ p: 4, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Capacity Insights</Typography>

                            <Box sx={{ my: 3, textAlign: 'center' }}>
                                <Typography variant="h2" fontWeight={800} color="primary.light">
                                    {stats.occupancyRatio}%
                                </Typography>
                                <Typography variant="caption" sx={{ opacity: 0.7, textTransform: 'uppercase', letterSpacing: 1 }}>
                                    Current Occupancy
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={stats.occupancyRatio}
                                    sx={{ mt: 2, height: 8, borderRadius: 4, bgcolor: 'rgba(255,255,255,0.1)' }}
                                />
                            </Box>

                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 4 }}>
                                Your facilities have a combined capacity of <strong>{stats.totalCapacity}</strong> people.
                                {stats.occupancyRatio > 90 ? ' Utilization is near critical levels.' : ' Space optimization is currently healthy.'}
                            </Typography>

                            <Box sx={{ flexGrow: 1 }} />

                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                <Typography variant="caption" display="block" sx={{ mb: 1, opacity: 0.8 }}>RECOMMENDED ACTION</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    {stats.occupancyRatio > 85 ? 'Review expansion requirements for Q3.' : 'Ideal for upcoming workplace events.'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* NEW SECTION: Compliance & PPM */}
            <Typography variant="h5" fontWeight={700} sx={{ mt: 6, mb: 3 }}>Operations & Compliance</Typography>
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'primary.light', color: 'primary.main' }}>
                                    <PPMIcon />
                                </Box>
                                <Typography variant="h6" fontWeight={700}>Planned Maintenance (PPM)</Typography>
                            </Stack>
                            <Stack spacing={2}>
                                {upcomingPPM.length > 0 ? upcomingPPM.map((ppm: any) => (
                                    <Box key={ppm.id} sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 2 }}>
                                        <Typography variant="subtitle2" fontWeight={700}>{ppm.task_name}</Typography>
                                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 1 }}>
                                            <Typography variant="caption" color="text.secondary">{ppm.asset_name}</Typography>
                                            <Chip label={ppm.frequency} size="small" variant="outlined" />
                                        </Stack>
                                        <Typography variant="caption" display="block" sx={{ mt: 1, color: 'primary.main', fontWeight: 600 }}>
                                            Next Due: {new Date(ppm.next_due_date).toLocaleDateString()}
                                        </Typography>
                                    </Box>
                                )) : (
                                    <Typography variant="body2" color="text.secondary">No upcoming PPM tasks.</Typography>
                                )}
                            </Stack>
                            <Button fullWidth variant="outlined" sx={{ mt: 2, borderRadius: 2 }}>View Schedule</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'success.light', color: 'success.main' }}>
                                    <ComplianceIcon />
                                </Box>
                                <Typography variant="h6" fontWeight={700}>Audit Compliance</Typography>
                            </Stack>
                            <Box sx={{ textAlign: 'center', py: 2 }}>
                                <Typography variant="h2" fontWeight={800} color="success.main">{stats.complianceScore}%</Typography>
                                <Typography variant="caption" color="text.secondary">AVERAGE COMPLIANCE SCORE</Typography>
                            </Box>
                            <Stack spacing={1} sx={{ mt: 2 }}>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2">Safety Audit</Typography>
                                    <Typography variant="body2" fontWeight={700}>Passed (92%)</Typography>
                                </Stack>
                                <Stack direction="row" justifyContent="space-between">
                                    <Typography variant="body2">Resource Audit</Typography>
                                    <Typography variant="body2" fontWeight={700}>Pending</Typography>
                                </Stack>
                            </Stack>
                            <Button fullWidth variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>Full Audit History</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: '#fef2f2' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'error.main', color: 'white' }}>
                                    <CalendarIcon />
                                </Box>
                                <Typography variant="h6" fontWeight={700}>SLA Monitoring</Typography>
                            </Stack>
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" gutterBottom>Response Performance</Typography>
                                <LinearProgress variant="determinate" value={85} color="success" sx={{ height: 6, borderRadius: 3 }} />
                            </Box>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="body2" gutterBottom>Resolution Performance</Typography>
                                <LinearProgress variant="determinate" value={72} color="warning" sx={{ height: 6, borderRadius: 3 }} />
                            </Box>
                            <Typography variant="caption" color="error.main" fontWeight={700}>
                                3 Work Orders currently exceeding SLA resolution time!
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* NEW SECTION: Reporting, Communication & Administration */}
            <Typography variant="h5" fontWeight={700} sx={{ mt: 6, mb: 3 }}>Management & Coordination</Typography>
            <Grid container spacing={3} sx={{ mb: 6 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'secondary.light', color: 'secondary.main' }}>
                                    <AnalyticsIcon />
                                </Box>
                                <Typography variant="h6" fontWeight={700}>Reporting & Analytics</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Generate comprehensive reports on asset health, maintenance costs, and team performance.
                            </Typography>
                            <Stack spacing={1} sx={{ mb: 3 }}>
                                <Button size="small" variant="text" startIcon={<ExportIcon />} sx={{ justifyContent: 'flex-start' }}>Export Asset Inventory (XLS)</Button>
                                <Button size="small" variant="text" startIcon={<ExportIcon />} sx={{ justifyContent: 'flex-start' }}>Monthly Maintenance Report (PDF)</Button>
                            </Stack>
                            <Button fullWidth variant="contained" sx={{ borderRadius: 2, bgcolor: 'secondary.main' }}>Open Analytics Hub</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'info.light', color: 'info.main' }}>
                                    <ChatIcon />
                                </Box>
                                <Typography variant="h6" fontWeight={700}>Coordination Center</Typography>
                            </Stack>
                            <Box sx={{ bgcolor: '#f1f5f9', p: 2, borderRadius: 2, mb: 3 }}>
                                <Typography variant="caption" fontWeight={700} color="text.secondary">LATEST TEAM MESSAGE</Typography>
                                <Typography variant="body2" sx={{ mt: 1 }}>"HVAC technician has arrived at Site B. Proceeding with filter replacement."</Typography>
                                <Typography variant="caption" display="block" sx={{ mt: 1, color: 'info.main' }}>- Admin, 10 mins ago</Typography>
                            </Box>
                            <Button fullWidth variant="outlined" sx={{ borderRadius: 2 }}>Open Team Chat</Button>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                                <Box sx={{ p: 1, borderRadius: 2, bgcolor: 'warning.light', color: 'warning.main' }}>
                                    <AdminIcon />
                                </Box>
                                <Typography variant="h6" fontWeight={700}>System Administration</Typography>
                            </Stack>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                Manage CAFM permissions, audit logs, and global facility settings.
                            </Typography>
                            <Stack spacing={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">System Health</Typography>
                                    <Chip label="Stable" size="small" color="success" />
                                </Stack>
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                    <Typography variant="body2">Pending Audits</Typography>
                                    <Typography variant="body2" fontWeight={700}>2 Devices</Typography>
                                </Stack>
                            </Stack>
                            <Button fullWidth variant="outlined" sx={{ mt: 3, borderRadius: 2 }}>Admin Console</Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
