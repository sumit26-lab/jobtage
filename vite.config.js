import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const baseURL = process.env.VITE_API_BASE_URL|| 'https://jobtage.vercel.app';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server:{
    port:3000,
    proxy:{
      '/api':{
        target:baseURL,
        changeOrigin:true,
        rewrite:(path)=>path.replace(/^\/api/,'')
      }
    }
  }
})
