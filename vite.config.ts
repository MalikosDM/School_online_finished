import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/send-email': {
        target: 'https://n8n.srv1271485.hstgr.cloud',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/send-email/, '/webhook/get-email'),
      },
    },
  },
})
