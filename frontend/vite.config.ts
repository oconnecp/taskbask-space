import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  server:{
    port: 3000,
    cors:{
      origin: 'http://localhost:5000',
      methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
  },
  plugins: [react()],
})
