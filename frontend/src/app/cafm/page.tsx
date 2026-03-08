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
} from '@mui/material';
import {
    MoreVert as MoreVertIcon,
    HomeWork as FacilityIcon,
    Room as SpaceIcon,
    Inventory as AssetIcon,
    Build as MaintenanceIcon,
    ArrowForward as ArrowForwardIcon,
    Add as AddIcon
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
        maintenance: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            try {
                const [facilitiesRes, spacesRes, assetsRes, maintenanceRes] = await Promise.all([
                    axios.get('cafm/facilities/'),
                    axios.get('cafm/spaces/'),
                    axios.get('cafm/assets/'),
                    axios.get('cafm/maintenance-requests/')
                ]);

                setStats({
                    facilities: facilitiesRes.data.length,
                    spaces: spacesRes.data.length,
                    assets: assetsRes.data.length,
                    maintenance: maintenanceRes.data.length
                });
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
                    onClick={() => router.push('/cafm/maintenance')}
                    sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                    New Request
                </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {modules.map((module) => (
                    <Grid size={{ xs: 12, md: 3 }} key={module.title}>
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
            </Grid>

            {/* Content blocks, such as charts or list for quick monitoring */}
            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: 4, height: '100%' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight={700}>Critical Maintenance Requests</Typography>
                                <Button size="small">View All</Button>
                            </Stack>
                            <Box sx={{ bgcolor: '#f1f5f9', p: 4, borderRadius: 3, textAlign: 'center' }}>
                                <MaintenanceIcon sx={{ fontSize: 40, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.primary">No Critical Issues</Typography>
                                <Typography variant="body2" color="text.secondary">All systems and facilities are running optimally.</Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, height: '100%', background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Capacity Insights</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 4 }}>
                                Facility utilization is currently at 85%. Consider reviewing space allocation on Floor 3 for upcoming hires.
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                <Typography variant="caption" display="block" sx={{ mb: 1, opacity: 0.8 }}>RECOMMENDED ACTION</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    Schedule a space utilization review meeting.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
