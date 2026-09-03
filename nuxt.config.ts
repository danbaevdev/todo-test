// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: {enabled: false},
  ssr: false, // SPA per ТЗ

  modules: ['@pinia/nuxt', '@nuxt/eslint'],

  components: [{path: '~/components', pathPrefix: false}],

  css: ['~/assets/styles/tokens.css', '~/assets/styles/base.css'],

  // Breakpoint tokens: inject @custom-media into every file, then resolve them.
  postcss: {
    plugins: {
      '@csstools/postcss-global-data': {
        files: ['app/assets/styles/breakpoints.css'],
      },
      'postcss-custom-media': {},
    },
  },

  typescript: {
    strict: true,
    typeCheck: false,
  },

  app: {
    // No route/layout animation — navigation is instant.
    pageTransition: false,
    layoutTransition: false,

    head: {
      title: 'Заметки',
      meta: [
        {
          name: 'viewport',
          // maximum-scale/user-scalable=no: stop iOS from zooming the whole
          // page when a field is focused. Fields are 16px so nothing is clipped.
          content:
            'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover',
        },
      ],
    },
  },
})
