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
    Tabs,
    Tab,
    Card,
    CardContent,
    Grid,
    Tooltip,
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
    Business as VendorIcon,
    Gavel as SLAIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Timer as TimerIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

export default function CAFMSettings() {
    const [tab, setTab] = useState(0);
    const [vendors, setVendors] = useState<any[]>([]);
    const [slaPolicies, setSlaPolicies] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Dialog State
    const [openVendorDialog, setOpenVendorDialog] = useState(false);
    const [openSlaDialog, setOpenSlaDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    
    const [vendorForm, setVendorForm] = useState({
        name: '',
        contact_person: '',
        email: '',
        phone: '',
        service_type: '',
        address: ''
    });

    const [slaForm, setSlaForm] = useState({
        name: '',
        description: '',
        response_time_hours: 4,
        resolution_time_hours: 24,
        priority_level: 'MEDIUM'
    });

    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setLoading(true);
        try {
            const [vRes, sRes] = await Promise.all([
                axios.get('cafm/vendors/'),
                axios.get('cafm/sla-policies/')
            ]);
            setVendors(vRes.data);
            setSlaPolicies(sRes.data);
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenVendor = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setVendorForm({
                name: item.name,
                contact_person: item.contact_person || '',
                email: item.email,
                phone: item.phone,
                service_type: item.service_type,
                address: item.address || ''
            });
        } else {
            setEditingItem(null);
            setVendorForm({
                name: '',
                contact_person: '',
                email: '',
                phone: '',
                service_type: '',
                address: ''
            });
        }
        setOpenVendorDialog(true);
    };

    const handleSaveVendor = async () => {
        try {
            if (editingItem) {
                await axios.put(`cafm/vendors/${editingItem.id}/`, vendorForm);
                setSnackbar({ open: true, message: 'Vendor updated successfully', severity: 'success' });
            } else {
                await axios.post('cafm/vendors/', vendorForm);
                setSnackbar({ open: true, message: 'Vendor added successfully', severity: 'success' });
            }
            setOpenVendorDialog(false);
            fetchSettings();
        } catch (error: any) {
            setSnackbar({ open: true, message: 'Failed to save vendor', severity: 'error' });
        }
    };

    const handleDeleteVendor = async (id: number) => {
        if (window.confirm('Remove this vendor from the approved list?')) {
            try {
                await axios.delete(`cafm/vendors/${id}/`);
                setSnackbar({ open: true, message: 'Vendor removed', severity: 'success' });
                fetchSettings();
            } catch (error) {
                setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
            }
        }
    };

    const handleOpenSla = (item: any = null) => {
        if (item) {
            setEditingItem(item);
            setSlaForm({
                name: item.name,
                description: item.description || '',
                response_time_hours: item.response_time_hours,
                resolution_time_hours: item.resolution_time_hours,
                priority_level: item.priority_level
            });
        } else {
            setEditingItem(null);
            setSlaForm({
                name: '',
                description: '',
                response_time_hours: 4,
                resolution_time_hours: 24,
                priority_level: 'MEDIUM'
            });
        }
        setOpenSlaDialog(true);
    };

    const handleSaveSla = async () => {
        try {
            if (editingItem) {
                await axios.put(`cafm/sla-policies/${editingItem.id}/`, slaForm);
                setSnackbar({ open: true, message: 'SLA updated', severity: 'success' });
            } else {
                await axios.post('cafm/sla-policies/', slaForm);
                setSnackbar({ open: true, message: 'SLA defined successfully', severity: 'success' });
            }
            setOpenSlaDialog(false);
            fetchSettings();
        } catch (error) {
            setSnackbar({ open: true, message: 'Failed to save policy', severity: 'error' });
        }
    };

    const handleDeleteSla = async (id: number) => {
        if (window.confirm('Delete this service level policy?')) {
            try {
                await axios.delete(`cafm/sla-policies/${id}/`);
                setSnackbar({ open: true, message: 'Policy removed', severity: 'success' });
                fetchSettings();
            } catch (error) {
                setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
            }
        }
    };

    const getPriorityColor = (priority: string): any => {
        switch (priority) {
            case 'CRITICAL': return 'error';
            case 'HIGH': return 'warning';
            case 'MEDIUM': return 'info';
            case 'LOW': return 'success';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 4, bgcolor: '#f8fafc', minHeight: '100vh' }}>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    CAFM Settings & Compliance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage service level agreements and external maintenance vendors.
                </Typography>
            </Box>

            <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                <Tabs 
                    value={tab} 
                    onChange={(_, v) => setTab(v)}
                    sx={{ px: 3, pt: 2, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}
                >
                    <Tab label="Service Vendors" icon={<VendorIcon />} iconPosition="start" />
                    <Tab label="SLA Policies" icon={<SLAIcon />} iconPosition="start" />
                </Tabs>

                <Box sx={{ p: 4 }}>
                    {tab === 0 && (
                        <Box>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight={700}>Approved Maintenance Vendors</Typography>
                                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={() => handleOpenVendor()}>
                                    Partner with Vendor
                                </Button>
                            </Stack>

                            <Grid container spacing={3}>
                                {vendors.map((vendor: any) => (
                                    <Grid size={{ xs: 12, md: 4 }} key={vendor.id}>
                                        <Card variant="outlined" sx={{ borderRadius: 4, height: '100%', transition: '0.2s', '&:hover': { boxShadow: '0 4px 20px #00000008' } }}>
                                            <CardContent>
                                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                    <Typography variant="h6" fontWeight={700}>{vendor.name}</Typography>
                                                    <Chip label={vendor.service_type} size="small" color="primary" variant="outlined" sx={{ fontWeight: 600 }} />
                                                </Stack>
                                                
                                                <Stack spacing={1.5} sx={{ mt: 3 }}>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <EmailIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        <Typography variant="body2">{vendor.email}</Typography>
                                                    </Stack>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <PhoneIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                                        <Typography variant="body2">{vendor.phone}</Typography>
                                                    </Stack>
                                                </Stack>

                                                <Box sx={{ mt: 3, pt: 3, borderTop: '1px dashed #e2e8f0' }}>
                                                    <Typography variant="caption" color="text.secondary" display="block">PRIMARY CONTACT</Typography>
                                                    <Typography variant="subtitle2" fontWeight={600}>{vendor.contact_person || 'Company Contact'}</Typography>
                                                </Box>

                                                <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 2 }}>
                                                    <Tooltip title="Edit Vendor">
                                                        <IconButton size="small" onClick={() => handleOpenVendor(vendor)}><EditIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                    <Tooltip title="Remove Partner">
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteVendor(vendor.id)}><DeleteIcon fontSize="small" /></IconButton>
                                                    </Tooltip>
                                                </Stack>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                                {!loading && vendors.length === 0 && (
                                    <Grid size={{ xs: 12 }}>
                                        <Box sx={{ textAlign: 'center', py: 6, bgcolor: '#f1f5f9', borderRadius: 4 }}>
                                            <VendorIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                                            <Typography variant="body1" color="text.secondary">No vendors registered yet.</Typography>
                                        </Box>
                                    </Grid>
                                )}
                            </Grid>
                        </Box>
                    )}

                    {tab === 1 && (
                        <Box>
                            <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
                                <Typography variant="h6" fontWeight={700}>Global SLA Definitions</Typography>
                                <Button variant="contained" startIcon={<AddIcon />} sx={{ borderRadius: 2 }} onClick={() => handleOpenSla()}>
                                    Define Policy
                                </Button>
                            </Stack>

                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3 }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 700 }}>Policy Name</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Priority Level</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Response Time</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Resolution Time</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {slaPolicies.map((policy: any) => (
                                            <TableRow key={policy.id} hover>
                                                <TableCell>
                                                    <Typography variant="subtitle2" fontWeight={700}>{policy.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{policy.description}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip 
                                                        label={policy.priority_level} 
                                                        color={getPriorityColor(policy.priority_level)} 
                                                        size="small"
                                                        sx={{ fontWeight: 700, fontSize: '0.7rem' }}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <TimerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2" fontWeight={600}>{policy.response_time_hours} Hours</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell>
                                                    <Stack direction="row" spacing={1} alignItems="center">
                                                        <TimerIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                                        <Typography variant="body2" fontWeight={600}>{policy.resolution_time_hours} Hours</Typography>
                                                    </Stack>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                                                        <IconButton size="small" onClick={() => handleOpenSla(policy)}><EditIcon fontSize="small" /></IconButton>
                                                        <IconButton size="small" color="error" onClick={() => handleDeleteSla(policy.id)}><DeleteIcon fontSize="small" /></IconButton>
                                                    </Stack>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {!loading && slaPolicies.length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                                                    <Typography variant="body2" color="text.secondary">No policies defined.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Box>
            </Paper>

            {/* Vendor Dialog */}
            <Dialog open={openVendorDialog} onClose={() => setOpenVendorDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Edit Vendor' : 'Partner with Vendor'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={3}>
                        <TextField 
                            label="Vendor Name" 
                            fullWidth 
                            value={vendorForm.name}
                            onChange={(e) => setVendorForm({...vendorForm, name: e.target.value})}
                        />
                        <TextField 
                            label="Service Type" 
                            placeholder="e.g. Electrical, HVAC, Cleaning"
                            fullWidth 
                            value={vendorForm.service_type}
                            onChange={(e) => setVendorForm({...vendorForm, service_type: e.target.value})}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Contact Person" 
                                fullWidth 
                                value={vendorForm.contact_person}
                                onChange={(e) => setVendorForm({...vendorForm, contact_person: e.target.value})}
                            />
                            <TextField 
                                label="Phone" 
                                fullWidth 
                                value={vendorForm.phone}
                                onChange={(e) => setVendorForm({...vendorForm, phone: e.target.value})}
                            />
                        </Stack>
                        <TextField 
                            label="Email Address" 
                            fullWidth 
                            value={vendorForm.email}
                            onChange={(e) => setVendorForm({...vendorForm, email: e.target.value})}
                        />
                        <TextField 
                            label="Headquarters Address" 
                            multiline 
                            rows={3} 
                            fullWidth 
                            value={vendorForm.address}
                            onChange={(e) => setVendorForm({...vendorForm, address: e.target.value})}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenVendorDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveVendor}>Save Partner</Button>
                </DialogActions>
            </Dialog>

            {/* SLA Dialog */}
            <Dialog open={openSlaDialog} onClose={() => setOpenSlaDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{editingItem ? 'Edit Policy' : 'Define New SLA Policy'}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Stack spacing={3}>
                        <TextField 
                            label="Policy Name" 
                            fullWidth 
                            value={slaForm.name}
                            onChange={(e) => setSlaForm({...slaForm, name: e.target.value})}
                        />
                        <TextField
                            select
                            label="Priority Level"
                            fullWidth
                            value={slaForm.priority_level}
                            onChange={(e) => setSlaForm({...slaForm, priority_level: e.target.value})}
                        >
                            <MenuItem value="LOW">Low</MenuItem>
                            <MenuItem value="MEDIUM">Medium</MenuItem>
                            <MenuItem value="HIGH">High</MenuItem>
                            <MenuItem value="CRITICAL">Critical</MenuItem>
                        </TextField>
                        <Stack direction="row" spacing={2}>
                            <TextField 
                                label="Target Response (Hours)" 
                                type="number" 
                                fullWidth 
                                value={slaForm.response_time_hours}
                                onChange={(e) => setSlaForm({...slaForm, response_time_hours: parseInt(e.target.value)})}
                            />
                            <TextField 
                                label="Target Resolution (Hours)" 
                                type="number" 
                                fullWidth 
                                value={slaForm.resolution_time_hours}
                                onChange={(e) => setSlaForm({...slaForm, resolution_time_hours: parseInt(e.target.value)})}
                            />
                        </Stack>
                        <TextField 
                            label="Description" 
                            multiline 
                            rows={2} 
                            fullWidth 
                            value={slaForm.description}
                            onChange={(e) => setSlaForm({...slaForm, description: e.target.value})}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setOpenSlaDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSaveSla}>Save Policy</Button>
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
