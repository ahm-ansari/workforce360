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
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    FilterList as FilterListIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function StaffingRequests() {
    const router = useRouter();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await axios.get('outsourcing/requests/');
            setRequests(response.data);
        } catch (error) {
            console.error('Error fetching staffing requests:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'OPEN': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'FILLED': return 'primary';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'URGENT': return '#ef4444';
            case 'HIGH': return '#f97316';
            case 'MEDIUM': return '#3b82f6';
            case 'LOW': return '#10b981';
            default: return 'text.secondary';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Staffing Requests
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Managing client requirements and fulfillment pipeline
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/outsourcing/requests/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Create Request
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            size="small"
                            placeholder="Search by title or client..."
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 350 }}
                        />
                        <Button startIcon={<FilterListIcon />} variant="outlined" size="small" sx={{ borderRadius: 2 }}>
                            Filters
                        </Button>
                    </Stack>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 700, py: 2 }}>Requirement Title</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Openings</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Priority</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Target Start</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={40} />
                                    </TableCell>
                                </TableRow>
                            ) : requests.length > 0 ? requests.map((request: any) => (
                                <TableRow key={request.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell
                                        sx={{ 
                                            fontWeight: 700, 
                                            cursor: 'pointer', 
                                            color: 'primary.main',
                                            '&:hover': { textDecoration: 'underline' } 
                                        }}
                                        onClick={() => router.push(`/outsourcing/requests/${request.id}`)}
                                    >
                                        {request.title}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>{request.client_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>
                                            {request.number_of_positions}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={request.status}
                                            size="small"
                                            color={getStatusColor(request.status) as any}
                                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <Box 
                                                sx={{ 
                                                    width: 8, 
                                                    height: 8, 
                                                    borderRadius: '50%', 
                                                    bgcolor: getPriorityColor(request.priority) 
                                                }} 
                                            />
                                            <Typography variant="body2" fontWeight={600} sx={{ color: getPriorityColor(request.priority) }}>
                                                {request.priority}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(request.start_date).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton 
                                            size="small" 
                                            color="primary"
                                            onClick={() => router.push(`/outsourcing/requests/${request.id}`)}
                                            sx={{ bgcolor: 'primary.lighter' }}
                                        >
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                                        <Box sx={{ opacity: 0.5 }}>
                                            <AssignmentIcon sx={{ fontSize: 60, mb: 2 }} />
                                            <Typography variant="h6">No staffing requests found</Typography>
                                            <Typography variant="body2">Requests from clients will appear here.</Typography>
                                        </Box>
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
