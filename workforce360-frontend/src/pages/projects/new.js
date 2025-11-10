// pages/projects/new.js
import { Paper, Typography, TextField, Button, Box } from '@mui/material';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function NewProjectPage() {
  const [formData, setFormData] = useState({ name: '', client: '' });
  const router = useRouter();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting new project:', formData);
    // Add logic to save the new project via an API call
    router.push('/projects');
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Create New Project
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <TextField
          name="name"
          label="Project Name"
          value={formData.name}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          name="client"
          label="Client"
          value={formData.client}
          onChange={handleChange}
          fullWidth
          required
        />
        <Button type="submit" variant="contained">Create Project</Button>
      </Box>
    </Paper>
  );
}
