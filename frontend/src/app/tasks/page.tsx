'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Grid, Card, CardContent, Chip, IconButton, Menu, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ViewListIcon from '@mui/icons-material/ViewList';
import ViewKanbanIcon from '@mui/icons-material/ViewModule'; // Using ViewModule as proxy for Kanban icon
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface Task {
    id: number;
    title: string;
    description: string;
    status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    due_date: string;
    assigned_to_details: {
        first_name: string;
        last_name: string;
    } | null;
}

export default function TasksPage() {
    const router = useRouter();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('kanban');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            const response = await api.get('tasks/tasks/');
            setTasks(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'DONE': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'IN_REVIEW': return 'warning';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            default: return 'default';
        }
    };

    const KanbanColumn = ({ status, title }: { status: string, title: string }) => (
        <Grid size={{ xs: 12, md: 3 }}>
            <Box sx={{ bgcolor: 'background.paper', p: 2, borderRadius: 1, height: '100%', minHeight: 500 }}>
                <Typography variant="h6" gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    {title}
                    <Chip label={tasks.filter(t => t.status === status).length} size="small" />
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {tasks.filter(t => t.status === status).map(task => (
                        <Card key={task.id} sx={{ cursor: 'pointer' }} onClick={() => router.push(`/tasks/${task.id}`)}>
                            <CardContent>
                                <Typography variant="subtitle1" gutterBottom>
                                    {task.title}
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                                    <Chip label={task.priority} size="small" color={getPriorityColor(task.priority) as any} variant="outlined" />
                                </Box>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    Due: {task.due_date || 'No date'}
                                </Typography>
                                {task.assigned_to_details && (
                                    <Typography variant="caption" display="block" color="text.secondary">
                                        Assigned: {task.assigned_to_details.first_name}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Grid>
    );

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Task Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <ToggleButtonGroup
                        value={viewMode}
                        exclusive
                        onChange={(_, newView) => newView && setViewMode(newView)}
                        aria-label="view mode"
                    >
                        <ToggleButton value="list" aria-label="list view">
                            <ViewListIcon />
                        </ToggleButton>
                        <ToggleButton value="kanban" aria-label="kanban view">
                            <ViewKanbanIcon />
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/tasks/create')}
                    >
                        Create Task
                    </Button>
                </Box>
            </Box>

            {viewMode === 'kanban' ? (
                <Grid container spacing={3}>
                    <KanbanColumn status="TODO" title="To Do" />
                    <KanbanColumn status="IN_PROGRESS" title="In Progress" />
                    <KanbanColumn status="IN_REVIEW" title="In Review" />
                    <KanbanColumn status="DONE" title="Done" />
                </Grid>
            ) : (
                <Grid container spacing={2}>
                    {tasks.map(task => (
                        <Grid size={{ xs: 12 }} key={task.id}>
                            <Card onClick={() => router.push(`/tasks/${task.id}`)} sx={{ cursor: 'pointer' }}>
                                <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Box>
                                        <Typography variant="h6">{task.title}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {task.description.substring(0, 100)}...
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                                        <Chip label={task.status} color={getStatusColor(task.status) as any} />
                                        <Chip label={task.priority} color={getPriorityColor(task.priority) as any} variant="outlined" />
                                        <Typography variant="body2">
                                            {task.assigned_to_details?.first_name}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}
        </Box>
    );
}
