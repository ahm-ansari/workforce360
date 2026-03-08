'use client';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    MenuItem,
    CircularProgress,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface Department {
    id: number;
    name: string;
}

export default function CreateJob() {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        requirements: '',
        department: '',
        status: 'DRAFT',
        closing_date: '',
    });
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const router = useRouter();

    useEffect(() => {
        api
            .get('employees/departments/')
            .then((res) => setDepartments(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleGenerateDescription = async () => {
        if (!formData.title) {
            alert('Please enter a Job Title first');
            return;
        }
        setGenerating(true);
        try {
            const res = await api.post('recruitment/jobs/generate_description/', {
                title: formData.title
            });
            setFormData(prev => ({
                ...prev,
                description: res.data.description,
                requirements: res.data.requirements
            }));
        } catch (err) {
            console.error('Error generating description:', err as any);
            const errorMsg = (err as any).response?.data?.error || 'Failed to generate description';
            alert(errorMsg);
        } finally {
            setGenerating(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('recruitment/jobs/', formData);
            router.push('/recruitment/jobs');
        } catch (err) {
            console.error('Error creating job:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Create Job Posting
            </Typography>
            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                fullWidth
                                label="Job Title"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }} sx={{ display: 'flex', alignItems: 'center' }}>
                            <Button
                                variant="outlined"
                                startIcon={generating ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                                onClick={handleGenerateDescription}
                                disabled={generating || !formData.title}
                                fullWidth
                                sx={{ height: '56px' }}
                            >
                                {generating ? 'Generating...' : 'Generate with AI'}
                            </Button>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Description"
                                multiline
                                rows={4}
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Requirements"
                                multiline
                                rows={4}
                                value={formData.requirements}
                                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                select
                                label="Department"
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                required
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id} value={dept.id}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                select
                                label="Status"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="DRAFT">Draft</MenuItem>
                                <MenuItem value="PUBLISHED">Published</MenuItem>
                                <MenuItem value="CLOSED">Closed</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <TextField
                                fullWidth
                                type="date"
                                label="Closing Date"
                                value={formData.closing_date}
                                onChange={(e) => setFormData({ ...formData, closing_date: e.target.value })}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Create Job'}
                            </Button>
                            <Button sx={{ ml: 2 }} onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
