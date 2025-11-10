// types/index.ts
export type UUID = string;

export interface RecruitmentPlan {
  id: UUID;
  title: string;
  department?: string;
  positions?: number;
  open_date?: string | null;
  close_date?: string | null;
  status?: string;
  notes?: string;
}

export interface JobOpening {
  id: UUID;
  plan?: UUID | null;
  job_code: string;
  title: string;
  location?: string;
  description?: string;
  salary_min?: number | null;
  salary_max?: number | null;
  created_at?: string;
}

export interface Applicant {
  id?: UUID;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  cv?: string | null;
  cover_letter?: string;
}

export interface JobApplication {
  id: UUID;
  applicant: Applicant;
  job: JobOpening;
  status: string;
  applied_at?: string;
  source?: string;
}

export interface Screening {
  id?: UUID;
  application: UUID;
  screener?: string;
  score?: number | null;
  notes?: string;
  passed?: boolean;
}

export interface InterviewFeedback {
  id?: UUID;
  application: UUID;
  interviewer?: string;
  interview_type?: string;
  date?: string;
  score?: number | null;
  strengths?: string;
  weaknesses?: string;
  decision_recommendation?: string;
}

export interface Employee {
  id?: UUID;
  application?: UUID | null;
  employee_code?: string;
  first_name: string;
  last_name: string;
  email: string;
  position?: string;
  start_date?: string | null;
}
