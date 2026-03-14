'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Stack,
    Grid,
    MenuItem
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function NewMaintenanceRequest() {
    const router = useRouter();
    const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
    const [spaces, setSpaces] = useState<{ id: number; name: string }[]>([]);
    const [assets, setAssets] = useState<{ id: number; name: string }[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [formData, setFormData] = useState({
        work_order_id: '',
        title: '',
        description: '',
        priority: 'MEDIUM',
        status: 'OPEN',
        facility: '',
        space: '',
        location_details: '',
        asset: '',
        assigned_to: '',
        estimated_completion_time: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [facRes, spRes, astRes, empRes] = await Promise.all([
                    axios.get('cafm/facilities/'),
                    axios.get('cafm/spaces/'),
                    axios.get('cafm/assets/'),
                    axios.get('employees/employees/')
                ]);
                setFacilities(facRes.data);
                setSpaces(spRes.data);
                setAssets(astRes.data);
                setEmployees(empRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        fetchInitialData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: any = { ...formData };
            if (!payload.space) delete payload.space;
            if (!payload.asset) delete payload.asset;
            if (!payload.assigned_to) delete payload.assigned_to;
            if (!payload.estimated_completion_time) delete payload.estimated_completion_time;

            await axios.post('cafm/maintenance-requests/', payload);
            router.push('/cafm/maintenance');
        } catch (error) {
            console.error('Error submitting maintenance request', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 3 }}
            >
                Back to Requests
            </Button>

            <Typography variant="h4" fontWeight={700} gutterBottom>
                New Maintenance Request
            </Typography>

            <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Work Order ID"
                                    name="work_order_id"
                                    value={formData.work_order_id}
                                    onChange={handleChange}
                                    placeholder="e.g. WO-2024-001"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Task Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    required
                                    label="Facility"
                                    name="facility"
                                    value={formData.facility}
                                    onChange={handleChange}
                                >
                                    {facilities.map((f) => (
                                        <MenuItem key={f.id} value={f.id.toString()}>
                                            {f.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Priority"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="LOW">Low</MenuItem>
                                    <MenuItem value="MEDIUM">Medium</MenuItem>
                                    <MenuItem value="HIGH">High</MenuItem>
                                    <MenuItem value="CRITICAL">Critical</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Space (Optional)"
                                    name="space"
                                    value={formData.space}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {spaces.map((s) => (
                                        <MenuItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Asset (Optional)"
                                    name="asset"
                                    value={formData.asset}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""><em>None</em></MenuItem>
                                    {assets.map((a) => (
                                        <MenuItem key={a.id} value={a.id.toString()}>
                                            {a.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Specific Location Details"
                                    name="location_details"
                                    value={formData.location_details}
                                    onChange={handleChange}
                                    placeholder="e.g. Near the server room entrance, Floor 2"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Assigned Technician"
                                    name="assigned_to"
                                    value={formData.assigned_to}
                                    onChange={handleChange}
                                >
                                    <MenuItem value=""><em>Unassigned</em></MenuItem>
                                    {employees.map((e) => (
                                        <MenuItem key={e.id} value={e.id.toString()}>
                                            {e.user?.first_name} {e.user?.last_name} ({e.designation_name})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="datetime-local"
                                    label="Estimated Completion"
                                    name="estimated_completion_time"
                                    value={formData.estimated_completion_time}
                                    onChange={handleChange}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    rows={4}
                                    label="Issue Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? 'Submitting...' : 'Submit Request'}
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </Box>
    );
}
