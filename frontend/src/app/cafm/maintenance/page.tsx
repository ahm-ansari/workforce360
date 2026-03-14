'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Stack,
    IconButton,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function MaintenanceList() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get('cafm/maintenance-requests/');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching maintenance requests:', error);
        } finally {
            setLoading(false);
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

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'CRITICAL': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Maintenance Requests
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage work orders and facility upkeep.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/cafm/maintenance/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    New Request
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField
                        size="small"
                        placeholder="Search requests..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 400 }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>ID</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Title</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Facility</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Reported By</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Assigned To</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {requests.length > 0 ? requests.map((request: any) => (
                                <TableRow key={request.id} hover>
                                    <TableCell>{request.work_order_id || `MRQ-${request.id}`}</TableCell>
                                    <TableCell>
                                        <Typography
                                            variant="subtitle2"
                                            fontWeight={700}
                                            sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                            onClick={() => router.push(`/cafm/maintenance/${request.id}`)}
                                        >
                                            {request.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={request.priority}
                                            size="small"
                                            variant="outlined"
                                            color={getPriorityColor(request.priority) as any}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={request.status?.replace('_', ' ')}
                                            size="small"
                                            color={getStatusColor(request.status) as any}
                                        />
                                    </TableCell>
                                    <TableCell>{request.facility_name}</TableCell>
                                    <TableCell>{request.reported_by_name || '-'}</TableCell>
                                    <TableCell>{request.assigned_to_name || 'Unassigned'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={8} align="center" sx={{ py: 10 }}>
                                        {loading ? (
                                            <Typography>Loading requests...</Typography>
                                        ) : (
                                            <Typography>No maintenance requests found.</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}
