'use client';

import React, { useState } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    TextField,
    InputAdornment
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/services/api';
import { useAuthStore } from '@/store/authStore';

interface Company {
    id: number;
    name: string;
    email: string;
    phone: string;
    contact_person: string;
    industry: string;
    is_active: boolean;
}

const fetchCompanies = async () => {
    const response = await api.get('visitors/companies/');
    return response.data;
};

export default function CompanyListPage() {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const user = useAuthStore((state) => state.user);

    const queryClient = useQueryClient();

    const { data: companies, isLoading } = useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies
    });

    const filteredCompanies = companies?.filter((company: Company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleRegister = () => {
        router.push('/companies/register');
    };

    const handleEdit = (id: number) => {
        router.push(`/companies/${id}`);
    };

    const handleDelete = async (id: number) => {
        if (window.confirm('Are you sure you want to delete this company?')) {
            try {
                await api.delete(`visitors/companies/${id}/`);
                queryClient.invalidateQueries({ queryKey: ['companies'] });
            } catch (error) {
                console.error('Error deleting company:', error);
                alert('Failed to delete company');
            }
        }
    };

    if (isLoading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" fontWeight="600" color="primary">
                    Companies
                </Typography>
                {(['admin', 'hr', 'security', 'administrator'].includes((user?.role_details?.name || user?.role || '').toLowerCase())) && (
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleRegister}
                        sx={{
                            background: 'linear-gradient(45deg, #4f46e5 30%, #ec4899 90%)',
                            color: 'white',
                            boxShadow: '0 3px 5px 2px rgba(79, 70, 229, .3)',
                        }}
                    >
                        Register Company
                    </Button>
                )}
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search companies..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 3 }}>
                <Table>
                    <TableHead sx={{ bgcolor: 'rgba(0, 0, 0, 0.04)' }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 600 }}>Name</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Industry</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Contact Person</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Phone</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                            <TableCell sx={{ fontWeight: 600 }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredCompanies?.map((company: Company) => (
                            <TableRow key={company.id} hover>
                                <TableCell sx={{ fontWeight: 500 }}>{company.name}</TableCell>
                                <TableCell>{company.industry}</TableCell>
                                <TableCell>{company.contact_person}</TableCell>
                                <TableCell>{company.email}</TableCell>
                                <TableCell>{company.phone}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={company.is_active ? 'Active' : 'Inactive'}
                                        color={company.is_active ? 'success' : 'default'}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>
                                    <IconButton size="small" color="primary" onClick={() => handleEdit(company.id)}>
                                        <EditIcon fontSize="small" />
                                    </IconButton>
                                    <IconButton size="small" color="error" onClick={() => handleDelete(company.id)}>
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredCompanies?.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No companies found
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
