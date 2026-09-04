import {fileURLToPath} from 'node:url'
import {defineConfig} from 'vitest/config'
import {defineVitestProject} from '@nuxt/test-utils/config'

const alias = {
  '~': fileURLToPath(new URL('./app', import.meta.url)),
  '@': fileURLToPath(new URL('./app', import.meta.url)),
}

export default defineConfig({
  resolve: {alias},
  test: {
    projects: [
      {
        // Pure logic — fast Node environment.
        resolve: {alias},
        test: {
          name: 'unit',
          environment: 'node',
          include: ['test/*.spec.ts'],
        },
      },
      // Component tests that need Nuxt auto-imports, router and app context.
      await defineVitestProject({
        test: {
          name: 'nuxt',
          environment: 'nuxt',
          include: ['test/nuxt/**/*.spec.ts'],
        },
      }),
    ],
  },
})
