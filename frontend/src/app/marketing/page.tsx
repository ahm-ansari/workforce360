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
    IconButton,
    LinearProgress,
    Chip,
    Avatar,
    Divider
} from '@mui/material';
import {
    Campaign as CampaignIcon,
    AutoGraph as AnalysisIcon,
    TrendingUp as StrategyIcon,
    Assignment as PlanIcon,
    Add as AddIcon,
    ArrowForward as ArrowForwardIcon,
    MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function MarketingOverview() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [stats, setStats] = useState({
        analyses: 0,
        strategies: 0,
        plans: 0,
        activeCampaigns: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setMounted(true);
        const fetchStats = async () => {
            try {
                const [analyses, strategies, plans] = await Promise.all([
                    axios.get('marketing/analyses/'),
                    axios.get('marketing/strategies/'),
                    axios.get('marketing/plans/')
                ]);

                setStats({
                    analyses: analyses.data.length,
                    strategies: strategies.data.length,
                    plans: plans.data.length,
                    activeCampaigns: plans.data.filter((p: any) => p.status === 'EXECUTING').length
                });
            } catch (error) {
                console.error('Error fetching marketing stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (!mounted) return null;

    const modules = [
        {
            title: 'Marketing Analysis',
            description: 'SWOT, Market Trends, and Competitor Insights',
            icon: <AnalysisIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
            path: '/marketing/analysis',
            count: stats.analyses,
            color: '#6366f1'
        },
        {
            title: 'Marketing Strategy',
            description: 'Target Audience, Value Proposition, and Objectives',
            icon: <StrategyIcon sx={{ fontSize: 40, color: 'success.main' }} />,
            path: '/marketing/strategy',
            count: stats.strategies,
            color: '#10b981'
        },
        {
            title: 'Marketing Plan',
            description: 'Campaigns, Budgets, and Execution Timelines',
            icon: <PlanIcon sx={{ fontSize: 40, color: 'warning.main' }} />,
            path: '/marketing/plan',
            count: stats.plans,
            color: '#f59e0b'
        }
    ];

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Marketing Command Center
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Strategize, analyze, and execute your brand's growth journey.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/marketing/plan')}
                    sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                    New Campaign
                </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {modules.map((module) => (
                    <Grid item xs={12} md={4} key={module.title}>
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
                                        <Typography variant="button" fontWeight={700}>Manage Module</Typography>
                                        <ArrowForwardIcon fontSize="small" />
                                    </Stack>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Card sx={{ borderRadius: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                                <Typography variant="h6" fontWeight={700}>Active Campaigns Timeline</Typography>
                                <Button size="small">View Calendar</Button>
                            </Stack>
                            <Stack spacing={3}>
                                {[
                                    { name: 'Q4 Brand Awareness', progress: 65, color: '#6366f1', status: 'In Progress' },
                                    { name: 'Product Launch 2.0', progress: 40, color: '#10b981', status: 'Phase 1' },
                                    { name: 'Social Media Blast', progress: 90, color: '#f59e0b', status: 'Wrapping Up' }
                                ].map((campaign) => (
                                    <Box key={campaign.name}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" fontWeight={600}>{campaign.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{campaign.progress}% Complete</Typography>
                                        </Stack>
                                        <LinearProgress
                                            variant="determinate"
                                            value={campaign.progress}
                                            sx={{
                                                height: 8,
                                                borderRadius: 4,
                                                bgcolor: '#f1f5f9',
                                                '& .MuiLinearProgress-bar': { bgcolor: campaign.color }
                                            }}
                                        />
                                    </Box>
                                ))}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 4, height: '100%', background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)', color: 'white' }}>
                        <CardContent sx={{ p: 3, display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Quick Insight</Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mb: 4 }}>
                                Based on your recent Marketing Analysis, there is a 15% increase in market interest for Enterprise solutions.
                            </Typography>
                            <Box sx={{ flexGrow: 1 }} />
                            <Box sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 3 }}>
                                <Typography variant="caption" display="block" sx={{ mb: 1, opacity: 0.8 }}>RECOMMENDED ACTION</Typography>
                                <Typography variant="body2" fontWeight={600}>
                                    Shift 20% budget to LinkedIn Lead Generation for better ROI.
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
