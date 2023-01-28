module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:vue/base',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    // 放到最后，禁用和prettier冲突的规则
    'prettier',
  ],
  parser: 'vue-eslint-parser',
  // For <script>
  parserOptions: {
    parser: '@typescript-eslint/parser',
    // tsconfigRootDir: __dirname,
    // project: ['./tsconfig.json'],
  },
  ignorePatterns: ['.eslintrc.cjs'],
  rules: {
    quotes: [1, 'single'],
  },
}
