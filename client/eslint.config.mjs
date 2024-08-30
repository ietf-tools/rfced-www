// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt({
  rules: {
    'vue/multi-word-component-names': 'off',
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/comma-dangle': 'off',
    '@stylistic/comma-dangle': 'off',
    'vue/html-self-closing': 'off',
    'vue/html-closing-bracket-newline': 'off',
    '@stylistic/member-delimiter-style': [
      'error',
      {
        singleline: {
          delimiter: 'semi',
          requireLast: false
        },
        multiline: {
          delimiter: 'none',
          requireLast: false
        },
        multilineDetection: 'brackets'
      }
    ]
  }
})
