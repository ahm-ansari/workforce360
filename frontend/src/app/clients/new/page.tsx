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
    Divider,
    Alert,
    CircularProgress,
    Autocomplete
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function NewClient() {
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        legal_name: '',
        client_type: 'ENTERPRISE',
        status: 'ACTIVE',
        email: '',
        phone: '',
        website: '',
        industry: '',
        tax_id: '',
        vat_id: '',
        account_manager: '',
        payment_terms: '',
        currency: 'USD',
        notes: ''
    });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get('/api/employees/employees/');
                setEmployees(response.data);
            } catch (err) {
                console.error('Error fetching employees:', err);
                setError('Failed to load employee data.');
            } finally {
                setFetchingData(false);
            }
        };
        fetchEmployees();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await axios.post('/api/clients/clients/', formData);
            router.push('/clients');
        } catch (err: any) {
            console.error('Error creating client:', err);
            setError(err.response?.data?.detail || 'Failed to create client. Please check your input.');
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
                    Back to Directory
                </Button>
                <Typography variant="h4" fontWeight={700}>
                    Onboard New Client
                </Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    General Information
                                </Typography>
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Company Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Acme Corporation"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Legal Name (for invoicing)"
                                        name="legal_name"
                                        value={formData.legal_name}
                                        onChange={handleChange}
                                        placeholder="e.g. Acme Corp India Pvt Ltd"
                                    />
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Client Type"
                                                name="client_type"
                                                value={formData.client_type}
                                                onChange={handleChange}
                                                required
                                            >
                                                <MenuItem value="ENTERPRISE">Enterprise</MenuItem>
                                                <MenuItem value="SME">SME</MenuItem>
                                                <MenuItem value="GOVERNMENT">Government</MenuItem>
                                                <MenuItem value="NGO">NGO</MenuItem>
                                                <MenuItem value="INDIVIDUAL">Individual</MenuItem>
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                fullWidth
                                                label="Industry"
                                                name="industry"
                                                value={formData.industry}
                                                onChange={handleChange}
                                                placeholder="e.g. IT Services, Logistics"
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 2, mt: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Tax & Business Identification
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Tax ID / Registration #"
                                            name="tax_id"
                                            value={formData.tax_id}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="VAT / GST Registration"
                                            name="vat_id"
                                            value={formData.vat_id}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
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
                                    rows={4}
                                    placeholder="Internal observations about the client relationship..."
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Relationship Details
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Relationship Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="PROSPECT">Prospect</MenuItem>
                                            <MenuItem value="ACTIVE">Active</MenuItem>
                                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                                            <MenuItem value="ON_HOLD">On Hold</MenuItem>
                                        </TextField>

                                        <Autocomplete
                                            options={employees}
                                            getOptionLabel={(option: any) => `${option.user?.first_name} ${option.user?.last_name} (${option.user?.username})`}
                                            renderInput={(params) => (
                                                <TextField {...params} label="Account Manager" />
                                            )}
                                            onChange={(_, newValue) => {
                                                setFormData(prev => ({ ...prev, account_manager: newValue ? newValue.id : '' }));
                                            }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Payment & Billing
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Currency"
                                            name="currency"
                                            value={formData.currency}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Payment Terms"
                                            name="payment_terms"
                                            value={formData.payment_terms}
                                            onChange={handleChange}
                                            placeholder="e.g. Net 30"
                                        />
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
                                {loading ? 'Creating...' : 'Save Client'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
