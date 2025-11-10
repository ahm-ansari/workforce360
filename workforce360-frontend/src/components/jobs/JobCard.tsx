// components/JobCard.tsx
import Link from 'next/link';
import { JobOpening } from '@/types';
import {  Box, Grid, Paper,Typography,} from '@mui/material';
import MuiLink from '@mui/material/Link';

export default function JobCard({ job }: { job: JobOpening }) {
  return (
    <Grid size = {{xs: 12, md: 4, lg: 3}}>
    <Paper components="article" sx={{m: 2,
        bgcolor: 'background.paper', // Uses the theme's white color
        p: 4,                        // Padding
        borderRadius: 1,             // Rounded corners
        boxShadow: 1,                // Small shadow
     }}>
        <Typography
      variant="h3" // This uses the default h3 styles from the theme
      component="h3" // Ensures the underlying HTML element is <h3> for semantics
      sx={{
        fontSize: '1.125rem', // text-lg equivalent
        fontWeight: 600,      // font-semibold equivalent
      }}
    >
      {job.title}
    </Typography>
     <Typography
        variant="body2" // text-sm
        sx={{
          color: 'text.secondary', // text-slate-600 (uses theme secondary text color)
          mt: 0.5, // Small top margin for spacing
        }}
      >
        {job.location ?? 'Remote'}
      </Typography>
      <Typography
        variant="body2" // text-sm
        sx={{
          mt: 2, // mt-2 (default spacing 2 = 16px)
        }}
      >
        {job.description ? job.description.slice(0, 140) + '...' : ''}
      </Typography>
       <Box
        sx={{
          mt: 4, // mt-4
          display: 'flex', // flex
          justifyContent: 'space-between', // justify-between
          alignItems: 'center', // items-center
        }}
      >
         <Typography
          variant="caption" // text-xs
          sx={{
            color: 'text.disabled', // text-slate-500 (uses theme disabled text color)
          }}
        >
          Code: {job.job_code}
        </Typography>
        <Link
          href={`/jobs/${job.id}`}
          className="ViewApplyLink" // You can keep this class or move all styles to sx
        >
        <MuiLink
            component="span" // Use span to wrap text in MUI Link for custom styles
            sx={{
              fontSize: '0.875rem', // text-sm
              color: 'white', // text-white
              bgcolor: 'primary.main', // bg-blue-600 (uses theme primary color)
              px: 3, // px-3
              py: 1, // py-1
              borderRadius: 1, // rounded
              textDecoration: 'none', // Remove underline
              '&:hover': {
                bgcolor: 'primary.dark', // Optional hover effect
              },
            }}
          >
            View & Apply
          </MuiLink>
        </Link>
      </Box>


    </Paper>
    </Grid>
  )
}
