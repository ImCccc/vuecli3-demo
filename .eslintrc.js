// https://eslint.org/docs/user-guide/configuring
module.exports = {
  root: true,

  parserOptions: {
    parser: 'babel-eslint'
  },

  env: {
    browser: true
  },

  extends: [
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    'plugin:vue/essential',
    // https://github.com/standard/standard/blob/master/docs/RULES-en.md
    'standard'
  ],

  // required to lint *.vue files
  plugins: ['vue'],

  rules: {
    // function 的小括号之前必须要有空格
    'space-before-function-paren': 'off',
    // 文件最后一行必须有一个空行
    'eol-last': 'off',
    // 禁止行尾有空格
    'no-trailing-spaces': 'off',
    // 定义过的变量必须使用
    'no-unused-vars': 1,
    // 对象的最后一个属性末尾必须有逗号
    'comma-dangle': 'off',
    // 允许用字面量{}抛出异常
    'no-throw-literal': 0,
    // 箭头函数只有一个参数的时候，必须加括号
    'arrow-parens': 'off',
    // 语句强制分号结尾
    'semi': [2, 'always'],
    // 缩进风格: 一个缩进必须用2个空格替代
    'indent': [1, 2, { 'SwitchCase': 1 }],
    // 一个let或者var只能声明一个变量
    'one-var': ['error', 'never'],
    // 禁止使用debugger
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}