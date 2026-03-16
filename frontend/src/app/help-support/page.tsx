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
    CircularProgress,
    Snackbar,
    Alert,
    Avatar,
    Divider
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    History as HistoryIcon,
    ConfirmationNumber as TicketIcon,
    FilterList as FilterIcon,
    Chat as ChatIcon,
    Person as UserIcon,
    PriorityHigh as PriorityIcon,
    AssignmentInd as AssignmentIcon,
    CheckCircle as ResolvedIcon,
    ErrorOutline as OpenIcon,
    PendingActions as PendingIcon,
    ArrowForward as ViewIcon,
    Business as FacilityIcon,
    Timer as TimerIcon,
    ContactSupport as ContactSupportIcon,
    Analytics as AnalyticsIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function SupportDashboard() {
    const router = useRouter();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        open: 0,
        in_progress: 0,
        resolved: 0
    });
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [ticketsRes, statsRes] = await Promise.all([
                axios.get('support/tickets/'),
                axios.get('support/tickets/stats/')
            ]);
            setTickets(ticketsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error('Error fetching support data:', error);
            setSnackbar({ open: true, message: 'Failed to load support tickets', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const getStatusChip = (status: string) => {
        switch (status) {
            case 'OPEN': return <Chip label="Open" size="small" color="error" variant="filled" sx={{ fontWeight: 700, borderRadius: 1.5 }} />;
            case 'IN_PROGRESS': return <Chip label="In Progress" size="small" color="warning" variant="filled" sx={{ fontWeight: 700, borderRadius: 1.5 }} />;
            case 'RESOLVED': return <Chip label="Resolved" size="small" color="success" variant="filled" sx={{ fontWeight: 700, borderRadius: 1.5 }} />;
            case 'CLOSED': return <Chip label="Closed" size="small" variant="outlined" sx={{ fontWeight: 700, borderRadius: 1.5 }} />;
            default: return <Chip label={status} size="small" variant="outlined" />;
        }
    };

    const getPriorityIcon = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return <PriorityIcon sx={{ color: '#ef4444' }} />;
            case 'HIGH': return <PriorityIcon sx={{ color: '#f97316' }} />;
            case 'MEDIUM': return <PriorityIcon sx={{ color: '#eab308' }} />;
            default: return <PriorityIcon sx={{ color: '#94a3b8' }} />;
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase()) || 
                             t.ticket_id.toLowerCase().includes(search.toLowerCase());
        const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const formatDuration = (seconds: number | null) => {
        if (seconds === null) return '--';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f1f5f9', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 6 }}>
                <Box>
                    <Typography variant="h3" fontWeight={800} sx={{ color: '#1e293b', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: 2 }}>
                        <ContactSupportIcon sx={{ fontSize: 40, color: '#3b82f6' }} /> Help Desk Center
                    </Typography>
                    <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 400, mt: 1 }}>
                        Enterprise support system with real-time tracking and SLA monitoring.
                    </Typography>
                </Box>
                <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/help-support/new')}
                    sx={{ 
                        borderRadius: 3, 
                        px: 4, 
                        py: 1.5, 
                        bgcolor: '#3b82f6', 
                        boxShadow: '0 4px 14px 0 rgba(59, 130, 246, 0.4)',
                        '&:hover': { bgcolor: '#2563eb' },
                        fontWeight: 700
                    }}
                >
                    Create New Ticket
                </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 6 }}>
                {[
                    { label: 'System Overview', value: stats.total, icon: <TicketIcon />, color: '#1e293b', bg: '#f8fafc' },
                    { label: 'Active Escalations', value: stats.open + stats.in_progress, icon: <OpenIcon />, color: '#ef4444', bg: '#fef2f2' },
                    { label: 'In Execution', value: stats.in_progress, icon: <PendingIcon />, color: '#f59e0b', bg: '#fffbeb' },
                    { label: 'Successful Closure', value: stats.resolved, icon: <ResolvedIcon />, color: '#10b981', bg: '#f0fdf4' },
                ].map((stat, idx) => (
                    <Grid size={{ xs: 12, sm: 6, md: 3 }} key={idx}>
                        <Card sx={{ borderRadius: 4, border: '1px solid #e2e8f0', boxShadow: '0 4px 6px rgba(0,0,0,0.02)', bgcolor: 'white' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Avatar sx={{ bgcolor: stat.bg, color: stat.color, width: 56, height: 56, borderRadius: 3 }}>
                                        {stat.icon}
                                    </Avatar>
                                    <Box>
                                        <Typography variant="h4" fontWeight={900} sx={{ color: stat.color }}>{stat.value}</Typography>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ borderRadius: 5, overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.04)' }}>
                <Box sx={{ p: 3, bgcolor: 'white', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="Search Ticket ID, Subject or Asset..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        sx={{ width: { xs: '100%', md: 400 }, '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: '#f8fafc' } }}
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
                    <Stack direction="row" spacing={1} sx={{ overflowX: 'auto' }}>
                        <Button 
                            variant="outlined" 
                            size="small"
                            startIcon={<AnalyticsIcon />} 
                            onClick={() => router.push('/help-support/analytics')}
                            sx={{ borderRadius: 2, mr: 1, borderColor: '#e2e8f0', color: '#6366f1', fontWeight: 700, px: 2 }}
                        >
                            Analytics
                        </Button>
                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'].map((filter) => (
                            <Chip
                                key={filter}
                                label={filter.replace('_', ' ')}
                                onClick={() => setStatusFilter(filter)}
                                variant={statusFilter === filter ? 'filled' : 'outlined'}
                                color={statusFilter === filter ? 'primary' : 'default'}
                                sx={{ fontWeight: 700, borderRadius: 2 }}
                            />
                        ))}
                    </Stack>
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f8fafc' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>TICKET ID</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>SUBJECT & CATEGORY</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>IDENTIFICATION</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>PERFORMANCE</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }}>STATUS</TableCell>
                                <TableCell sx={{ fontWeight: 800, color: '#475569' }} align="right">ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={32} thickness={5} />
                                        <Typography sx={{ mt: 2, color: '#64748b', fontWeight: 600 }}>Synchronizing Support Data...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : filteredTickets.length > 0 ? filteredTickets.map((ticket) => (
                                <TableRow key={ticket.id} hover sx={{ '&:last-child td': { border: 0 } }}>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 800, color: '#3b82f6' }}>
                                            {ticket.ticket_id}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight={800} sx={{ color: '#1e293b' }}>
                                                {ticket.title}
                                            </Typography>
                                            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600 }}>
                                                    {ticket.category_name}
                                                </Typography>
                                                <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    {getPriorityIcon(ticket.priority)}
                                                    <Typography variant="caption" fontWeight={700} sx={{ color: '#64748b' }}>
                                                        {ticket.priority}
                                                    </Typography>
                                                </Stack>
                                            </Stack>
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        {ticket.facility_name ? (
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <FacilityIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                                                <Box>
                                                    <Typography variant="caption" sx={{ display: 'block', fontWeight: 700, color: '#475569' }}>{ticket.facility_name}</Typography>
                                                    <Typography variant="caption" sx={{ color: '#94a3b8' }}>{ticket.asset_name || ticket.space_name || 'General Area'}</Typography>
                                                </Box>
                                            </Box>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">Global Issue</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={0.5}>
                                            <Tooltip title="Response Time">
                                                <Stack direction="row" spacing={0.5} alignItems="center">
                                                    <TimerIcon sx={{ fontSize: 14, color: '#3b82f6' }} />
                                                    <Typography variant="caption" fontWeight={600} color="#1e293b">Resp: {formatDuration(ticket.response_time_seconds)}</Typography>
                                                </Stack>
                                            </Tooltip>
                                            <Typography variant="caption" color="text.secondary">Opened: {new Date(ticket.created_at).toLocaleDateString()}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {getStatusChip(ticket.status)}
                                    </TableCell>
                                    <TableCell align="right">
                                        <Button 
                                            variant="contained" 
                                            disableElevation
                                            size="small"
                                            onClick={() => router.push(`/help-support/${ticket.id}`)}
                                            sx={{ borderRadius: 2, fontWeight: 700, bgcolor: '#f1f5f9', color: '#1e293b', '&:hover': { bgcolor: '#e2e8f0' } }}
                                        >
                                            Manage
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Box sx={{ opacity: 0.5 }}>
                                            <TicketIcon sx={{ fontSize: 48, mb: 1, color: '#94a3b8' }} />
                                            <Typography variant="h6">No tickets found</Typography>
                                            <Typography variant="body2">Try adjusting your search or filters.</Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                <Alert severity={snackbar.severity} sx={{ borderRadius: 3 }}>{snackbar.message}</Alert>
            </Snackbar>
        </Box>
    );
}
