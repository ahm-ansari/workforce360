'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    MenuItem,
    Stack,
    IconButton,
    Alert,
    FormControlLabel,
    Switch
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function NewPPMSchedule() {
    const router = useRouter();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        asset: '',
        task_name: '',
        description: '',
        frequency: 'MONTHLY',
        next_due_date: new Date().toISOString().split('T')[0],
        is_active: true
    });

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get('cafm/assets/');
                setAssets(response.data);
            } catch (err) {
                console.error('Error fetching assets:', err);
            }
        };
        fetchAssets();
    }, []);

    const handleChange = (e: any) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await axios.post('cafm/ppm-schedules/', formData);
            router.push('/cafm/ppm');
        } catch (err: any) {
            console.error('Error creating PPM schedule:', err);
            setError(err.response?.data?.message || 'Failed to create PPM schedule. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: 'white', boxShadow: 1 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={700}>Create PPM Schedule</Typography>
                    <Typography variant="body1" color="text.secondary">Defined automated maintenance cycles for your assets.</Typography>
                </Box>
            </Stack>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper component="form" onSubmit={handleSubmit} sx={{ p: 4, borderRadius: 4 }}>
                        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Task Name"
                                    name="task_name"
                                    required
                                    value={formData.task_name}
                                    onChange={handleChange}
                                    placeholder="e.g., HVAC Quarterly Service"
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Target Asset"
                                    name="asset"
                                    required
                                    value={formData.asset}
                                    onChange={handleChange}
                                >
                                    {assets.map((asset: any) => (
                                        <MenuItem key={asset.id} value={asset.id}>
                                            {asset.name} ({asset.asset_id || asset.category})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Maintenance Frequency"
                                    name="frequency"
                                    required
                                    value={formData.frequency}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="WEEKLY">Weekly</MenuItem>
                                    <MenuItem value="MONTHLY">Monthly</MenuItem>
                                    <MenuItem value="QUARTERLY">Quarterly</MenuItem>
                                    <MenuItem value="YEARLY">Yearly</MenuItem>
                                </TextField>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Next Due Date"
                                    name="next_due_date"
                                    required
                                    value={formData.next_due_date}
                                    onChange={handleChange}
                                    InputLabelProps={{ shrink: true }}
                                />
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box sx={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={formData.is_active}
                                                onChange={handleChange}
                                                name="is_active"
                                            />
                                        }
                                        label="Enable automated generation"
                                    />
                                </Box>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Task Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Detail the steps or requirements for this maintenance task..."
                                />
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                    <Button
                                        variant="outlined"
                                        startIcon={<CancelIcon />}
                                        onClick={() => router.back()}
                                        disabled={loading}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        variant="contained"
                                        type="submit"
                                        startIcon={<SaveIcon />}
                                        loading={loading}
                                    >
                                        Save Schedule
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Typography variant="h6" fontWeight={700} gutterBottom>Maintenance Strategy</Typography>
                    <Box sx={{ p: 3, bgcolor: '#eff6ff', borderRadius: 4, border: '1px solid #bfdbfe' }}>
                        <Typography variant="subtitle2" fontWeight={700} color="primary.main" gutterBottom>
                            💡 Pro Tip
                        </Typography>
                        <Typography variant="body2" sx={{ color: '#1e40af' }}>
                            Planned maintenance reduces emergency repair costs by up to 40%.
                            Ensure high-frequency tasks are assigned to assets with low reliability.
                        </Typography>
                    </Box>
                    <Stack spacing={2} sx={{ mt: 4 }}>
                        <Paper sx={{ p: 2, borderRadius: 2 }}>
                            <Typography variant="caption" fontWeight={700} display="block" gutterBottom>HINT</Typography>
                            <Typography variant="body2">
                                Automation will trigger a new Work Order 7 days before the "Next Due Date".
                            </Typography>
                        </Paper>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
