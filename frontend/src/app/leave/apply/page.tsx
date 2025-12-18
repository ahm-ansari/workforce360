'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, MenuItem, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

interface LeaveType {
    id: number;
    name: string;
}

export default function ApplyLeavePage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [formData, setFormData] = useState({
        leave_type: '',
        start_date: '',
        end_date: '',
        reason: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const response = await api.get('hr/leave-types/');
            setLeaveTypes(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch leave types:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await api.post('hr/leaves/', {
                ...formData,
                employee: user?.employee_id
            });
            router.push('/leave');
        } catch (err: any) {
            console.error('Failed to apply leave:', err);
            setError(err.response?.data?.detail || 'Failed to submit leave request');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Apply for Leave
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                select
                                fullWidth
                                label="Leave Type"
                                value={formData.leave_type}
                                onChange={(e) => setFormData({ ...formData, leave_type: e.target.value })}
                                required
                            >
                                {leaveTypes.map((type) => (
                                    <MenuItem key={type.id} value={type.id}>
                                        {type.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Start Date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="End Date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.end_date}
                                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={4}
                                label="Reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? 'Submitting...' : 'Submit Request'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
