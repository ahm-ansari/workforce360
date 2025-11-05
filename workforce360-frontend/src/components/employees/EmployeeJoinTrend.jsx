"use client";

import React, { useEffect, useState } from "react";
import CustomChart from "@/components/charts/CustomChart";
import axiosInstance from "../../utils/axiosInstance";
import { format, parse } from "date-fns";
import { Box, Grid } from "@mui/material";

export default function EmployeeJoinTrend() {
  const [chartData, setChartData] = useState([]);
  const [chartDataMonth, setChartDataMonth] = useState([]);

  useEffect(() => {
    async function fetchEmployees() {
      try {
        const res = await axiosInstance.get("/employee/all/"); // update API endpoint if needed
        const employees = res.data;
        const grouped = groupByJoiningDate(employees);
        setChartData(grouped);
        setChartDataMonth(groupByJoiningMonth(employees));
        console.log(grouped);
      } catch (err) {
        console.error("Error loading employees:", err);
      }
    }

    fetchEmployees();
  }, []);

  function groupByJoiningDate(employees) {
    const grouped = employees.reduce((acc, emp) => {
      const month = format(new Date(emp.dataofjoining), "MMM");
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Convert to array sorted by date
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => 
            parse(a.date, "MMM", new Date()) -
            parse(b.date, "MMM", new Date()));
  }

  function groupByJoiningMonth(employees) {
    const grouped = employees.reduce((acc, emp) => {
      const month = format(new Date(emp.dataofleaving), "yyyy");
      acc[month] = (acc[month] || 0) + 1;
      return acc;
    }, {});

    // Convert to array sorted by date
    return Object.entries(grouped)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  

  return (
    <Box>
    <Grid container spacing={1} sx={{ mb: 4 }}>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomChart
          title="Employee Leaving Trend"
          data={chartDataMonth}
          type="bar"
          xKey="date"
          yKeys={["count"]}
          colors={["#42a5f5", "#66bb6a"]}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CustomChart
          title="Employee Joining Trend"
          data={chartData}
          type="line"
          xKey="date"
          yKeys={["count"]}
          colors={["#42a5f5"]}
        />
      </Grid >
    </Grid>
    </Box>
  );
}
