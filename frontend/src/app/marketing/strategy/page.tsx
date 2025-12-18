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
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Chip,
    Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    TrendingUp as StrategyIcon,
    Group as AudienceIcon,
    Stars as ValuePropIcon,
    Share as ChannelIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function MarketingStrategy() {
    const [mounted, setMounted] = useState(false);
    const [strategies, setStrategies] = useState<any[]>([]);
    const [analyses, setAnalyses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        analysis: '',
        title: '',
        target_audience: '',
        value_proposition: '',
        key_channels: '',
        objectives: ''
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [strategiesRes, analysesRes] = await Promise.all([
                axios.get('marketing/strategies/'),
                axios.get('marketing/analyses/')
            ]);
            setStrategies(strategiesRes.data);
            setAnalyses(analysesRes.data);
        } catch (error) {
            console.error('Error fetching strategy data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('marketing/strategies/', formData);
            setOpenDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error saving strategy:', error);
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Marketing Strategy
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Defining the high-level roadmap for market success.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Create Strategy
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {strategies.length > 0 ? strategies.map((strategy) => (
                    <Grid item xs={12} md={6} key={strategy.id}>
                        <Card sx={{ borderRadius: 4, height: '100%' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                                    <Avatar sx={{ bgcolor: 'success.light' }}><StrategyIcon /></Avatar>
                                    <Box>
                                        <Typography variant="h6" fontWeight={700}>{strategy.title}</Typography>
                                        <Typography variant="caption" color="text.secondary">Based on: {strategy.analysis_name}</Typography>
                                    </Box>
                                </Stack>

                                <Divider sx={{ my: 2 }} />

                                <Stack spacing={2}>
                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <AudienceIcon fontSize="small" color="action" />
                                            <Typography variant="subtitle2" fontWeight={700}>Target Audience</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">{strategy.target_audience}</Typography>
                                    </Box>

                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <ValuePropIcon fontSize="small" color="action" />
                                            <Typography variant="subtitle2" fontWeight={700}>Value Proposition</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">{strategy.value_proposition}</Typography>
                                    </Box>

                                    <Box>
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
                                            <ChannelIcon fontSize="small" color="action" />
                                            <Typography variant="subtitle2" fontWeight={700}>Key Channels</Typography>
                                        </Stack>
                                        <Stack direction="row" spacing={1} flexWrap="wrap">
                                            {strategy.key_channels.split(',').map((channel: string) => (
                                                <Chip key={channel} label={channel.trim()} size="small" variant="outlined" />
                                            ))}
                                        </Stack>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Grid item xs={12} textAlign="center" sx={{ py: 10 }}>
                        <StrategyIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">Define your first marketing strategy to get started.</Typography>
                    </Grid>
                )}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>New Strategic Framework</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            fullWidth
                            label="Select Source Analysis"
                            value={formData.analysis}
                            onChange={(e) => setFormData({ ...formData, analysis: e.target.value })}
                        >
                            {analyses.map((a) => (
                                <MenuItem key={a.id} value={a.id}>{a.title}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Strategy Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Target Audience"
                            placeholder="Who are we talking to?"
                            value={formData.target_audience}
                            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Value Proposition"
                            placeholder="Why should they choose us?"
                            value={formData.value_proposition}
                            onChange={(e) => setFormData({ ...formData, value_proposition: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Key Channels"
                            placeholder="Comma separated (e.g. Google Ads, LinkedIn, Email)"
                            value={formData.key_channels}
                            onChange={(e) => setFormData({ ...formData, key_channels: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Strategic Objectives"
                            value={formData.objectives}
                            onChange={(e) => setFormData({ ...formData, objectives: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Finalize Strategy</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
