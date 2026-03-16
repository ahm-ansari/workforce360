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
    Autocomplete,
    Chip,
    Collapse,
    Avatar,
    Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Subject as SubjectIcon,
    PriorityHigh as PriorityIcon,
    CloudUpload as UploadIcon,
    Business as FacilityIcon,
    LocationOn as SpaceIcon,
    Settings as AssetIcon,
    Groups as DeptIcon,
    Person as AssignIcon,
    Phone as PhoneIcon,
    Email as EmailIcon,
    EscalatorWarning as EscalationIcon,
    OpenInNew as OpenInNewIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function NewSupportTicket() {
    const router = useRouter();
    const [categories, setCategories] = useState<any[]>([]);
    const [facilities, setFacilities] = useState<any[]>([]);
    const [spaces, setSpaces] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [departments, setDepartments] = useState<any[]>([]);
    const [staff, setStaff] = useState<any[]>([]);
    const [filteredStaff, setFilteredStaff] = useState<any[]>([]);
    const [escalationContacts, setEscalationContacts] = useState<any[]>([]);
    const [deptEscalation, setDeptEscalation] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(false);
    const [loadingStaff, setLoadingStaff] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        priority: 'MEDIUM',
        department: null as number | null,
        assigned_to: null as number | null,
        facility: null as number | null,
        space: null as number | null,
        asset: null as number | null
    });

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [catsRes, facilitiesRes, deptsRes, staffRes, escalationRes] = await Promise.all([
                    axios.get('support/categories/'),
                    axios.get('cafm/facilities/'),
                    axios.get('employees/departments/'),
                    axios.get('users/users/?is_staff=true'),
                    axios.get('support/escalation-matrix/')
                ]);
                
                setCategories(catsRes.data);
                setFacilities(facilitiesRes.data);
                setDepartments(deptsRes.data);
                setStaff(staffRes.data);
                setFilteredStaff(staffRes.data);
                setEscalationContacts(escalationRes.data);
                
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

    // When department changes, filter the escalation contacts for that dept
    useEffect(() => {
        if (formData.department) {
            const filtered = escalationContacts.filter(c => c.department === formData.department);
            setDeptEscalation(filtered);
        } else {
            setDeptEscalation([]);
        }
    }, [formData.department, escalationContacts]);

    // When dept changes, fetch employees in that dept and match with staff users
    useEffect(() => {
        if (!formData.department) {
            setFilteredStaff([]);
            return;
        }
        setLoadingStaff(true);
        axios.get(`employees/?department=${formData.department}`)
            .then(res => {
                const deptUsers = res.data
                    .filter((emp: any) => emp.user_details)
                    .map((emp: any) => ({
                        id: emp.user_details.id,
                        username: emp.user_details.username,
                        first_name: emp.user_details.first_name,
                        last_name: emp.user_details.last_name,
                        role_details: emp.user_details.role_details,
                        designation: emp.designation_details?.name || '',
                        department_name: emp.department_details?.name || '',
                    }));
                setFilteredStaff(deptUsers);
            })
            .catch(() => setFilteredStaff([]))
            .finally(() => setLoadingStaff(false));
    }, [formData.department]);

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

                                        <Divider sx={{ my: 1 }}>
                                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 700 }}>ROUTING & ASSIGNMENT</Typography>
                                        </Divider>

                                        <TextField
                                            select
                                            fullWidth
                                            label="Target Department"
                                            value={formData.department || ''}
                                            onChange={(e) => {
                                                const deptId = Number(e.target.value) || null;
                                                // Reset assignee when dept changes
                                                setFormData(p => ({ ...p, department: deptId, assigned_to: null }));
                                            }}
                                            slotProps={{
                                                input: {
                                                    startAdornment: <InputAdornment position="start"><DeptIcon fontSize="small" /></InputAdornment>
                                                }
                                            }}
                                        >
                                            <MenuItem value=""><em>Select Department</em></MenuItem>
                                            {departments.map(d => <MenuItem key={d.id} value={d.id}>{d.name}</MenuItem>)}
                                        </TextField>

                                        <TextField
                                            select
                                            fullWidth
                                            label={
                                                loadingStaff
                                                    ? 'Loading personnel...'
                                                    : formData.department
                                                        ? `Assign To Personnel (${filteredStaff.length} available)`
                                                        : 'Assign To Personnel'
                                            }
                                            value={formData.assigned_to || ''}
                                            onChange={(e) => setFormData(p => ({ ...p, assigned_to: Number(e.target.value) || null }))}
                                            disabled={!formData.department || loadingStaff}
                                            helperText={!formData.department ? 'Select a department first to see available personnel' : ''}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            {loadingStaff
                                                                ? <CircularProgress size={16} />
                                                                : <AssignIcon fontSize="small" />}
                                                        </InputAdornment>
                                                    )
                                                }
                                            }}
                                        >
                                            <MenuItem value=""><em>Auto-Assign later</em></MenuItem>
                                            {filteredStaff.length === 0 && formData.department ? (
                                                <MenuItem disabled>
                                                    <Typography variant="caption" color="text.secondary">
                                                        No personnel found in this department
                                                    </Typography>
                                                </MenuItem>
                                            ) : (
                                                filteredStaff.map(s => (
                                                    <MenuItem key={s.id} value={s.id}>
                                                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ width: '100%' }}>
                                                            <Avatar sx={{ width: 28, height: 28, fontSize: '0.7rem', bgcolor: '#6366f1' }}>
                                                                {s.first_name?.[0] || s.username?.[0] || '?'}
                                                            </Avatar>
                                                            <Box>
                                                                <Typography variant="body2" fontWeight={700}>
                                                                    {s.first_name && s.last_name ? `${s.first_name} ${s.last_name}` : s.username}
                                                                </Typography>
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {s.designation || s.role_details?.name || 'Staff'}
                                                                </Typography>
                                                            </Box>
                                                        </Stack>
                                                    </MenuItem>
                                                ))
                                            )}
                                        </TextField>

                                        {/* Live Escalation Preview */}
                                        <Collapse in={deptEscalation.length > 0}>
                                            <Box>
                                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
                                                    <Stack direction="row" spacing={0.8} alignItems="center">
                                                        <EscalationIcon sx={{ fontSize: 16, color: '#4f46e5' }} />
                                                        <Typography variant="caption" fontWeight={800} color="#4f46e5">
                                                            ESCALATION CONTACTS
                                                        </Typography>
                                                    </Stack>
                                                    <Tooltip title="View full escalation matrix">
                                                        <Typography
                                                            variant="caption"
                                                            fontWeight={700}
                                                            color="#6366f1"
                                                            component="a"
                                                            href="/help-support/escalation"
                                                            sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 0.3, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                                                        >
                                                            View All <OpenInNewIcon sx={{ fontSize: 11 }} />
                                                        </Typography>
                                                    </Tooltip>
                                                </Stack>
                                                <Stack spacing={1}>
                                                    {[1, 2, 3].map(level => {
                                                        const c = deptEscalation.find(x => x.level === level);
                                                        if (!c) return null;
                                                        const levelColors: Record<number, { bg: string; color: string; label: string }> = {
                                                            1: { bg: '#f0fdf4', color: '#16a34a', label: 'L1' },
                                                            2: { bg: '#fffbeb', color: '#d97706', label: 'L2' },
                                                            3: { bg: '#fef2f2', color: '#dc2626', label: 'L3' },
                                                        };
                                                        const lc = levelColors[level];
                                                        return (
                                                            <Box key={level} sx={{ p: 1.5, bgcolor: lc.bg, borderRadius: 2, border: `1px solid ${lc.color}30` }}>
                                                                <Stack direction="row" spacing={1.5} alignItems="center">
                                                                    <Avatar sx={{ width: 30, height: 30, bgcolor: lc.color, fontSize: '0.65rem', fontWeight: 900 }}>
                                                                        {lc.label}
                                                                    </Avatar>
                                                                    <Box sx={{ flex: 1, minWidth: 0 }}>
                                                                        <Typography variant="caption" fontWeight={800} color="#1e293b" display="block" noWrap>
                                                                            {c.name}
                                                                        </Typography>
                                                                        <Typography variant="caption" color="text.secondary" noWrap>
                                                                            {c.designation}
                                                                        </Typography>
                                                                    </Box>
                                                                    <Stack direction="row" spacing={0.5}>
                                                                        <Tooltip title={c.phone}>
                                                                            <IconButton
                                                                                size="small"
                                                                                component="a"
                                                                                href={`tel:${c.phone}`}
                                                                                sx={{ bgcolor: 'white', border: `1px solid ${lc.color}40`, color: lc.color, width: 26, height: 26 }}
                                                                            >
                                                                                <PhoneIcon sx={{ fontSize: 13 }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                        <Tooltip title={c.email}>
                                                                            <IconButton
                                                                                size="small"
                                                                                component="a"
                                                                                href={`mailto:${c.email}`}
                                                                                sx={{ bgcolor: 'white', border: `1px solid ${lc.color}40`, color: lc.color, width: 26, height: 26 }}
                                                                            >
                                                                                <EmailIcon sx={{ fontSize: 13 }} />
                                                                            </IconButton>
                                                                        </Tooltip>
                                                                    </Stack>
                                                                </Stack>
                                                            </Box>
                                                        );
                                                    })}
                                                </Stack>
                                            </Box>
                                        </Collapse>

                                        {/* Fallback when no dept selected */}
                                        {deptEscalation.length === 0 && (
                                            <Box sx={{ p: 2, bgcolor: '#fef2f2', borderRadius: 3, border: '1px solid #fee2e2' }}>
                                                <Typography variant="caption" fontWeight={700} color="#ef4444" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                    <PriorityIcon fontSize="inherit" /> AUTOMATIC ESCALATION
                                                </Typography>
                                                <Typography variant="caption" color="#991b1b" display="block" sx={{ mt: 0.5 }}>
                                                    Select a department above to view the escalation contacts for your issue.
                                                </Typography>
                                            </Box>
                                        )}
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
