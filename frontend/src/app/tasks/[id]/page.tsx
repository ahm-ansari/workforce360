'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Chip, TextField, Divider, List, ListItem, ListItemText, ListItemAvatar, Avatar } from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PersonIcon from '@mui/icons-material/Person';
import { useAuthStore } from '@/store/authStore';

interface ActivityLog {
    id: number;
    user_details: {
        username: string;
    };
    action: string;
    timestamp: string;
}

interface Task {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    assigned_to_details: {
        first_name: string;
        last_name: string;
    } | null;
    assigned_by_details: {
        username: string;
    } | null;
    activities: ActivityLog[];
}

export default function TaskDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState('');

    useEffect(() => {
        if (params.id) {
            fetchTask();
        }
    }, [params.id]);

    const fetchTask = async () => {
        try {
            const response = await api.get(`tasks/tasks/${params.id}/`);
            setTask(response.data);
        } catch (error) {
            console.error('Failed to fetch task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus: string) => {
        if (!task) return;
        try {
            await api.patch(`tasks/tasks/${task.id}/`, { status: newStatus });
            fetchTask(); // Refresh to get new activity log
        } catch (error) {
            console.error('Failed to update status:', error);
        }
    };

    const handleAddComment = async () => {
        if (!task || !comment.trim()) return;
        try {
            await api.post(`tasks/tasks/${task.id}/log_activity/`, {
                action: `Comment: ${comment}`
            });
            setComment('');
            fetchTask();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    if (loading) return <Typography>Loading...</Typography>;
    if (!task) return <Typography>Task not found</Typography>;

    return (
        <Box sx={{ p: 3, maxWidth: 1000, mx: 'auto' }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
                Back to Tasks
            </Button>

            <Grid container spacing={3}>
                <Grid size={{ xs: 12, md: 8 }}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                            <Typography variant="h4">{task.title}</Typography>
                            <Chip label={task.status} color={task.status === 'DONE' ? 'success' : 'primary'} />
                        </Box>

                        <Typography variant="body1" paragraph>
                            {task.description || 'No description provided.'}
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="h6" gutterBottom>Activity & Comments</Typography>
                        <List>
                            {task.activities.map((log) => (
                                <ListItem key={log.id} alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar>
                                            <PersonIcon />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={log.user_details?.username || 'Unknown User'}
                                        secondary={
                                            <>
                                                <Typography component="span" variant="body2" color="text.primary">
                                                    {log.action}
                                                </Typography>
                                                {" — "}{new Date(log.timestamp).toLocaleString()}
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>

                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Add a comment..."
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                            <Button variant="contained" onClick={handleAddComment}>
                                Post
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" gutterBottom>Details</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Priority</Typography>
                                <Typography>{task.priority}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Assigned To</Typography>
                                <Typography>
                                    {task.assigned_to_details ?
                                        `${task.assigned_to_details.first_name} ${task.assigned_to_details.last_name}` :
                                        'Unassigned'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Assigned By</Typography>
                                <Typography>{task.assigned_by_details?.username || '-'}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="caption" color="text.secondary">Due Date</Typography>
                                <Typography>{task.due_date || 'No date'}</Typography>
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        <Typography variant="h6" gutterBottom>Actions</Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((status) => (
                                <Button
                                    key={status}
                                    variant={task.status === status ? 'contained' : 'outlined'}
                                    onClick={() => handleStatusChange(status)}
                                    disabled={task.status === status}
                                >
                                    Mark as {status.replace('_', ' ')}
                                </Button>
                            ))}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}
