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
    ReceiptLong as InvoiceIcon,
    Visibility as VisibilityIcon,
    FileDownload as DownloadIcon,
    Payment as PaymentIcon,
    RemoveCircleOutline as RemoveIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function InvoicesPage() {
    const [mounted, setMounted] = useState(false);
    const [invoices, setInvoices] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

    // Line items state
    const [items, setItems] = useState([{ description: '', quantity: 1, unit_price: 0 }]);

    // Payment state
    const [paymentData, setPaymentData] = useState({
        date: new Date().toISOString().split('T')[0],
        amount: 0,
        payment_mode: 'BANK_TRANSFER',
        reference_number: '',
        notes: ''
    });

    const [formData, setFormData] = useState({
        client: '',
        invoice_number: `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        issue_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        status: 'UNPAID',
        notes: '',
        tax_rate: 18.00
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

            await axios.post('sales/invoices/', payload);
            setOpenDialog(false);
            setItems([{ description: '', quantity: 1, unit_price: 0 }]);
            fetchData();
        } catch (error) {
            console.error('Error saving invoice:', error);
        }
    };

    const handleOpenPayment = (invoice: any) => {
        setSelectedInvoice(invoice);
        setPaymentData({
            ...paymentData,
            amount: parseFloat(invoice.total_amount) - parseFloat(invoice.amount_paid)
        });
        setOpenPaymentDialog(true);
    };

    const handleRecordPayment = async () => {
        try {
            await axios.post('sales/payments/', {
                ...paymentData,
                invoice: selectedInvoice.id
            });
            setOpenPaymentDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error recording payment:', error);
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
                        Professional billing with itemized details and payment tracking.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    New Invoice
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Invoice #</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Due Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Paid</TableCell>
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
                                    <TableCell sx={{ fontWeight: 700 }}>${parseFloat(inv.total_amount).toLocaleString()}</TableCell>
                                    <TableCell color="success.main">${parseFloat(inv.amount_paid).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={inv.status}
                                            size="small"
                                            color={inv.status === 'PAID' ? 'success' : inv.status === 'PARTIALLY_PAID' ? 'info' : 'warning'}
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            {inv.status !== 'PAID' && (
                                                <IconButton
                                                    size="small"
                                                    color="primary"
                                                    title="Record Payment"
                                                    onClick={() => handleOpenPayment(inv)}
                                                >
                                                    <PaymentIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                            <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                            <IconButton size="small"><DownloadIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No invoices found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            {/* New Invoice Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 700, bgcolor: '#f8fafc' }}>New Billing Invoice</DialogTitle>
                <DialogContent sx={{ p: 4 }}>
                    <Grid container spacing={3} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, md: 6 }}>
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
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Invoice Number"
                                value={formData.invoice_number}
                                onChange={(e) => setFormData({ ...formData, invoice_number: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Issue Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.issue_date}
                                onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Due Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={formData.due_date}
                                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}>
                            <Divider sx={{ my: 2 }}><Chip label="Line Items" size="small" /></Divider>
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
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} size="large" sx={{ px: 4 }}>Save Invoice</Button>
                </DialogActions>
            </Dialog>

            {/* Payment Dialog */}
            <Dialog open={openPaymentDialog} onClose={() => setOpenPaymentDialog(false)} maxWidth="xs" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Record Payment</DialogTitle>
                <DialogContent>
                    <Box sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            Invoice: {selectedInvoice?.invoice_number}
                        </Typography>
                        <Stack spacing={3} sx={{ mt: 2 }}>
                            <TextField
                                fullWidth
                                label="Payment Date"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                                value={paymentData.date}
                                onChange={(e) => setPaymentData({ ...paymentData, date: e.target.value })}
                            />
                            <TextField
                                fullWidth
                                label="Amount Paid ($)"
                                type="number"
                                value={paymentData.amount}
                                onChange={(e) => setPaymentData({ ...paymentData, amount: parseFloat(e.target.value) })}
                            />
                            <TextField
                                select
                                fullWidth
                                label="Payment Mode"
                                value={paymentData.payment_mode}
                                onChange={(e) => setPaymentData({ ...paymentData, payment_mode: e.target.value })}
                            >
                                <MenuItem value="CASH">Cash</MenuItem>
                                <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                                <MenuItem value="CHEQUE">Cheque</MenuItem>
                                <MenuItem value="ONLINE">Online Payment</MenuItem>
                            </TextField>
                            <TextField
                                fullWidth
                                label="Reference (Ref/Cheque No)"
                                value={paymentData.reference_number}
                                onChange={(e) => setPaymentData({ ...paymentData, reference_number: e.target.value })}
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenPaymentDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleRecordPayment} color="success">Submit Payment</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
