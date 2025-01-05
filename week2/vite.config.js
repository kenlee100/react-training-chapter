import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import url from 'url'

const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '../'), // 最外層環境變數路徑
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@apis': path.resolve(__dirname, '../apis'),
      '@utils': path.resolve(__dirname, '../utils')
    }
  }
})