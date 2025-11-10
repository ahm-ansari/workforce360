import { Typography, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Chip } from '@mui/material';

export default function StaffListTable() {
  // Sample data for the staff list. This should be replaced with data fetched dynamically.
  const staff = [
    { id: 1, name: 'Jane Doe', role: 'Software Engineer', status: 'Active' },
    { id: 2, name: 'John Smith', role: 'UX Designer', status: 'Active' },
    { id: 3, name: 'Emily White', role: 'Project Manager', status: 'On Leave' },
  ];

  // Helper function to determine the Chip color based on the staff member's status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'On Leave':
        return 'warning';
      case 'Terminated':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        My Staff
      </Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {staff.map((member) => (
              <TableRow key={member.id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.role}</TableCell>
                <TableCell>
                  <Chip
                    label={member.status}
                    color={getStatusColor(member.status)}
                    size="small"
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
