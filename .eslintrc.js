/*
 * @Author: zengzijian
 * @Date: 2019-08-12 14:36:03
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 15:28:13
 * @Description: 语法规则和代码风格的检查配置定义（目标是保证代码的一致性和避免错误。）
 */
module.exports = {
    "parser": 'babel-eslint',
    "env": {
        "browser": true,
        "es6": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:react/recommended"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "no-dupe-class-members": "off",
        "react/prop-types": "off",
        "react/no-deprecated": "off"
    }
};