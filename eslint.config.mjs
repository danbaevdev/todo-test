import withNuxt from './.nuxt/eslint.config.mjs'
import prettier from 'eslint-config-prettier'

export default withNuxt(
  {
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/no-multiple-template-root': 'off',
      // optional props (`?`) are legitimately `undefined`
      'vue/require-default-prop': 'off',
      '@typescript-eslint/no-explicit-any': 'error',
    },
  },
  // keep last: turn off rules that conflict with Prettier
  prettier,
)
