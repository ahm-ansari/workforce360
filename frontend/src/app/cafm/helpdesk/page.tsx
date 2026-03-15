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
    Alert,
    Avatar
} from '@mui/material';
import {
    Search as SearchIcon,
    HelpOutline as HelpIcon,
    Chat as ChatIcon,
    Person as UserIcon,
    PriorityHigh as PriorityIcon,
    AssignmentInd as AssignmentIcon,
    DoneAll as ResolvedIcon,
    QuestionAnswer as CommentIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function HelpdeskSystem() {
    const [queries, setQueries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        resolved: 0,
        avgResponse: '2.4h'
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        // Since there is no specific 'helpdesk' model in the backend, 
        // we use MaintenanceCommunications or a subset of MaintenanceRequests for now.
        // For a true helpdesk, we'd normally have a separate model.
        // For this implementation, we'll fetch maintenance requests and treat them as tickets.
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const response = await axios.get('cafm/maintenance-requests/');
            const data = response.data;
            setQueries(data);
            
            setStats({
                total: data.length,
                pending: data.filter((t: any) => t.status === 'OPEN').length,
                resolved: data.filter((t: any) => t.status === 'RESOLVED' || t.status === 'CLOSED').length,
                avgResponse: '1.8h' // Mocked KPI
            });
        } catch (error) {
            console.error('Error fetching helpdesk tickets:', error);
            setSnackbar({ open: true, message: 'Failed to sync with support engine', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'info';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'success';
            case 'CLOSED': return 'default';
            default: return 'default';
        }
    };

    const filteredTickets = queries.filter((t: any) => 
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.work_order_id?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Tenant Helpdesk
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Centralized support hub for facility queries and service requests.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<ChatIcon />} 
                    sx={{ borderRadius: 2, bgcolor: '#3b82f6' }}
                    onClick={() => setSnackbar({ open: true, message: 'Portal coming soon', severity: 'success' })}
                >
                    Create Ticket
                </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#3b82f615', color: '#3b82f6' }}><HelpIcon /></Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.total}</Typography>
                                    <Typography variant="caption" color="text.secondary">TOTAL TICKETS</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#f59e0b15', color: '#f59e0b' }}><PriorityIcon /></Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.pending}</Typography>
                                    <Typography variant="caption" color="text.secondary">AWAITING RESPONSE</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#10b98115', color: '#10b981' }}><ResolvedIcon /></Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.resolved}</Typography>
                                    <Typography variant="caption" color="text.secondary">RESOLVED TICKETS</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Avatar sx={{ bgcolor: '#8b5cf615', color: '#8b5cf6' }}><ChatIcon /></Avatar>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.avgResponse}</Typography>
                                    <Typography variant="caption" color="text.secondary">AVG RESPONSE TIME</Typography>
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
                        placeholder="Search tickets by subject, ID..."
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
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Ticket ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Requested By</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Subject</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Assigned To</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} sx={{ p: 0 }}>
                                        <LinearProgress sx={{ height: 2 }} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredTickets.map((ticket: any) => (
                                <TableRow key={ticket.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            #{ticket.work_order_id || ticket.id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, fontSize: '0.8rem', bgcolor: '#e2e8f0', color: '#64748b' }}>
                                                {ticket.reported_by_name?.charAt(0) || 'U'}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontWeight={700}>{ticket.reported_by_name || 'System User'}</Typography>
                                                <Typography variant="caption" color="text.secondary">Tenant</Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>{ticket.title}</Typography>
                                        <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                                            {ticket.description}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {ticket.assigned_to_name ? (
                                            <Chip 
                                                icon={<AssignmentIcon sx={{ fontSize: '1rem !important' }} />} 
                                                label={ticket.assigned_to_name} 
                                                size="small" 
                                                variant="outlined" 
                                                sx={{ fontWeight: 600 }}
                                            />
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">Unassigned</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={ticket.status} 
                                            color={getStatusColor(ticket.status)} 
                                            size="small"
                                            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="View Conversation">
                                                <IconButton size="small" color="primary">
                                                    <CommentIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Resolved">
                                                <IconButton size="small" color="success">
                                                    <ResolvedIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
