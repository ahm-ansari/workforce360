import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Typography, Grid, Paper, List, ListItem, ListItemText, Divider } from "@mui/material";
import DashboardLayout from "@/components/layout/DashboardLayout";

export default function EmployeesPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);

  // Mock data for KPIs and employees
  const kpis = [
    { name: "Total Employees", value: 150 },
    { name: "New Hires (Last 30 Days)", value: 5 },
    { name: "Average Tenure (Years)", value: 3.5 },
    { name: "Open Positions", value: 10 },
  ];

  const employees = [
    { id: 1, name: "John Doe", position: "Software Engineer" },
    { id: 2, name: "Jane Smith", position: "Project Manager" },
    { id: 3, name: "Peter Jones", position: "UI/UX Designer" },
    { id: 4, name: "Alice Brown", position: "QA Engineer" },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) {
      router.push("/login");
    } else if (userData) {
      setUser(JSON.parse(userData));
    }
  }, [router]);

  return (
    <DashboardLayout>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Employees Overview
        </Typography>

        {/* KPIs Section */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {kpis.map((kpi, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
              <Paper sx={{ p: 2, display: "flex", flexDirection: "column", height: 120, justifyContent: "space-between" }}>
                <Typography component="h2" variant="h6" color="primary" gutterBottom>
                  {kpi.name}
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
          <List>
            {employees.map((employee) => (
              <div key={employee.id}>
                <ListItem>
                  <ListItemText primary={employee.name} secondary={employee.position} />
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </Paper>
      </Box>
    </DashboardLayout>
  );
}
