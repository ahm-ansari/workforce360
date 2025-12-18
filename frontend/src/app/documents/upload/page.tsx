'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, TextField, MenuItem, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

interface DocumentCategory {
    id: number;
    name: string;
}

interface Employee {
    id: number;
    user: {
        first_name: string;
        last_name: string;
    };
}

export default function UploadDocumentPage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [categories, setCategories] = useState<DocumentCategory[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [formData, setFormData] = useState({
        title: '',
        category: '',
        description: '',
        employee: '',
        is_confidential: false,
        expiry_date: ''
    });
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [catsRes, empsRes] = await Promise.all([
                api.get('hr/document-categories/'),
                api.get('employees/') // Assuming we can fetch employees list
            ]);

            setCategories(Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.results || []);
            setEmployees(Array.isArray(empsRes.data) ? empsRes.data : empsRes.data.results || []);

            // Default employee to self if available
            if (user?.employee_id) {
                setFormData(prev => ({ ...prev, employee: String(user.employee_id) }));
            }
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        setError('');
        setLoading(true);

        const data = new FormData();
        data.append('title', formData.title);
        data.append('category', formData.category);
        data.append('description', formData.description);
        if (formData.employee) data.append('employee', formData.employee);
        data.append('is_confidential', String(formData.is_confidential));
        if (formData.expiry_date) data.append('expiry_date', formData.expiry_date);
        data.append('file', file);

        try {
            await api.post('hr/documents/', data, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            router.push('/documents');
        } catch (err: any) {
            console.error('Failed to upload document:', err);
            setError(err.response?.data?.detail || 'Failed to upload document');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h5" gutterBottom>
                    Upload Document
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Category"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                required
                            >
                                {categories.map((cat) => (
                                    <MenuItem key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                select
                                fullWidth
                                label="Employee (Optional)"
                                value={formData.employee}
                                onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                            >
                                <MenuItem value="">None (Company Document)</MenuItem>
                                {employees.map((emp) => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        {emp.user.first_name} {emp.user.last_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={3}
                                label="Description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Button
                                variant="outlined"
                                component="label"
                                fullWidth
                                sx={{ height: 56 }}
                            >
                                {file ? file.name : 'Choose File'}
                                <input
                                    type="file"
                                    hidden
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                />
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Expiry Date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={formData.is_confidential}
                                        onChange={(e) => setFormData({ ...formData, is_confidential: e.target.checked })}
                                    />
                                }
                                label="Is Confidential?"
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                            <Button variant="outlined" onClick={() => router.back()}>
                                Cancel
                            </Button>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? 'Uploading...' : 'Upload'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
