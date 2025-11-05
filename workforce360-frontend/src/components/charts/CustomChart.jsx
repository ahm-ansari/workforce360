"use client";

import React from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, Typography, Box, useTheme } from "@mui/material";

const CustomChart = ({
  title = "Performance Overview",
  data = [],
  type = "line", // "line" or "bar"
  xKey = "name",
  yKeys = [],
  colors = [],
  height = 320,
}) => {
  const theme = useTheme();

  return (
    <Card
      elevation={3}
      sx={{
        borderRadius: 3,
        p: 2,
        bgcolor: "background.paper",
        boxShadow: theme.shadows[2],
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          fontWeight="600"
          gutterBottom
          color="text.primary"
        >
          {title}
        </Typography>

        <Box sx={{ width: "100%", height }}>
          <ResponsiveContainer width="100%" height="100%">
            {type === "bar" ? (
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey={xKey} tick={{ fill: theme.palette.text.secondary }} />
                <YAxis tick={{ fill: theme.palette.text.secondary }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                {yKeys.map((key, index) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={colors[index] || theme.palette.primary.main}
                    radius={[6, 6, 0, 0]}
                  />
                ))}
              </BarChart>
            ) : (
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey={xKey} tick={{ fill: theme.palette.text.secondary }} />
                <YAxis tick={{ fill: theme.palette.text.secondary }} 
                    label={{
                    value: "Employee Count",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: theme.palette.background.paper,
                    borderRadius: 8,
                  }}
                />
                <Legend />
                {yKeys.map((key, index) => (
                  <Line
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index] || theme.palette.primary.main}
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
};

export default CustomChart;
