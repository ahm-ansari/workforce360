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
                const response = await axios.get('/api/outsourcing/staff/');
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
            await axios.post('/api/outsourcing/timesheets/', formData);
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    variant="text"
                >
                    Back
                </Button>
                <Typography variant="h4" fontWeight={700}>
                    Submit Timesheet
                </Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Time Entry Details
                                </Typography>
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Active Placement"
                                        name="placement"
                                        value={formData.placement}
                                        onChange={handlePlacementChange}
                                        required
                                        helperText="Select the employee and client assignment"
                                    >
                                        {placements.map((p: any) => (
                                            <MenuItem key={p.id} value={p.id}>
                                                {p.employee_name} @ {p.client_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Period Start"
                                                name="start_date"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={formData.start_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Period End"
                                                name="end_date"
                                                type="date"
                                                InputLabelProps={{ shrink: true }}
                                                value={formData.end_date}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        fullWidth
                                        label="Total Work Hours"
                                        name="total_hours"
                                        type="number"
                                        inputProps={{ step: 0.5, min: 0 }}
                                        value={formData.total_hours}
                                        onChange={handleHoursChange}
                                        required
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <TimeIcon fontSize="small" />
                                                </InputAdornment>
                                            ),
                                        }}
                                    />

                                    <TextField
                                        fullWidth
                                        label="Notes / Description of Work"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleChange}
                                        multiline
                                        rows={4}
                                        placeholder="Briefly describe the tasks performed during this period..."
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 2, bgcolor: 'primary.lighter' }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} color="primary" gutterBottom>
                                        Billing Summary
                                    </Typography>
                                    <Box sx={{ mt: 2 }}>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">Total Hours:</Typography>
                                            <Typography variant="body2" fontWeight={600}>{formData.total_hours || '0.0'}</Typography>
                                        </Stack>
                                        <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                                            <Typography variant="body2" color="text.secondary">Billing Rate:</Typography>
                                            <Typography variant="body2" fontWeight={600}>
                                                ${(placements.find((p: any) => p.id === formData.placement) as any)?.billing_rate || '0.00'}/hr
                                            </Typography>
                                        </Stack>
                                        <Divider sx={{ my: 1.5 }} />
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle1" fontWeight={700}>Total Billable:</Typography>
                                            <Typography variant="h6" fontWeight={700} color="primary.main">
                                                ${parseFloat(formData.billable_amount || '0').toFixed(2)}
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
                                sx={{ borderRadius: 2, height: 50 }}
                            >
                                {loading ? 'Submitting...' : 'Submit for Approval'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
