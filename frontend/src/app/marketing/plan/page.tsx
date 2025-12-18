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
    LinearProgress,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Assignment as PlanIcon,
    MonetizationOn as BudgetIcon,
    Event as DateIcon,
    Campaign as CampaignIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function MarketingPlan() {
    const [mounted, setMounted] = useState(false);
    const [plans, setPlans] = useState<any[]>([]);
    const [strategies, setStrategies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        strategy: '',
        title: '',
        description: '',
        budget: '',
        start_date: '',
        end_date: '',
        status: 'DRAFT'
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [plansRes, strategiesRes] = await Promise.all([
                axios.get('marketing/plans/'),
                axios.get('marketing/strategies/')
            ]);
            setPlans(plansRes.data);
            setStrategies(strategiesRes.data);
        } catch (error) {
            console.error('Error fetching plan data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('marketing/plans/', formData);
            setOpenDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error saving plan:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'EXECUTING': return 'primary';
            case 'COMPLETED': return 'success';
            case 'DRAFT': return 'default';
            case 'APPROVED': return 'info';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Actionable Marketing Plans
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Executable roadmaps with budgets and campaign tracking.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    New Marketing Plan
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {plans.length > 0 ? plans.map((plan) => (
                    <Grid item xs={12} key={plan.id}>
                        <Card sx={{ borderRadius: 4 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Grid container spacing={4} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'primary.light', color: 'white' }}>
                                                <PlanIcon />
                                            </Box>
                                            <Box>
                                                <Typography variant="h6" fontWeight={700}>{plan.title}</Typography>
                                                <Typography variant="caption" color="text.secondary">Strategy: {plan.strategy_name}</Typography>
                                            </Box>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={2}>
                                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                            <BudgetIcon fontSize="small" />
                                            <Typography variant="body2" fontWeight={600}>${parseFloat(plan.budget).toLocaleString()}</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={3}>
                                        <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                                            <DateIcon fontSize="small" />
                                            <Typography variant="body2">{plan.start_date} → {plan.end_date}</Typography>
                                        </Stack>
                                    </Grid>

                                    <Grid item xs={6} md={2}>
                                        <Chip
                                            label={plan.status}
                                            size="small"
                                            color={getStatusColor(plan.status) as any}
                                            variant="outlined"
                                            sx={{ fontWeight: 700 }}
                                        />
                                    </Grid>

                                    <Grid item xs={6} md={1}>
                                        <Button variant="text" size="small">Details</Button>
                                    </Grid>
                                </Grid>

                                {plan.campaigns && plan.campaigns.length > 0 && (
                                    <Box sx={{ mt: 3, p: 2, bgcolor: '#f1f5f9', borderRadius: 3 }}>
                                        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>Linked Campaigns</Typography>
                                        <Stack direction="row" spacing={2} flexWrap="wrap">
                                            {plan.campaigns.map((c: any) => (
                                                <Chip
                                                    key={c.id}
                                                    icon={<CampaignIcon sx={{ fontSize: '1rem !important' }} />}
                                                    label={`${c.name} (${c.platform})`}
                                                    size="small"
                                                    sx={{ bgcolor: 'white' }}
                                                />
                                            ))}
                                        </Stack>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                )) : (
                    <Grid item xs={12} textAlign="center" sx={{ py: 10 }}>
                        <PlanIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" color="text.secondary">No marketing plans found. Turn your strategies into action.</Typography>
                    </Grid>
                )}
            </Grid>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>Initiate Marketing Plan</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            fullWidth
                            label="Select Strategy"
                            value={formData.strategy}
                            onChange={(e) => setFormData({ ...formData, strategy: e.target.value })}
                        >
                            {strategies.map((s) => (
                                <MenuItem key={s.id} value={s.id}>{s.title}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Plan Title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Execution Roadmap"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Total Budget ($)"
                                    value={formData.budget}
                                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                                    InputProps={{
                                        startAdornment: <BudgetIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} />
                                    }}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Start Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.start_date}
                                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="End Date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.end_date}
                                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Deploy Plan</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
