// components/projects/ProjectsList.js
import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Link from 'next/link';

// Sample data.
const projects = [
  { id: 1, name: 'Web App Development', client: 'Client A', status: 'In Progress' },
  { id: 2, name: 'Mobile App Redesign', client: 'Client B', status: 'Completed' },
  { id: 3, name: 'API Integration', client: 'Client C', status: 'Overdue' },
];

export default function ProjectsList() {
  // Helper function to determine Chip color
  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'info';
      case 'Completed': return 'success';
      case 'Overdue': return 'error';
      default: return 'default';
    }
  };
  
  const handleDelete = (id) => {
    // Logic to handle project deletion
    console.log(`Deleting project ${id}`);
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        All Projects
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Project Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link href={`/projects/${project.id}`}>{project.name}</Link>
                </TableCell>
                <TableCell>{project.client}</TableCell>
                <TableCell>
                  <Chip label={project.status} color={getStatusColor(project.status)} size="small" />
                </TableCell>
                <TableCell align="right">
                  <Link href={`/projects/${project.id}/edit`}>
                    <IconButton aria-label="edit">
                      <EditIcon />
                    </IconButton>
                  </Link>
                  <IconButton aria-label="delete" onClick={() => handleDelete(project.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
