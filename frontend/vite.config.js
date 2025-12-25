import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite' // Ye import karein
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Ye plugin yahan add karein
  ],
})