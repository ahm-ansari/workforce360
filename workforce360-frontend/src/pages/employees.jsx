
import { useEffect, useState } from "react";
// import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/router";
import {
  Box, Typography, Grid, Paper, List, ListItem, ListItemText, Divider, Pagination,
  Table,
  TableBody,
  TableCell, Chip,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress, Fab, Container,
  Alert,
} from "@mui/material";
import AdminLayout from "@/components/layout/AdminLayout";
import EditIcon from '@mui/icons-material/Edit';
import Delete from '@mui/icons-material/Delete';
import EmployeeJoinTrend from "@/components/employees/EmployeeJoinTrend";
import { CardUX } from "@/components/ui/card";
import { Check, ClearRounded, People,Man, Woman } from '@mui/icons-material';
import AttachMoney from '@mui/icons-material/AttachMoney';
import InsightsIcon from '@mui/icons-material/Insights';
import Groups3Icon from '@mui/icons-material/Groups3';


const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Terminated':
        return 'error';
      default:
        return 'default';
    }
  };


export default function EmployeesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10; // items per page
  const [keypis, setKpis] = useState(null);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
    const fetchEmployees = async (pageNumber = 1) => {
      try {
        const res = await axiosInstance.get(`/employees/?page=${pageNumber}&page_size=${pageSize}`);
        const data = res.data;
        setEmployees(data.results || []);
        setTotalPages(Math.ceil(data.count / pageSize));
      } catch (err) {
        console.error("Error fetching employees:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees(page);

    const fetchKPIs = async () => {
      try {
        const res = await axiosInstance.get("/kpi/summary/");
        setKpis(res.data);
      } catch (err) {
        console.error("Failed to fetch KPI data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();


  }, [page]);

  const kpiItems = [
    { title: "Total Employees", value: keypis?.total_employees ?? "N/A" },
    { title: "Average Salary", value: `$${keypis?.average_salary}` ?? "N/A" },
    { title: "Average Performance", value: keypis?.average_performance ?? "N/A" },
    { title: "Active Employees", value: keypis?.active_employees ?? "N/A" },
    /*{ title: "On-time Attendance", value: `${keypis.on_time_rate}%` },*/
  ];

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  return (
    <AdminLayout title="Employees" user={user}>
      <Grid container spacing={2}>  {/* Grid container from MUI styles  with full width and grid items are evenly distrubuted */}
        {/* Example Cards */}
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CardUX title="Total Employees" value={keypis?.total_employees ?? "N/A"} icon={<People sx={{ fontSize: 60 }} />} color="#e0f7fa"/>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CardUX title="Active Employees" value={keypis?.active_employees ?? "N/A"} icon={<Groups3Icon sx={{ fontSize: 60}}/>} color="#ffecb3"/>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CardUX title="Average Salary" value={`$ ${keypis?.average_salary}`} icon={<AttachMoney sx={{ fontSize: 60 }}/>} color="#e8f5e9" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
          <CardUX title="Average Performance" value={keypis?.average_performance ?? "N/A"} icon={<InsightsIcon sx={{ fontSize: 60 }} />} color="#f3e5f5"  />
        </Grid>
      </Grid>
      <EmployeeJoinTrend />
      <Typography variant="h5" component="h2" gutterBottom>Employee List </Typography>
        <TableContainer component={Paper} elevation={4}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>DOB</strong></TableCell>
                <TableCell><strong>Gender</strong></TableCell>
                <TableCell><strong>Code</strong></TableCell>
                <TableCell><strong>Status</strong></TableCell>
                <TableCell><strong>Joined Date</strong></TableCell>
                <TableCell><strong>Leaving Date</strong></TableCell>
                <TableCell><strong>Is Blocked</strong></TableCell>
                <TableCell><strong>Reporting Manager</strong></TableCell>
                <TableCell><strong>Score</strong></TableCell>
                <TableCell><strong>Tenure</strong></TableCell>
                <TableCell><strong>Action</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {employees.length > 0 ? (
                employees.map((emp) => (
                  <TableRow key={emp.id} hover>
                    <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                    <TableCell>{emp.date_of_birth}</TableCell>
                    <TableCell>{emp.gender=== 'Male'? <Man sx={{ fontSize: 30 , color:"#2196f3"}} /> : <Woman sx={{ fontSize: 30 , color:"#e91e63"}} />}</TableCell>
                    <TableCell><Chip label={emp.emp_code} color="primary" size="small"></Chip></TableCell>
                    <TableCell>
                      <Chip
                        label={emp.status}
                        color={getStatusColor(emp.status)}
                        size="small"
                      /></TableCell>
                    <TableCell>{emp.dataofjoining}</TableCell>
                    <TableCell>{emp.dataofleaving}</TableCell>
                    <TableCell>{emp.is_blocked ? <Check sx={{color: "green"}} />: <ClearRounded sx={{color: "red"}} />}</TableCell>
                    <TableCell>{emp.manager_name}</TableCell>
                    <TableCell>{emp.performance_score}</TableCell>
                    <TableCell>{emp.tenure_days}</TableCell>
                    <TableCell>
                          <EditIcon mr={1} color="secondary" />
                          <Delete mr={1} color="error" />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No employees found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            variant="outlined"
            shape="rounded"
          />
        </Box>
    </AdminLayout>
  );
}
