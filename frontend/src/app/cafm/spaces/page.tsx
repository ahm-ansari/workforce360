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
    Stack,
    IconButton,
    TextField,
    InputAdornment,
    Chip
} from '@mui/material';
import {
    Add as AddIcon,
    Search as SearchIcon,
    Visibility as VisibilityIcon,
    Edit as EditIcon,
    Delete as DeleteIcon
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import axios from '@/lib/axios';

export default function SpacesList() {
    const router = useRouter();
    const [spaces, setSpaces] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async () => {
        try {
            const response = await axios.get('cafm/spaces/');
            setSpaces(response.data);
        } catch (error) {
            console.error('Error fetching spaces:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 4 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Box>
                    <Typography variant="h4" fontWeight={700} gutterBottom>
                        Spaces
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage rooms, floors, and functional areas.
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/cafm/spaces/new')}
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Add Space
                </Button>
            </Stack>

            <Card sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
                    <TextField
                        size="small"
                        placeholder="Search spaces..."
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
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'action.hover' }}>
                                <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Facility</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                <TableCell sx={{ fontWeight: 600 }}>Capacity</TableCell>
                                <TableCell align="right" sx={{ fontWeight: 600 }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {spaces.length > 0 ? spaces.map((space: any) => (
                                <TableRow key={space.id} hover>
                                    <TableCell>
                                        <Typography variant="subtitle2" fontWeight={700}>
                                            {space.name}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>{space.facility_name}</TableCell>
                                    <TableCell>
                                        <Chip label={space.space_type} size="small" variant="outlined" />
                                    </TableCell>
                                    <TableCell>{space.capacity || '-'}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small">
                                            <VisibilityIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small">
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" color="error">
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            )) : (
                                <TableRow>
                                    <TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                                        {loading ? (
                                            <Typography>Loading spaces...</Typography>
                                        ) : (
                                            <Typography>No spaces found.</Typography>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Card>
        </Box>
    );
}
