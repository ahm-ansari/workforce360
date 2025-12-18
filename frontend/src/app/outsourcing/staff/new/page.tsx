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
    Autocomplete
} from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function AssignStaff() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const requestIdParam = searchParams.get('requestId');

    const [requests, setRequests] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [companies, setCompanies] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        staffing_request: requestIdParam || '',
        employee: '',
        client: '',
        role: '',
        billing_rate: '',
        start_date: '',
        end_date: '',
        status: 'ACTIVE',
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [reqRes, empRes, compRes] = await Promise.all([
                    axios.get('outsourcing/requests/'),
                    axios.get('employees/'),
                    axios.get('visitors/companies/')
                ]);
                setRequests(reqRes.data);
                setEmployees(empRes.data);
                setCompanies(compRes.data);

                // If requestId is provided, auto-fill the client
                if (requestIdParam) {
                    const selectedReq = reqRes.data.find((r: any) => r.id.toString() === requestIdParam);
                    if (selectedReq) {
                        setFormData(prev => ({
                            ...prev,
                            client: selectedReq.client,
                            role: selectedReq.title,
                            billing_rate: selectedReq.proposed_rate || '',
                            start_date: selectedReq.start_date || ''
                        }));
                    }
                }
            } catch (err) {
                console.error('Error fetching assignment data:', err);
                setError('Failed to load necessary data. Please try again.');
            } finally {
                setFetchingData(false);
            }
        };
        fetchData();
    }, [requestIdParam]);

    const handleRequestChange = (e: any) => {
        const val = e.target.value;
        const selectedReq = requests.find((r: any) => r.id === val);
        if (selectedReq) {
            setFormData(prev => ({
                ...prev,
                staffing_request: val,
                client: selectedReq.client,
                role: selectedReq.title,
                billing_rate: selectedReq.proposed_rate || '',
                start_date: selectedReq.start_date || ''
            }));
        } else {
            setFormData(prev => ({ ...prev, staffing_request: val }));
        }
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
            await axios.post('outsourcing/staff/', formData);
            router.push('/outsourcing/staff');
        } catch (err: any) {
            console.error('Error creating assignment:', err);
            setError(err.response?.data?.detail || 'Failed to assign staff. Please check your input.');
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
                    Assign Staff to Client
                </Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Assignment Details
                                </Typography>
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Staffing Request (Optional)"
                                        name="staffing_request"
                                        value={formData.staffing_request}
                                        onChange={handleRequestChange}
                                        helperText="Select a request to auto-fill details"
                                    >
                                        <MenuItem value=""><em>None / Direct Placement</em></MenuItem>
                                        {requests.map((req: any) => (
                                            <MenuItem key={req.id} value={req.id}>
                                                {req.title} ({req.client_name})
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Autocomplete
                                        options={employees}
                                        getOptionLabel={(option: any) => option.full_name || `Employee #${option.id}`}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Employee" required />
                                        )}
                                        onChange={(_, newValue) => {
                                            setFormData(prev => ({ ...prev, employee: newValue ? newValue.id : '' }));
                                        }}
                                    />

                                    <TextField
                                        select
                                        fullWidth
                                        label="Client Company"
                                        name="client"
                                        value={formData.client}
                                        onChange={handleChange}
                                        required
                                        disabled={!!formData.staffing_request}
                                    >
                                        {companies.map((company: any) => (
                                            <MenuItem key={company.id} value={company.id}>
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <TextField
                                        fullWidth
                                        label="Role at Client"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Lead Developer"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 2, mt: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Notes & Remarks
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    multiline
                                    rows={3}
                                    placeholder="Add any specific instructions or terms for this placement..."
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Financials & Dates
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Billing Rate ($/hr)"
                                            name="billing_rate"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={formData.billing_rate}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Start Date"
                                            name="start_date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="End Date"
                                            name="end_date"
                                            type="date"
                                            InputLabelProps={{ shrink: true }}
                                            value={formData.end_date}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            select
                                            fullWidth
                                            label="Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="ACTIVE">Active</MenuItem>
                                            <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                                            <MenuItem value="COMPLETED">Completed</MenuItem>
                                            <MenuItem value="TERMINATED">Terminated</MenuItem>
                                        </TextField>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Button
                                fullWidth
                                variant="contained"
                                size="large"
                                type="submit"
                                disabled={loading}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                                sx={{ borderRadius: 2, height: 50 }}
                            >
                                {loading ? 'Assigning...' : 'Confirm Assignment'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
