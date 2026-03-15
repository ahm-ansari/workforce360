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
    Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    PlayArrow as GenerateIcon,
    History as HistoryIcon,
    CalendarMonth as CalendarIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function PPMList() {
    const router = useRouter();
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        fetchSchedules();
    }, []);

    const fetchSchedules = async () => {
        try {
            const response = await axios.get('cafm/ppm-schedules/');
            setSchedules(response.data);
        } catch (error) {
            console.error('Error fetching PPM schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateWorkOrders = async () => {
        try {
             const response = await axios.post('cafm/ppm-schedules/bulk_generate/');
             fetchSchedules();
             alert(response.data.status || 'Work orders generated successfully!');
        } catch (e) {
            console.error(e);
            alert('Failed to generate work orders.');
        }
    };

    const filteredSchedules = schedules.filter(s => 
        s.task_name.toLowerCase().includes(search.toLowerCase()) ||
        s.asset_name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Planned Preventive Maintenance (PPM)
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage recurring maintenance schedules and automate work order generation.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<GenerateIcon />}
                        onClick={handleGenerateWorkOrders}
                        sx={{ borderRadius: 2 }}
                    >
                        Generate Due Orders
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/cafm/ppm/new')}
                        sx={{ borderRadius: 2 }}
                    >
                        New PPM Task
                    </Button>
                </Stack>
            </Stack>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden', mb: 4 }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                    <TextField
                        fullWidth
                        placeholder="Search by task or asset..."
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
                                <TableCell sx={{ fontWeight: 700 }}>Task Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Asset</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Frequency</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Next Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Last Completed</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSchedules.map((schedule: any) => (
                                <TableRow key={schedule.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={600}>
                                            {schedule.task_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{schedule.asset_name}</TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={schedule.frequency} 
                                            size="small" 
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <CalendarIcon fontSize="small" color="primary" />
                                            <Typography variant="body2">
                                                {new Date(schedule.next_due_date).toLocaleDateString()}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        {schedule.last_completed_date ? 
                                            new Date(schedule.last_completed_date).toLocaleDateString() : 
                                            <Typography variant="caption" color="text.disabled">Never</Typography>
                                        }
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={schedule.is_active ? 'Active' : 'Paused'} 
                                            color={schedule.is_active ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Generate Work Order">
                                                <IconButton 
                                                    size="small" 
                                                    color="primary"
                                                    onClick={async () => {
                                                        try {
                                                            await axios.post(`cafm/ppm-schedules/${schedule.id}/generate_work_order/`);
                                                            fetchSchedules();
                                                            alert('Work order generated successfully!');
                                                        } catch (e) {
                                                            console.error(e);
                                                            alert('Failed to generate work order.');
                                                        }
                                                    }}
                                                >
                                                    <GenerateIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="View History">
                                                <IconButton size="small">
                                                    <HistoryIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Task">
                                                <IconButton size="small">
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredSchedules.length === 0 && !loading && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Typography variant="body1" color="text.secondary">
                                            No PPM schedules found.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
