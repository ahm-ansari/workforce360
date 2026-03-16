'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    MenuItem,
    Stack,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment,
    Divider
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, QueryBuilder as TimeIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function NewTimesheet() {
    const router = useRouter();
    const [placements, setPlacements] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        placement: '',
        start_date: '',
        end_date: '',
        total_hours: '',
        billable_amount: '',
        notes: '',
        status: 'SUBMITTED'
    });

    useEffect(() => {
        const fetchPlacements = async () => {
            try {
                const response = await axios.get('outsourcing/staff/');
                setPlacements(response.data.filter((p: any) => p.status === 'ACTIVE'));
            } catch (err) {
                console.error('Error fetching placements:', err);
                setError('Failed to load active placements.');
            } finally {
                setFetchingData(false);
            }
        };
        fetchPlacements();
    }, []);

    const handlePlacementChange = (e: any) => {
        const val = e.target.value;
        const selectedPlacement = placements.find((p: any) => p.id === val);
        setFormData(prev => ({
            ...prev,
            placement: val,
            billable_amount: selectedPlacement ? (parseFloat(prev.total_hours || '0') * parseFloat(selectedPlacement.billing_rate)).toString() : prev.billable_amount
        }));
    };

    const handleHoursChange = (e: any) => {
        const hours = e.target.value;
        const selectedPlacement: any = placements.find((p: any) => p.id === formData.placement);
        setFormData(prev => ({
            ...prev,
            total_hours: hours,
            billable_amount: selectedPlacement ? (parseFloat(hours || '0') * parseFloat(selectedPlacement.billing_rate)).toString() : prev.billable_amount
        }));
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('outsourcing/timesheets/', formData);
            router.push('/outsourcing/timesheets');
        } catch (err: any) {
            console.error('Error submitting timesheet:', err);
            setError(err.response?.data?.detail || 'Failed to submit timesheet. Please verify all fields.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress size={40} />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1200, mx: 'auto' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: 'action.hover' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={800}>
                        Log Billable Hours
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Submit service hours for verification and client billing
                    </Typography>
                </Box>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                    Activity & Assignment
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Personnel Placement"
                                        name="placement"
                                        value={formData.placement}
                                        onChange={handlePlacementChange}
                                        required
                                        helperText="Select the active deployment for this period"
                                    >
                                        {placements.map((p: any) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.employee_name} — {p.client_name} ({p.role})
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Grid container spacing={3}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Service Start Date"
                                                name="start_date"
                                                type="date"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Service End Date"
                                                name="end_date"
                                                type="date"
                                                slotProps={{ inputLabel: { shrink: true } }}
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        fullWidth
                                        label="Total Billable Hours"
                                        name="total_hours"
                                        type="number"
                                        inputProps={{ step: 0.1, min: 0 }}
                                        value={formData.total_hours}
                                        onChange={handleHoursChange}
                                        required
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <TimeIcon fontSize="small" color="primary" />
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Work Description & Comments"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        multiline
                                        rows={5}
                                        placeholder="Detailed summary of deliverables and activities performed during this period..."
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={4}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', bgcolor: 'primary.lighter', border: '1px solid', borderColor: 'primary.light' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} color="primary.dark" gutterBottom sx={{ mb: 3 }}>
                                        Financial Summary
                                    </Typography>
                                    <Box>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Effort logged:</Typography>
                                            <Typography variant="subtitle2" fontWeight={700}>{formData.total_hours || '0.0'} Hours</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 2 }}>
                                            <Typography variant="body2" color="text.secondary">Contract rate:</Typography>
                                            <Typography variant="subtitle2" fontWeight={700}>
                                                ${(placements.find((p: any) => p.id === formData.placement) as any)?.billing_rate || '0.00'}/hr
                                            </Typography>
                                        </Stack>
                                        <Divider sx={{ my: 2, borderColor: 'primary.light' }} />
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight={800} color="primary.dark">Total Billing:</Typography>
                                            <Typography variant="h5" fontWeight={800} color="primary.dark">
                                                ${parseFloat(formData.billable_amount || '0').toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </CardContent>
                            </Card>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={loading || !formData.placement}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                sx={{ 
                                    borderRadius: 3, 
                                    py: 2, 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
                                }}
                            >
                                {loading ? 'Processing...' : 'Submit Records'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
