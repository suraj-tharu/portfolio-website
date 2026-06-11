module.exports = {
  env: {
    node: true,
    es2021: true,
    browser: true
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module'
  },
  rules: {
    'no-unused-vars': 'off',
    'no-undef': 'off',
    'no-empty': 'off'
  }
};
