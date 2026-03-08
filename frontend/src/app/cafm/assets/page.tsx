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

export default function AssetsList() {
    const router = useRouter();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        try {
            const response = await axios.get('cafm/assets/');
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'MAINTENANCE': return 'warning';
            case 'INACTIVE': return 'error';
            case 'RETIRED': return 'default';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Assets
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track equipment and physical items.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/cafm/assets/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Add Asset
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField
                        size="small"
                        placeholder="Search assets..."
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
                                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Facility</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Serial Number</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {assets.length > 0 ? assets.map((asset: any) => (
                                <TableRow key={asset.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {asset.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{asset.asset_type}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={asset.status}
                                            size="small"
                                            color={getStatusColor(asset.status) as any}
                                        />
                                    </TableCell>
                                    <TableCell>{asset.facility_name || '-'}</TableCell>
                                    <TableCell>{asset.serial_number || '-'}</TableCell>
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
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        {loading ? (
                                            <Typography>Loading assets...</Typography>
                                        ) : (
                                            <Typography>No assets found.</Typography>
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
