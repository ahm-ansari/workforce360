// app/jobs/[id]/page.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import api from '@/lib/api';
import { JobOpening, Applicant } from '@/types';
import AdminLayout from '@/components/layout/AdminLayout';
import { Box, Typography } from '@mui/material';

type FormValues = {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  cover_letter?: string;
  cv?: FileList;
}

export default function JobDetail() {
  
  const [job, setJob] = useState<JobOpening | null>(null);
  const router = useRouter();
  const id = router.query;

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();


  useEffect(() => {
    api.get(`/jobs/${id}/`).then(r => setJob(r.data)).catch(console.error);
  }, [id]);

  const onSubmit = async (data: FormValues) => {
    try {
      // Step 1: create applicant (multipart for CV)
      const fd = new FormData();
      fd.append('first_name', data.first_name);
      fd.append('last_name', data.last_name);
      fd.append('email', data.email);
      if (data.phone) fd.append('phone', data.phone);
      if (data.cover_letter) fd.append('cover_letter', data.cover_letter);
      if (data.cv && data.cv[0]) fd.append('cv', data.cv[0]);

      const applicantResp = await api.post('/applicants/', fd, { headers: { 'Content-Type': 'multipart/form-data' }});
      const applicant: Applicant = applicantResp.data;

      // Step 2: create application referencing applicant & job
      await api.post('/applications/', {
        job: id,
        applicant: { id: applicant.id },
        source: 'website'
      });

      router.push('/applications');
    } catch (err: any) {
      console.error(err);
      alert('Failed to submit application');
    }
  };

  if (!job) return <AdminLayout title="Job not found" user={user}> <Box component='section' sx={{display:'flex'}}> <Typography variant="h6" color="error" m={4}> Job not found. </Typography> </Box> </AdminLayout>;

  return (
    <div className="space-y-4">
      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold">{job.title}</h2>
        <p className="text-slate-600 mt-2">{job.description}</p>
        <p className="mt-3 text-sm">Location: {job.location ?? 'Remote'}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6 rounded shadow space-y-4">
        <h3 className="font-semibold">Apply for this job</h3>

        <div className="grid sm:grid-cols-2 gap-3">
          <input {...register('first_name', { required: true })} placeholder="First name" className="p-2 border rounded" />
          <input {...register('last_name', { required: true })} placeholder="Last name" className="p-2 border rounded" />
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          <input {...register('email', { required: true })} placeholder="Email" className="p-2 border rounded" />
          <input {...register('phone')} placeholder="Phone (optional)" className="p-2 border rounded" />
        </div>

        <textarea {...register('cover_letter')} placeholder="Cover letter (optional)" className="w-full p-2 border rounded" />

        <div>
          <label className="block text-sm">Upload CV</label>
          <input type="file" {...register('cv')} className="mt-1" />
        </div>

        <div>
          <button type="submit" disabled={isSubmitting} className="bg-blue-600 text-white px-4 py-2 rounded">
            {isSubmitting ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>
      </form>
    </div>
  )
}
