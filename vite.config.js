import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
const port = process.env.VITE_PORT || 3000;
const baseURL = process.env.VITE_API_BASE_URL|| 'https://jobtage.vercel.app';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:port,
    proxy:{
      '/api':{
        target:baseURL,
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  }
})
