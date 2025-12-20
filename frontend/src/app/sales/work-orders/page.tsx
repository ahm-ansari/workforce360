'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Card, Stack,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, TextField, InputAdornment, Dialog,
    DialogTitle, DialogContent, DialogActions, MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Assignment as AssignmentIcon,
    Visibility as VisibilityIcon,
    ReceiptLong as InvoiceIcon,
    CheckCircle as CompleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function WorkOrdersPage() {
    const router = useRouter();
    const [mounted, setMounted] = useState(false);
    const [workOrders, setWorkOrders] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        client: '',
        work_order_number: `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
        start_date: new Date().toISOString().split('T')[0],
        status: 'PENDING',
        total_value: '0',
        description: ''
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [woRes, cRes] = await Promise.all([
                axios.get('sales/work-orders/'),
                axios.get('clients/clients/')
            ]);
            setWorkOrders(woRes.data);
            setClients(cRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('sales/work-orders/', formData);
            setOpenDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error saving work order:', error);
        }
    };

    const handleGenerateInvoice = (wo: any) => {
        // Navigate or show message. For now, simple console and alert
        // In a real app, you'd pass the WO ID to the Invoice creation page
        alert(`Initializing Invoice for ${wo.work_order_number}...`);
        router.push(`/sales/invoices?work_order=${wo.id}`);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'COMPLETED': return 'success';
            case 'IN_PROGRESS': return 'info';
            case 'PENDING': return 'warning';
            case 'CANCELLED': return 'error';
            default: return 'default';
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Work Orders
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage confirmed project execution and service orders.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Create Work Order
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 4, overflow: 'hidden', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Work Order #</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Value</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {workOrders.length > 0 ? workOrders.map((wo) => (
                                <TableRow key={wo.id} hover>
                                    <TableCell sx={{ fontWeight: 600 }}>{wo.work_order_number}</TableCell>
                                    <TableCell>{wo.client_name}</TableCell>
                                    <TableCell>{wo.start_date}</TableCell>
                                    <TableCell sx={{ fontWeight: 700 }}>${parseFloat(wo.total_value).toLocaleString()}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={wo.status}
                                            size="small"
                                            color={getStatusColor(wo.status) as any}
                                            variant="outlined"
                                            sx={{ fontWeight: 600 }}
                                        />
                                    </TableCell>
                                    <TableCell align="right">
                                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                title="Generate Invoice"
                                                onClick={() => handleGenerateInvoice(wo)}
                                            >
                                                <InvoiceIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small"><VisibilityIcon fontSize="small" /></IconButton>
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No work orders found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 700 }}>Initialize Work Order</DialogTitle>
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
                        <TextField
                            fullWidth
                            label="Start Date"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            value={formData.start_date}
                            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Total Contract Value ($)"
                            type="number"
                            value={formData.total_value}
                            onChange={(e) => setFormData({ ...formData, total_value: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Order Description / Scope"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Confirm Order</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
