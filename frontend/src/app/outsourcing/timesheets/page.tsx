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
    Tooltip,
    CircularProgress
} from '@mui/material';
import Grid from '@mui/material/Grid';
import {
    CheckCircle as CheckCircleIcon,
    Cancel as CancelIcon,
    Visibility as VisibilityIcon,
    Add as AddIcon,
    EventNote as EventNoteIcon,
    Download as DownloadIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function OutsourcingTimesheets() {
    const router = useRouter();
    const [timesheets, setTimesheets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTimesheets();
    }, []);

    const fetchTimesheets = async () => {
        try {
            const response = await axios.get('outsourcing/timesheets/');
            setTimesheets(response.data);
        } catch (error) {
            console.error('Error fetching timesheets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            await axios.patch(`outsourcing/timesheets/${id}/`, { status: 'APPROVED' });
            fetchTimesheets();
        } catch (error) {
            console.error('Error approving timesheet:', error);
        }
    };

    const totalBillable = timesheets.reduce((sum: number, ts: any) => sum + parseFloat(ts.billable_amount), 0);
    const totalHours = timesheets.reduce((sum: number, ts: any) => sum + parseFloat(ts.total_hours), 0);
    const pendingApproval = timesheets.filter((ts: any) => ts.status === 'SUBMITTED').length;

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Timesheet Management
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Review and approve billable hours for outsourced staff
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/outsourcing/timesheets/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Submit Timesheet
                </Button>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.lighter', border: '1px solid', borderColor: 'primary.light' }}>
                        <Typography variant="overline" fontWeight={700} color="primary.dark">Total Billable</Typography>
                        <Typography variant="h4" fontWeight={800} color="primary.dark">${totalBillable.toLocaleString()}</Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'warning.lighter', border: '1px solid', borderColor: 'warning.light' }}>
                        <Typography variant="overline" fontWeight={700} color="warning.dark">Total Hours</Typography>
                        <Typography variant="h4" fontWeight={800} color="warning.dark">{totalHours.toLocaleString()}h</Typography>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ p: 2, textAlign: 'center', bgcolor: 'info.lighter', border: '1px solid', borderColor: 'info.light' }}>
                        <Typography variant="overline" fontWeight={700} color="info.dark">Pending Approval</Typography>
                        <Typography variant="h4" fontWeight={800} color="info.dark">{pendingApproval}</Typography>
                    </Card>
                </Grid>
            </Grid>

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 700, py: 2 }}>Personnel</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Client Partnership</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Service Period</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Hours</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
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
                            ) : timesheets.length > 0 ? timesheets.map((ts: any) => (
                                <TableRow key={ts.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        {ts.employee_name}
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{ts.client_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(ts.start_date).toLocaleDateString()} - {new Date(ts.end_date).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>{ts.total_hours}h</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>${parseFloat(ts.billable_amount).toLocaleString()}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={ts.status}
                                            size="small"
                                            color={ts.status === 'APPROVED' ? 'success' : ts.status === 'SUBMITTED' ? 'warning' : 'default'}
                                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
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
                                                            sx={{ bgcolor: 'success.lighter' }}
                                                        >
                                                            <CheckCircleIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Reject">
                                                        <IconButton size="small" color="error" sx={{ bgcolor: 'error.lighter' }}>
                                                            <CancelIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </>
                                            )}
                                            <IconButton size="small" color="primary" sx={{ bgcolor: 'action.hover' }}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                                        <Box sx={{ opacity: 0.5 }}>
                                            <EventNoteIcon sx={{ fontSize: 60, mb: 2 }} />
                                            <Typography variant="h6">No timesheets recorded</Typography>
                                            <Typography variant="body2">Submission records will appear here.</Typography>
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
