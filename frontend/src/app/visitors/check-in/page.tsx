'use client';
import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Grid,
    MenuItem,
    CircularProgress,
    Alert,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import api from '@/lib/axios';

interface Employee {
    id: number;
    user_details: {
        first_name: string;
        last_name: string;
    };
}

export default function CheckInVisitor() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        purpose_of_visit: '',
        host_employee: '',
        id_proof_type: 'NATIONAL_ID',
        id_proof_number: '',
    });
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [generalError, setGeneralError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        api
            .get('employees/')
            .then((res) => setEmployees(res.data))
            .catch((err) => console.error(err));
    }, []);

    const handleChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value });
        // Clear error when user types
        if (fieldErrors[field]) {
            setFieldErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setFieldErrors({});
        setGeneralError(null);

        try {
            await api.post('visitors/visitors/', formData);
            router.push('/visitors');
        } catch (err: any) {
            console.error('Error checking in visitor:', err);
            if (err.response?.status === 400 && err.response?.data) {
                const data = err.response.data;
                const newFieldErrors: Record<string, string> = {};
                let errorMsg = null;

                Object.keys(data).forEach(key => {
                    if (Array.isArray(data[key])) {
                        newFieldErrors[key] = data[key].join(' ');
                    } else if (typeof data[key] === 'string') {
                        if (key === 'detail' || key === 'non_field_errors') {
                            errorMsg = data[key];
                        } else {
                            newFieldErrors[key] = data[key];
                        }
                    }
                });

                setFieldErrors(newFieldErrors);
                if (errorMsg) {
                    setGeneralError(errorMsg);
                } else if (Object.keys(newFieldErrors).length > 0) {
                    setGeneralError("Please correct the errors below.");
                } else {
                    setGeneralError("Request failed with status 400.");
                }
            } else {
                setGeneralError("Failed to check in visitor. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Visitor Check-In
            </Typography>
            {generalError && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {generalError}
                </Alert>
            )}
            <Paper sx={{ p: 3 }}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Visitor Name"
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                error={!!fieldErrors.name}
                                helperText={fieldErrors.name}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Phone"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                error={!!fieldErrors.phone}
                                helperText={fieldErrors.phone}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleChange('email', e.target.value)}
                                error={!!fieldErrors.email}
                                helperText={fieldErrors.email}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="Company"
                                value={formData.company}
                                onChange={(e) => handleChange('company', e.target.value)}
                                error={!!fieldErrors.company}
                                helperText={fieldErrors.company}
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <TextField
                                fullWidth
                                label="Purpose of Visit"
                                multiline
                                rows={3}
                                value={formData.purpose_of_visit}
                                onChange={(e) => handleChange('purpose_of_visit', e.target.value)}
                                error={!!fieldErrors.purpose_of_visit}
                                helperText={fieldErrors.purpose_of_visit}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="Host Employee"
                                value={formData.host_employee}
                                onChange={(e) => handleChange('host_employee', e.target.value)}
                                error={!!fieldErrors.host_employee}
                                helperText={fieldErrors.host_employee}
                                required
                            >
                                {employees.map((emp) => (
                                    <MenuItem key={emp.id} value={emp.id}>
                                        {emp.user_details.first_name} {emp.user_details.last_name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                select
                                label="ID Proof Type"
                                value={formData.id_proof_type}
                                onChange={(e) => handleChange('id_proof_type', e.target.value)}
                                error={!!fieldErrors.id_proof_type}
                                helperText={fieldErrors.id_proof_type}
                            >
                                <MenuItem value="PASSPORT">Passport</MenuItem>
                                <MenuItem value="DRIVERS_LICENSE">Driver's License</MenuItem>
                                <MenuItem value="NATIONAL_ID">National ID</MenuItem>
                                <MenuItem value="OTHER">Other</MenuItem>
                            </TextField>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <TextField
                                fullWidth
                                label="ID Proof Number"
                                value={formData.id_proof_number}
                                onChange={(e) => handleChange('id_proof_number', e.target.value)}
                                error={!!fieldErrors.id_proof_number}
                                helperText={fieldErrors.id_proof_number}
                                required
                            />
                        </Grid>
                        <Grid size={{ xs: 12 }}>
                            <Button type="submit" variant="contained" disabled={loading}>
                                {loading ? <CircularProgress size={24} /> : 'Check-In Visitor'}
                            </Button>
                            <Button sx={{ ml: 2 }} onClick={() => router.back()}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    );
}
