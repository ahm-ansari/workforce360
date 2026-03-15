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
    Snackbar,
    Alert,
    Tooltip,
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

export default function FacilitiesList() {
    const router = useRouter();
    const [facilities, setFacilities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchFacilities();
    }, []);

    const fetchFacilities = async () => {
        setLoading(true);
        try {
            const response = await axios.get('cafm/facilities/');
            setFacilities(response.data);
        } catch (error) {
            console.error('Error fetching facilities:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this facility? This may affect linked assets and spaces.')) {
            try {
                await axios.delete(`cafm/facilities/${id}/`);
                setSnackbar({ open: true, message: 'Facility deleted successfully', severity: 'success' });
                fetchFacilities();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete facility', severity: 'error' });
            }
        }
    };

    const filteredFacilities = facilities.filter((f: any) => 
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.address.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Facilities Registry
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your buildings, sites, and physical locations.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/cafm/facilities/new')}
                    sx={{ borderRadius: 2, px: 3, py: 1 }}
                >
                    Add Facility
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid', borderColor: 'divider', bgcolor: 'white' }}>
                    <TextField
                        size="small"
                        placeholder="Search facilities by name or address..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{ width: 400 }}
                    />
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Facility Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Physical Address</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Primary Contact</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {!loading && filteredFacilities.length > 0 ? filteredFacilities.map((facility: any) => (
                                <TableRow key={facility.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {facility.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">ID: FAC-{facility.id.toString().padStart(3, '0')}</Typography>
                                    </TableCell>
                                    <TableCell>{facility.address}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{facility.contact_email || 'N/A'}</Typography>
                                        <Typography variant="caption" color="text.secondary">{facility.contact_phone || ''}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="View Details">
                                                <IconButton size="small" onClick={() => router.push(`/cafm/facilities/${facility.id}`)}>
                                                    <VisibilityIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => router.push(`/cafm/facilities/${facility.id}`)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(facility.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={4} align="center" sx={{ py: 10 }}>
                                        {loading ? (
                                            <Typography color="text.secondary">Loading facility data...</Typography>
                                        ) : (
                                            <Typography color="text.secondary">No facilities found.</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
