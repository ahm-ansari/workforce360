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
    Download as DownloadIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function StaffingContracts() {
    const [contracts, setContracts] = useState([]);

    useEffect(() => {
        fetchContracts();
    }, []);

    const fetchContracts = async () => {
        try {
            const response = await axios.get('/api/outsourcing/contracts/');
            setContracts(response.data);
        } catch (error) {
            console.error('Error fetching contracts:', error);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700}>
                    Staffing Contracts
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ borderRadius: 2 }}
                >
                    New Contract
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 2 }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Contract #</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Period</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Total Value</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {contracts.length > 0 ? contracts.map((contract: any) => (
                                <TableRow key={contract.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{contract.contract_number}</TableCell>
                                    <TableCell>{contract.client_name}</TableCell>
                                    <TableCell>
                                        {new Date(contract.start_date).toLocaleDateString()} -
                                        {new Date(contract.end_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell>${Number(contract.total_value).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={contract.status}
                                            size="small"
                                            color={contract.status === 'ACTIVE' ? 'success' : 'default'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small">
                                            <DownloadIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                                        <Typography color="text.secondary">
                                            No staffing contracts found.
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
