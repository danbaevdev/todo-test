// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false, // SPA per ТЗ

  modules: ['@pinia/nuxt'],

  components: [{ path: '~/components', pathPrefix: false }],

  css: ['~/assets/styles/tokens.css', '~/assets/styles/base.css'],

  typescript: {
    strict: true,
    typeCheck: false,
  },

  app: {
    head: {
      title: 'Notes & Todo',
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },
})
