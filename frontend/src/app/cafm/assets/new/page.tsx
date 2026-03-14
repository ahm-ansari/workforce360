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

export default function NewAsset() {
    const router = useRouter();
    const [facilities, setFacilities] = useState<{ id: number; name: string }[]>([]);
    const [spaces, setSpaces] = useState<{ id: number; name: string }[]>([]);
    const [formData, setFormData] = useState({
        asset_id: '',
        name: '',
        category: '',
        description: '',
        asset_type: '',
        location: '',
        serial_number: '',
        installation_date: '',
        warranty_details: '',
        vendor_information: '',
        maintenance_frequency: '',
        asset_value: '',
        status: 'ACTIVE',
        facility: '',
        space: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchFacilitiesAndSpaces = async () => {
            try {
                const [facRes, spRes] = await Promise.all([
                    axios.get('cafm/facilities/'),
                    axios.get('cafm/spaces/')
                ]);
                setFacilities(facRes.data);
                setSpaces(spRes.data);
            } catch (error) {
                console.error('Failed to fetch data', error);
            }
        };
        fetchFacilitiesAndSpaces();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload: any = { ...formData };
            if (!payload.facility) delete payload.facility;
            if (!payload.space) delete payload.space;
            if (!payload.installation_date) delete payload.installation_date;
            if (!payload.asset_value) delete payload.asset_value;

            await axios.post('cafm/assets/', payload);
            router.push('/cafm/assets');
        } catch (error) {
            console.error('Error creating asset', error);
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
                Back to Assets
            </Button>

            <Typography variant="h4" fontWeight={700} gutterBottom>
                Add New Asset
            </Typography>

            <Card sx={{ borderRadius: 2 }}>
                <CardContent sx={{ p: 4 }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Asset ID"
                                    name="asset_id"
                                    value={formData.asset_id}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Asset Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Asset Type"
                                    name="asset_type"
                                    value={formData.asset_type}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    select
                                    label="Status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                >
                                    <MenuItem value="ACTIVE">Active</MenuItem>
                                    <MenuItem value="INACTIVE">Inactive</MenuItem>
                                    <MenuItem value="MAINTENANCE">In Maintenance</MenuItem>
                                    <MenuItem value="RETIRED">Retired</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Serial Number"
                                    name="serial_number"
                                    value={formData.serial_number}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
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
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Space"
                                    name="space"
                                    value={formData.space}
                                    onChange={handleChange}
                                >
                                    {spaces.map((s) => (
                                        <MenuItem key={s.id} value={s.id.toString()}>
                                            {s.name}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="date"
                                    label="Installation Date"
                                    name="installation_date"
                                    value={formData.installation_date}
                                    onChange={handleChange}
                                    slotProps={{ inputLabel: { shrink: true } }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Asset Value"
                                    name="asset_value"
                                    value={formData.asset_value}
                                    onChange={handleChange}
                                    InputProps={{ startAdornment: <Typography sx={{mr: 1}}>$</Typography> }}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Maintenance Frequency"
                                    name="maintenance_frequency"
                                    value={formData.maintenance_frequency}
                                    onChange={handleChange}
                                    placeholder="e.g. Monthly, Annually"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Warranty Details"
                                    name="warranty_details"
                                    value={formData.warranty_details}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    label="Vendor Information"
                                    name="vendor_information"
                                    value={formData.vendor_information}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 2 }}>
                                    <Button variant="outlined" onClick={() => router.back()}>
                                        Cancel
                                    </Button>
                                    <Button type="submit" variant="contained" disabled={loading}>
                                        {loading ? 'Saving...' : 'Save Asset'}
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
