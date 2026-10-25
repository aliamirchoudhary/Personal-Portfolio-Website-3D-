import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', '.ssr-temp', 'test-results', '.lh-temp', 'coverage']),
  {
    files: ['**/*.{js,jsx,mjs}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: [
      'api/**/*.js',
      'server/**/*.js',
      'tests/**/*.{js,mjs}',
      'scripts/**/*.{js,mjs}',
      '*config.js',
    ],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['shared/contact.js'],
    // Control characters are deliberately rejected at the server trust boundary.
    rules: { 'no-control-regex': 'off' },
  },
])
