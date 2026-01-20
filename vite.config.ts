import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    }
  },
  build: {
    // Injeta CSS no JS ou emite arquivo único (vamos controlar isso no main.ts)
    cssCodeSplit: false, 
    // Força imagens < 10MB a serem convertidas para Base64 (resolve problema de imagens quebradas)
    assetsInlineLimit: 10000000, 
    rollupOptions: {
      output: {
        // Garante nomes de arquivos previsíveis para o manifest
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
      }
    }
  }
})