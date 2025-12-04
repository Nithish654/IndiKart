import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // load all env vars (including VITE_*)
  const env = loadEnv(mode, process.cwd(), '');

  return {
    // IMPORTANT — set this to your repo name for project GitHub Pages
    // If your repository is https://github.com/Nithish654/IndiKart
    // the base should be "/IndiKart/"
    base: '/IndiKart/',

    server: {
      port: 3000,
      host: '0.0.0.0',
    },

    plugins: [react()],

    // Make a safe mapping so any "process.env..." usage (or global replacement)
    // picks up VITE_ values at build time.
    define: {
      // Gemini / Google key (client-side)
      'process.env.VITE_GEMINI_API_KEY': JSON.stringify(env.VITE_GEMINI_API_KEY ?? ''),
      // Supabase
      'process.env.VITE_SUPABASE_URL': JSON.stringify(env.VITE_SUPABASE_URL ?? ''),
      'process.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(env.VITE_SUPABASE_ANON_KEY ?? ''),
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
  };
});
