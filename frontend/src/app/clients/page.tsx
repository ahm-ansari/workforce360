'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Card,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    TextField,
    InputAdornment,
    Stack,
    Avatar,
    Tooltip,
    Menu,
    MenuItem
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    FilterList as FilterListIcon,
    Business as BusinessIcon,
    MoreVert as MoreVertIcon,
    Email as EmailIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function ClientList() {
    const router = useRouter();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [selectedClientId, setSelectedClientId] = useState<number | null>(null);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            const response = await axios.get('/api/clients/clients/');
            setClients(response.data);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: number) => {
        setAnchorEl(event.currentTarget);
        setSelectedClientId(id);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedClientId(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'PROSPECT': return 'info';
            case 'NEGOTIATION': return 'warning';
            case 'INACTIVE': return 'error';
            default: return 'default';
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Client Directory
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage your business relationships and corporate accounts.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/clients/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Add Client
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <Stack direction="row" spacing={2} justifyContent="space-between">
                        <TextField
                            size="small"
                            placeholder="Search clients by name, industry, or Tax ID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon fontSize="small" />
                                    </InputAdornment>
                                ),
                            }}
                            sx={{ width: 400 }}
                        />
                        <Button startIcon={<FilterListIcon />} variant="outlined" size="small">
                            More Filters
                        </Button>
                    </Stack>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Company Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Industry</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Account Manager</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Connect</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {clients.length > 0 ? clients.map((client: any) => (
                                <TableRow key={client.id} hover>
                                    <TableCell>
                                        <Stack direction="row" spacing={2} alignItems="center">
                                            <Avatar sx={{ bgcolor: 'primary.light', width: 36, height: 36 }}>
                                                <BusinessIcon fontSize="small" />
                                            </Avatar>
                                            <Box>
                                                <Typography
                                                    variant="subtitle2"
                                                    fontWeight={700}
                                                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                                                    onClick={() => router.push(`/clients/${client.id}`)}
                                                >
                                                    {client.name}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    ID: CLN-{client.id.toString().padStart(4, '0')}
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{client.client_type}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2">{client.industry || 'N/A'}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Typography variant="body2" fontWeight={500}>
                                            {client.account_manager_name || 'Unassigned'}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={client.status}
                                            size="small"
                                            color={getStatusColor(client.status) as any}
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Stack direction="row" spacing={1}>
                                            <Tooltip title={client.email || 'No email'}>
                                                <IconButton size="small" disabled={!client.email}>
                                                    <EmailIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title={client.phone || 'No phone'}>
                                                <IconButton size="small" disabled={!client.phone}>
                                                    <PhoneIcon fontSize="small" />
                                                </IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => router.push(`/clients/${client.id}`)}>
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={(e) => handleMenuOpen(e, client.id)}>
                                            <MoreVertIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={7} align="center" sx={{ py: 10 }}>
                                        {loading ? (
                                            <CircularProgress size={30} />
                                        ) : (
                                            <Box sx={{ opacity: 0.5 }}>
                                                <BusinessIcon sx={{ fontSize: 48, mb: 1 }} />
                                                <Typography>No clients found.</Typography>
                                            </Box>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => { handleMenuClose(); router.push(`/clients/${selectedClientId}/edit`); }}>Edit Client</MenuItem>
                <MenuItem onClick={handleMenuClose}>Add Contact</MenuItem>
                <MenuItem onClick={handleMenuClose}>Log Activity</MenuItem>
                <Divider />
                <MenuItem onClick={handleMenuClose} sx={{ color: 'error.main' }}>Delete Client</MenuItem>
            </Menu>
        </Box>
    );
}

function CircularProgress({ size }: { size: number }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <Box
                sx={{
                    width: size,
                    height: size,
                    borderRadius: '50%',
                    border: '2px solid #ddd',
                    borderTopColor: 'primary.main',
                    animation: 'spin 1s linear infinite',
                    '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' }
                    }
                }}
            />
        </Box>
    );
}

const Divider = () => <Box sx={{ borderTop: '1px solid', borderColor: 'divider', my: 1 }} />;
