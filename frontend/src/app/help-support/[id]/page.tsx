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
    Link as MuiLink
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
    SupportAgent as AgentIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/lib/axios';

export default function TicketDetail() {
    const router = useRouter();
    const params = useParams();
    const { id } = params;
    
    const [ticket, setTicket] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
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
            const response = await axios.post(`support/tickets/${id}/add_message/`, {
                message: message
            });
            setTicket((prev: any) => ({
                ...prev,
                messages: [...(prev.messages || []), response.data]
            }));
            setMessage('');
        } catch (err) {
            console.error('Error sending message:', err);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        try {
            await axios.post(`support/tickets/${id}/change_status/`, { status: newStatus });
            setTicket((prev: any) => ({ ...prev, status: newStatus }));
            setAnchorEl(null);
        } catch (err) {
            console.error('Error changing status:', err);
        }
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
                {/* Chat Section */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ borderRadius: 5, height: '70vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                        <Box sx={{ p: 2, bgcolor: '#f1f5f9', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <ChatIcon sx={{ color: '#64748b', fontSize: 20 }} />
                                <Typography variant="subtitle2" fontWeight={700} sx={{ color: '#475569' }}>Conversation Thread</Typography>
                            </Stack>
                            <Chip label={`${ticket.messages?.length || 0} Messages`} size="small" sx={{ fontWeight: 700, bgcolor: 'white' }} />
                        </Box>

                        <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 3, bgcolor: 'white' }}>
                            {/* Initial Description */}
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

                            {/* Ticket Messages */}
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
                                            bgcolor: msg.user === ticket.user ? '#f8fafc' : '#f0fdf4',
                                            p: 2, 
                                            borderRadius: msg.user === ticket.user ? '0 16px 16px 16px' : '16px 0 16px 16px',
                                            border: '1px solid',
                                            borderColor: msg.user === ticket.user ? '#e2e8f0' : '#dcfce7'
                                        }}>
                                            <Typography variant="subtitle2" fontWeight={800} gutterBottom>
                                                {msg.user_details?.username} 
                                                {msg.is_internal && <Chip label="Internal" size="small" color="secondary" sx={{ ml: 1, height: 16, fontSize: '0.625rem' }} />}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#1e293b' }}>{msg.message}</Typography>
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
                                    <TextField
                                        fullWidth
                                        multiline
                                        maxRows={4}
                                        placeholder="Type your message here..."
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        sx={{ 
                                            '& .MuiOutlinedInput-root': { borderRadius: 4, bgcolor: '#f8fafc' }
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
                                                            sx={{ borderRadius: 3, bgcolor: '#3b82f6' }}
                                                            startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendIcon />}
                                                        >
                                                            Send
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
                </Grid>

                {/* Info Sidebar */}
                <Grid item xs={12} md={4}>
                    <Stack spacing={3}>
                        <Card sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ mb: 3 }}>Ticket Information</Typography>
                                <Stack spacing={2}>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>STATUS</Typography>
                                        <Box sx={{ mt: 0.5 }}>
                                            <Chip 
                                                label={ticket.status} 
                                                color={ticket.status === 'OPEN' ? 'error' : (ticket.status === 'RESOLVED' ? 'success' : 'warning')} 
                                                sx={{ fontWeight: 800, borderRadius: 2 }} 
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>PRIORITY</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 0.5 }} alignItems="center">
                                            <PriorityIcon sx={{ color: ticket.priority === 'CRITICAL' ? '#ef4444' : '#f59e0b' }} />
                                            <Typography variant="body2" fontWeight={800}>{ticket.priority}</Typography>
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>DEPARTMENT</Typography>
                                        <Typography variant="body2" fontWeight={700} sx={{ mt: 0.5 }}>{ticket.category_name}</Typography>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>ASSIGNED AGENT</Typography>
                                        <Stack direction="row" spacing={1} sx={{ mt: 1 }} alignItems="center">
                                            <Avatar sx={{ width: 24, height: 24, bgcolor: '#f1f5f9', color: '#64748b' }}><AgentIcon fontSize="small" /></Avatar>
                                            <Typography variant="body2" fontWeight={800}>{ticket.assigned_to_details?.username || 'Waiting for assignment...'}</Typography>
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 700 }}>TICKET ID</Typography>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 700, mt: 0.5 }}>{ticket.ticket_id}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>

                        <Card sx={{ borderRadius: 5, border: '1px solid #e2e8f0', boxShadow: 'none', bgcolor: '#f8fafc' }}>
                            <CardContent sx={{ p: 3 }}>
                                <Typography variant="subtitle2" fontWeight={800} gutterBottom display="flex" alignItems="center" gap={1}>
                                    <TimeIcon fontSize="small" /> Activity Timeline
                                </Typography>
                                <Stack spacing={2} sx={{ mt: 2 }}>
                                    <Box sx={{ borderLeft: '2px solid #e2e8f0', pl: 2, pb: 1, position: 'relative' }}>
                                        <Box sx={{ position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: '50%', bgcolor: '#3b82f6' }} />
                                        <Typography variant="caption" fontWeight={700} display="block">Ticket Created</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(ticket.created_at).toLocaleString()}</Typography>
                                    </Box>
                                    <Box sx={{ borderLeft: '2px solid #e2e8f0', pl: 2, pb: 1, position: 'relative' }}>
                                        <Box sx={{ position: 'absolute', left: -5, top: 0, width: 8, height: 8, borderRadius: '50%', bgcolor: '#94a3b8' }} />
                                        <Typography variant="caption" fontWeight={700} display="block">Last Sync</Typography>
                                        <Typography variant="caption" color="text.secondary">{new Date(ticket.updated_at).toLocaleString()}</Typography>
                                    </Box>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );
}
