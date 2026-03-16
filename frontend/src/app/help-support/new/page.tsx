'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    MenuItem,
    Button,
    Stack,
    IconButton,
    InputAdornment,
    CircularProgress,
    Alert,
    Snackbar,
    Grid,
    Paper,
    Divider,
    Autocomplete
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Subject as SubjectIcon,
    Category as CategoryIcon,
    PriorityHigh as PriorityIcon,
    CloudUpload as UploadIcon,
    Business as FacilityIcon,
    LocationOn as SpaceIcon,
    Settings as AssetIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function NewSupportTicket() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [facilities, setFacilities] = useState<any[]>([]);
    const [spaces, setSpaces] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'MEDIUM',
        facility: null as number | null,
        space: null as number | null,
        asset: null as number | null
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catsRes, facilitiesRes] = await Promise.all([
                    axios.get('support/categories/'),
                    axios.get('cafm/facilities/')
                ]);
                
                setCategories(catsRes.data);
                setFacilities(facilitiesRes.data);
                
                if (catsRes.data.length > 0) {
                    setFormData(prev => ({ ...prev, category: catsRes.data[0].id }));
                }
            } catch (err) {
                console.error('Error fetching initial data:', err);
                setError('Failed to load support components');
            } finally {
                setFetching(false);
            }
        };
        fetchInitialData();
    }, []);

    useEffect(() => {
        if (formData.facility) {
            axios.get(`cafm/spaces/?facility=${formData.facility}`).then(res => setSpaces(res.data));
            axios.get(`cafm/assets/?facility=${formData.facility}`).then(res => setAssets(res.data));
        } else {
            setSpaces([]);
            setAssets([]);
        }
    }, [formData.facility]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('support/tickets/', formData);
            setSnackbar({ open: true, message: `Ticket ${response.data.ticket_id} created successfully!`, severity: 'success' });
            setTimeout(() => {
                router.push('/help-support');
            }, 1500);
        } catch (err: any) {
            console.error('Error creating ticket:', err);
            setError(err.response?.data?.detail || 'Failed to submit ticket. Please check your input.');
        } finally {
            setLoading(false);
        }
    };

    if (fetching) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <IconButton onClick={() => router.back()} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box>
                    <Typography variant="h4" fontWeight={800} color="#1e293b">
                        Create Support Ticket
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Identify your facility and asset for faster resolution.
                    </Typography>
                </Box>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 3 }}>{error}</Alert>}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                    Ticket Details
                                </Typography>
                                <Stack spacing={3}>
                                    <TextField
                                        fullWidth
                                        label="Subject / Short Title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        placeholder="Briefly describe the issue"
                                        slotProps={{
                                            input: {
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SubjectIcon fontSize="small" color="action" />
                                                    </InputAdornment>
                                                ),
                                            }
                                        }}
                                    />
                                    
                                    <Divider sx={{ my: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>LOCATION & ASSET IDENTIFICATION</Typography>
                                    </Divider>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Facility"
                                                value={formData.facility || ''}
                                                onChange={(e) => setFormData(p => ({ ...p, facility: Number(e.target.value) || null }))}
                                                slotProps={{
                                                    input: {
                                                        startAdornment: <InputAdornment position="start"><FacilityIcon fontSize="small" /></InputAdornment>
                                                    }
                                                }}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {facilities.map(f => <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>)}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                select
                                                fullWidth
                                                label="Space / Room"
                                                value={formData.space || ''}
                                                onChange={(e) => setFormData(p => ({ ...p, space: Number(e.target.value) || null }))}
                                                disabled={!formData.facility}
                                                slotProps={{
                                                    input: {
                                                        startAdornment: <InputAdornment position="start"><SpaceIcon fontSize="small" /></InputAdornment>
                                                    }
                                                }}
                                            >
                                                <MenuItem value=""><em>None</em></MenuItem>
                                                {spaces.map(s => <MenuItem key={s.id} value={s.id}>{s.name} ({s.space_type})</MenuItem>)}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Autocomplete
                                                options={assets}
                                                getOptionLabel={(option) => `${option.name} (${option.asset_id})`}
                                                value={assets.find(a => a.id === formData.asset) || null}
                                                onChange={(_, newValue) => setFormData(p => ({ ...p, asset: newValue?.id || null }))}
                                                disabled={!formData.facility}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label="Related Asset"
                                                        placeholder="Select the equipment causing trouble"
                                                        slotProps={{
                                                            input: {
                                                                ...params.InputProps,
                                                                startAdornment: (
                                                                    <>
                                                                        <InputAdornment position="start"><AssetIcon fontSize="small" /></InputAdornment>
                                                                        {params.InputProps.startAdornment}
                                                                    </>
                                                                )
                                                            }
                                                        }}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>

                                    <Divider sx={{ my: 1 }}>
                                        <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>ISSUE DESCRIPTION</Typography>
                                    </Divider>

                                    <TextField
                                        fullWidth
                                        multiline
                                        rows={6}
                                        label="Detailed Description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        required
                                        placeholder="Provide as much detail as possible. Include codes shown on asset displays if any."
                                    />
                                    
                                    <Paper 
                                        variant="outlined" 
                                        sx={{ 
                                            p: 3, 
                                            borderRadius: 3, 
                                            borderStyle: 'dashed', 
                                            bgcolor: '#f8fafc',
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            '&:hover': { bgcolor: '#f1f5f9' }
                                        }}
                                    >
                                        <UploadIcon sx={{ fontSize: 40, color: '#94a3b8', mb: 1 }} />
                                        <Typography variant="body2" fontWeight={600} color="#64748b">
                                            Attach photos of the issue (Optional)
                                        </Typography>
                                        <Typography variant="caption" color="text.disabled">
                                            Max file size 5MB • JPG, PNG, PDF
                                        </Typography>
                                    </Paper>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12, md: 4 }}>
                        <Stack spacing={4}>
                            <Card sx={{ borderRadius: 4, boxShadow: '0 4px 25px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                                <CardContent sx={{ p: 4 }}>
                                    <Typography variant="h6" fontWeight={700} gutterBottom sx={{ mb: 3 }}>
                                        Service Level
                                    </Typography>
                                    <Stack spacing={3}>
                                        <TextField
                                            select
                                            fullWidth
                                            label="Support Category"
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            required
                                        >
                                            {categories.map((cat) => (
                                                <MenuItem key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </MenuItem>
                                            ))}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Priority Level"
                                            name="priority"
                                            value={formData.priority}
                                            onChange={handleChange}
                                            required
                                        >
                                            <MenuItem value="LOW">Low - General Inquiry</MenuItem>
                                            <MenuItem value="MEDIUM">Medium - Functional Issue</MenuItem>
                                            <MenuItem value="HIGH">High - Critical Failure</MenuItem>
                                            <MenuItem value="CRITICAL">Critical - Safety/Security</MenuItem>
                                        </TextField>

                                        <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 3, border: '1px solid #fee2e2' }}>
                                            <Typography variant="caption" fontWeight={700} color="#ef4444" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                <PriorityIcon fontSize="inherit" /> AUTOMATIC ESCALATION
                                            </Typography>
                                            <Typography variant="caption" color="#991b1b" display="block" sx={{ mt: 0.5 }}>
                                                Critical tickets trigger immediate SMS alerts to the engineering on-call team.
                                            </Typography>
                                        </Box>
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
                                    bgcolor: '#3b82f6',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                    boxShadow: '0 8px 16px rgba(59, 130, 246, 0.25)'
                                }}
                            >
                                {loading ? 'Creating Request...' : 'Submit Support Ticket'}
                            </Button>
                        </Stack>
                    </Grid>
                </Grid>
            </form>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
