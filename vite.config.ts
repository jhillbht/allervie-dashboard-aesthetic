import { defineConfig, type UserConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

const config: UserConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    target: ['es2022', 'edge89', 'firefox89', 'chrome89', 'safari15'],
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      format: {
        comments: false
      },
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase-vendor': ['@supabase/supabase-js'],
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-select',
            '@radix-ui/react-slot',
            '@radix-ui/react-toast'
          ],
          'chart-vendor': ['recharts']
        }
      }
    }
  },
  server: {
    port: 8080,
    host: true,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'DENY'
    }
  },
  preview: {
    port: 8080,
    strictPort: true,
    headers: {
      'Cache-Control': 'no-store',
      'X-Frame-Options': 'DENY'
    }
  }
} as const;

export default defineConfig(config);