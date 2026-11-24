import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' supaya bundle jalan di GitHub Pages (/Defisit-Harian/) sekaligus di WebView Capacitor.
export default defineConfig({ plugins: [react()], base: './', build: { target: 'es2020' } });
