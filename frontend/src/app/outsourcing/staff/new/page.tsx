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
    IconButton,
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
            setFormData(prev => ({ ...prev, staffing_request: val, client: '' }));
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
                        Assign Personnel
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Create a new client placement for an employee
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
                                    Placement Foundation
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Link to Staffing Request"
                                        name="staffing_request"
                                        value={formData.staffing_request}
                                        onChange={handleRequestChange}
                                        helperText="Selecting a request will prepopulate client and role details"
                                    >
                                        <MenuItem value=""><em>Direct Placement (No Request)</em></MenuItem>
                                        {requests.map((req: any) => (
                                            <MenuItem key={req.id} value={req.id}>
                                                {req.title} — {req.client_name}
                                            </MenuItem>
                                        ))}
                                    </TextField>

                                    <Autocomplete
                                        options={employees}
                                        getOptionLabel={(option: any) => option.full_name || `Employee #${option.id}`}
                                        renderInput={(params) => (
                                            <TextField {...params} label="Select Personnel" required placeholder="Search by name..." />
                                        )}
                                        onChange={(_, newValue) => {
                                            setFormData(prev => ({ ...prev, employee: newValue ? newValue.id : '' }));
                                        }}
                                    />

                                    <TextField
                                        select
                                        fullWidth
                                        label="Target Client"
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
                                        label="Designation / Role"
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Senior Project Manager"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', mt: 4 }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>
                                    Internal Coordination Notes
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                    placeholder="Add internal notes about this placement, specific client requirements, or unique terms..."
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={4}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                        Commercials & Timing
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Hourly Billing Rate"
                                            name="billing_rate"
                                            type="number"
                                            inputProps={{ min: 0, step: "0.01" }}
                                            value={formData.billing_rate}
                                            onChange={handleChange}
                                            required
                                            slotProps={{
                                                input: {
                                                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                                                }
                                            }}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Commencement Date"
                                            name="start_date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Projected End Date"
                                            name="end_date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={formData.end_date}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            select
                                            fullWidth
                                            label="Initial Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="ACTIVE">Active Deployment</MenuItem>
                                            <MenuItem value="ON_LEAVE">Temporary Absence</MenuItem>
                                            <MenuItem value="COMPLETED">Assignment Finished</MenuItem>
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
                                sx={{ 
                                    borderRadius: 3, 
                                    py: 2, 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
                                }}
                            >
                                {loading ? 'Processing...' : 'Deploy Personnel'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
