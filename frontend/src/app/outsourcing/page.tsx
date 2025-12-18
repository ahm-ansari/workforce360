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
    PersonAdd as PersonAddIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

const StatCard = ({ title, value, icon, color, onClick }: any) => (
    <Card
        sx={{
            height: '100%',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: 4
            }
        }}
        onClick={onClick}
    >
        <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                    <Typography variant="overline" color="text.secondary" fontWeight={600}>
                        {title}
                    </Typography>
                    <Typography variant="h4" fontWeight={700} sx={{ my: 1 }}>
                        {value}
                    </Typography>
                </Box>
                <Box
                    sx={{
                        p: 1.5,
                        borderRadius: 2,
                        bgcolor: `${color}.lighter`,
                        color: `${color}.main`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
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
                const response = await axios.get('/api/outsourcing/requests/stats/');
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
                <CircularProgress />
            </Box>
        );
    }

    const statConfig = [
        {
            title: 'Active Placements',
            value: stats?.active_placements || 0,
            icon: <AssignmentIndIcon />,
            color: 'primary',
            path: '/outsourcing/staff'
        },
        {
            title: 'Open Requests',
            value: stats?.open_requests || 0,
            icon: <AssignmentIcon />,
            color: 'warning',
            path: '/outsourcing/requests'
        },
        {
            title: 'Active Contracts',
            value: stats?.active_contracts || 0,
            icon: <DescriptionIcon />,
            color: 'success',
            path: '/outsourcing/contracts'
        },
        {
            title: 'Pending Timesheets',
            value: stats?.pending_timesheets || 0,
            icon: <EventNoteIcon />,
            color: 'info',
            path: '/outsourcing/timesheets'
        },
    ];

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Outsourcing Overview
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Staffing Solutions & Outsourced Personnel Management
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<PersonAddIcon />}
                        onClick={() => router.push('/outsourcing/staff/new')}
                        sx={{ borderRadius: 2 }}
                    >
                        Assign Staff
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/outsourcing/requests/new')}
                        sx={{ borderRadius: 2 }}
                    >
                        New Request
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                {statConfig.map((stat) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={stat.title}>
                        <StatCard
                            {...stat}
                            onClick={() => router.push(stat.path)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ height: '100%', borderRadius: 2 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                Quick Management
                            </Typography>
                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            justifyContent: 'flex-start',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'action.hover',
                                            '&:hover': { bgcolor: 'action.selected' }
                                        }}
                                        onClick={() => router.push('/outsourcing/requests')}
                                    >
                                        <AssignmentIcon sx={{ mr: 2, color: 'warning.main' }} />
                                        <Box textAlign="left">
                                            <Typography variant="subtitle2" fontWeight={700}>Review Requests</Typography>
                                            <Typography variant="caption" color="text.secondary">Manage incoming staffing needs</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            justifyContent: 'flex-start',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'action.hover',
                                            '&:hover': { bgcolor: 'action.selected' }
                                        }}
                                        onClick={() => router.push('/outsourcing/timesheets')}
                                    >
                                        <EventNoteIcon sx={{ mr: 2, color: 'info.main' }} />
                                        <Box textAlign="left">
                                            <Typography variant="subtitle2" fontWeight={700}>Timesheet Approvals</Typography>
                                            <Typography variant="caption" color="text.secondary">Review and certify billable hours</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            justifyContent: 'flex-start',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'action.hover',
                                            '&:hover': { bgcolor: 'action.selected' }
                                        }}
                                        onClick={() => router.push('/outsourcing/staff')}
                                    >
                                        <AssignmentIndIcon sx={{ mr: 2, color: 'primary.main' }} />
                                        <Box textAlign="left">
                                            <Typography variant="subtitle2" fontWeight={700}>Staff Directory</Typography>
                                            <Typography variant="caption" color="text.secondary">View active client placements</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Button
                                        fullWidth
                                        variant="text"
                                        sx={{
                                            justifyContent: 'flex-start',
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: 'action.hover',
                                            '&:hover': { bgcolor: 'action.selected' }
                                        }}
                                        onClick={() => router.push('/outsourcing/contracts')}
                                    >
                                        <DescriptionIcon sx={{ mr: 2, color: 'success.main' }} />
                                        <Box textAlign="left">
                                            <Typography variant="subtitle2" fontWeight={700}>Active Contracts</Typography>
                                            <Typography variant="caption" color="text.secondary">Monitor agreement periods</Typography>
                                        </Box>
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ height: '100%', borderRadius: 2, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
                        <CardContent sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>
                                Business Growth
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.8, mb: 4 }}>
                                You have {stats?.open_requests || 0} open staffing requests. Fill them to increase your active placement count.
                            </Typography>

                            <Box sx={{ mt: 'auto' }}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => router.push('/outsourcing/requests/new')}
                                    sx={{ borderRadius: 2, py: 1.5, fontWeight: 700 }}
                                >
                                    Fulfill New Requirement
                                </Button>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
