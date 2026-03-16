'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Card,
    CardContent,
    Button,
    TextField,
    Stack,
    IconButton,
    Avatar,
    Chip,
    Divider,
    CircularProgress,
    Alert,
    Tooltip,
    Menu,
    MenuItem,
    Breadcrumbs,
    Link as MuiLink,
    InputAdornment
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Send as SendIcon,
    MoreVert as MoreIcon,
    CheckCircle as ResolveIcon,
    AssignmentInd as AssignIcon,
    Schedule as TimeIcon,
    AttachFile as FileIcon,
    EmojiEmotions as EmojiIcon,
    PriorityHigh as PriorityIcon,
    Person as UserIcon,
    SupportAgent as AgentIcon,
    Chat as ChatIcon,
    Business as FacilityIcon,
    LocationOn as SpaceIcon,
    Settings as AssetIcon,
    HourglassTop as ResponseIcon,
    TaskAlt as ResolutionIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';

export default function TicketDetail() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    const currentUser = useAuthStore((state) => state.user);
    const isStaff = currentUser?.is_staff || ['admin', 'manager', 'facility manager', 'helpdesk operator'].includes(currentUser?.role_details?.name?.toLowerCase() || '');
    
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [isInternal, setIsInternal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const messageEndRef = useRef<null | HTMLDivElement>(null);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    useEffect(() => {
        fetchTicket();
    }, [id]);

    useEffect(() => {
        scrollToBottom();
    }, [ticket?.messages]);

    const fetchTicket = async () => {
        try {
            const response = await axios.get(`support/tickets/${id}/`);
            setTicket(response.data);
        } catch (err) {
            console.error('Error fetching ticket:', err);
            setError('Failed to load ticket details');
        } finally {
            setLoading(false);
        }
    };

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setSubmitting(true);
        try {
            await axios.post(`support/tickets/${id}/add_message/`, {
                message: message,
                is_internal: isInternal
            });
            // Refresh ticket to get updated timing
            fetchTicket();
            setMessage('');
            setIsInternal(false);
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleAssignToMe = async () => {
        try {
            await axios.patch(`support/tickets/${id}/`, {
                assigned_to: currentUser?.id
            });
            fetchTicket();
        } catch (err) {
            console.error('Error assigning ticket:', err);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await axios.post(`support/tickets/${id}/change_status/`, { status: newStatus });
            fetchTicket();
            setAnchorEl(null);
        } catch (err) {
            console.error('Error changing status:', err);
        }
    };

    const formatDuration = (seconds: number | null) => {
        if (seconds === null) return '--';
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        return h > 0 ? `${h}h ${m}m` : `${m}m`;
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;
    if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;
    if (!ticket) return <Alert severity="warning">Ticket not found</Alert>;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Breadcrumbs sx={{ mb: 1 }}>
                        <MuiLink component="button" onClick={() => router.push('/help-support')} sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>Help & Support</MuiLink>
                        <Typography color="text.primary" sx={{ fontSize: '0.875rem', fontWeight: 600 }}>{ticket.ticket_id}</Typography>
                    </Breadcrumbs>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <IconButton onClick={() => router.back()} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="h4" fontWeight={800} color="#1e293b">
                            {ticket.title}
                        </Typography>
                    </Stack>
                </Box>
                <Stack direction="row" spacing={2}>
                    {ticket.status !== 'RESOLVED' && (
                        <Button 
                            variant="outlined" 
                            color="success" 
                            startIcon={<ResolveIcon />}
                            onClick={() => handleStatusChange('RESOLVED')}
                            sx={{ borderRadius: 3, fontWeight: 700 }}
                        >
                            Mark as Resolved
                        </Button>
                    )}
                    <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} sx={{ bgcolor: 'white', border: '1px solid #e2e8f0' }}>
                        <MoreIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={openMenu} onClose={() => setAnchorEl(null)}>
                        <MenuItem onClick={() => handleStatusChange('OPEN')}>Set to Open</MenuItem>
                        <MenuItem onClick={() => handleStatusChange('IN_PROGRESS')}>Set to In Progress</MenuItem>
                        <MenuItem onClick={() => handleStatusChange('CLOSED')}>Set to Closed</MenuItem>
                        <Divider />
                        <MenuItem sx={{ color: 'error.main' }}>Delete Ticket</MenuItem>
                    </Menu>
                </Stack>
            </Stack>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack spacing={3}>
                        {/* Conversation Thread */}
                        <Paper sx={{ borderRadius: 5, height: '60vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                            <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <ChatIcon sx={{ color: '#64748b', fontSize: 20 }} />
                                    <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#475569' }}>Conversation Thread</Typography>
                                </Stack>
                                <Chip label={`${ticket.messages?.length || 0} Messages`} size="small" sx={{ fontWeight: 700, bgcolor: 'white' }} />
                            </Box>

                            <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: 'white' }}>
                                <Box sx={{ mb: 4, display: 'flex', gap: 2 }}>
                                    <Avatar sx={{ bgcolor: '#eff6ff', color: '#3b82f6' }}>{ticket.user_details?.username?.charAt(0)}</Avatar>
                                    <Box sx={{ flexGrow: 1 }}>
                                        <Box sx={{ bgcolor: '#f1f5f9', p: 2, borderRadius: '0 16px 16px 16px', border: '1px solid #e2e8f0' }}>
                                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>{ticket.user_details?.username} (Requester)</Typography>
                                            <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', color: '#1e293b' }}>{ticket.description}</Typography>
                                        </Box>
                                        <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                                            Original request • {new Date(ticket.created_at).toLocaleString()}
                                        </Typography>
                                    </Box>
                                </Box>

                                <Divider sx={{ mb: 4 }}>
                                    <Chip label="Updates" size="small" variant="outlined" sx={{ fontWeight: 600, color: '#94a3b8' }} />
                                </Divider>

                                {ticket.messages?.map((msg: any) => (
                                    <Box key={msg.id} sx={{ mb: 3, display: 'flex', gap: 2, flexDirection: msg.user === ticket.user ? 'row' : 'row-reverse' }}>
                                        <Avatar sx={{ 
                                            bgcolor: msg.user === ticket.user ? '#eff6ff' : '#f0fdf4',
                                            color: msg.user === ticket.user ? '#3b82f6' : '#10b981'
                                        }}>
                                            {msg.user_details?.username?.charAt(0)}
                                        </Avatar>
                                        <Box sx={{ maxWidth: '80%', textAlign: msg.user === ticket.user ? 'left' : 'right' }}>
                                            <Box sx={{ 
                                                bgcolor: msg.is_internal ? '#fdf2f8' : (msg.user === ticket.user ? '#f8fafc' : '#f0fdf4'),
                                                p: 2, 
                                                borderRadius: msg.user === ticket.user ? '0 16px 16px 16px' : '16px 0 16px 16px',
                                                border: '1px solid',
                                                borderColor: msg.is_internal ? '#fbcfe8' : (msg.user === ticket.user ? '#e2e8f0' : '#dcfce7')
                                            }}>
                                                <Typography variant="subtitle2" fontWeight={800} gutterBottom sx={{ color: msg.is_internal ? '#be185d' : 'inherit' }}>
                                                    {msg.user_details?.username} 
                                                    {msg.is_internal && <Chip label="Internal Note" size="small" color="secondary" sx={{ ml: 1, height: 16, fontSize: '0.625rem', fontWeight: 700 }} />}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: msg.is_internal ? '#86198f' : '#1e293b' }}>{msg.message}</Typography>
                                            </Box>
                                            <Typography variant="caption" sx={{ mt: 0.5, display: 'block', color: '#94a3b8', fontWeight: 600 }}>
                                                {new Date(msg.created_at).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                ))}
                                <div ref={messageEndRef} />
                            </Box>

                            <Box sx={{ p: 2, bgcolor: 'white', borderTop: '1px solid #e2e8f0' }}>
                                {ticket.status === 'CLOSED' ? (
                                    <Alert severity="info" sx={{ borderRadius: 3 }}>This ticket is closed. Reopen to send messages.</Alert>
                                ) : (
                                    <form onSubmit={handleSendMessage}>
                                        {isStaff && (
                                            <Stack direction="row" spacing={1} sx={{ mb: 1.5 }}>
                                                <Chip 
                                                    label="Customer Message" 
                                                    size="small" 
                                                    onClick={() => setIsInternal(false)}
                                                    variant={!isInternal ? 'filled' : 'outlined'}
                                                    color={!isInternal ? 'primary' : 'default'}
                                                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                                />
                                                <Chip 
                                                    label="Internal Private Note" 
                                                    size="small" 
                                                    onClick={() => setIsInternal(true)}
                                                    variant={isInternal ? 'filled' : 'outlined'}
                                                    color={isInternal ? 'secondary' : 'default'}
                                                    sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                                />
                                            </Stack>
                                        )}
                                        <TextField
                                            fullWidth
                                            multiline
                                            maxRows={4}
                                            placeholder={isInternal ? "Type a private note for staff..." : "Type your message to customer..."}
                                            value={message}
                                            onChange={(e) => setMessage(e.target.value)}
                                            sx={{ 
                                                '& .MuiOutlinedInput-root': { 
                                                    borderRadius: 4, 
                                                    bgcolor: isInternal ? '#fdf2f8' : '#f8fafc',
                                                    border: isInternal ? '1px dashed #ec4899' : 'none'
                                                } 
                                            }}
                                            slotProps={{
                                                input: {
                                                    startAdornment: (
                                                        <InputAdornment position="start">
                                                            <IconButton size="small"><FileIcon /></IconButton>
                                                            <IconButton size="small"><EmojiIcon /></IconButton>
                                                        </InputAdornment>
                                                    ),
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <Button 
                                                                variant="contained" 
                                                                type="submit"
                                                                disabled={submitting || !message.trim()}
                                                                color={isInternal ? 'secondary' : 'primary'}
                                                                sx={{ borderRadius: 3, boxShadow: 'none' }}
                                                                startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                                                            >
                                                                {isInternal ? 'Add Note' : 'Send'}
                                                            </Button>
                                                        </InputAdornment>
                                                    ),
                                                }
                                            }}
                                        />
                                    </form>
                                )}
                            </Box>
                        </Paper>

                        {/* Performance Details */}
                        <Card sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="h6" fontWeight={800} gutterBottom>Service Execution Performance</Typography>
                                <Grid container spacing={2} sx={{ mt: 1 }}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                            <ResponseIcon color="primary" sx={{ mb: 1 }} />
                                            <Typography variant="h6" fontWeight={800}>{formatDuration(ticket.response_time_seconds)}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>RESPONSE TIME</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                            <ResolutionIcon color="success" sx={{ mb: 1 }} />
                                            <Typography variant="h6" fontWeight={800}>{formatDuration(ticket.resolution_time_seconds)}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>RESOLUTION TIME</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                            <AgentIcon color="warning" sx={{ mb: 1 }} />
                                            <Typography variant="h6" fontWeight={800}>{ticket.assigned_at ? 'ASSIGNED' : 'WAITING'}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>ASSIGNMENT STATUS</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Paper variant="outlined" sx={{ p: 2, borderRadius: 3, textAlign: 'center' }}>
                                            <TimeIcon color="info" sx={{ mb: 1 }} />
                                            <Typography variant="h6" fontWeight={800}>{ticket.sla_deadline ? new Date(ticket.sla_deadline).toLocaleTimeString() : '--'}</Typography>
                                            <Typography variant="caption" color="text.secondary" fontWeight={700}>SLA DEADLINE</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Stack spacing={3}>
                        {/* Ticket Overview */}
                        <Card sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ mb: 3 }}>Request Metadata</Typography>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>PRIORITY & STATUS</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                                            <Chip label={ticket.status} color={ticket.status === 'OPEN' ? 'error' : (ticket.status === 'RESOLVED' ? 'success' : 'warning')} sx={{ fontWeight: 800, borderRadius: 2 }} />
                                            <Chip icon={<PriorityIcon sx={{ fontSize: '0.9rem !important' }} />} label={ticket.priority} variant="outlined" sx={{ fontWeight: 800, borderRadius: 2 }} />
                                        </Stack>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>FACILITY IDENTIFICATION</Typography>
                                        <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b', width: 32, height: 32 }}><FacilityIcon fontSize="small" /></Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={800}>{ticket.facility_name || 'Not Specified'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Facility / Building</Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b', width: 32, height: 32 }}><SpaceIcon fontSize="small" /></Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={800}>{ticket.space_name || 'Not Specified'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Space / Room No.</Typography>
                                                </Box>
                                            </Stack>
                                            <Stack direction="row" spacing={1.5} alignItems="center">
                                                <Avatar sx={{ bgcolor: '#f1f5f9', color: '#64748b', width: 32, height: 32 }}><AssetIcon fontSize="small" /></Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={800}>{ticket.asset_name || 'Not Specified'}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Related Asset / Equipment</Typography>
                                                </Box>
                                            </Stack>
                                        </Stack>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>ASSIGNED PERSONNEL</Typography>
                                        {ticket.assigned_to ? (
                                            <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} alignItems="center">
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#4f46e5', color: 'white' }}>
                                                    {ticket.assigned_to_details?.username?.charAt(0) || '?'}
                                                </Avatar>
                                                <Box>
                                                    <Typography variant="body2" fontWeight={800}>{ticket.assigned_to_details?.username}</Typography>
                                                    <Typography variant="caption" color="text.secondary">Support Specialist</Typography>
                                                </Box>
                                            </Stack>
                                        ) : (
                                            <Box sx={{ mt: 1.5 }}>
                                                <Typography variant="body2" sx={{ color: '#94a3b8', fontStyle: 'italic', mb: 1 }}>Unassigned</Typography>
                                                {isStaff && (
                                                    <Button 
                                                        fullWidth 
                                                        size="small" 
                                                        variant="outlined" 
                                                        startIcon={<AssignIcon />}
                                                        onClick={handleAssignToMe}
                                                        sx={{ borderRadius: 2, fontWeight: 700 }}
                                                    >
                                                        Assign to Me
                                                    </Button>
                                                )}
                                            </Box>
                                        )}
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Audit Log */}
                        <Card sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" fontWeight={800} gutterBottom display="flex" alignItems="center" gap={1}>
                                    <TimeIcon fontSize="small" /> Activity Log
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    {[
                                        { label: 'Created', time: ticket.created_at, icon: 'ticket' },
                                        { label: 'Assigned', time: ticket.assigned_at, icon: 'assign' },
                                        { label: 'First Response', time: ticket.first_response_at, icon: 'chat' },
                                        { label: 'Resolved', time: ticket.resolved_at, icon: 'check' },
                                    ].filter(log => log.time).map((log, i) => (
                                        <Box key={i} sx={{ borderLeft: '2px solid #e2e8f0', pl: 2, pb: 1, position: 'relative' }}>
                                            <Box sx={{ position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: '50%', bgcolor: log.label === 'Resolved' ? '#10b981' : '#3b82f6' }} />
                                            <Typography variant="caption" fontWeight={700} display="block" sx={{ lineHeight: 1 }}>{log.label}</Typography>
                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.65rem' }}>{new Date(log.time).toLocaleString()}</Typography>
                                        </Box>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
