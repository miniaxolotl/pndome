module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: [],
  extends: ['next', 'next/core-web-vitals', 'plugin:react/recommended'],
  env: {
    es6: true,
    browser: true,
    jest: true,
    node: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/jsx-filename-extension': ['error', { extensions: ['.ts', '.tsx'] }],
    'react/display-name': 'error',
    'react/prop-types': 'error',
  },
};
