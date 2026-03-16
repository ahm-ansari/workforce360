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
    IconButton
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
                        Create Request
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Initiate a new staffing requirement for a client
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
                                    Requirement Details
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Requirement Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. Senior Backend Engineer (Node.js)"
                                    />
                                    <TextField
                                        fullWidth
                                        label="Comprehensive Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        multiline
                                        rows={6}
                                        placeholder="Outline the role, responsibilities, and specific client environment..."
                                    />
                                    <TextField
                                        fullWidth
                                        label="Required Skills & Competencies"
                                        name="required_skills"
                                        value={formData.required_skills}
                                        onChange={handleChange}
                                        required
                                        placeholder="e.g. React, TypeScript, AWS, Docker (comma-separated)"
                                    />
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={4}>
                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                        Client & Priority
                                    </Typography>
                                    <Stack spacing={3}>
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
                                            label="Urgency Level"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="LOW">Low Priority</MenuItem>
                                            <MenuItem value="MEDIUM">Medium Priority</MenuItem>
                                            <MenuItem value="HIGH">High Priority</MenuItem>
                                            <MenuItem value="URGENT">Urgent / Critical</MenuItem>
                                        </TextField>
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                        Fulfillment Criteria
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Experience Range (Years)"
                                            name="experience_years"
                                            type="number"
                                            inputProps={{ step: 0.5, min: 0 }}
                                            value={formData.experience_years}
                                            onChange={handleChange}
                                        />
                                        <TextField
                                            fullWidth
                                            label="Open Positions"
                                            name="number_of_positions"
                                            type="number"
                                            inputProps={{ min: 1 }}
                                            value={formData.number_of_positions}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Target Billing Rate"
                                            name="proposed_rate"
                                            type="number"
                                            inputProps={{ min: 0, step: "0.01" }}
                                            value={formData.proposed_rate}
                                            onChange={handleChange}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <Typography sx={{ mr: 1, color: 'text.secondary' }}>$</Typography>
                                                }
                                            }}
                                        />
                                    </Stack>
                                </CardContent>
                            </Card>

                            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                        Expected Timeline
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            fullWidth
                                            label="Target Onboarding Date"
                                            name="start_date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
                                            value={formData.start_date}
                                            onChange={handleChange}
                                            required
                                        />
                                        <TextField
                                            fullWidth
                                            label="Projected Duration End"
                                            name="end_date"
                                            type="date"
                                            slotProps={{ inputLabel: { shrink: true } }}
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
                                sx={{ 
                                    borderRadius: 3, 
                                    py: 2, 
                                    fontSize: '1.1rem', 
                                    fontWeight: 700,
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Post Staffing Request'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>
        </Box>
    );
}
