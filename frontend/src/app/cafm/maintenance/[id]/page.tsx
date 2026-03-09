'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Stack,
    Button,
    Chip,
    Divider,
    TextField,
    MenuItem,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Avatar
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    History as HistoryIcon,
    Person as PersonIcon,
    Build as BuildIcon,
    Room as RoomIcon,
    Business as BusinessIcon,
    Send as SendIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/lib/axios';

export default function MaintenanceDetail() {
    const router = useRouter();
    const { id } = useParams();
    const [request, setRequest] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchRequest();
    }, [id]);

    const fetchRequest = async () => {
        try {
            const res = await axios.get(`cafm/maintenance-requests/${id}/`);
            setRequest(res.data);
        } catch (error) {
            console.error('Failed to fetch request', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        setSaving(true);
        try {
            await axios.patch(`cafm/maintenance-requests/${id}/`, { status: newStatus });
            fetchRequest();
        } catch (error) {
            console.error('Failed to update status', error);
        } finally {
            setSaving(false);
        }
    };

    const handleAddComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSaving(true);
        try {
            await axios.post('cafm/maintenance-logs/', {
                request: id,
                comment: comment
            });
            setComment('');
            fetchRequest();
        } catch (error) {
            console.error('Failed to add comment', error);
        } finally {
            setSaving(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'error';
            case 'IN_PROGRESS': return 'warning';
            case 'RESOLVED': return 'info';
            case 'CLOSED': return 'success';
            default: return 'default';
        }
    };

    if (loading) return <Box sx={{ p: 4 }}>Loading...</Box>;
    if (!request) return <Box sx={{ p: 4 }}>Request not found.</Box>;

    return (
        <Box sx={{ p: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/cafm/maintenance')}
                sx={{ mb: 3 }}
            >
                Back to Maintenance
            </Button>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 2 }}>
                        <Box>
                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                {request.title}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                ID: MRQ-{request.id.toString().padStart(4, '0')} • Created {new Date(request.created_at).toLocaleDateString()}
                            </Typography>
                        </Box>
                        <Chip
                            label={request.status.replace('_', ' ')}
                            color={getStatusColor(request.status) as any}
                            sx={{ px: 2, py: 1, fontWeight: 700 }}
                        />
                    </Stack>

                    <Card sx={{ borderRadius: 3, mb: 4 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Description</Typography>
                            <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', mb: 4 }}>
                                {request.description}
                            </Typography>

                            <Divider sx={{ mb: 3 }} />

                            <Grid container spacing={3}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">LOCATION</Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <BusinessIcon color="action" fontSize="small" />
                                                <Typography variant="body2">{request.facility_name}</Typography>
                                            </Stack>
                                            {request.space_name && (
                                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                                    <RoomIcon color="action" fontSize="small" />
                                                    <Typography variant="body2">{request.space_name}</Typography>
                                                </Stack>
                                            )}
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">ASSET</Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <BuildIcon color="action" fontSize="small" />
                                                <Typography variant="body2">{request.asset_name || 'No specific asset'}</Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Stack spacing={2}>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">REPORTED BY</Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PersonIcon color="action" fontSize="small" />
                                                <Typography variant="body2">{request.reported_by_name || 'System'}</Typography>
                                            </Stack>
                                        </Box>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">ASSIGNED TO</Typography>
                                            <Stack direction="row" spacing={1} alignItems="center">
                                                <PersonIcon color="primary" fontSize="small" />
                                                <Typography variant="body2" fontWeight={600}>
                                                    {request.assigned_to_name || 'Unassigned'}
                                                </Typography>
                                            </Stack>
                                        </Box>
                                    </Stack>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>Activity & Logs</Typography>
                    <Paper sx={{ p: 0, borderRadius: 3, overflow: 'hidden' }}>
                        <List sx={{ p: 0 }}>
                            {request.logs?.map((log: any, index: number) => (
                                <React.Fragment key={log.id}>
                                    <ListItem alignItems="flex-start" sx={{ px: 3, py: 2 }}>
                                        <ListItemIcon sx={{ mt: 0.5 }}>
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: log.status_change ? 'info.light' : 'action.selected' }}>
                                                {log.status_change ? <HistoryIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                                            </Avatar>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Typography variant="subtitle2" fontWeight={700}>{log.user_name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {new Date(log.created_at).toLocaleString()}
                                                    </Typography>
                                                </Stack>
                                            }
                                            secondary={
                                                <Box sx={{ mt: 0.5 }}>
                                                    {log.status_change && (
                                                        <Chip
                                                            label={log.status_change}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ mb: 1, height: 20, fontSize: '0.7rem' }}
                                                        />
                                                    )}
                                                    <Typography variant="body2" color="text.primary">
                                                        {log.comment}
                                                    </Typography>
                                                </Box>
                                            }
                                        />
                                    </ListItem>
                                    {index < request.logs.length - 1 && <Divider component="li" />}
                                </React.Fragment>
                            ))}
                            <ListItem sx={{ px: 3, py: 3, bgcolor: 'action.hover' }}>
                                <Box component="form" onSubmit={handleAddComment} sx={{ width: '100%' }}>
                                    <TextField
                                        fullWidth
                                        placeholder="Add a comment or update note..."
                                        multiline
                                        rows={2}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        sx={{ bgcolor: 'white' }}
                                        InputProps={{
                                            endAdornment: (
                                                <Button
                                                    type="submit"
                                                    disabled={saving || !comment.trim()}
                                                    variant="contained"
                                                    sx={{ ml: 1 }}
                                                >
                                                    <SendIcon />
                                                </Button>
                                            )
                                        }}
                                    />
                                </Box>
                            </ListItem>
                        </List>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 3, position: 'sticky', top: 24 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Actions</Typography>
                            <Stack spacing={2}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Update Status"
                                    value={request.status}
                                    onChange={(e) => handleStatusChange(e.target.value)}
                                    disabled={saving}
                                >
                                    <MenuItem value="OPEN">Open</MenuItem>
                                    <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
                                    <MenuItem value="RESOLVED">Resolved</MenuItem>
                                    <MenuItem value="CLOSED">Closed</MenuItem>
                                </TextField>

                                <Button
                                    variant="outlined"
                                    fullWidth
                                    startIcon={<PersonIcon />}
                                    disabled={saving}
                                >
                                    Reassign Task
                                </Button>

                                <Divider />

                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        PRIORITY
                                    </Typography>
                                    <Chip
                                        label={request.priority}
                                        color={request.priority === 'CRITICAL' ? 'error' : request.priority === 'HIGH' ? 'warning' : 'info'}
                                        sx={{ fontWeight: 700 }}
                                    />
                                </Box>

                                <Box>
                                    <Typography variant="caption" color="text.secondary" display="block" gutterBottom>
                                        DUE DATE
                                    </Typography>
                                    <Typography variant="body2" fontWeight={600}>
                                        {request.due_date ? new Date(request.due_date).toLocaleDateString() : 'No due date'}
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
