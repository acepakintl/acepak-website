import { defineConfig } from 'vite';

// Vite settings for the AcePak website.
// Vercel detects Vite automatically: build command "npm run build", output folder "dist".
export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
