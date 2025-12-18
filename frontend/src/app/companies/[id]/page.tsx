'use client';

import React, { useState, useEffect, use } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    TextField,
    Grid,
    FormControlLabel,
    Checkbox,
    Alert,
    CircularProgress
} from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CompanyEditPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        contact_person: '',
        contact_person_designation: '',
        industry: '',
        website: '',
        is_active: true
    });

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const response = await api.get(`visitors/companies/${id}/`);
                setFormData(response.data);
            } catch (err) {
                console.error("Error fetching company details:", err);
                setError("Failed to load company details.");
            } finally {
                setFetching(false);
            }
        };

        if (id) {
            fetchCompany();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, checked, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error when user types
        if (fieldErrors[name]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setFieldErrors({});

        // Filter out fields that shouldn't be sent or might cause issues (like logo as url string)
        const payload = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            address: formData.address,
            contact_person: formData.contact_person,
            contact_person_designation: formData.contact_person_designation,
            industry: formData.industry,
            website: formData.website,
            is_active: formData.is_active
        };

        try {
            await api.put(`visitors/companies/${id}/`, payload);
            router.push('/companies');
        } catch (err: any) {
            console.error("Error updating company:", err);
            if (err.response?.status === 400 && err.response?.data) {
                const data = err.response.data;
                const newFieldErrors: Record<string, string> = {};
                let generalError = null;

                Object.keys(data).forEach(key => {
                    if (Array.isArray(data[key])) {
                        newFieldErrors[key] = data[key].join(' ');
                    } else if (typeof data[key] === 'string') {
                        if (key === 'detail' || key === 'non_field_errors') {
                            generalError = data[key];
                        } else {
                            newFieldErrors[key] = data[key];
                        }
                    }
                });

                setFieldErrors(newFieldErrors);
                if (generalError) {
                    setError(generalError);
                } else if (Object.keys(newFieldErrors).length === 0) {
                    setError("Request failed with status 400.");
                } else {
                    setError("Please correct the errors below.");
                }

            } else {
                setError(err.response?.data?.detail || "Failed to update company. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.back()}
                sx={{ mb: 3 }}
            >
                Back to List
            </Button>

            <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h5" fontWeight="600" gutterBottom color="primary">
                    Edit Company
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                    Update the details of the company.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 3 }}>
                        {error}
                    </Alert>
                )}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                required
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name}
                                label="Company Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                error={!!fieldErrors.email}
                                helperText={fieldErrors.email}
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                required
                                error={!!fieldErrors.phone}
                                helperText={fieldErrors.phone}
                                label="Phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                error={!!fieldErrors.industry}
                                helperText={fieldErrors.industry}
                                label="Industry"
                                name="industry"
                                value={formData.industry}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                error={!!fieldErrors.website}
                                helperText={fieldErrors.website}
                                label="Website"
                                name="website"
                                value={formData.website}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                error={!!fieldErrors.contact_person}
                                helperText={fieldErrors.contact_person}
                                label="Contact Person"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                fullWidth
                                error={!!fieldErrors.contact_person_designation}
                                helperText={fieldErrors.contact_person_designation}
                                label="Contact Person Title"
                                name="contact_person_designation"
                                value={formData.contact_person_designation}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                error={!!fieldErrors.address}
                                helperText={fieldErrors.address}
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_active}
                                        onChange={handleChange}
                                        name="is_active"
                                        color="primary"
                                    />
                                }
                                label="Active"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                disabled={loading}
                                sx={{
                                    mt: 2,
                                    background: 'linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)',
                                    color: 'white',
                                    py: 1.5
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update Company'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Related Entities Section */}
            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" fontWeight="600" gutterBottom>
                    Company Portfolio
                </Typography>
                <Grid container spacing={3}>
                    {/* Projects */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="primary">
                                Projects ({(formData as any).projects_list?.length || 0})
                            </Typography>
                            {(formData as any).projects_list?.map((project: any) => (
                                <Box key={project.id} sx={{ mb: 1, p: 1, bgcolor: '#f1f5f9', borderRadius: 1 }}>
                                    <Typography variant="body2" fontWeight="500">{project.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{project.status}</Typography>
                                </Box>
                            ))}
                            {(!(formData as any).projects_list || (formData as any).projects_list.length === 0) && (
                                <Typography variant="caption" color="text.secondary">No active projects.</Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* Services */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom color="secondary">
                                Associated Services ({(formData as any).services_details?.length || 0})
                            </Typography>
                            {(formData as any).services_details?.map((service: any) => (
                                <Box key={service.id} sx={{ mb: 1, p: 1, bgcolor: '#fdf2f8', borderRadius: 1 }}>
                                    <Typography variant="body2" fontWeight="500">{service.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{service.category}</Typography>
                                </Box>
                            ))}
                            {(!(formData as any).services_details || (formData as any).services_details.length === 0) && (
                                <Typography variant="caption" color="text.secondary">No services associated.</Typography>
                            )}
                        </Paper>
                    </Grid>

                    {/* Solutions */}
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 2, height: '100%', borderRadius: 2 }}>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ color: '#6366f1' }}>
                                Implemented Solutions ({(formData as any).solutions_details?.length || 0})
                            </Typography>
                            {(formData as any).solutions_details?.map((solution: any) => (
                                <Box key={solution.id} sx={{ mb: 1, p: 1, bgcolor: '#eef2ff', borderRadius: 1 }}>
                                    <Typography variant="body2" fontWeight="500">{solution.name}</Typography>
                                    <Typography variant="caption" color="text.secondary">{solution.category}</Typography>
                                </Box>
                            ))}
                            {(!(formData as any).solutions_details || (formData as any).solutions_details.length === 0) && (
                                <Typography variant="caption" color="text.secondary">No solutions found.</Typography>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}

