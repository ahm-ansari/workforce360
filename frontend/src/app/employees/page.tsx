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
    TextField,
    InputAdornment,
    Chip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Employee {
    id: number;
    user_details: {
        username: string;
        email: string;
        first_name: string;
        last_name: string;
    };
    department_details: {
        name: string;
    } | null;
    designation_details: {
        name: string;
    } | null;
    date_of_joining: string;
}

export default function EmployeesPage() {
    const router = useRouter();
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const response = await api.get('employees/');
            // Handle both array response and paginated response
            const data = Array.isArray(response.data) ? response.data : response.data.results || [];
            setEmployees(data);
        } catch (error) {
            console.error('Failed to fetch employees:', error);
            setEmployees([]); // Set empty array on error
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('Are you sure you want to delete this employee?')) {
            try {
                await api.delete(`employees/${id}/`);
                fetchEmployees();
            } catch (error) {
                console.error('Failed to delete employee:', error);
            }
        }
    };

    const filteredEmployees = employees.filter((emp) => {
        const searchLower = searchQuery.toLowerCase();
        return (
            emp.user_details.username.toLowerCase().includes(searchLower) ||
            emp.user_details.email.toLowerCase().includes(searchLower) ||
            emp.user_details.first_name.toLowerCase().includes(searchLower) ||
            emp.user_details.last_name.toLowerCase().includes(searchLower)
        );
    });

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Employees</Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => router.push('/employees/create')}
                >
                    Add Employee
                </Button>
            </Box>

            <Paper sx={{ mb: 3, p: 2 }}>
                <TextField
                    fullWidth
                    placeholder="Search employees..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Department</TableCell>
                            <TableCell>Designation</TableCell>
                            <TableCell>Joining Date</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : filteredEmployees.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    No employees found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEmployees.map((employee) => (
                                <TableRow key={employee.id} hover>
                                    <TableCell>
                                        {employee.user_details.first_name} {employee.user_details.last_name}
                                        {!employee.user_details.first_name && !employee.user_details.last_name && (
                                            <em>{employee.user_details.username}</em>
                                        )}
                                    </TableCell>
                                    <TableCell>{employee.user_details.email}</TableCell>
                                    <TableCell>
                                        {employee.department_details ? (
                                            <Chip label={employee.department_details.name} size="small" />
                                        ) : (
                                            '-'
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {employee.designation_details ? employee.designation_details.name : '-'}
                                    </TableCell>
                                    <TableCell>
                                        <span suppressHydrationWarning>
                                            {employee.date_of_joining
                                                ? new Date(employee.date_of_joining).toLocaleDateString()
                                                : '-'}
                                        </span>
                                    </TableCell>
                                    <TableCell align="right">
                                        <IconButton
                                            size="small"
                                            onClick={() => router.push(`/employees/${employee.id}`)}
                                            color="primary"
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton
                                            size="small"
                                            onClick={() => handleDelete(employee.id)}
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
        </Box>
    );
}
