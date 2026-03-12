'use client';
import { useEffect, useState } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Avatar,
    Paper,
    Divider
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import EventIcon from '@mui/icons-material/Event';
import HailIcon from '@mui/icons-material/Hail';
import api from '@/lib/axios';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function HRDashboard() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ jobs: 0, candidates: 0, interviews: 0, hires: 0 });
    const [pipelineData, setPipelineData] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [jobsRes, candidatesRes, interviewsRes, pipelineRes] = await Promise.all([
                    api.get('recruitment/jobs/').catch(() => ({ data: [] })),
                    api.get('recruitment/candidates/').catch(() => ({ data: [] })),
                    api.get('recruitment/interviews/').catch(() => ({ data: [] })),
                    api.get('recruitment/candidates/pipeline/').catch(() => ({ data: [] })),
                ]);

                setStats({
                    jobs: jobsRes.data?.length || 0,
                    candidates: candidatesRes.data?.length || 0,
                    interviews: interviewsRes.data?.length || 0,
                    hires: candidatesRes.data?.filter((c: any) => c.status === 'HIRED').length || 0,
                });

                const chartData = pipelineRes.data?.map((p: any) => ({
                    stage: p.stage.name,
                    count: p.candidates.length
                })) || [];
                setPipelineData(chartData);

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

    const cards = [
        { title: 'Open Jobs', value: stats.jobs, icon: <WorkIcon />, color: '#1976d2' },
        { title: 'Total Candidates', value: stats.candidates, icon: <PeopleIcon />, color: '#2e7d32' },
        { title: 'Interviews Scheduled', value: stats.interviews, icon: <EventIcon />, color: '#ed6c02' },
        { title: 'Successful Hires', value: stats.hires, icon: <HailIcon />, color: '#9c27b0' },
    ];

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f5f5', minHeight: '100vh' }}>
            <Typography variant="h4" gutterBottom fontWeight="bold" color="primary">
                HR & Recruitment Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {cards.map((c, i) => (
                    <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card sx={{
                            borderRadius: '16px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            borderLeft: `6px solid ${c.color}`
                        }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold">
                                            {c.value}
                                        </Typography>
                                        <Typography color="text.secondary" variant="subtitle2">{c.title}</Typography>
                                    </Box>
                                    <Avatar sx={{ bgcolor: `${c.color}20`, color: c.color, width: 56, height: 56 }}>
                                        {c.icon}
                                    </Avatar>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12 }}>
                    <Paper sx={{ p: 4, borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            Recruitment Pipeline Funnel
                        </Typography>
                        <Divider sx={{ mb: 3 }} />
                        <Box sx={{ height: 400 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={pipelineData} layout="vertical" margin={{ left: 50 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                    <XAxis type="number" />
                                    <YAxis dataKey="stage" type="category" width={150} />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                        {pipelineData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
