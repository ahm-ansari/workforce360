'use client';

import { useState, useEffect } from 'react';
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
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '@/services/api';

interface Department {
    id: number;
    name: string;
    description: string;
    designations_count?: number;
    employees_count?: number;
}

export default function DepartmentsPage() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingDept, setEditingDept] = useState<Department | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        try {
            const response = await api.get('employees/departments/');
            const data = Array.isArray(response.data) ? response.data : response.data.results || [];
            setDepartments(data);
        } catch (error) {
            console.error('Failed to fetch departments:', error);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (dept?: Department) => {
        if (dept) {
            setEditingDept(dept);
            setFormData({ name: dept.name, description: dept.description });
        } else {
            setEditingDept(null);
            setFormData({ name: '', description: '' });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingDept(null);
        setFormData({ name: '', description: '' });
    };

    const handleSubmit = async () => {
        try {
            if (editingDept) {
                await api.put(`employees/departments/${editingDept.id}/`, formData);
            } else {
                await api.post('employees/departments/', formData);
            }
            fetchDepartments();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save department:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this department?')) {
            try {
                await api.delete(`employees/departments/${id}/`);
                fetchDepartments();
            } catch (error) {
                console.error('Failed to delete department:', error);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Departments</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Department
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Designations</TableCell>
                            <TableCell>Employees</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : departments.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">No departments found</TableCell>
                            </TableRow>
                        ) : (
                            departments.map((dept) => (
                                <TableRow key={dept.id} hover>
                                    <TableCell>{dept.name}</TableCell>
                                    <TableCell>{dept.description}</TableCell>
                                    <TableCell>
                                        <Chip label={dept.designations_count || 0} size="small" color="primary" />
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={dept.employees_count || 0} size="small" color="secondary" />
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(dept)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(dept.id)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>{editingDept ? 'Edit Department' : 'Add Department'}</DialogTitle>
                <DialogContent>
                    <TextField
                        fullWidth
                        label="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        margin="normal"
                        multiline
                        rows={3}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {editingDept ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
