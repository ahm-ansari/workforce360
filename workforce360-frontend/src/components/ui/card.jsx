import React from "react";
import { Card, CardActionArea, CardContent, CardHeader, Typography, CardMedia } from "@mui/material";
import { FormatBold } from "@mui/icons-material";

export const CardUX = ({title, value, icon, color, children, className = "" }) => (
  // Style of the card should be bg-white rounded-xl shadow p-5
  <Card sx={{ bgcolor: 'background.paper', boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)', borderRadius: '8px', mb: 2, mt: 2, p:1}} className={` ${className}`}>
      <CardActionArea>
        <CardHeaderUX title={title} icon={icon} />     
        <CardMedia sx={{position:'absolute', right:'4px', padding:'20px',bgcolor: `${color}`, width:'100px', height:'100px', borderRadius:'20%', color:'text.secondary'}} className={`${className}`} > {icon}</CardMedia>
        <CardContentUX value={value}>
          {children}
        </CardContentUX>
      </CardActionArea>
    </Card>
);

export const CardHeaderUX = ({title="title", children, className = "" }) => (
  
    <Typography sx={{mt:2, ml:2, mb:0}} className={`${className}`}  color="primary" gutterBottom>
      {title}
    {children}
  </Typography>
  
);

export const CardContentUX = ({value, children, className = "" }) => (
  <CardContent className={` ${className}`}>
    <Typography variant="h4" component="p">{value}</Typography>
    {children}
  </CardContent>
);

