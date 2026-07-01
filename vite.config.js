import { defineConfig } from 'vite';

export default defineConfig({
    server: {
        allowedHosts: true
    },
    base: './',                   
    build: {
        outDir: 'dist',
        minify: 'terser',            
        terserOptions: {
            compress: {
                drop_console: true,     
            },
            mangle: true
        },
        rollupOptions: {
            input: {
                main: 'index.html'
            },
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash].[ext]'
            }
        }
    }
});