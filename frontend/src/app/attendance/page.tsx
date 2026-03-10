'use client';

import { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Paper, Grid, CircularProgress, Tabs, Tab,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Select, FormControl, InputLabel
} from '@mui/material';
import AttendanceCalendar from '@/components/hr/AttendanceCalendar';
import TeamAttendance from '@/components/hr/TeamAttendance';
import api from '@/services/api';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import { useAuthStore } from '@/store/authStore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

interface AttendanceRecord {
    id: number;
    date: string;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LATE' | 'ON_LEAVE';
    check_in?: string;
    check_out?: string;
    work_hours?: number;
}

interface Employee {
    id: number;
    user_details: {
        first_name: string;
        last_name: string;
        email: string;
    };
    department?: { name: string };
    designation?: { name: string };
}

export default function AttendancePage() {
    const [currentDate, setCurrentDate] = useState<Date | null>(null);
    const [isMounted, setIsMounted] = useState(false);
    const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [todayRecord, setTodayRecord] = useState<AttendanceRecord | null>(null);
    const user = useAuthStore((state) => state.user);

    // Bulk Generate State
    const [openBulkDialog, setOpenBulkDialog] = useState(false);
    const [bulkDate, setBulkDate] = useState<Date | null>(null);
    const [globalStatus, setGlobalStatus] = useState('PRESENT');

    const [bulkLoading, setBulkLoading] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeStatuses, setEmployeeStatuses] = useState<{ [key: number]: string }>({});
    const [loadingEmployees, setLoadingEmployees] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        setCurrentDate(new Date());
        setBulkDate(new Date());
    }, []);

    useEffect(() => {
        if (currentDate) {
            fetchAttendance();
        }
    }, [currentDate]);

    useEffect(() => {
        if (openBulkDialog) {
            fetchEmployees();
        }
    }, [openBulkDialog]);

    const fetchAttendance = async () => {
        try {
            setLoading(true);
            const response = await api.get('hr/attendance/?mine=true');
            const data = Array.isArray(response.data) ? response.data : response.data.results || [];
            setAttendanceData(data);

            const todayStr = new Date().toISOString().split('T')[0];
            const today = data.find((r: AttendanceRecord) => r.date === todayStr);
            setTodayRecord(today || null);
        } catch (error) {
            console.error('Failed to fetch attendance:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchEmployees = async () => {
        try {
            setLoadingEmployees(true);
            // Assuming api/employees/ is available and correct
            const response = await api.get('employees/');
            const data = Array.isArray(response.data) ? response.data : response.data.results || [];
            setEmployees(data);

            // Initialize statuses
            const initialStatuses: any = {};
            data.forEach((emp: Employee) => {
                initialStatuses[emp.id] = 'PRESENT';
            });
            setEmployeeStatuses(initialStatuses);
            setGlobalStatus('PRESENT');
        } catch (error: any) {
            console.error('Failed to fetch employees:', error);
            if (error.response?.status === 404) {
                console.warn('Employees endpoint not found or returns 404');
            }
        } finally {
            setLoadingEmployees(false);
        }
    };

    const handleCheckIn = async () => {
        try {
            const now = new Date();
            const timeStr = now.toTimeString().split(' ')[0];
            const dateStr = now.toISOString().split('T')[0];

            if (todayRecord) {
                if (todayRecord.status === 'ABSENT') {
                    await api.patch(`hr/attendance/${todayRecord.id}/`, {
                        check_in: timeStr,
                        status: 'PRESENT'
                    });
                } else {
                    await api.patch(`hr/attendance/${todayRecord.id}/`, {
                        check_out: timeStr,
                        status: 'PRESENT'
                    });
                }
            } else {
                await api.post('hr/attendance/', {
                    date: dateStr,
                    check_in: timeStr,
                    status: 'PRESENT'
                });
            }
            fetchAttendance();
        } catch (error) {
            console.error('Failed to mark attendance:', error);
            alert('Failed to mark attendance');
        }
    };

    const handleGlobalStatusChange = (status: string) => {
        setGlobalStatus(status);
        const newStatuses: any = {};
        employees.forEach(emp => {
            newStatuses[emp.id] = status;
        });
        setEmployeeStatuses(newStatuses);
    };

    const handleBulkGenerate = async () => {
        if (!bulkDate) return;
        try {
            setBulkLoading(true);
            const dateStr = bulkDate.toISOString().split('T')[0];

            // Construct detailed payload
            const records = employees.map(emp => ({
                employee_id: emp.id,
                status: employeeStatuses[emp.id] || 'PRESENT'
            }));

            const response = await api.post('hr/attendance/bulk_generate/', {
                date: dateStr,
                records: records
            });

            alert(response.data.message);
            setOpenBulkDialog(false);
            fetchAttendance();
        } catch (error) {
            console.error('Failed to generate attendance:', error);
            alert('Failed to generate attendance');
        } finally {
            setBulkLoading(false);
        }
    };

    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const roleName = user?.role_details?.name?.toLowerCase();
    const isManager = roleName === 'admin' || roleName === 'manager';

    return (
        <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">Attendance</Typography>

                <Box sx={{ display: 'flex', gap: 2 }}>
                    {isManager && (
                        <Button
                            variant="outlined"
                            startIcon={<GroupAddIcon />}
                            onClick={() => setOpenBulkDialog(true)}
                        >
                            Bulk Generate
                        </Button>
                    )}
                    {tabValue === 0 && (
                        <Button
                            variant="contained"
                            startIcon={<AccessTimeIcon />}
                            onClick={handleCheckIn}
                            color={todayRecord?.check_out ? 'success' : (todayRecord && todayRecord.status !== 'ABSENT') ? 'warning' : 'primary'}
                            disabled={!!todayRecord?.check_out}
                        >
                            {todayRecord?.check_out ? 'Completed' : (todayRecord && todayRecord.status !== 'ABSENT') ? 'Check Out' : 'Check In'}
                        </Button>
                    )}
                </Box>
            </Box>

            {isManager && (
                <Tabs value={tabValue} onChange={handleTabChange} sx={{ mb: 3 }}>
                    <Tab label="My Attendance" />
                    <Tab label="Team Attendance" />
                </Tabs>
            )}

            {tabValue === 0 ? (
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 8 }}>
                        {currentDate && (
                            <AttendanceCalendar
                                attendanceData={attendanceData}
                                currentDate={currentDate}
                                onMonthChange={(date: Date) => setCurrentDate(date)}
                            />
                        )}
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom>
                                Today's Status
                            </Typography>
                            {loading ? (
                                <CircularProgress />
                            ) : (
                                <Box>
                                    <Typography variant="body1" gutterBottom>
                                        Date: {isMounted ? new Date().toLocaleDateString() : ''}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Status: <strong>{todayRecord?.status || 'Not Marked'}</strong>
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Check In: {todayRecord?.check_in || '-'}
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        Check Out: {todayRecord?.check_out || '-'}
                                    </Typography>
                                    {todayRecord?.work_hours && (
                                        <Typography variant="body1" gutterBottom>
                                            Work Hours: {todayRecord.work_hours}
                                        </Typography>
                                    )}
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            ) : (
                <TeamAttendance />
            )}

            <Dialog open={openBulkDialog} onClose={() => setOpenBulkDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Bulk Generate Attendance</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 3 }}>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label="Date"
                                        value={bulkDate}
                                        onChange={(newValue) => setBulkDate(newValue)}
                                        slotProps={{ textField: { fullWidth: true } }}
                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <FormControl fullWidth>
                                    <InputLabel>Mark All As</InputLabel>
                                    <Select
                                        value={globalStatus}
                                        label="Mark All As"
                                        onChange={(e) => handleGlobalStatusChange(e.target.value)}
                                    >
                                        <MenuItem value="PRESENT">Present</MenuItem>
                                        <MenuItem value="ABSENT">Absent</MenuItem>
                                        <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                                        <MenuItem value="HALF_DAY">Half Day</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        {loadingEmployees ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', maxHeight: 400 }}>
                                <Table stickyHeader size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Employee</TableCell>
                                            <TableCell>Department</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employees.map((emp) => (
                                            <TableRow key={emp.id}>
                                                <TableCell>
                                                    {emp.user_details ? `${emp.user_details.first_name} ${emp.user_details.last_name}` : `Emp ID: ${emp.id}`}
                                                </TableCell>
                                                <TableCell>{emp.department?.name || '-'}</TableCell>
                                                <TableCell sx={{ minWidth: 150 }}>
                                                    <Select
                                                        value={employeeStatuses[emp.id] || 'PRESENT'}
                                                        onChange={(e) => setEmployeeStatuses({
                                                            ...employeeStatuses,
                                                            [emp.id]: e.target.value
                                                        })}
                                                        size="small"
                                                        fullWidth
                                                        variant="standard"
                                                    >
                                                        <MenuItem value="PRESENT">Present</MenuItem>
                                                        <MenuItem value="ABSENT">Absent</MenuItem>
                                                        <MenuItem value="ON_LEAVE">On Leave</MenuItem>
                                                        <MenuItem value="HALF_DAY">Half Day</MenuItem>
                                                    </Select>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenBulkDialog(false)}>Cancel</Button>
                    <Button
                        onClick={handleBulkGenerate}
                        variant="contained"
                        disabled={bulkLoading}
                    >
                        {bulkLoading ? 'Generating...' : 'Generate Attendance'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box >
    );
}
