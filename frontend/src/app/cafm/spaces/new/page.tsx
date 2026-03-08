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

export default function NewSpace() {
    const router = useRouter();
    const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        facility: '',
        name: '',
        space_type: '',
        capacity: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFacilities = async () => {
            try {
                const res = await axios.get('cafm/facilities/');
                setFacilities(res.data);
            } catch (error) {
                console.error('Failed to fetch facilities', error);
            }
        };
        fetchFacilities();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('cafm/spaces/', {
                ...formData,
                capacity: formData.capacity ? parseInt(formData.capacity) : null
            });
            router.push('/cafm/spaces');
        } catch (error) {
            console.error('Error creating space', error);
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
                Back to Spaces
            </Button>

            <Typography variant="h4" fontWeight={700} gutterBottom>
                Add New Space
            </Typography>

            <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    select
                                    fullWidth
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
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Space Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Space Type"
                                    name="space_type"
                                    value={formData.space_type}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Capacity"
                                    name="capacity"
                                    value={formData.capacity}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Space'}
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
