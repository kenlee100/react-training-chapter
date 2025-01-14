/* eslint-disable no-undef */
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import url from 'url'


const __filename = url.fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig(({ mode }) => {
  const envDir = path.resolve(__dirname, '../') // 最外層環境變數路徑
  const env = loadEnv(mode, envDir, '')
  return {
    base: process.env.NODE_ENV === "production" ? `${env.VITE_BASE}/week3` : "/",
    plugins: [react()],
    envDir,
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@apis': path.resolve(__dirname, '../apis'),
        '@utils': path.resolve(__dirname, '../utils')
      }
    }
  }
})