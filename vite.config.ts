import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  // 根据环境变量设置 base 路径
  const base = process.env.VITE_BASE_PATH || './';
  
  return {
    // 设置基础路径，支持子目录部署
    base: base,
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), './src'),
      },
    },
    build: {
      // 输出目录
      outDir: 'dist',
      // 生成相对路径的资源引用
      assetsDir: 'assets',
      // 启用 CSS 代码分割
      cssCodeSplit: true,
      // 构建后是否生成 source map
      sourcemap: false,
      // 设置打包后的资源文件名格式
      rollupOptions: {
        output: {
          // 分包策略，避免单个文件过大
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            ui: ['lucide-react', 'class-variance-authority', 'clsx', 'tailwind-merge']
          },
          // 资源文件命名
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js'
        }
      },
      // 压缩选项
      minify: 'terser' as const,
      terserOptions: {
        compress: {
          drop_console: true, // 生产环境移除 console
          drop_debugger: true
        }
      }
    },
    server: {
      host: '0.0.0.0'
    }
  }
})
