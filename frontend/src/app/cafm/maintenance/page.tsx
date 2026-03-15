'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Stack,
    IconButton,
    TextField,
    InputAdornment,
    Tooltip,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Build as MaintenanceIcon,
    Schedule as ClockIcon,
    Warning as WarningIcon,
    CheckCircle as CheckIcon,
    Speed as SLAIcon,
    Assignment as WorkOrderIcon,
    PlayArrow as StartIcon,
    DoneAll as ResolveIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function MaintenanceList() {
    const router = useRouter();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        overdue: 0,
        slaCompliance: 0
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const [reqRes, analyticsRes] = await Promise.all([
                axios.get('cafm/maintenance-requests/'),
                axios.get('cafm/analytics/')
            ]);

            setRequests(reqRes.data);
            const summary = analyticsRes.data.summary;

            setStats({
                total: reqRes.data.length,
                open: reqRes.data.filter((r: any) => r.status === 'OPEN' || r.status === 'IN_PROGRESS').length,
                overdue: reqRes.data.filter((r: any) => {
                    if (r.status === 'RESOLVED' || r.status === 'CLOSED') return false;
                    return r.sla_resolution_deadline && new Date(r.sla_resolution_deadline) < new Date();
                }).length,
                slaCompliance: summary.sla_compliance_rate || 0
            });
        } catch (error) {
            console.error('Error fetching maintenance requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAcknowledge = async (id: number) => {
        try {
            await axios.post(`cafm/maintenance-requests/${id}/acknowledge/`);
            setSnackbar({ open: true, message: 'Work order started', severity: 'success' });
            fetchRequests();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to start work order', severity: 'error' });
        }
    };

    const handleResolve = async (id: number) => {
        try {
            await axios.post(`cafm/maintenance-requests/${id}/resolve/`);
            setSnackbar({ open: true, message: 'Work order resolved successfully', severity: 'success' });
            fetchRequests();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to resolve work order', severity: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to cancel and delete this work order?')) {
            try {
                await axios.delete(`cafm/maintenance-requests/${id}/`);
                setSnackbar({ open: true, message: 'Work order deleted', severity: 'success' });
                fetchRequests();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete request', severity: 'error' });
            }
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'info';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            case 'ON_HOLD': return 'secondary';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return '#ef4444';
            case 'HIGH': return '#f59e0b';
            case 'MEDIUM': return '#3b82f6';
            case 'LOW': return '#10b981';
            default: return '#64748b';
        }
    };

    const filteredRequests = requests.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.work_order_id?.toLowerCase().includes(search.toLowerCase()) ||
        r.asset_name?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Work Order Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track and manage reactive and preventive maintenance across all facilities.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/cafm/maintenance/new')}
                        sx={{ borderRadius: 2 }}
                    >
                        Raise Work Order
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#3b82f615', color: '#3b82f6' }}>
                                    <WorkOrderIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.total}</Typography>
                                    <Typography variant="caption" color="text.secondary">TOTAL ORDERS</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#f59e0b15', color: '#f59e0b' }}>
                                    <ClockIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.open}</Typography>
                                    <Typography variant="caption" color="text.secondary">ACTIVE REQUESTS</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#ef444415', color: '#ef4444' }}>
                                    <WarningIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.overdue}</Typography>
                                    <Typography variant="caption" color="text.secondary">OVERDUE SLA</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#10b98115', color: '#10b981' }}>
                                    <SLAIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.slaCompliance}%</Typography>
                                    <Typography variant="caption" color="text.secondary">SLA COMPLIANCE</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                    <TextField
                        fullWidth
                        placeholder="Search work orders..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{ bgcolor: 'white' }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Request Details</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Asset / Space</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Type / Priority</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>SLA Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ p: 0 }}>
                                        <LinearProgress sx={{ height: 2 }} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredRequests.map((req: any) => (
                                <TableRow key={req.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700 }}>
                                            #{req.work_order_id || req.id.toString().padStart(5, '0')}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {req.title}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200, display: 'block' }}>
                                            {req.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>{req.asset_name || 'General Facility'}</Typography>
                                        <Typography variant="caption" color="text.secondary">{req.facility_name} • {req.space_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Chip label={req.request_type} size="small" variant="outlined" sx={{ height: 20, fontSize: '0.65rem' }} />
                                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: getPriorityColor(req.priority) }} />
                                            <Typography variant="caption" fontWeight={700}>{req.priority}</Typography>
                                        </Stack>
                                        <Chip
                                            label={req.status}
                                            color={getStatusColor(req.status)}
                                            size="small"
                                            sx={{ mt: 1, fontWeight: 700, fontSize: '0.65rem', height: 20 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {req.assigned_to_name ? (
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <Box sx={{ width: 24, height: 24, borderRadius: '50%', bgcolor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <Typography variant="caption" fontWeight={700}>{req.assigned_to_name[0]}</Typography>
                                                </Box>
                                                <Typography variant="body2">{req.assigned_to_name}</Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">Unassigned</Typography>
                                        )}
                                        {req.vendor_name && (
                                            <Typography variant="caption" color="primary" display="block">Ext: {req.vendor_name}</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {req.status !== 'RESOLVED' && req.status !== 'CLOSED' ? (
                                            <Box sx={{ minWidth: 100 }}>
                                                <Typography variant="caption" color={req.sla_resolution_deadline && new Date(req.sla_resolution_deadline) < new Date() ? 'error' : 'text.secondary'} fontWeight={600}>
                                                    Due: {req.sla_resolution_deadline ? new Date(req.sla_resolution_deadline).toLocaleDateString() : 'N/A'}
                                                </Typography>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={80} // Simulated percentage
                                                    sx={{
                                                        height: 4,
                                                        borderRadius: 2,
                                                        mt: 0.5,
                                                        '& .MuiLinearProgress-bar': {
                                                            bgcolor: req.sla_resolution_deadline && new Date(req.sla_resolution_deadline) < new Date() ? '#ef4444' : '#3b82f6'
                                                        }
                                                    }}
                                                />
                                            </Box>
                                        ) : (
                                            <Stack direction="row" spacing={0.5} alignItems="center" color="success.main">
                                                <CheckIcon sx={{ fontSize: 16 }} />
                                                <Typography variant="caption" fontWeight={700}>Target Met</Typography>
                                            </Stack>
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {req.status === 'OPEN' && (
                                                <Tooltip title="Acknowledge & Start">
                                                    <IconButton size="small" color="warning" onClick={() => handleAcknowledge(req.id)}>
                                                        <StartIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            {req.status === 'IN_PROGRESS' && (
                                                <Tooltip title="Mark Resolved">
                                                    <IconButton size="small" color="success" onClick={() => handleResolve(req.id)}>
                                                        <ResolveIcon fontSize="small" />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                            <Tooltip title="View Details">
                                                <IconButton size="small" color="primary" onClick={() => router.push(`/cafm/maintenance/${req.id}`)}>
                                                    <WorkOrderIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(req.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filteredRequests.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <MaintenanceIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            No work orders found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
