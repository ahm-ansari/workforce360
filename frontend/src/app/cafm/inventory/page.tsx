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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar,
    Alert,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Inventory as InventoryIcon,
    Warning as AlertIcon,
    ShoppingBag as OrderIcon,
    CompareArrows as TransactionIcon,
    Build as PartIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function InventoryList() {
    const [items, setItems] = useState<any[]>([]);
    const [assets, setAssets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [stats, setStats] = useState({
        totalItems: 0,
        lowStock: 0,
        totalValue: 0
    });

    // Dialog State
    const [openDialog, setOpenDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        quantity: 0,
        min_quantity: 5,
        unit_cost: 0,
        location: '',
        asset: ''
    });

    // Snackbar State
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchInventory();
        fetchAssets();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await axios.get('cafm/inventory/');
            setItems(response.data);
            
            const lowCount = response.data.filter((i: any) => i.quantity <= i.min_quantity).length;
            const value = response.data.reduce((acc: number, i: any) => acc + (i.quantity * parseFloat(i.unit_cost)), 0);
            
            setStats({
                totalItems: response.data.length,
                lowStock: lowCount,
                totalValue: value
            });
        } catch (error) {
            console.error('Error fetching inventory:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssets = async () => {
        try {
            const response = await axios.get('cafm/assets/');
            setAssets(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };

    const handleOpenDialog = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setFormData({
                name: item.name,
                sku: item.sku,
                quantity: item.quantity,
                min_quantity: item.min_quantity,
                unit_cost: item.unit_cost,
                location: item.location || '',
                asset: item.asset || ''
            });
        } else {
            setEditingItem(null);
            setFormData({
                name: '',
                sku: '',
                quantity: 0,
                min_quantity: 5,
                unit_cost: 0,
                location: '',
                asset: ''
            });
        }
        setOpenDialog(true);
    };

    const handleSave = async () => {
        try {
            if (editingItem) {
                await axios.put(`cafm/inventory/${editingItem.id}/`, formData);
                setSnackbar({ open: true, message: 'Item updated successfully', severity: 'success' });
            } else {
                await axios.post('cafm/inventory/', formData);
                setSnackbar({ open: true, message: 'Item added successfully', severity: 'success' });
            }
            setOpenDialog(false);
            fetchInventory();
        } catch (error: any) {
            setSnackbar({ open: true, message: error.response?.data?.detail || 'Operation failed', severity: 'error' });
        }
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await axios.delete(`cafm/inventory/${id}/`);
                setSnackbar({ open: true, message: 'Item deleted successfully', severity: 'success' });
                fetchInventory();
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to delete item', severity: 'error' });
            }
        }
    };

    const filteredItems = items.filter(i => 
        i.name.toLowerCase().includes(search.toLowerCase()) ||
        i.sku?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Spare Parts & Inventory
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage stocks of critical components and maintenance supplies.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        startIcon={<TransactionIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={() => setSnackbar({ open: true, message: 'Stock adjustment feature coming soon', severity: 'success' })}
                    >
                        Stock adjustment
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        sx={{ borderRadius: 2 }}
                        onClick={() => handleOpenDialog()}
                    >
                        Add Item
                    </Button>
                </Stack>
            </Stack>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#3b82f615', color: '#3b82f6' }}>
                                    <InventoryIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.totalItems}</Typography>
                                    <Typography variant="caption" color="text.secondary">TOTAL SKU COUNT</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#ef444415', color: '#ef4444' }}>
                                    <AlertIcon />
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>{stats.lowStock}</Typography>
                                    <Typography variant="caption" color="text.secondary">LOW STOCK ALERTS</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, bgcolor: 'white' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                                <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: '#10b98115', color: '#10b981' }}>
                                    <Typography variant="h6" fontWeight={700}>$</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h5" fontWeight={700}>${stats.totalValue.toLocaleString()}</Typography>
                                    <Typography variant="caption" color="text.secondary">INVENTORY VALUE</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {stats.lowStock > 0 && (
                <Paper sx={{ p: 2, mb: 4, borderRadius: 3, bgcolor: '#fef2f2', border: '1px solid #fecaca' }}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <AlertIcon color="error" />
                        <Typography variant="body2" color="error.main" fontWeight={600}>
                            Warning: {stats.lowStock} items are below their minimum stock levels. Immediate procurement is recommended.
                        </Typography>
                        <Box sx={{ flexGrow: 1 }} />
                        <Button 
                            size="small" 
                            variant="contained" 
                            color="error" 
                            sx={{ borderRadius: 2 }}
                            onClick={() => setSnackbar({ open: true, message: 'Purchase request initiated', severity: 'success' })}
                        >
                            Create Purchase Request
                        </Button>
                    </Stack>
                </Paper>
            )}

            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ p: 3, borderBottom: '1px solid #e2e8f0' }}>
                    <TextField
                        fullWidth
                        placeholder="Search items by name or SKU..."
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
                                <TableCell sx={{ fontWeight: 700 }}>SKU</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Item Name</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Location</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Linked Asset</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Stock Level</TableCell>
                                <TableCell sx={{ fontWeight: 700 }}>Unit Cost</TableCell>
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
                            ) : filteredItems.map((item: any) => (
                                <TableRow key={item.id} hover>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                            {item.sku}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {item.name}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {item.description || 'No description'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{item.location || 'N/A'}</TableCell>
                                    <TableCell>
                                        {item.asset_name ? (
                                            <Stack direction="row" spacing={0.5} alignItems="center">
                                                <PartIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                                                <Typography variant="body2">{item.asset_name}</Typography>
                                            </Stack>
                                        ) : (
                                            <Typography variant="caption" color="text.disabled">Universal</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Stack spacing={1}>
                                            <Stack direction="row" justifyContent="space-between">
                                                <Typography variant="subtitle2" fontWeight={700} color={item.quantity <= item.min_quantity ? 'error' : 'text.primary'}>
                                                    {item.quantity} Units
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">Min: {item.min_quantity}</Typography>
                                            </Stack>
                                            <LinearProgress 
                                                variant="determinate" 
                                                value={Math.min(100, (item.quantity / (item.min_quantity * 2)) * 100)} 
                                                sx={{ 
                                                    height: 6, 
                                                    borderRadius: 3,
                                                    bgcolor: '#f1f5f9',
                                                    '& .MuiLinearProgress-bar': {
                                                        bgcolor: item.quantity <= item.min_quantity ? '#ef4444' : '#10b981'
                                                    }
                                                }}
                                            />
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={600}>${parseFloat(item.unit_cost).toLocaleString()}</Typography>
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <Tooltip title="Procure More">
                                                <IconButton size="small" color="primary" onClick={() => handleOpenDialog(item)}>
                                                    <OrderIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Edit">
                                                <IconButton size="small" onClick={() => handleOpenDialog(item)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Delete">
                                                <IconButton size="small" color="error" onClick={() => handleDelete(item.id)}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            {/* Inventory Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Edit Inventory Item' : 'Add New Inventory Item'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={3}>
                        <TextField 
                            label="Item Name" 
                            fullWidth 
                            value={formData.name} 
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                        <TextField 
                            label="SKU Code" 
                            fullWidth 
                            value={formData.sku} 
                            onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Quantity" 
                                type="number" 
                                fullWidth 
                                value={formData.quantity} 
                                onChange={(e) => setFormData({...formData, quantity: parseInt(e.target.value)})}
                            />
                            <TextField 
                                label="Min Quantity" 
                                type="number" 
                                fullWidth 
                                value={formData.min_quantity} 
                                onChange={(e) => setFormData({...formData, min_quantity: parseInt(e.target.value)})}
                            />
                        </Stack>
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Unit Cost" 
                                type="number" 
                                fullWidth 
                                value={formData.unit_cost} 
                                onChange={(e) => setFormData({...formData, unit_cost: parseFloat(e.target.value)})}
                            />
                            <TextField 
                                label="Storage Location" 
                                fullWidth 
                                value={formData.location} 
                                onChange={(e) => setFormData({...formData, location: e.target.value})}
                            />
                        </Stack>
                        <TextField
                            select
                            label="Linked Asset (Optional)"
                            fullWidth
                            value={formData.asset}
                            onChange={(e) => setFormData({...formData, asset: e.target.value})}
                        >
                            <MenuItem value="">Universal / No Asset</MenuItem>
                            {assets.map((asset) => (
                                <MenuItem key={asset.id} value={asset.id}>{asset.name}</MenuItem>
                            ))}
                        </TextField>
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Save Item</Button>
                </DialogActions>
            </Dialog>

            {/* Feedback SnackBar */}
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({...snackbar, open: false})}>
                <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 3 }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
