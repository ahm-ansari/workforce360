'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import api from '@/services/api';
import { useRouter } from 'next/navigation';

interface LeaveRequest {
    id: number;
    employee_details: {
        user: {
            first_name: string;
            last_name: string;
            email: string;
        };
    };
    leave_type_details: {
        name: string;
    };
    start_date: string;
    end_date: string;
    days_count: number;
    reason: string;
    status: string;
}

export default function ApproveLeavePage() {
    const router = useRouter();
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [rejectDialog, setRejectDialog] = useState<{ open: boolean; id: number | null }>({ open: false, id: null });
    const [rejectReason, setRejectReason] = useState('');

    useEffect(() => {
        fetchPendingLeaves();
    }, []);

    const fetchPendingLeaves = async () => {
        try {
            const response = await api.get('hr/leaves/?status=PENDING');
            setLeaves(Array.isArray(response.data) ? response.data : response.data.results || []);
        } catch (error) {
            console.error('Failed to fetch pending leaves:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await api.post(`hr/leaves/${id}/approve/`);
            fetchPendingLeaves();
        } catch (error) {
            console.error('Failed to approve leave:', error);
        }
    };

    const handleReject = async () => {
        if (!rejectDialog.id) return;
        try {
            await api.post(`hr/leaves/${rejectDialog.id}/reject/`, { reason: rejectReason });
            setRejectDialog({ open: false, id: null });
            setRejectReason('');
            fetchPendingLeaves();
        } catch (error) {
            console.error('Failed to reject leave:', error);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Approve Leave Requests</Typography>
                <Button variant="outlined" onClick={() => router.back()}>
                    Back
                </Button>
            </Box>

            <Paper sx={{ p: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Employee</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Dates</TableCell>
                                <TableCell>Days</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaves.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center">No pending requests</TableCell>
                                </TableRow>
                            ) : (
                                leaves.map((leave) => (
                                    <TableRow key={leave.id}>
                                        <TableCell>
                                            {leave.employee_details.user.first_name} {leave.employee_details.user.last_name}
                                        </TableCell>
                                        <TableCell>{leave.leave_type_details.name}</TableCell>
                                        <TableCell>
                                            {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{leave.days_count}</TableCell>
                                        <TableCell>{leave.reason}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 1 }}>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="success"
                                                    startIcon={<CheckCircleIcon />}
                                                    onClick={() => handleApprove(leave.id)}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="error"
                                                    startIcon={<CancelIcon />}
                                                    onClick={() => setRejectDialog({ open: true, id: leave.id })}
                                                >
                                                    Reject
                                                </Button>
                                            </Box>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, id: null })}>
                <DialogTitle>Reject Leave Request</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Rejection Reason"
                        fullWidth
                        multiline
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRejectDialog({ open: false, id: null })}>Cancel</Button>
                    <Button onClick={handleReject} color="error" variant="contained">Reject</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
