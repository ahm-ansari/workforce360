'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Grid,
    Stack,
    Button,
    Chip,
    Divider,
    Paper,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    ListItemIcon,
    Avatar,
    LinearProgress
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    Build as BuildIcon,
    Room as RoomIcon,
    Business as BusinessIcon,
    Inventory as AssetIcon,
    Event as EventIcon,
    Verified as VerifiedIcon,
    Warning as WarningIcon
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';
import axios from '@/lib/axios';

export default function AssetDetail() {
    const router = useRouter();
    const { id } = useParams();
    const [asset, setAsset] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAsset = async () => {
            try {
                const res = await axios.get(`cafm/assets/${id}/`);
                setAsset(res.data);
            } catch (error) {
                console.error('Failed to fetch asset', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAsset();
    }, [id]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'success';
            case 'MAINTENANCE': return 'warning';
            case 'INACTIVE': return 'error';
            case 'RETIRED': return 'default';
            default: return 'default';
        }
    };

    if (loading) return <Box sx={{ p: 4 }}><LinearProgress /></Box>;
    if (!asset) return <Box sx={{ p: 4 }}>Asset not found.</Box>;

    return (
        <Box sx={{ p: 4 }}>
            <Button
                startIcon={<ArrowBackIcon />}
                onClick={() => router.push('/cafm/assets')}
                sx={{ mb: 3 }}
            >
                Back to Assets
            </Button>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{ borderRadius: 4, mb: 4, overflow: 'hidden' }}>
                        <Box sx={{ bgcolor: 'primary.main', py: 6, display: 'flex', justifyContent: 'center' }}>
                            <AssetIcon sx={{ fontSize: 80, color: 'white' }} />
                        </Box>
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                                <Typography variant="caption" color="text.secondary" fontWeight={700}>
                                    {asset.asset_type ? asset.asset_type.toUpperCase() : 'ASSET'}
                                </Typography>
                                <Chip
                                    label={asset.status}
                                    size="small"
                                    color={getStatusColor(asset.status) as any}
                                />
                            </Stack>
                            <Typography variant="h5" fontWeight={700} gutterBottom>
                                {asset.name} {asset.asset_id && <Typography component="span" variant="h6" color="text.secondary">(#{asset.asset_id})</Typography>}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                {asset.description || 'No description provided.'}
                            </Typography>

                            <Divider sx={{ mb: 2 }} />

                            <Stack spacing={2}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">CATEGORY</Typography>
                                    <Typography variant="body2" fontWeight={600}>{asset.category || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">SERIAL NUMBER</Typography>
                                    <Typography variant="body2" fontWeight={600}>{asset.serial_number || 'N/A'}</Typography>
                                </Box>
                                <Box>
                                    <Typography variant="caption" color="text.secondary">LOCATION DETAILS</Typography>
                                    {asset.location && (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                            <RoomIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{asset.location}</Typography>
                                        </Stack>
                                    )}
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <BusinessIcon fontSize="small" color="action" />
                                        <Typography variant="body2">{asset.facility_name}</Typography>
                                    </Stack>
                                    {asset.space_name && (
                                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                                            <RoomIcon fontSize="small" color="action" />
                                            <Typography variant="body2">{asset.space_name}</Typography>
                                        </Stack>
                                    )}
                                </Box>
                            </Stack>

                            <Button variant="contained" fullWidth sx={{ mt: 4, borderRadius: 2 }}>
                                Edit Asset Details
                            </Button>
                        </CardContent>
                    </Card>

                    <Card sx={{ borderRadius: 4, bgcolor: '#f8fafc' }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={700} gutterBottom>Asset & Purchase Info</Typography>
                            <Stack spacing={2}>
                                {asset.vendor_information && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Vendor Information</Typography>
                                        <Typography variant="body2" fontWeight={600}>{asset.vendor_information}</Typography>
                                    </Box>
                                )}
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Value</Typography>
                                    <Typography variant="body2" fontWeight={600}>{asset.asset_value ? `$${asset.asset_value}` : 'N/A'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Installation Date</Typography>
                                    <Typography variant="body2" fontWeight={600}>{asset.installation_date || 'Unknown'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Purchase Date</Typography>
                                    <Typography variant="body2" fontWeight={600}>{asset.purchase_date || 'Unknown'}</Typography>
                                </Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <Typography variant="body2" color="text.secondary">Warranty Expiry</Typography>
                                    <Typography variant="body2" fontWeight={600} color={asset.warranty_expiry ? 'inherit' : 'text.secondary'}>
                                        {asset.warranty_expiry || 'No Warranty'}
                                    </Typography>
                                </Box>
                                {asset.warranty_details && (
                                    <Box>
                                        <Typography variant="body2" color="text.secondary">Warranty Details</Typography>
                                        <Typography variant="body2">{asset.warranty_details}</Typography>
                                    </Box>
                                )}
                                {asset.maintenance_frequency && (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                                        <Typography variant="body2" color="text.secondary">Maintenance Freq</Typography>
                                        <Typography variant="body2" fontWeight={600}>{asset.maintenance_frequency}</Typography>
                                    </Box>
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 8 }}>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
                        <BuildIcon sx={{ mr: 1 }} /> Maintenance History
                    </Typography>

                    {asset.maintenance_history?.length > 0 ? (
                        <Paper sx={{ borderRadius: 4, overflow: 'hidden' }}>
                            <List sx={{ p: 0 }}>
                                {asset.maintenance_history.map((record: any, index: number) => (
                                    <React.Fragment key={record.id}>
                                        <ListItem
                                            disablePadding
                                            sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                        >
                                            <ListItemButton
                                                onClick={() => router.push(`/cafm/maintenance/${record.id}`)}
                                                sx={{ px: 3, py: 2 }}
                                            >
                                                <ListItemIcon>
                                                    <Avatar sx={{ bgcolor: record.status === 'CLOSED' ? 'success.light' : 'warning.light' }}>
                                                        {record.status === 'CLOSED' ? <VerifiedIcon /> : <WarningIcon />}
                                                    </Avatar>
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                                            <Typography variant="subtitle1" fontWeight={700}>{record.title}</Typography>
                                                            <Chip label={record.status} size="small" variant="outlined" />
                                                        </Stack>
                                                    }
                                                    secondary={
                                                        <Stack direction="row" spacing={2} sx={{ mt: 0.5 }}>
                                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <EventIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                                                {new Date(record.created_at).toLocaleDateString()}
                                                            </Typography>
                                                            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <BuildIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                                                                Priority: {record.priority}
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        {index < asset.maintenance_history.length - 1 && <Divider />}
                                    </React.Fragment>
                                ))}
                            </List>
                        </Paper>
                    ) : (
                        <Box sx={{ p: 8, textAlign: 'center', bgcolor: 'action.hover', borderRadius: 4 }}>
                            <VerifiedIcon sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 1 }} />
                            <Typography color="text.secondary">No maintenance history found for this asset.</Typography>
                        </Box>
                    )}

                    <Box sx={{ mt: 4 }}>
                        <Card sx={{ borderRadius: 4, background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', color: 'white' }}>
                            <CardContent sx={{ p: 4 }}>
                                <Typography variant="h6" fontWeight={700} gutterBottom>Schedule Maintenance</Typography>
                                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>
                                    Need to perform a routine checkup or fix an issue? Create a new maintenance request directly for this asset.
                                </Typography>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => router.push(`/cafm/maintenance/new?asset=${asset.id}`)}
                                    sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: '#f1f5f9' } }}
                                >
                                    New Request for Asset
                                </Button>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
