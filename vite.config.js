/**
 * Configuración de Vite para el proyecto.
 * Define los plugins necesarios para soportar React y otras optimizaciones.
 */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // Plugin oficial de Vite para React con soporte para Fast Refresh
  plugins: [react()],
})
