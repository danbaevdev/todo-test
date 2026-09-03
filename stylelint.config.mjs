/** @type {import('stylelint').Config} */
export default {
  extends: ['stylelint-config-standard', 'stylelint-config-recommended-vue'],
  rules: {
    // BEM-ish class names (.block__el, .block--mod)
    'selector-class-pattern': null,
    // design-token custom properties (--color-*, --space-*, ...)
    'custom-property-pattern': null,
    // @custom-media lives in breakpoints.css
    'at-rule-no-unknown': [true, {ignoreAtRules: ['custom-media']}],
    'media-feature-name-value-no-unknown': null,
    // Vue scoped selectors
    'selector-pseudo-class-no-unknown': [
      true,
      {ignorePseudoClasses: ['deep', 'slotted', 'global']},
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {ignorePseudoElements: ['v-deep', 'v-slotted', 'v-global']},
    ],
    // we intentionally use modern functions
    'declaration-property-value-no-unknown': null,
    'no-descending-specificity': null,
    // keep real font names cased (BlinkMacSystemFont, SFMono-Regular, …)
    'value-keyword-case': null,
  },
}
