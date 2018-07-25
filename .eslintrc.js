module.exports = {
  extends: ['eslint:recommended'],
  rules: {
    'no-console': [
      'error',
      {
        allow: ['warn', 'error', 'info']
      }
    ]
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'script'
  },
  // 全局变量
  globals: {
    // "window": true
  },
  env: {
    browser: false,
    node: true,
    es6: true,
    mocha: true
  }
}
