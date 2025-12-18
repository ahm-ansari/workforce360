'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Card, Stack, Grid,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, TextField, InputAdornment, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    RequestQuote as QuoteIcon,
    Visibility as VisibilityIcon,
    Delete as DeleteIcon,
    Description as DescriptionIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function QuotationsPage() {
    const [mounted, setMounted] = useState(false);
    const [quotations, setQuotations] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        client: '',
        quotation_number: `QT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        expiry_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'DRAFT',
        subtotal: '0',
        notes: ''
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

    const handleSave = async () => {
        try {
            await axios.post('sales/quotations/', formData);
            setOpenDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error saving quotation:', error);
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
                        Create and manage client proposals and estimates.
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

            <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField
                        size="small"
                        placeholder="Search quotations..."
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon fontSize="small" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ width: 300 }}
                    />
                </Box>
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
                                    <TableCell fontWeight={600}>{q.quotation_number}</TableCell>
                                    <TableCell>{q.client_details?.name}</TableCell>
                                    <TableCell>{q.date}</TableCell>
                                    <TableCell fontWeight={700}>${parseFloat(q.total_amount).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={q.status}
                                            size="small"
                                            color={getStatusColor(q.status) as any}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                        <IconButton size="small"><DescriptionIcon fontSize="small" /></IconButton>
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

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>Generate New Quotation</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
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
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Expiry Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.expiry_date}
                                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Subtotal Amount ($)"
                            type="number"
                            value={formData.subtotal}
                            onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Notes / Terms"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Create Quotation</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
