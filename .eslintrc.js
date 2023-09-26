module.exports = {
  extends: ['plugin:vue/vue3-essential', 'airbnb-base'],
  // parser: 'vue-eslint-parser',
  parserOptions: {
    parser: 'espree',
    ecmaVersion: 2021,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  globals: {
    defineProps: 'readonly',
    defineEmits: 'readonly',
    defineExpose: 'readonly',
    withDefaults: 'readonly',
  },
  env: {
    browser: true,
    es6: true,
    commonjs: true,
    node: true,
  },
  plugins: ['vue'],
  rules: {
    // 自己配置的规则
    indent: ['off', 2],
    'no-tabs': 'off',
    'no-unused-vars': [
      0,
      {
        vars: 'all', // "local",允许声明未使用变量
        args: 'all', // 检查所有参数
      },
    ],
    quotes: ['error', 'single', { allowTemplateLiterals: true }], // 字符串使用单引号/模版字符串
    'import/no-absolute-path': 0, // 关闭不能使用绝对路径导入模块 @ 别名
    'import/no-unresolved': 0, // 关闭不能使用 @ 导入模块
    'no-multi-assign': 0, // 关闭不能使用 三元
    'max-len': 0,
    'no-return-assign': 0,
    'no-sequences': 0,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
    'consistent-return': 0,
    'no-console': 0,
    'no-empty': 0,
    'no-nested-ternary': 0,
    'prefer-destructuring': 0,
    'import/no-extraneous-dependencies': 0,
    'no-undef': 0,
    'import/extensions': 0,
    'no-unused-expressions': 0,
    'array-callback-return': 0,
    'vue/no-parsing-error': 0,
    'require-await': 0,
    camelcase: 'off', // 不检查属性名称
    'vue/comment-directive': [
      0,
      {
        reportUnusedDisableDirectives: false,
      },
    ],
    'no-use-before-define': ['error', { functions: false, classes: true }], // 允许声明位置
    'no-restricted-globals': 0, // 关闭不能使用 isNaN 等方法
    'no-param-reassign': [
      0,
      {
        props: true,
        ignorePropertyModificationsFor: ['e', 'global', 'state', 'item', 'child', 'curr', 'next', 'type', 'val', 'params', 'store', 'instance'],
      },
    ],
  },
  overrides: [
    {
      files: ['*.vue'],
      rules: {
        // 这里写覆盖vue文件的规则
        'vue/no-mutating-props': 0,
        'vue/no-parsing-error': 0,
      },
    },
  ],
};
