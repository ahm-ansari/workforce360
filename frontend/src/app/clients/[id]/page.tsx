'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Grid,
    Stack,
    Chip,
    Divider,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Tabs,
    Tab,
    Paper,
    List,
    ListItem,
    ListItemText,
    Avatar,
    IconButton,
    CircularProgress
} from '@mui/material';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowBack as ArrowBackIcon,
    Edit as EditIcon,
    Business as BusinessIcon,
    Email as EmailIcon,
    Phone as PhoneIcon,
    Language as WebsiteIcon,
    LocationOn as LocationIcon,
    Person as PersonIcon,
    Add as AddIcon
} from '@mui/icons-material';
import axios from '@/lib/axios';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;
    return (
        <div role="tabpanel" hidden={value !== index} {...other}>
            {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
        </div>
    );
}

export default function ClientDetail() {
    const { id } = useParams();
    const router = useRouter();
    const [client, setClient] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tabValue, setTabValue] = useState(0);
    const [contactDialogOpen, setContactDialogOpen] = useState(false);
    const [siteDialogOpen, setSiteDialogOpen] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const [contactForm, setContactForm] = useState({
        first_name: '',
        last_name: '',
        designation: '',
        email: '',
        phone: '',
        is_primary: false,
        notes: ''
    });

    const [siteForm, setSiteForm] = useState({
        site_name: '',
        site_type: 'BRANCH',
        address: '',
        city: '',
        state: '',
        country: 'India',
        zip_code: '',
        is_billing_address: false,
        is_shipping_address: false
    });

    const fetchClient = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`clients/clients/${id}/`);
            setClient(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching client details:', err);
            setError('Failed to load client details.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClient();
    }, [id]);

    const handleAddContact = async () => {
        setFormLoading(true);
        try {
            await axios.post('clients/contacts/', { ...contactForm, client: id });
            setContactDialogOpen(false);
            setContactForm({ first_name: '', last_name: '', designation: '', email: '', phone: '', is_primary: false, notes: '' });
            fetchClient();
        } catch (err: any) {
            console.error('Error adding contact:', err);
            alert(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add contact');
        } finally {
            setFormLoading(false);
        }
    };

    const handleAddSite = async () => {
        setFormLoading(true);
        try {
            await axios.post('clients/sites/', { ...siteForm, client: id });
            setSiteDialogOpen(false);
            setSiteForm({ site_name: '', site_type: 'BRANCH', address: '', city: '', state: '', country: 'India', zip_code: '', is_billing_address: false, is_shipping_address: false });
            fetchClient();
        } catch (err: any) {
            console.error('Error adding site:', err);
            alert(err.response?.data ? JSON.stringify(err.response.data) : 'Failed to add site');
        } finally {
            setFormLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!client) return <Alert severity="info">Client not found.</Alert>;

    return (
        <Box sx={{ p: 4 }}>
            {/* Header */}
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
                <IconButton onClick={() => router.push('/clients')}>
                    <ArrowBackIcon />
                </IconButton>
                <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                    <BusinessIcon fontSize="large" />
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" fontWeight={700}>{client.name}</Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={client.status} color="success" size="small" variant="outlined" />
                        <Typography variant="body2" color="text.secondary">{client.industry} • {client.client_type}</Typography>
                    </Stack>
                </Box>
                <Button variant="outlined" startIcon={<EditIcon />} onClick={() => router.push(`/clients/${id}/edit`)}>
                    Edit Client
                </Button>
            </Stack>

            <Grid container spacing={3}>
                {/* Left Sidebar Info */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 2, mb: 3 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Contact Info</Typography>
                            <List>
                                <ListItem disableGutters>
                                    <Avatar sx={{ mr: 2, bgcolor: 'action.hover', color: 'text.secondary', width: 32, height: 32 }}>
                                        <EmailIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                    <ListItemText primary="Email" secondary={client.email || 'N/A'} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <Avatar sx={{ mr: 2, bgcolor: 'action.hover', color: 'text.secondary', width: 32, height: 32 }}>
                                        <PhoneIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                    <ListItemText primary="Phone" secondary={client.phone || 'N/A'} />
                                </ListItem>
                                <ListItem disableGutters>
                                    <Avatar sx={{ mr: 2, bgcolor: 'action.hover', color: 'text.secondary', width: 32, height: 32 }}>
                                        <WebsiteIcon sx={{ fontSize: 18 }} />
                                    </Avatar>
                                    <ListItemText primary="Website" secondary={client.website || 'N/A'} />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 2 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Relationship</Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Account Manager</Typography>
                                    <Typography variant="body1" fontWeight={600}>{client.account_manager_name || 'Not assigned'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Joined Since</Typography>
                                    <Typography variant="body1">{client.joined_date || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">Client ID</Typography>
                                    <Typography variant="body1">CLN-{client.id.toString().padStart(4, '0')}</Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Main Content Tabs */}
                <Grid size={{ xs: 12, md: 8 }}>
                    <Card sx={{ borderRadius: 2, minHeight: 400 }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 2 }}>
                            <Tabs value={tabValue} onChange={handleTabChange}>
                                <Tab label="Overview" />
                                <Tab label={`Contacts (${client.contacts?.length || 0})`} />
                                <Tab label={`Locations (${client.sites?.length || 0})`} />
                                <Tab label="Documents" />
                            </Tabs>
                        </Box>

                        <CardContent>
                            <TabPanel value={tabValue} index={0}>
                                <Typography variant="h6" fontWeight={600} gutterBottom>About {client.name}</Typography>
                                <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.secondary' }}>
                                    {client.notes || 'No description provided for this client.'}
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" fontWeight={600} gutterBottom>Billing Details</Typography>
                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="caption" color="text.secondary">Payment Terms</Typography>
                                            <Typography variant="body1" fontWeight={600}>{client.payment_terms || 'Standard'}</Typography>
                                        </Paper>
                                    </Grid>
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Paper variant="outlined" sx={{ p: 2 }}>
                                            <Typography variant="caption" color="text.secondary">Currency</Typography>
                                            <Typography variant="body1" fontWeight={600}>{client.currency}</Typography>
                                        </Paper>
                                    </Grid>
                                </Grid>
                            </TabPanel>

                            <TabPanel value={tabValue} index={1}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="h6" fontWeight={600}>Client Contacts</Typography>
                                    <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => setContactDialogOpen(true)}>Add Contact</Button>
                                </Stack>
                                <Grid container spacing={2}>
                                    {client.contacts?.length > 0 ? client.contacts.map((contact: any) => (
                                        <Grid size={{ xs: 12, sm: 6 }} key={contact.id}>
                                            <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                                <CardContent>
                                                    <Stack direction="row" spacing={2} alignItems="center">
                                                        <Avatar sx={{ bgcolor: contact.is_primary ? 'primary.main' : 'grey.400' }}>
                                                            {contact.first_name[0]}{contact.last_name[0]}
                                                        </Avatar>
                                                        <Box>
                                                            <Typography variant="subtitle2" fontWeight={700}>
                                                                {contact.first_name} {contact.last_name}
                                                                {contact.is_primary && <Chip label="Primary" size="small" sx={{ ml: 1, height: 16, fontSize: 10 }} color="primary" />}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">{contact.designation}</Typography>
                                                        </Box>
                                                    </Stack>
                                                    <Box sx={{ mt: 2 }}>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <EmailIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="body2">{contact.email}</Typography>
                                                        </Stack>
                                                        <Stack direction="row" alignItems="center" spacing={1}>
                                                            <PhoneIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                                            <Typography variant="body2">{contact.phone}</Typography>
                                                        </Stack>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    )) : <Typography color="text.secondary" align="center" sx={{ w: '100%', py: 4 }}>No contacts added.</Typography>}
                                </Grid>
                            </TabPanel>

                            <TabPanel value={tabValue} index={2}>
                                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                    <Typography variant="h6" fontWeight={600}>Operational Sites</Typography>
                                    <Button size="small" startIcon={<AddIcon />} variant="outlined" onClick={() => setSiteDialogOpen(true)}>Add Site</Button>
                                </Stack>
                                <List>
                                    {client.sites?.length > 0 ? client.sites.map((site: any) => (
                                        <ListItem key={site.id} divider>
                                            <Avatar sx={{ mr: 2, bgcolor: 'action.hover', color: 'text.secondary' }}>
                                                <LocationIcon />
                                            </Avatar>
                                            <ListItemText
                                                primary={<Typography fontWeight={600}>{site.site_name} ({site.site_type})</Typography>}
                                                secondary={`${site.address}, ${site.city}, ${site.country}`}
                                            />
                                            <Stack direction="row" spacing={1}>
                                                {site.is_billing_address && <Chip label="Billing" size="small" variant="outlined" color="info" />}
                                                {site.is_shipping_address && <Chip label="Shipping" size="small" variant="outlined" color="warning" />}
                                            </Stack>
                                        </ListItem>
                                    )) : <Typography color="text.secondary" align="center" sx={{ py: 4 }}>No locations added.</Typography>}
                                </List>
                            </TabPanel>

                            <TabPanel value={tabValue} index={3}>
                                <Box sx={{ textAlign: 'center', py: 8, opacity: 0.5 }}>
                                    <Typography variant="body1">No documents uploaded for this client.</Typography>
                                    <Button variant="text" sx={{ mt: 1 }}>Upload Document</Button>
                                </Box>
                            </TabPanel>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Add Contact Dialog */}
            <Dialog open={contactDialogOpen} onClose={() => setContactDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Contact</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    value={contactForm.first_name}
                                    onChange={(e) => setContactForm({ ...contactForm, first_name: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    value={contactForm.last_name}
                                    onChange={(e) => setContactForm({ ...contactForm, last_name: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Designation"
                            value={contactForm.designation}
                            onChange={(e) => setContactForm({ ...contactForm, designation: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={contactForm.email}
                            onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Phone"
                            value={contactForm.phone}
                            onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        />
                        <FormControlLabel
                            control={
                                <Checkbox
                                    checked={contactForm.is_primary}
                                    onChange={(e) => setContactForm({ ...contactForm, is_primary: e.target.checked })}
                                />
                            }
                            label="Primary Contact"
                        />
                        <TextField
                            fullWidth
                            label="Notes"
                            multiline
                            rows={2}
                            value={contactForm.notes}
                            onChange={(e) => setContactForm({ ...contactForm, notes: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setContactDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddContact}
                        disabled={formLoading || !contactForm.first_name || !contactForm.email}
                    >
                        {formLoading ? 'Saving...' : 'Save Contact'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Site Dialog */}
            <Dialog open={siteDialogOpen} onClose={() => setSiteDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Location / Site</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            fullWidth
                            label="Site Name"
                            value={siteForm.site_name}
                            onChange={(e) => setSiteForm({ ...siteForm, site_name: e.target.value })}
                            placeholder="e.g. Mumbai HQ, Delhi Branch"
                        />
                        <TextField
                            select
                            fullWidth
                            label="Site Type"
                            value={siteForm.site_type}
                            onChange={(e) => setSiteForm({ ...siteForm, site_type: e.target.value })}
                        >
                            <MenuItem value="HEADQUARTERS">Headquarters</MenuItem>
                            <MenuItem value="BRANCH">Branch Office</MenuItem>
                            <MenuItem value="WAREHOUSE">Warehouse</MenuItem>
                            <MenuItem value="ONSITE_CLIENT">Client On-site</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                        </TextField>
                        <TextField
                            fullWidth
                            label="Address"
                            multiline
                            rows={2}
                            value={siteForm.address}
                            onChange={(e) => setSiteForm({ ...siteForm, address: e.target.value })}
                        />
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="City"
                                    value={siteForm.city}
                                    onChange={(e) => setSiteForm({ ...siteForm, city: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="State"
                                    value={siteForm.state}
                                    onChange={(e) => setSiteForm({ ...siteForm, state: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Country"
                                    value={siteForm.country}
                                    onChange={(e) => setSiteForm({ ...siteForm, country: e.target.value })}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    fullWidth
                                    label="Zip Code"
                                    value={siteForm.zip_code}
                                    onChange={(e) => setSiteForm({ ...siteForm, zip_code: e.target.value })}
                                />
                            </Grid>
                        </Grid>
                        <Stack direction="row" spacing={2}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={siteForm.is_billing_address}
                                        onChange={(e) => setSiteForm({ ...siteForm, is_billing_address: e.target.checked })}
                                    />
                                }
                                label="Billing Address"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={siteForm.is_shipping_address}
                                        onChange={(e) => setSiteForm({ ...siteForm, is_shipping_address: e.target.checked })}
                                    />
                                }
                                label="Shipping Address"
                            />
                        </Stack>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3 }}>
                    <Button onClick={() => setSiteDialogOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAddSite}
                        disabled={formLoading || !siteForm.site_name || !siteForm.address}
                    >
                        {formLoading ? 'Saving...' : 'Save Site'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
