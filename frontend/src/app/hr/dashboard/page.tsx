'use client';
import { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, CircularProgress, Avatar } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import api from '@/lib/axios';

interface StatCard {
    title: string;
    value: number;
    icon: JSX.Element;
    color: string;
}

export default function HRDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ jobs: 0, candidates: 0, interviews: 0, hires: 0 });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, candidatesRes, interviewsRes] = await Promise.all([
                    api.get('recruitment/jobs/').catch(() => ({ data: [] })),
                    api.get('recruitment/candidates/').catch(() => ({ data: [] })),
                    api.get('recruitment/interviews/').catch(() => ({ data: [] })),
                ]);
                setStats({
                    jobs: jobsRes.data?.length || 0,
                    candidates: candidatesRes.data?.length || 0,
                    interviews: interviewsRes.data?.length || 0,
                    hires: candidatesRes.data?.filter((c: any) => c.status === 'HIRED').length || 0,
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    const cards: StatCard[] = [
        { title: 'Open Jobs', value: stats.jobs, icon: <WorkIcon />, color: '#1976d2' },
        { title: 'Candidates', value: stats.candidates, icon: <PeopleIcon />, color: '#2e7d32' },
        { title: 'Interviews', value: stats.interviews, icon: <EventIcon />, color: '#ed6c02' },
        { title: 'Hires', value: stats.hires, icon: <AttachMoneyIcon />, color: '#9c27b0' },
    ];

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                HR Dashboard
            </Typography>
            <Grid container spacing={3}>
                {cards.map((c, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{ bgcolor: c.color, color: 'white' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h5" fontWeight="bold">
                                            {c.value}
                                        </Typography>
                                        <Typography>{c.title}</Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>{c.icon}</Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
