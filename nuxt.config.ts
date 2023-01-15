// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        '@nuxtjs/tailwindcss',
        '@vueuse/nuxt',
        'nuxt-icon',
    ],
    imports: {
        dirs: [
            'entity',
            'commands'
        ]
    },
    app: {
        head: {
            charset: 'utf-16',
            viewport: 'width=device-width, initial-scale=1',
            title: '✨ Hemera ✨',
            meta: [
              { name: 'description', content: 'Heroes of Ancient Legends Stat Calculator.' },
            ],
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/favicon.svg' },
            ]
        }
    }
})
