'use client';

import { Box, Typography } from '@mui/material';
import EmployeeForm from '../employee-form';

export default function CreateEmployeePage() {
    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Add New Employee
            </Typography>
            <EmployeeForm title="Add New Employee" />
        </Box>
    );
}
