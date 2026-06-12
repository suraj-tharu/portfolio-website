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
  globals: {
    THREE: 'readonly',
    gsap: 'readonly',
    AOS: 'readonly',
    Lenis: 'readonly',
    monaco: 'readonly',
    Chart: 'readonly',
    d3: 'readonly',
    io: 'readonly',
    ScrollTrigger: 'readonly',
    L: 'readonly',
    GitHubCalendar: 'readonly',
    QRCode: 'readonly'
  },
  rules: {
    // Keep reasonable defaults
    'no-unused-vars': 'warn',
    'no-undef': 'error',
    'no-empty': 'warn',
    'no-inner-declarations': 'warn',
    'no-redeclare': 'warn',
    'no-useless-escape': 'warn'
  }
};
