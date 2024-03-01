import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
    base: '/sistema',
    root: './',
    build: {
        outDir: 'dist',
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    isCustomElement: (tag) => [
                        'box-icon',
                        'center',
                    ].includes(tag),
                },
                transformAssetUrls: {
                    includeAbsolute: false,
                },
            },
        }),
        VitePWA({
            registerType: 'autoUpdate',
            injectRegister: 'auto',
            workbox: {
                cleanupOutdatedCaches: true,
                globPatterns: ['**/*.{js,css,html,ico,png,jpg,svg,json,vue,txt,ttf}'],
                maximumFileSizeToCacheInBytes: 6130000,
            },
            manifest: {
                name: 'Rompiendo Armaduras | Admin',
                short_name: 'Rompiendo Armaduras',
                description: 'Portal de acceso administrativo de Rompiendo Armaduras',
                theme_color: '#991418',
                background_color: '#ffffff',
                display: 'standalone',
                lang: 'es',
                icons: [
                    {
                        src: '/sistema/favicon/pwa-icon-192x192.png',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: '/sistema/favicon/pwa-icon-256x256.png',
                        sizes: '256x256',
                        type: 'image/png',
                    },
                    {
                        src: '/sistema/favicon/pwa-icon-384x384.png',
                        sizes: '384x384',
                        type: 'image/png',
                    },
                    {
                        src: '/sistema/favicon/pwa-icon-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src/js'),
            '~': path.resolve(__dirname, './src/style'),
        },
        extensions: ['.js', '.ts', '.tsx', '.jsx', '.vue'],
    },
})
