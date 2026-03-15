'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Stack,
    IconButton,
    TextField,
    InputAdornment,
    Tooltip,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    History as HistoryIcon,
    Inventory as AssetIcon,
    LocationOn as LocationIcon,
    Business as FacilityIcon,
    Settings as SettingsIcon,
    Assessment as LifecycleIcon,
    FilterList as FilterIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function AssetRegister() {
    const router = useRouter();
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        maintenance: 0,
        totalValue: 0
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchAssets();
    }, []);

    const fetchAssets = async () => {
        setLoading(true);
        try {
            const response = await axios.get('cafm/assets/');
            const data = response.data;
            setAssets(data);
            
            setStats({
                total: data.length,
                active: data.filter((a: any) => a.status === 'ACTIVE').length,
                maintenance: data.filter((a: any) => a.status === 'MAINTENANCE').length,
                totalValue: data.reduce((acc: number, a: any) => acc + (parseFloat(a.purchase_cost) || 0), 0)
            });
        } catch (error) {
            console.error('Error fetching assets:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Decommission and remove this asset from the registry?')) {
            try {
                await axios.delete(`cafm/assets/${id}/`);
                setSnackbar({ open: true, message: 'Asset removed successfully', severity: 'success' });
                fetchAssets();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete asset', severity: 'error' });
            }
        }
    };

    const filteredAssets = assets.filter((a: any) => 
        a.name.toLowerCase().includes(search.toLowerCase()) ||
        a.asset_id?.toLowerCase().includes(search.toLowerCase()) ||
        a.category?.toLowerCase().includes(search.toLowerCase())
    );

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'INACTIVE': return 'default';
            case 'MAINTENANCE': return 'warning';
            case 'RETIRED': return 'error';
            case 'DISPOSED': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Asset Register
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Comprehensive registry of all physical assets and equipment across facilities.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<FilterIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setSnackbar({ open: true, message: 'Filtering coming soon', severity: 'success' })}
                    >
                        Filter
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => router.push('/cafm/assets/new')}
                        sx={{ borderRadius: 2 }}
                    >
                        Add Asset
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#3b82f615', color: '#3b82f6' }}>
                                    <AssetIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.total}</Typography>
                                    <Typography variant="caption" color="text.secondary">TOTAL ASSETS</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#10b98115', color: '#10b981' }}>
                                    <SettingsIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.active}</Typography>
                                    <Typography variant="caption" color="text.secondary">OPERATIONAL</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#f59e0b15', color: '#f59e0b' }}>
                                    <LifecycleIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.maintenance}</Typography>
                                    <Typography variant="caption" color="text.secondary">IN MAINTENANCE</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#6366f115', color: '#6366f1' }}>
                                    <Typography variant="h6" fontWeight={700}>$</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>${stats.totalValue.toLocaleString()}</Typography>
                                    <Typography variant="caption" color="text.secondary">TOTAL ASSET VALUE</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                    <TextField
                        fullWidth
                        placeholder="Search assets by name, ID, or category..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }
                        }}
                        sx={{ bgcolor: 'white' }}
                    />
                </Box>

                <TableContainer>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f1f5f9' }}>
                            <TableRow>
                                <TableCell sx={{ fontWeight: 700 }}>Asset ID</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Lifecycle Info</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={7} sx={{ p: 0 }}>
                                        <LinearProgress sx={{ height: 2 }} />
                                    </TableCell>
                                </TableRow>
                            ) : filteredAssets.map((asset: any) => (
                                <TableRow key={asset.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {asset.asset_id || `AST-${asset.id.toString().padStart(4, '0')}`}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {asset.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            SN: {asset.serial_number || 'N/A'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={asset.category} size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={0.5} alignItems="center">
                                            <FacilityIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                            <Typography variant="body2">{asset.facility_name}</Typography>
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary">
                                            {asset.space_name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Box sx={{ minWidth: 150 }}>
                                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                                                <Typography variant="caption" color="text.secondary">Age: {asset.age} yrs</Typography>
                                                <Typography variant="caption" color="text.secondary">Life: {asset.expected_life_years} yrs</Typography>
                                            </Stack>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={Math.min(100, (asset.age / asset.expected_life_years) * 100)} 
                                                sx={{ 
                                                    height: 6, 
                                                    borderRadius: 3,
                                                    bgcolor: '#f1f5f9',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: asset.age >= asset.expected_life_years ? '#ef4444' : '#3b82f6'
                                                    }
                                                }}
                                            />
                                        </Box>
                                    </TableCell>
                                    <TableCell>
                                        <Chip 
                                            label={asset.status} 
                                            color={getStatusColor(asset.status)}
                                            size="small"
                                            sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="View History">
                                                <IconButton size="small" color="primary" onClick={() => router.push(`/cafm/assets/${asset.id}`)}>
                                                    <HistoryIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit Asset">
                                                <IconButton size="small" onClick={() => router.push(`/cafm/assets/${asset.id}`)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(asset.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {!loading && filteredAssets.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                                        <AssetIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                        <Typography variant="body1" color="text.secondary">
                                            No assets found matching your search.
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
