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
import { useParams, useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function EditClient() {
    const { id } = useParams();
    const router = useRouter();
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingData, setFetchingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<any>({
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
        joined_date: '',
        payment_terms: '',
        currency: 'USD',
        notes: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [clientRes, employeesRes] = await Promise.all([
                    axios.get(`clients/clients/${id}/`),
                    axios.get('employees/')
                ]);

                const clientData = clientRes.data;
                setFormData({
                    name: clientData.name || '',
                    legal_name: clientData.legal_name || '',
                    client_type: clientData.client_type || 'ENTERPRISE',
                    status: clientData.status || 'ACTIVE',
                    email: clientData.email || '',
                    phone: clientData.phone || '',
                    website: clientData.website || '',
                    industry: clientData.industry || '',
                    tax_id: clientData.tax_id || '',
                    vat_id: clientData.vat_id || '',
                    account_manager: clientData.account_manager || '',
                    joined_date: clientData.joined_date || '',
                    payment_terms: clientData.payment_terms || '',
                    currency: clientData.currency || 'USD',
                    notes: clientData.notes || ''
                });
                setEmployees(employeesRes.data);
            } catch (err) {
                console.error('Error fetching data:', err);
                setError('Failed to load client or employee data.');
            } finally {
                setFetchingData(false);
            }
        };
        fetchData();
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const submissionData = { ...formData };
        if (!submissionData.account_manager) {
            submissionData.account_manager = null;
        }

        try {
            await axios.put(`clients/clients/${id}/`, submissionData);
            router.push(`/clients/${id}`);
        } catch (err: any) {
            console.error('Error updating client:', err);
            if (err.response?.data) {
                const data = err.response.data;
                const messages = Object.keys(data).map(key => {
                    const value = data[key];
                    return `${key}: ${Array.isArray(value) ? value.join(', ') : value}`;
                });
                setError(messages.join(' | ') || 'Failed to update client.');
            } else {
                setError('Failed to update client. Please check your connection.');
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    // Find the currently selected employee object for Autocomplete value
    const selectedManager = employees.find((emp: any) => emp.id === formData.account_manager) || null;

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    variant="text"
                >
                    Cancel
                </Button>
                <Typography variant="h4" fontWeight={700}>
                    Edit Client: {formData.name}
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
                                    />
                                    <TextField
                                        fullWidth
                                        label="Legal Name"
                                        name="legal_name"
                                        value={formData.legal_name}
                                        onChange={handleChange}
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
                                            />
                                        </Grid>
                                    </Grid>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 2, mt: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Contacts & Communication
                                </Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Email Address"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <TextField
                                            fullWidth
                                            label="Phone Number"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <TextField
                                            fullWidth
                                            label="Website URL"
                                            name="website"
                                            value={formData.website}
                                            onChange={handleChange}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 2, mt: 3 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Internal Notes
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    multiline
                                    rows={4}
                                />
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Relationship Management
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="PROSPECT">Prospect</MenuItem>
                                            <MenuItem value="NEGOTIATION">Negotiation</MenuItem>
                                            <MenuItem value="ACTIVE">Active</MenuItem>
                                            <MenuItem value="INACTIVE">Inactive</MenuItem>
                                            <MenuItem value="ON_HOLD">On Hold</MenuItem>
                                        </TextField>

                                        <Autocomplete
                                            options={employees}
                                            value={selectedManager}
                                            getOptionLabel={(option: any) => option.full_name || `Employee #${option.id}`}
                                            isOptionEqualToValue={(option: any, value: any) => option.id === value.id}
                                            noOptionsText="No employees found"
                                            renderInput={(params) => (
                                                <TextField {...params} label="Account Manager" placeholder={employees.length === 0 ? "Loading or no employees..." : "Select an employee"} />
                                            )}
                                            onChange={(_, newValue) => {
                                                setFormData((prev: any) => ({ ...prev, account_manager: newValue ? newValue.id : '' }));
                                            }}
                                        />

                                        <TextField
                                            fullWidth
                                            label="Relationship Start Date"
                                            name="joined_date"
                                            type="date"
                                            value={formData.joined_date}
                                            onChange={handleChange}
                                            InputLabelProps={{ shrink: true }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Billing Information
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Tax ID"
                                            name="tax_id"
                                            value={formData.tax_id}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Payment Terms"
                                            name="payment_terms"
                                            value={formData.payment_terms}
                                            onChange={handleChange}
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
                                {loading ? 'Updating...' : 'Update Client'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
