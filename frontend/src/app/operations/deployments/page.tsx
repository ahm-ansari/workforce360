'use client';

import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Card, Stack, Avatar,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    Chip, IconButton, TextField, MenuItem, Dialog,
    DialogTitle, DialogContent, DialogActions, Grid
} from '@mui/material';
import {
    Add as AddIcon,
    Engineering as EngineeringIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function DeploymentsPage() {
    const [mounted, setMounted] = useState(false);
    const [deployments, setDeployments] = useState<any[]>([]);
    const [employees, setEmployees] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const [formData, setFormData] = useState({
        employee: '',
        client: '',
        role_at_deployment: '',
        start_date: new Date().toISOString().split('T')[0],
        status: 'ACTIVE',
        notes: ''
    });

    useEffect(() => {
        setMounted(true);
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [dRes, eRes, cRes] = await Promise.all([
                axios.get('operations/deployments/'),
                axios.get('employees/'),
                axios.get('clients/clients/')
            ]);
            setDeployments(dRes.data);
            setEmployees(eRes.data);
            setClients(cRes.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        try {
            await axios.post('operations/deployments/', formData);
            setOpenDialog(false);
            fetchData();
        } catch (error) {
            console.error('Error saving deployment:', error);
        }
    };

    if (!mounted) return null;

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Staff Deployment
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Track employee assignments across various client sites and projects.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    New Deployment
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Employee</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Client / Destination</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Start Date</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {deployments.length > 0 ? deployments.map((d) => (
                                <TableRow key={d.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.light' }}>
                                                {d.employee_details?.first_name?.[0]}
                                            </Avatar>
                                            <Typography variant="body2" fontWeight={600}>
                                                {d.employee_details?.first_name} {d.employee_details?.last_name}
                                            </Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1} alignItems="center">
                                            <LocationIcon fontSize="inherit" color="action" />
                                            <Typography variant="body2">{d.client_name}</Typography>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>{d.role_at_deployment}</TableCell>
                                    <TableCell>{d.start_date}</TableCell>
                                    <TableCell>
                                        <Chip label={d.status} size="small" color="success" variant="outlined" />
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        <Typography color="text.secondary">No active deployments tracked.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle fontWeight={700}>Assign Staff Member</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            select
                            fullWidth
                            label="Employee"
                            value={formData.employee}
                            onChange={(e) => setFormData({ ...formData, employee: e.target.value })}
                        >
                            {employees.map((e) => (
                                <MenuItem key={e.id} value={e.id}>{e.first_name} {e.last_name} ({e.employee_id})</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            select
                            fullWidth
                            label="Deployment Destination (Client)"
                            value={formData.client}
                            onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                        >
                            {clients.map((c) => (
                                <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            fullWidth
                            label="Designated Role"
                            placeholder="e.g. Field Engineer, Project Manager"
                            value={formData.role_at_deployment}
                            onChange={(e) => setFormData({ ...formData, role_at_deployment: e.target.value })}
                        />
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
                            multiline
                            rows={2}
                            label="Special Instructions"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave}>Deploy Staff</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
