// https://medium.com/@gogl.alex/how-to-properly-set-up-eslint-with-prettier-for-vue-or-nuxt-in-vscode-e42532099a9c

module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
  },
  extends: [
    'plugin:vue/recommended',
    'eslint:recommended',
    'prettier/vue',
    // This will start reading .prettierrc.json.
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    parser: 'babel-eslint',
  },
  globals: {
    firebase: true,
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'max-len': ['warn', { code: 100, ignoreStrings: true }],
    'vue/max-len': ['warn', { code: 100, ignoreStrings: true }],
    'vue/component-tags-order': ['off', { order: ['template', 'style', 'script'] }],
    'vue/order-in-components': 'off',
    'vue/no-v-html': 'off',
    'prefer-const': 'warn',
    quotes: [2, 'single', {}],
  },
};
