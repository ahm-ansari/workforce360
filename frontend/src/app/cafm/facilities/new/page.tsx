'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Stack,
    Grid
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import axios from '@/lib/axios';

export default function NewFacility() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contact_email: '',
        contact_phone: ''
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('cafm/facilities/', formData);
            router.push('/cafm/facilities');
        } catch (error) {
            console.error('Error creating facility', error);
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
                Back to Facilities
            </Button>

            <Typography variant="h4" fontWeight={700} gutterBottom>
                Add New Facility
            </Typography>

            <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Facility Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    required
                                    multiline
                                    rows={3}
                                    label="Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="email"
                                    label="Contact Email"
                                    name="contact_email"
                                    value={formData.contact_email}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Contact Phone"
                                    name="contact_phone"
                                    value={formData.contact_phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Facility'}
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
