'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LeaveBalanceCard from '@/components/hr/LeaveBalanceCard';
import api from '@/services/api';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';

interface LeaveType {
    id: number;
    name: string;
    max_days_per_year: number;
}

interface LeaveRequest {
    id: number;
    leave_type_details: LeaveType;
    start_date: string;
    end_date: string;
    days_count: number;
    status: string;
    reason: string;
}

export default function LeavePage() {
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
    const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [typesRes, leavesRes] = await Promise.all([
                api.get('hr/leave-types/'),
                api.get('hr/leaves/')
            ]);

            setLeaveTypes(Array.isArray(typesRes.data) ? typesRes.data : typesRes.data.results || []);
            setLeaves(Array.isArray(leavesRes.data) ? leavesRes.data : leavesRes.data.results || []);
        } catch (error) {
            console.error('Failed to fetch leave data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateUsedDays = (typeId: number) => {
        return leaves
            .filter(l => l.leave_type_details.id === typeId && l.status === 'APPROVED')
            .reduce((acc, curr) => acc + curr.days_count, 0);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'success';
            case 'PENDING': return 'warning';
            case 'REJECTED': return 'error';
            default: return 'default';
        }
    };

    const isManager = ['admin', 'manager', 'hr'].includes(user?.role_details?.name?.toLowerCase() || '');

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Leave Management</Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {isManager && (
                        <Button
                            variant="outlined"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => router.push('/leave/approve')}
                        >
                            Approve Requests
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/leave/apply')}
                    >
                        Apply Leave
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                {leaveTypes.map((type) => (
                    <Grid key={type.id} size={{ xs: 12, sm: 6, md: 3 }}>
                        <LeaveBalanceCard
                            type={type.name}
                            total={type.max_days_per_year}
                            used={calculateUsedDays(type.id)}
                        />
                    </Grid>
                ))}
            </Grid>

            <Paper sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom>
                    Recent Requests
                </Typography>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Type</TableCell>
                                <TableCell>Dates</TableCell>
                                <TableCell>Days</TableCell>
                                <TableCell>Reason</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {leaves.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">No leave requests found</TableCell>
                                </TableRow>
                            ) : (
                                leaves.map((leave) => (
                                    <TableRow key={leave.id}>
                                        <TableCell>{leave.leave_type_details.name}</TableCell>
                                        <TableCell>
                                            {new Date(leave.start_date).toLocaleDateString()} - {new Date(leave.end_date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{leave.days_count}</TableCell>
                                        <TableCell>{leave.reason}</TableCell>
                                        <TableCell>
                                            <Chip label={leave.status} color={getStatusColor(leave.status) as any} size="small" />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}
