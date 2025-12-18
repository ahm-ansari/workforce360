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
    MenuItem,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '@/services/api';

interface Department {
    id: number;
    name: string;
}

interface Designation {
    id: number;
    name: string;
    description: string;
    department: number;
    department_details?: {
        name: string;
    };
}

export default function DesignationsPage() {
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingDesig, setEditingDesig] = useState<Designation | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '', department: '' });

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [desigRes, deptRes] = await Promise.all([
                api.get('employees/designations/'),
                api.get('employees/departments/'),
            ]);
            const desigData = Array.isArray(desigRes.data) ? desigRes.data : desigRes.data.results || [];
            const deptData = Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.results || [];
            setDesignations(desigData);
            setDepartments(deptData);
        } catch (error) {
            console.error('Failed to fetch data:', error);
            setDesignations([]);
            setDepartments([]);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (desig?: Designation) => {
        if (desig) {
            setEditingDesig(desig);
            setFormData({
                name: desig.name,
                description: desig.description,
                department: desig.department.toString(),
            });
        } else {
            setEditingDesig(null);
            setFormData({ name: '', description: '', department: '' });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingDesig(null);
        setFormData({ name: '', description: '', department: '' });
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...formData,
                department: parseInt(formData.department),
            };

            if (editingDesig) {
                await api.put(`employees/designations/${editingDesig.id}/`, payload);
            } else {
                await api.post('employees/designations/', payload);
            }
            fetchData();
            handleCloseDialog();
        } catch (error) {
            console.error('Failed to save designation:', error);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this designation?')) {
            try {
                await api.delete(`employees/designations/${id}/`);
                fetchData();
            } catch (error) {
                console.error('Failed to delete designation:', error);
            }
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Designations</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => handleOpenDialog()}
                >
                    Add Designation
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">Loading...</TableCell>
                            </TableRow>
                        ) : designations.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center">No designations found</TableCell>
                            </TableRow>
                        ) : (
                            designations.map((desig) => (
                                <TableRow key={desig.id} hover>
                                    <TableCell>{desig.name}</TableCell>
                                    <TableCell>{desig.description}</TableCell>
                                    <TableCell>
                                        {desig.department_details ? (
                                            <Chip label={desig.department_details.name} size="small" color="primary" />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => handleOpenDialog(desig)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(desig.id)}
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
                <DialogTitle>{editingDesig ? 'Edit Designation' : 'Add Designation'}</DialogTitle>
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
                    <TextField
                        fullWidth
                        select
                        label="Department"
                        value={formData.department}
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                        margin="normal"
                        required
                    >
                        <MenuItem value="">Select Department</MenuItem>
                        {departments.map((dept) => (
                            <MenuItem key={dept.id} value={dept.id}>
                                {dept.name}
                            </MenuItem>
                        ))}
                    </TextField>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained" disabled={!formData.department}>
                        {editingDesig ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
