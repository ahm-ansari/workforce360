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
    Chip,
    Avatar,
    IconButton,
    Paper,
    Switch
} from '@mui/material';
import {
    Sensors as SensorIcon,
    Thermostat as TempIcon,
    Bolt as PowerIcon,
    Lightbulb as LightIcon,
    WaterDrop as WaterIcon,
    Security as SecurityIcon,
    SettingsRemote as RemoteIcon,
    NotificationsActive as AlertIcon,
    ArrowBack as ArrowBackIcon,
    Refresh as RefreshIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function BMSDashboard() {
    const router = useRouter();
    const [devices, setDevices] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDevices();
        const interval = setInterval(fetchDevices, 30000); // refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const fetchDevices = async () => {
        try {
            const response = await axios.get('cafm/bms-devices/');
            // Mock value injection if backend doesn't provide real-time stream
            const enhancedData = response.data.map((d: any) => ({
                ...d,
                value: Math.floor(Math.random() * 50) + (d.device_type === 'ENERGY' ? 200 : 18),
                status: Math.random() > 0.1 ? 'ONLINE' : 'OFFLINE'
            }));
            setDevices(enhancedData);
        } catch (error) {
            console.error('Error fetching BMS devices:', error);
        } finally {
            setLoading(false);
        }
    };

    const getDeviceIcon = (type: string) => {
        switch (type) {
            case 'HVAC': return <TempIcon />;
            case 'LIGHTING': return <LightIcon />;
            case 'ENERGY': return <PowerIcon />;
            case 'WATER': return <WaterIcon />;
            case 'SECURITY': return <SecurityIcon />;
            default: return <SensorIcon />;
        }
    };

    const getDeviceColor = (type: string) => {
        switch (type) {
            case 'HVAC': return '#ef4444';
            case 'LIGHTING': return '#3b82f6';
            case 'ENERGY': return '#f59e0b';
            case 'WATER': return '#06b6d4';
            case 'SECURITY': return '#8b5cf6';
            default: return '#64748b';
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#0f172a', minHeight: '100vh', color: 'white' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Box>
                    <Button 
                        startIcon={<ArrowBackIcon />} 
                        onClick={() => router.push('/cafm')}
                        sx={{ color: '#94a3b8', mb: 2 }}
                    >
                        Back to Command Center
                    </Button>
                    <Typography variant="h3" fontWeight={800} sx={{ letterSpacing: -1 }}>
                        Building Management System
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#94a3b8', fontWeight: 400 }}>
                        Real-time telemetry and edge device orchestration.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button variant="outlined" startIcon={<RefreshIcon />} onClick={fetchDevices} sx={{ borderColor: '#334155', color: 'white' }}>
                        Sync Now
                    </Button>
                    <Button variant="contained" sx={{ bgcolor: '#3b82f6' }}>
                        Add IoT Node
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {devices.map((device: any) => (
                    <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={device.id}>
                        <Card sx={{ bgcolor: '#1e293b', color: 'white', borderRadius: 5, border: '1px solid #334155', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', borderColor: getDeviceColor(device.device_type) } }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                                    <Avatar sx={{ bgcolor: `${getDeviceColor(device.device_type)}20`, color: getDeviceColor(device.device_type), width: 56, height: 56 }}>
                                        {getDeviceIcon(device.device_type)}
                                    </Avatar>
                                    <Box sx={{ textAlign: 'right' }}>
                                        <Chip 
                                            label={device.status} 
                                            size="small" 
                                            sx={{ 
                                                bgcolor: device.status === 'ONLINE' ? '#10b98120' : '#ef444420', 
                                                color: device.status === 'ONLINE' ? '#10b981' : '#ef4444',
                                                fontWeight: 800,
                                                fontSize: '0.65rem'
                                            }} 
                                        />
                                        <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#64748b' }}>
                                            ID: {device.external_id}
                                        </Typography>
                                    </Box>
                                </Stack>

                                <Typography variant="h6" fontWeight={800} gutterBottom>
                                    {device.name}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3 }}>
                                    {device.facility_name} • {device.location || 'Central Zone'}
                                </Typography>

                                <Box sx={{ mb: 4 }}>
                                    <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 1 }}>
                                        <Typography variant="h4" fontWeight={900}>
                                            {device.value}{device.device_type === 'HVAC' ? '°C' : (device.device_type === 'ENERGY' ? 'kW' : '%')}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#10b981' }}>+0.2% Normal</Typography>
                                    </Stack>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={Math.min(100, (device.value / (device.device_type === 'ENERGY' ? 500 : 50)) * 100)} 
                                        sx={{ height: 6, borderRadius: 3, bgcolor: '#334155', '& .MuiLinearProgress-bar': { bgcolor: getDeviceColor(device.device_type) } }}
                                    />
                                </Box>

                                <Stack direction="row" spacing={1}>
                                    <Button fullWidth variant="outlined" size="small" sx={{ borderColor: '#334155', color: 'white' }}>
                                        History
                                    </Button>
                                    <IconButton size="small" sx={{ bgcolor: '#334155', color: 'white', '&:hover': { bgcolor: '#475569' } }}>
                                        <RemoteIcon fontSize="small" />
                                    </IconButton>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
