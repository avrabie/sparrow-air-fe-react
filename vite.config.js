import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Default port
    allowedHosts: ['d8f8-2a02-21b4-b461-5c00-c828-82db-ef7b-f50a.ngrok-free.app', 'localhost']
  },
})
