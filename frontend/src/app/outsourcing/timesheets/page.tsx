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
    Stack,
    Tooltip
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Visibility as VisibilityIcon,
    Add as AddIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function OutsourcingTimesheets() {
    const router = useRouter();
    const [timesheets, setTimesheets] = useState([]);

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = async () => {
        try {
            const response = await axios.get('/api/outsourcing/timesheets/');
            setTimesheets(response.data);
        } catch (error) {
            console.error('Error fetching timesheets:', error);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await axios.patch(`/api/outsourcing/timesheets/${id}/`, { status: 'APPROVED' });
            fetchTimesheets();
        } catch (error) {
            console.error('Error approving timesheet:', error);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Timesheet Management
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/outsourcing/timesheets/new')}
                    sx={{ borderRadius: 2 }}
                >
                    Submit Timesheet
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Hours</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {timesheets.length > 0 ? timesheets.map((ts: any) => (
                                <TableRow key={ts.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{ts.employee_name}</TableCell>
                                    <TableCell>{ts.client_name}</TableCell>
                                    <TableCell>
                                        {new Date(ts.start_date).toLocaleDateString()} -
                                        {new Date(ts.end_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>{ts.total_hours}</TableCell>
                                    <TableCell>${ts.billable_amount}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ts.status}
                                            size="small"
                                            color={ts.status === 'APPROVED' ? 'success' : ts.status === 'SUBMITTED' ? 'warning' : 'default'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {ts.status === 'SUBMITTED' && (
                                                <>
                                                    <Tooltip title="Approve">
                                                        <IconButton
                                                            size="small"
                                                            color="success"
                                                            onClick={() => handleApprove(ts.id)}
                                                        >
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton size="small" color="error">
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            <IconButton size="small">
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary">
                                            No timesheets found for outsourcing.
                                        </Typography>
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
