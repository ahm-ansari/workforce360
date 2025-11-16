// /components/utilities/UtilitiesTools.tsx
import React from 'react';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { utilitiesMock } from '../../utils/mockUtilitiesData';


export default function UtilitiesTools() {
const handleClick = (action) => alert(`${action} triggered!`);


return (
<Grid container spacing={2}>
{utilitiesMock.tools.map((tool) => (
<Grid item xs={12} sm={6} md={3} key={tool.name}>
<Card>
<CardContent>
<Typography variant="subtitle1" gutterBottom>{tool.name}</Typography>
<Button variant="contained" color="primary" onClick={() => handleClick(tool.name)}>{tool.actionLabel}</Button>
</CardContent>
</Card>
</Grid>
))}
</Grid>
);
}