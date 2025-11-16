// /components/HeatmapSection.tsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import { styled } from '@mui/system';
import { Box } from '@mui/material';


// sample values between 0..4 for the year 2025
const values = Array.from({ length: 365 }).map((_, i) => {
    const date = new Date(2025, 0, 1);
    date.setDate(date.getDate() + i);
    // simple synthetic pattern: more activity mid-year
    const month = date.getMonth();
    const value = Math.max(0, Math.round(3 * Math.exp(-Math.abs(month - 6) / 3) + (Math.random() - 0.5)));
    return { date: date.toISOString().slice(0, 10), count: value };
});

const StyledHeatmapWrapper = styled(Box)(({ theme }) => ({
  '.react-calendar-heatmap .color-empty': {
    fill: theme.palette.grey[200],
  },
  '.react-calendar-heatmap .color-scale-1': {
    fill: theme.palette.success.light,
  },
  '.react-calendar-heatmap .color-scale-2': {
    fill: theme.palette.success.main,
  },
  '.react-calendar-heatmap .color-scale-3': {
    fill: theme.palette.success.dark,
  },
  '.react-calendar-heatmap .color-scale-4': {
    fill: theme.palette.secondary.main,
  },
  '.react-calendar-heatmap .color-scale-5': {
    fill: theme.palette.primary.dark,
  },
  '.react-calendar-heatmap .react-calendar-heatmap-year-text': {
    fontSize: '1.8rem', // Example font size adjustment
  },
}));


export default function HeatmapSection() {
    return (
        <Card>
            <CardContent>
                <Typography variant="h6">Hiring Activity (2025)</Typography>
                <div style={{ marginTop: 12 }}>
                    <CalendarHeatmap startDate={new Date('2025-01-01')} endDate={new Date('2025-12-31')} values={values} />
                </div>
            </CardContent>
            <StyledHeatmapWrapper>
        <CalendarHeatmap
          startDate={new Date('2025-01-01')}
          endDate={new Date('2025-12-31')}
          values={values}
          classForValue={(value) => {
            if (!value) {
              return 'color-empty';
            }
            return `color-scale-${Math.min(value.count, 5)}`;
          }}
         squareSize={18}
          /*tooltipDataAttrs={(value) => {
            return {
              'data-tip': `${value.date}: ${value.count} activity`,
            };
          }}*/
        />
      </StyledHeatmapWrapper>
      {/* Tooltip styles handled by react-calendar-heatmap */}
      <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Less Activity
        </Typography>
        <Box sx={{ display: 'flex' }}>
          {[1, 2, 3, 4, 5].map((scale) => (
            <Box
              key={scale}
              sx={{
                width: 16,
                height: 16,
                mr: 0.5,
                bgcolor: `var(--mui-palette-success-light)`, // Example, replace with correct theme value
                '&.color-scale-1': { bgcolor: '#81c784' },
                '&.color-scale-2': { bgcolor: '#4caf50' },
                '&.color-scale-3': { bgcolor: '#388e3c' },
                '&.color-scale-4': { bgcolor: '#9c27b0' },
                '&.color-scale-5': { bgcolor: '#7b1fa2' },
              }}
              className={`color-scale-${scale}`}
            />
          ))}
        </Box>
        <Typography variant="body2" sx={{ ml: 2 }}>
          More Activity
        </Typography>
      </Box>
        </Card>
        
    );
}