// pages/projects/[id].js
import { useRouter } from 'next/router';
import { Paper, Typography } from '@mui/material';
import AdminLayout from '@/components/layout/AdminLayout';

export default function ProjectDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  
  // In a real application, fetch project data based on the `id`
  const project = { id, name: `Project ${id}`, details: `Details for project ${id}.` };

  if (!project) {
    return <Typography>Project not found.</Typography>;
  }

  return (
    <AdminLayout>
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Project Details for: {project.name}
      </Typography>
      <Typography variant="body1">
        {project.details}
      </Typography>
    </Paper>
    </AdminLayout>
  );
}
