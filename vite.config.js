import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173, // Default port
    allowedHosts: ['all', '9c52-165-222-185-225.ngrok-free.app', 'localhost']
  },
})
