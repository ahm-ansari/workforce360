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
    Stack,
    Avatar
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    FilterList as FilterListIcon,
    Email as EmailIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function OutsourcedStaff() {
    const router = useRouter();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStaff();
    }, []);

    const fetchStaff = async () => {
        try {
            const response = await axios.get('outsourcing/staff/');
            setStaff(response.data);
        } catch (error) {
            console.error('Error fetching outsourced staff:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Outsourced Personnel
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Managing {staff.length} active placements across clients
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/outsourcing/staff/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Assign Staff
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <TextField
                            size="small"
                            placeholder="Search by name, client or role..."
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
                                <TableCell sx={{ fontWeight: 700, py: 2 }}>Personnel</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Client Partnership</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Assignment Role</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Billing Rate</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Service Period</TableCell>
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
                            ) : staff.length > 0 ? staff.map((member: any) => (
                                <TableRow key={member.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar 
                                                sx={{ 
                                                    width: 42, 
                                                    height: 42, 
                                                    background: 'linear-gradient(45deg, #3b82f6, #60a5fa)',
                                                    fontWeight: 700
                                                }}
                                            >
                                                {member.employee_name?.[0]}
                                            </Avatar>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight={700}>
                                                    {member.employee_name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: #{member.employee}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <BusinessIcon fontSize="small" color="action" />
                                            <Typography variant="body2" fontWeight={500}>{member.client_name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ bgcolor: 'primary.lighter', color: 'primary.dark', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block', fontWeight: 600 }}>
                                            {member.role}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>
                                            ${member.billing_rate}/hr
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={member.status}
                                            size="small"
                                            color={member.status === 'ACTIVE' ? 'success' : 'default'}
                                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Box>
                                            <Typography variant="body2" fontWeight={500}>
                                                {new Date(member.start_date).toLocaleDateString()}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                to {member.end_date ? new Date(member.end_date).toLocaleDateString() : 'Present'}
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton size="small" color="primary" sx={{ bgcolor: 'primary.lighter' }}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="info" sx={{ bgcolor: 'info.lighter' }}>
                                                <EmailIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 12 }}>
                                        <Box sx={{ opacity: 0.5 }}>
                                            <AssignmentIndIcon sx={{ fontSize: 60, mb: 2 }} />
                                            <Typography variant="h6">No personnel assigned yet</Typography>
                                            <Typography variant="body2">Start by assigning staff to a client request.</Typography>
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
