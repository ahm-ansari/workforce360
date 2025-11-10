export interface User {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  is_employee: boolean;
  is_jobseeker: boolean;
  is_admin: boolean;
  date_joined: string;
  groups: string[];
  role: string;
  avatarUrl?: string;
}
