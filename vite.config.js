import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import compressPlugin from 'vite-plugin-compression'
// 国际化i18n
import scriptSetup from 'unplugin-vue2-script-setup/vite'
import VueI18n from '@intlify/unplugin-vue-i18n/vite'

// compress: 'gzip' | 'brotli' | 'none'
function configCompressPlugin(isBuild, compress) {
  const plugins = []
  if (!isBuild) return plugins
  const compressList = compress.split(',')
  if (compressList.includes('gzip')) {
    plugins.push(
      compressPlugin({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'gzip',
        ext: '.gz',
      }),
    )
  }
  if (compressList.includes('none')) {
    plugins.push(
      compressPlugin({
        verbose: true,
        disable: false,
        threshold: 10240,
        algorithm: 'brotliCompress',
        ext: '.br',
      }),
    )
  }
  return plugins
}

export default ({ mode }) => {
  const isBuild = mode === 'production' // mode == production
  const port = 8080 // dev port
  return defineConfig({
    plugins: [
      createVuePlugin(),
      vueJsx(),
      scriptSetup(),
      VueI18n({
        bridge: true,
      }),
      createSvgIconsPlugin({
        iconDirs: [resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[dir]-[name]',
      }),
      // ...configCompressPlugin(isBuild, 'gzip'),
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    base: './',
    server: {
      port,
      open: true,
      hmr: { overlay: false },
      host: '0.0.0.0',
      proxy: {
        '/api': {
          target: 'http://119.91.150.211:8080/heimamm/public',
          // target: 'http://127.0.0.1/heimamm/public',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: false,
      chunkSizeWarningLimit: 1000,
      // rollupOptions: {
      //   output: {
      //     chunkFileNames: 'static/js/[hash].js',
      //     entryFileNames: 'static/js/[hash].js',
      //     assetFileNames: 'static/css/[hash].[ext]',
      //     manualChunks(id) {
      //       // 静态资源分拆打包
      //       if (id.includes('node_modules')) {
      //         return id.toString().split('node_modules/')[1].split('/')[0].toString()
      //       }
      //     },
      //   },
      // },
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: isBuild, // 打包时删除log
          drop_debugger: isBuild, // 打包时删除debugger
          pure_funcs: isBuild ? ['console.log'] : [],
        },
        output: {
          comments: isBuild, // 去掉注释
        },
      },
    },
  })
}
