'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Card, Stack, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, TextField, InputAdornment, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Divider,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    CheckCircle as AcceptIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon,
    RemoveCircleOutline as RemoveIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function QuotationsPage() {
    const [mounted, setMounted] = useState(false);
    const [quotations, setQuotations] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    // Line items state
    const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }]);

    const [formData, setFormData] = useState({
        client: '',
        quotation_number: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'DRAFT',
        notes: '',
        tax_rate: 18.00
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [qRes, cRes] = await Promise.all([
                axios.get('sales/quotations/'),
                axios.get('clients/clients/')
            ]);
            setQuotations(qRes.data);
            setClients(cRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = () => {
        setItems([...items, { description: '', quantity: 1, unit_price: 0 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const calculateSubtotal = () => {
        return items.reduce((acc, item) => acc + (item.quantity * item.unit_price), 0);
    };

    const handleSave = async () => {
        try {
            const subtotal = calculateSubtotal();
            const tax_amount = (subtotal * formData.tax_rate) / 100;
            const total_amount = subtotal + tax_amount;

            const payload = {
                ...formData,
                items,
                subtotal,
                tax_amount,
                total_amount
            };

            await axios.post('sales/quotations/', payload);
            setOpenDialog(false);
            setItems([{ description: '', quantity: 1, unit_price: 0 }]);
            fetchData();
        } catch (error) {
            console.error('Error saving quotation:', error);
        }
    };

    const handleAcceptQuotation = async (id: number) => {
        try {
            await axios.post(`sales/quotations/${id}/accept/`);
            fetchData();
            alert('Quotation accepted and Work Order generated!');
        } catch (error) {
            console.error('Error accepting quotation:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACCEPTED': return 'success';
            case 'SENT': return 'info';
            case 'REJECTED': return 'error';
            case 'DRAFT': return 'default';
            default: return 'default';
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Quotations
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Create itemized proposals and track acceptance.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    New Quotation
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Quotation #</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {quotations.length > 0 ? quotations.map((q) => (
                                <TableRow key={q.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{q.quotation_number}</TableCell>
                                    <TableCell>{q.client_details?.name}</TableCell>
                                    <TableCell>{q.date}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>${parseFloat(q.total_amount).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={q.status}
                                            size="small"
                                            color={getStatusColor(q.status) as any}
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {q.status === 'DRAFT' || q.status === 'SENT' ? (
                                                <IconButton
                                                    size="small"
                                                    color="success"
                                                    title="Accept & Create WO"
                                                    onClick={() => handleAcceptQuotation(q.id)}
                                                >
                                                    <AcceptIcon fontSize="small" />
                                                </IconButton>
                                            ) : null}
                                            <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                            <IconButton size="small"><DescriptionIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No quotations found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>
                    Generate New Quotation
                </DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }} >
                            <TextField
                                select
                                fullWidth
                                label="Select Client"
                                value={formData.client}
                                onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                            >
                                {clients.map((c) => (
                                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Quotation Number"
                                value={formData.quotation_number}
                                onChange={(e) => setFormData({ ...formData, quotation_number: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Quotation Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Expiry Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.expiry_date}
                                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }}>
                                <Chip label="Line Items" size="small" />
                            </Divider>
                            {items.map((item, index) => (
                                <Stack key={index} direction="row" spacing={2} sx={{ mb: 2 }} alignItems="flex-start">
                                    <TextField
                                        label="Description"
                                        fullWidth
                                        size="small"
                                        value={item.description}
                                        onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                    />
                                    <TextField
                                        label="Qty"
                                        type="number"
                                        sx={{ width: 100 }}
                                        size="small"
                                        value={item.quantity}
                                        onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value))}
                                    />
                                    <TextField
                                        label="Unit Price"
                                        type="number"
                                        sx={{ width: 150 }}
                                        size="small"
                                        InputProps={{ startAdornment: <InputAdornment position="start">$</InputAdornment> }}
                                        value={item.unit_price}
                                        onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                    />
                                    <Typography sx={{ width: 100, pt: 1, fontWeight: 700 }} align="right">
                                        ${(item.quantity * item.unit_price).toLocaleString()}
                                    </Typography>
                                    <IconButton onClick={() => handleRemoveItem(index)} color="error" size="small">
                                        <RemoveIcon />
                                    </IconButton>
                                </Stack>
                            ))}
                            <Button startIcon={<AddIcon />} onClick={handleAddItem} variant="outlined" size="small">
                                Add Item
                            </Button>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }} sx={{ ml: 'auto' }}>
                            <Paper sx={{ p: 2, bgcolor: '#f8fafc' }}>
                                <Stack spacing={1}>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">Subtotal:</Typography>
                                        <Typography variant="body2" fontWeight={700}>${calculateSubtotal().toLocaleString()}</Typography>
                                    </Stack>
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="body2">Tax ({formData.tax_rate}%):</Typography>
                                        <Typography variant="body2" fontWeight={700}>${((calculateSubtotal() * formData.tax_rate) / 100).toLocaleString()}</Typography>
                                    </Stack>
                                    <Divider />
                                    <Stack direction="row" justifyContent="space-between">
                                        <Typography variant="subtitle1" fontWeight={800}>Total Amount:</Typography>
                                        <Typography variant="subtitle1" fontWeight={800} color="primary.main">
                                            ${(calculateSubtotal() * (1 + formData.tax_rate / 100)).toLocaleString()}
                                        </Typography>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                label="Internal Notes / Terms & Conditions"
                                value={formData.notes}
                                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <Divider />
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setOpenDialog(false)} color="inherit">Cancel</Button>
                    <Button variant="contained" onClick={handleSave} size="large" sx={{ px: 4 }}>
                        Save Quotation
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
