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
    // Mantém sua configuração de CSS
    cssCodeSplit: false,
    
    // Mantém sua configuração de imagens em Base64
    assetsInlineLimit: 10000000, 
    
    rollupOptions: {
      // Necessário para garantir que o build gere um arquivo único para o IIFE funcionar
      input: {
        index: resolve(__dirname, 'index.html'), 
      },
      output: {
        // --- AQUI ESTÁ A CORREÇÃO ---
        // Muda de 'es' (padrão) para 'iife' para isolar o escopo das variáveis
        format: 'iife', 
        
        // Define um nome para a variável global da sua extensão (obrigatório para IIFE)
        name: 'MinhaExtensaoVue', 

        // Mantém seus nomes de arquivos previsíveis
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]',
        
        // Garante que não crie chunks separados que quebrariam o IIFE
        inlineDynamicImports: true, 
      }
    }
  }
})