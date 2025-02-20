import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3005,
    strictPort: false,
    host: true,
    open: true,
    watch: {
      usePolling: true
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  // Expose environment variables to the client
  define: {
    'import.meta.env.VITE_VERTEX_AI_PROJECT_ID': JSON.stringify(process.env.VITE_VERTEX_AI_PROJECT_ID),
    'import.meta.env.VITE_VERTEX_AI_LOCATION': JSON.stringify(process.env.VITE_VERTEX_AI_LOCATION),
    'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(process.env.VITE_SUPABASE_URL),
    'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(process.env.VITE_SUPABASE_ANON_KEY)
  }
});