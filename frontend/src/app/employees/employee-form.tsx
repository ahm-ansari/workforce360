'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    TextField,
    Button,
    Grid,
    MenuItem,
    Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Department {
    id: number;
    name: string;
}

interface Designation {
    id: number;
    name: string;
    department: number;
}

interface Role {
    id: number;
    name: string;
}

interface EmployeeFormProps {
    employeeId?: number;
    initialData?: any;
    title: string;
}

export default function EmployeeForm({ employeeId, initialData, title }: EmployeeFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [departments, setDepartments] = useState<Department[]>([]);
    const [designations, setDesignations] = useState<Designation[]>([]);
    const [roles, setRoles] = useState<Role[]>([]);

    // Default form state
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        role: '',
        department: '',
        designation: '',
        date_of_joining: '',
        address: '',
        emergency_contact: '',
    });

    // Load initial data if provided (Edit Mode)
    useEffect(() => {
        if (initialData) {
            setFormData({
                username: initialData.user_details?.username || '',
                email: initialData.user_details?.email || '',
                password: '', // Password usually left blank on edit unless changing
                first_name: initialData.user_details?.first_name || '',
                last_name: initialData.user_details?.last_name || '',
                role: initialData.user_details?.role || '',
                department: initialData.department || '',
                designation: initialData.designation || '',
                date_of_joining: initialData.date_of_joining || '',
                address: initialData.address || '',
                emergency_contact: initialData.emergency_contact || '',
            });
        }
    }, [initialData]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [deptRes, desigRes, roleRes] = await Promise.all([
                api.get('employees/departments/'),
                api.get('employees/designations/'),
                api.get('users/roles/'),
            ]);
            setDepartments(Array.isArray(deptRes.data) ? deptRes.data : deptRes.data.results || []);
            setDesignations(Array.isArray(desigRes.data) ? desigRes.data : desigRes.data.results || []);
            setRoles(Array.isArray(roleRes.data) ? roleRes.data : roleRes.data.results || []);
        } catch (error) {
            console.error('Failed to fetch data:', error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const payload: any = {
                ...formData,
                role: formData.role ? parseInt(String(formData.role)) : undefined,
                department: formData.department ? parseInt(String(formData.department)) : undefined,
                designation: formData.designation ? parseInt(String(formData.designation)) : undefined,
            };

            // Remove password if empty in edit mode
            if (employeeId && !payload.password) {
                delete payload.password;
            }

            if (employeeId) {
                // Update
                await api.patch(`employees/${employeeId}/`, payload);
            } else {
                // Create
                await api.post('employees/', payload);
            }
            router.push('/employees');
        } catch (err: any) {
            console.error('Failed to save employee:', err);
            setError(err.response?.data?.detail || 'Failed to save employee');
        } finally {
            setLoading(false);
        }
    };

    const filteredDesignations = formData.department
        ? designations.filter((d) => d.department === parseInt(String(formData.department)))
        : designations;

    return (
        <Paper sx={{ p: 3, mt: 3 }}>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                    {/* Only show username field in create mode or read-only in edit? usually username is immutable, but let's allow read-only */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required={!employeeId}
                            label="Username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled={!!employeeId} // Disable username edit
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required
                            type="email"
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            required={!employeeId}
                            type="password"
                            label={employeeId ? "Password (leave blank to keep current)" : "Password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <MenuItem value="">None</MenuItem>
                            {roles.map((role) => (
                                <MenuItem key={role.id} value={role.id}>
                                    {role.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            name="first_name"
                            value={formData.first_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            name="last_name"
                            value={formData.last_name}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                        >
                            <MenuItem value="">None</MenuItem>
                            {departments.map((dept) => (
                                <MenuItem key={dept.id} value={dept.id}>
                                    {dept.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            select
                            label="Designation"
                            name="designation"
                            value={formData.designation}
                            onChange={handleChange}
                            disabled={!formData.department}
                        >
                            <MenuItem value="">None</MenuItem>
                            {filteredDesignations.map((desig) => (
                                <MenuItem key={desig.id} value={desig.id}>
                                    {desig.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            type="date"
                            label="Date of Joining"
                            name="date_of_joining"
                            value={formData.date_of_joining}
                            onChange={handleChange}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }}>
                        <TextField
                            fullWidth
                            label="Emergency Contact"
                            name="emergency_contact"
                            value={formData.emergency_contact}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <TextField
                            fullWidth
                            multiline
                            rows={3}
                            label="Address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : (employeeId ? 'Update Employee' : 'Create Employee')}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => router.back()}
                            >
                                Cancel
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
}
