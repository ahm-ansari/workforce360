// /utils/fetcher.ts
import axios from 'axios';
export const fetcher = (url: any) => axios.get(url).then((res) => res.data);


// README - Quick start
/*
1. Create a Next.js app (if not already): npx create-next-app@latest
2. Copy the files above into your project (pages/_app.tsx, pages/dashboard/index.tsx, components/*, utils/*)
3. Install dependencies: npm install @mui/material @mui/icons-material @mui/x-data-grid recharts react-calendar-heatmap swr axios
4. Start dev server: npm run dev


Notes & next steps:
- Replace placeholder data with API calls (use SWR + /utils/fetcher.ts).
- Add authentication, role-based access, and routing as needed.
- If you'd like, I can wire this scaffold to your Django REST API endpoints and generate the API hooks.
*/