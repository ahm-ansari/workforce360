'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Stack,
    Alert,
    CircularProgress,
    IconButton,
    InputAdornment
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon, Description as ContractIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function NewContract() {
    const router = useRouter();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCompanies, setFetchingCompanies] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        client: '',
        contract_number: '',
        start_date: '',
        end_date: '',
        terms_and_conditions: '',
        total_value: '',
        status: 'ACTIVE'
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('visitors/companies/');
                setCompanies(response.data);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load companies.');
            } finally {
                setFetchingCompanies(false);
            }
        };
        fetchCompanies();
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
            await axios.post('outsourcing/contracts/', formData);
            router.push('/outsourcing/contracts');
        } catch (err: any) {
            console.error('Error creating contract:', err);
            setError(err.response?.data?.detail || 'Failed to create contract. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCompanies) {
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
                        New Staffing Contract
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Draft a master service agreement for a client company
                    </Typography>
                </Box>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                    Agreement Details
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Contract Ref Number"
                                        name="contract_number"
                                        value={formData.contract_number}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. MSA-2024-001"
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <ContractIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }
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
                                    >
                                        {companies.map((company: any) => (
                                            <MenuItem key={company.id} value={company.id}>
                                                {company.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                    <TextField
                                        fullWidth
                                        label="Terms & Conditions"
                                        name="terms_and_conditions"
                                        value={formData.terms_and_conditions}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        rows={8}
                                        placeholder="Outline payment terms, service levels, liability, etc..."
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Stack spacing={4}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                        Financials & Validity
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Contract Total Value"
                                            name="total_value"
                                            type="number"
                                            value={formData.total_value}
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
                                            label="Effective Start Date"
                                            name="start_date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Contract Expiry Date"
                                            name="end_date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={formData.end_date}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            select
                                            fullWidth
                                            label="Current Status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="ACTIVE">Active / Signed</MenuItem>
                                            <MenuItem value="DRAFT">Drafting</MenuItem>
                                            <MenuItem value="EXPIRED">Expired</MenuItem>
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
                                sx={{ 
                                    borderRadius: 3, 
                                    py: 2, 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
                                }}
                            >
                                {loading ? 'Saving...' : 'Finalize Contract'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
