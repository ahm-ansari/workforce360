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
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    Visibility as VisibilityIcon,
    Download as DownloadIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';
import { useRouter } from 'next/navigation';
import { CircularProgress } from '@mui/material';

export default function StaffingContracts() {
    const router = useRouter();
    const [contracts, setContracts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('outsourcing/contracts/');
            setContracts(response.data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={800} gutterBottom>
                        Staffing Contracts
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Master Service Agreements and active staffing contracts
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/outsourcing/contracts/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    New Contract
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 700, py: 2 }}>Contract Identification</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Client Entity</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Agreement Period</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Contract Value</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <CircularProgress size={40} />
                                    </TableCell>
                                </TableRow>
                            ) : contracts.length > 0 ? contracts.map((contract: any) => (
                                <TableRow key={contract.id} hover sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                    <TableCell sx={{ fontWeight: 700 }}>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <DescriptionIcon color="action" fontSize="small" />
                                            <Typography variant="subtitle2" fontWeight={700}>{contract.contract_number}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{contract.client_name}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">
                                            {new Date(contract.start_date).toLocaleDateString()} - {new Date(contract.end_date).toLocaleDateString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={700}>
                                            ${Number(contract.total_value).toLocaleString()}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={contract.status}
                                            size="small"
                                            color={contract.status === 'ACTIVE' ? 'success' : 'default'}
                                            sx={{ fontWeight: 700, borderRadius: 1.5 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton size="small" color="primary" sx={{ bgcolor: 'primary.lighter' }}>
                                                <VisibilityIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="info" sx={{ bgcolor: 'info.lighter' }}>
                                                <DownloadIcon fontSize="small" />
                                            </IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 12 }}>
                                        <Box sx={{ opacity: 0.5 }}>
                                            <DescriptionIcon sx={{ fontSize: 60, mb: 2 }} />
                                            <Typography variant="h6">No contracts found</Typography>
                                            <Typography variant="body2">Client agreements will appear here after creation.</Typography>
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
