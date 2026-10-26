import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Ensure files in Gambar/ are automatically mirrored into public/Gambar/
try {
  const rootGambar = path.resolve(__dirname, 'Gambar')
  const publicGambar = path.resolve(__dirname, 'public/Gambar')
  if (fs.existsSync(rootGambar)) {
    if (!fs.existsSync(publicGambar)) {
      fs.mkdirSync(publicGambar, { recursive: true })
    }
    const files = fs.readdirSync(rootGambar)
    for (const f of files) {
      const srcFile = path.join(rootGambar, f)
      const destFile = path.join(publicGambar, f)
      if (fs.statSync(srcFile).isFile()) {
        if (!fs.existsSync(destFile) || fs.statSync(srcFile).mtimeMs > fs.statSync(destFile).mtimeMs) {
          fs.copyFileSync(srcFile, destFile)
        }
      }
    }
  }
} catch (e) {
  console.error('Error syncing Gambar folder:', e)
}

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['pixi.js'],
  },
})

