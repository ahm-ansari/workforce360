import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../utils/axiosInstance";
import { useRouter } from "next/router";
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText, Divider, Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert, } from "@mui/material";
import DashboardLayout from "@/components/layout/DashboardLayout";

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
        console.log(data);
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
    { title: "Average Salary", value: `$${keypis?.average_salary}`  ?? "N/A"},
    { title: "Average Performance", value: keypis?.average_performance  ?? "N/A"},
    { title: "Active Employees", value: keypis?.active_employees  ?? "N/A"},
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
    <DashboardLayout>
      <Box  sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom color="primary">
          Employees Overview
        </Typography>

        {/* KPIs Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpiItems.map((kpi, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 120, justifyContent: "space-between" }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  {kpi.title}
                </Typography>
                <Typography component="p" variant="h4">
                  {kpi.value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Employees List Section */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            Employee List
          </Typography>
        </Paper>
      <TableContainer component={Paper} elevation={4}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Name</strong></TableCell>
              <TableCell><strong>DOB</strong></TableCell>
              <TableCell><strong>Gender</strong></TableCell>
              <TableCell><strong>Code</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Joined Date</strong></TableCell>
              <TableCell><strong>Leaving Date</strong></TableCell>
              <TableCell><strong>Is Blocked</strong></TableCell>
              <TableCell><strong>Reporting Manager</strong></TableCell>
              <TableCell><strong>KPIs</strong></TableCell>
              <TableCell><strong>Tenure</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {employees.length > 0 ? (
              employees.map((emp) => (
                <TableRow key={emp.id} hover>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.first_name} {emp.last_name}</TableCell>
                  <TableCell>{emp.date_of_birth}</TableCell>
                  <TableCell>{emp.gender}</TableCell>
                  <TableCell>{emp.emp_code}</TableCell>
                  <TableCell>{emp.status}</TableCell>
                  <TableCell>{emp.dataofjoining}</TableCell>
                  <TableCell>{emp.dataofleaving}</TableCell>
                  <TableCell>{emp.is_blocked ? "Yes" : "No"}</TableCell>
                  <TableCell>{emp.manager_name}</TableCell>
                  <TableCell>{emp.kpi_score}</TableCell>
                  <TableCell>{emp.tenure_days}</TableCell>
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
      
      </Box>
    </DashboardLayout>
  );
}
