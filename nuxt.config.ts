// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // SPA per ТЗ

  modules: ['@pinia/nuxt'],

  css: ['~/assets/styles/main.scss'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/styles/_tokens.scss" as *;\n@use "~/assets/styles/_mixins.scss" as *;\n',
        },
      },
    },
  },

  app: {
    head: {
      title: 'Notes & Todo',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
