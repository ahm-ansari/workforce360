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
    CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon, Save as SaveIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function NewStaffingRequest() {
    const router = useRouter();
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetchingCompanies, setFetchingCompanies] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        client: '',
        title: '',
        description: '',
        required_skills: '',
        experience_years: '',
        number_of_positions: 1,
        proposed_rate: '',
        start_date: '',
        end_date: '',
        priority: 'MEDIUM',
        status: 'OPEN'
    });

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await axios.get('visitors/companies/');
                setCompanies(response.data);
            } catch (err) {
                console.error('Error fetching companies:', err);
                setError('Failed to load companies. Please try again.');
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
            await axios.post('outsourcing/requests/', formData);
            router.push('/outsourcing/requests');
        } catch (err: any) {
            console.error('Error creating request:', err);
            setError(err.response?.data?.detail || 'Failed to create staffing request. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    if (fetchingCompanies) {
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
                    New Staffing Request
                </Typography>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 2 }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>
                                    Job Details
                                </Typography>
                                <Stack spacing={3} sx={{ mt: 2 }}>
                                    <TextField
                                        fullWidth
                                        label="Job Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Senior Java Developer"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        rows={4}
                                        placeholder="Provide a detailed description of the role and responsibilities..."
                                    />
                                    <TextField
                                        fullWidth
                                        label="Required Skills"
                                        name="required_skills"
                                        value={formData.required_skills}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Java, Spring Boot, Microservices (comma-separated)"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={3}>
                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Client & Status
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
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
                                            select
                                            fullWidth
                                            label="Priority"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="LOW">Low</MenuItem>
                                            <MenuItem value="MEDIUM">Medium</MenuItem>
                                            <MenuItem value="HIGH">High</MenuItem>
                                            <MenuItem value="URGENT">Urgent</MenuItem>
                                        </TextField>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Requirements
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
                                        <TextField
                                            fullWidth
                                            label="Experience (Years)"
                                            name="experience_years"
                                            type="number"
                                            inputProps={{ step: 0.5, min: 0 }}
                                            value={formData.experience_years}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            fullWidth
                                            label="No. of Positions"
                                            name="number_of_positions"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            value={formData.number_of_positions}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Proposed Rate ($/hr)"
                                            name="proposed_rate"
                                            type="number"
                                            inputProps={{ min: 0 }}
                                            value={formData.proposed_rate}
                                            onChange={handleChange}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 2 }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Timeline
                                    </Typography>
                                    <Stack spacing={3} sx={{ mt: 2 }}>
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
                                {loading ? 'Creating...' : 'Create Request'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
