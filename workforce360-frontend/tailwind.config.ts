// tailwind.config.ts
import type { Config } from 'tailwindcss';
import { createTheme } from '@mui/material/styles';

// Note: This is a utility to get M-UI theme tokens
const muiTheme = createTheme();

const config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/modules/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // 1. Disable preflight to use MUI's CssBaseline
  corePlugins: {
    preflight: false,
  },
  // 2. Add MUI theme tokens to Tailwind
  theme: {
    extend: {
      colors: {
        primary: muiTheme.palette.primary,
        secondary: muiTheme.palette.secondary,
      },
    },
  },
  plugins: [],
};
export default config as unknown as Config;