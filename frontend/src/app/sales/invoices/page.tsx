'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Card, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, TextField, InputAdornment, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem, Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    ReceiptLong as InvoiceIcon,
    Visibility as VisibilityIcon,
    FileDownload as DownloadIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function InvoicesPage() {
    const [mounted, setMounted] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        client: '',
        invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'UNPAID',
        subtotal: '0',
        tax_amount: '0',
        total_amount: '0',
        notes: ''
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [iRes, cRes] = await Promise.all([
                axios.get('sales/invoices/'),
                axios.get('clients/clients/')
            ]);
            setInvoices(iRes.data);
            setClients(cRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            // Simple calculation before save
            const sub = parseFloat(formData.subtotal);
            const data = {
                ...formData,
                tax_amount: (sub * 0.18).toString(),
                total_amount: (sub * 1.18).toString()
            };
            await axios.post('sales/invoices/', data);
            setOpenDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Business Invoices
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Billing, accounts receivable, and payment tracking.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Generate Invoice
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {invoices.length > 0 ? invoices.map((inv) => (
                                <TableRow key={inv.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{inv.invoice_number}</TableCell>
                                    <TableCell>{inv.client_name}</TableCell>
                                    <TableCell>{inv.due_date}</TableCell>
                                    <TableCell sx={{ fontWeight: { xs: 600, sm: 700 } }}>{`$${parseFloat(inv.total_amount).toLocaleString()}`}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={inv.status}
                                            size="small"
                                            color={inv.status === 'PAID' ? 'success' : 'warning'}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                        <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No invoices found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>New Billing Invoice</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            fullWidth
                            label="Recipient Client"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        >
                            {clients.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Issue Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.issue_date}
                                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Due Date"
                                    type="date"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.due_date}
                                    onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Invoice Subtotal ($)"
                            type="number"
                            helperText="+ 18% GST will be added automatically"
                            value={formData.subtotal}
                            onChange={(e) => setFormData({ ...formData, subtotal: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={2}
                            label="Billing Notes"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Generate & Send</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
