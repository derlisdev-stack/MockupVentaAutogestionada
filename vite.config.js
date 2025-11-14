import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/MockupVentaAutogestionada/', // IMPORTANTE para GitHub Pages
})
