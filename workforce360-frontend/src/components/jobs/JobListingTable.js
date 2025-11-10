import { Typography, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';

export default function JobListingTable() {
  const jobs = [
    { id: 1, title: 'Senior Software Engineer', status: 'Open', age: '15 days' },
    { id: 2, title: 'Product Manager', status: 'Interviewing', age: '30 days' },
    { id: 3, title: 'UX Designer', status: 'Closed', age: '50 days' },
  ];

  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Active Job Listings
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Job Title</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Age</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{job.title}</TableCell>
              <TableCell>
                <Chip label={job.status} color={job.status === 'Open' ? 'primary' : 'default'} size="small" />
              </TableCell>
              <TableCell>{job.age}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}