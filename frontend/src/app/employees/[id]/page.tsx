'use client';

import { useState, useEffect } from 'react';
import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useParams } from 'next/navigation';
import api from '@/lib/axios';
import EmployeeForm from '../employee-form';

export default function EditEmployeePage() {
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [employee, setEmployee] = useState(null);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await api.get(`employees/${params.id}/`);
                setEmployee(response.data);
            } catch (err) {
                console.error('Failed to fetch employee:', err);
                setError('Failed to load employee details');
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchEmployee();
        }
    }, [params.id]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Edit Employee
            </Typography>
            {employee && (
                <EmployeeForm
                    employeeId={Number(params.id)}
                    initialData={employee}
                    title="Edit Employee"
                />
            )}
        </Box>
    );
}
