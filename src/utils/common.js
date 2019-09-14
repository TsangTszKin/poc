/* eslint-disable no-useless-escape */
/* eslint-disable no-undef */
/* eslint-disable no-control-regex */
/*
 * @Author: zengzijian
 * @Date: 2018-09-08 10:28:00
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-22 13:51:00
 * @Description: 常用工具方法
 */
import { DatePicker, Input, Select } from "antd";
import React from "react";
import publicUtils from "@/utils/publicUtils";
import moment from 'moment';

export default {
    /**
     * 深度拷贝，适用于任何类型，针对于引用类型如数组，对象，函数（其实函数和数据也属于object，这里描述易于理解和区分）
     * PS:对象的简易克隆小技巧：var tmpObj = JSON.parse(JSON.stringify(传入对象)); 把应用类型序列化之后，变成了基本类型，基本类型不具有引用类型的地址引用特性，再把序列化猴的字符串反序列化为对象即可
     * @param {*} obj
     * @returns
     */
    deepClone(obj) {
        var o;
        if (typeof obj == "object") {
            if (obj === null) {
                o = null;
            } else {
                if (obj instanceof Array) {
                    o = [];
                    for (var i = 0, len = obj.length; i < len; i++) {
                        o.push(this.deepClone(obj[i]));
                    }
                } else {
                    o = {};
                    for (var j in obj) {
                        o[j] = this.deepClone(obj[j]);
                    }
                }
            }
        } else {
            o = obj;
        }
        return o;
    },
    loading: {
        show() {
            if (window.layer) {
                layer.load(2, {
                    shade: [0.2, '#fff']
                });
            }
        },
        hide() {
            if (window.layer) {
                layer.closeAll('loading');
            }
        }
    },
    /**
     * 下拉选择增加无选项，并列为第一项
     * @param {Array} selectData
     * @returns
     */
    appendSelectData(selectData) {
        if (selectData instanceof Array) {
            if (selectData.length === 0) {
                return [{ code: '', value: '无' }]
            } else {
                console.log('bingo')
                console.log(selectData)
                let tempArray = [];
                selectData.forEach(element => {
                    if (selectData.code != '') tempArray.push(element);
                })
                console.log(tempArray.splice(0, 0, { code: '', value: '无' }))
                // return tempArray.splice(0, 0, { code: '', value: '无' })
            }
        } else {
            return [{ code: '', value: '无' }]
        }

    },
    getGuid() {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }
        return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
    },
    /**
     * 空判断
     * @param {*} value
     * @returns
     */
    isEmpty(value) {
        let result = false;
        if (value === null || value === undefined) {
            result = true;
        }
        if (typeof value === 'string' && (value.replace(/\s+/g, "") === "" || value === "")) {
            result = true;
        }
        if (typeof value === "object" && value instanceof Array && value.length === 0) {
            result = true;
        }
        return result;
    },
    /**
     * code暂支持：GB2312，GBK，GB18030，ISO-8859-1，UTF-8，ASCII，Unicode
     * 根据当前编码和字符串，返回字符串对应的字节长度
     * @param {*} code
     */
    getByteLength(str, code) {
        let chineseSeize;
        let length;
        code = 'UTF-8';
        switch (code) {
            case 'GB2312':
                chineseSeize = 'aa'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length;
                break;
            case 'GBK':
                chineseSeize = 'aa'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length;
                break;
            case 'GB18030':
                chineseSeize = 'aa'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length;
                break;
            case 'ISO-8859-1':
                chineseSeize = 'a'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length;
                break;
            case 'UTF-8':
                chineseSeize = 'aaa'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length;
                break;
            case 'ASCII':
                chineseSeize = 'aa'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length;
                break;
            case 'Unicode':
                chineseSeize = 'a'
                length = str.replace(/[^\u0000-\u00ff]/g, chineseSeize).length * 2;
                break;

            default:
                break;
        }
        return length
    },
    /**
     * 过滤特殊字符 中英文数字和下划线
     * @param {*} s
     * @returns
     */
    stripscript(s) {
        var regHg = new RegExp("^[\u4e00-\u9fa5A-Za-z0-9-\_]+$")
        var rs = "";
        for (var i = 0; i < s.length; i++) {
            rs = rs + (regHg.test(s.substr(i, 1)) ? s.substr(i, 1) : '')
        }
        return rs;
    },
    /**
     * 校验字符串是否全是:中英文数字和下划线
     *
     * @param {string} s
     * @returns
     */
    testString(s) {
        console.log(s)
        var regHg = new RegExp("^[\u4e00-\u9fa5A-Za-z0-9-\_()（）]+$")
        return regHg.test(s)
    },
    /**
     * 校验字符串是否全是:英文数字和下划线
     *
     * @param {string} s
     * @returns
     */
    testCode(s) {
        console.log(s)
        var regHg = new RegExp("^[a-zA-Z]([-_a-zA-Z0-9])+$")
        return regHg.test(s)
    },
    /**
     * 字符串转数组
     * @param {*} value
     * @returns
     */
    stringToArray(value) {
        if (this.isEmpty(value)) return []
        if (typeof value !== 'string') return []
        if (value.indexOf(",") < 0) return [value]
        let array = value.split(",");
        return array
    },
    /**
     * 数组转字符串
     * @param {*} value
     * @returns
     */
    arrayToString(value) {
        if (typeof value == "object" && value instanceof Array) {
            if (value.length == 0) return ""
            let str = '';
            value.forEach(element => {
                str += element + ',';
            })
            return str.substr(0, str.length - 1);
        } else {
            return ""
        }
    },
    /**
     * 格式化时间 时间戳 转 yyyy-MM-dd hh:mm:ss
     * @param {*} time
     * @returns
     */
    formatTime(time) {
        //   格式：yyyy-MM-dd hh:mm:ss或者yyyy-MM-ddThh:mm:ss.xxx+xxx
        if (time === undefined) return '';
        const tempTime = time.replace('T', ' ');
        let date = new Date(tempTime);
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() + ':' : date.getMinutes() + ':';
        let s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
        return Y + M + D + h + m + s;
    },
    getCurrentTimeString() {
        var date = new Date();
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '';
        return Y + M + D;
    },
    getCurrentMonthStartTime() {
        var date = new Date();
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = '01 ';
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return Y + M + D + '00:00'
    },
    getCurrentMonthEndTime() {
        var date = new Date();
        date.setTime(date.getTime() + 24 * 60 * 60 * 1000);

        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() < 10 ? '0' + date.getDate() + ' ' : date.getDate() + ' ';
        let h = date.getHours() < 10 ? '0' + date.getHours() + ':' : date.getHours() + ':';
        let m = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes();
        return Y + M + D + '00:00'
    },
    /**
     * 字符串限制长度，超出部分显示为省略号，默认最大长度20
     */
    stringLimitEllipsis(str, maxLength = 20) {
        if (!this.isEmpty(str)) {
            return str.length > maxLength ? String(str).substr(0, maxLength) + '...' : str;
        }
    },
    /**
     * 字符串限制长度，超出部分显示为省略号，默认最大长度20汉字
     */
    cutString(str, maxLength = 20) {
        if (typeof str === 'string') {
            let i = 0; // 截取结束index
            let bLength = 0;
            // 也许少一个字节，但不会超出一个字节
            let bMaxLength = maxLength * 2 - 1;
            let flag = true; // 是否在范围内
            while (str[i] !== undefined && flag) {
                // 简单判断，ascii 0-255为1字节，否则为2字节
                bLength += /[\x00-\xff]/.test(str[i]) ? 1 : 2;
                flag = bLength < bMaxLength;
                i++;
            }
            let result = flag ? str : str.substr(0, i) + '...';
            return result;
        } else {
            return '';
        }
    },

    /**
     *判断当前对象是否数组类型（es5），如果用es6方法，可以直接用es6的Array.isArray() 判断
     *
     * @param {*} array
     * @returns
     */
    isArray(array) {
        return Object.prototype.toString.call(array) === '[object Array]';
    },
    /**
     * 数字每三位加逗号
     * @param numberOrString
     * @returns {string}
     */
    formatNumber(numberOrString) {
        let str = String(numberOrString);
        let reg = str.indexOf(".") > -1 ? /(\d)(?=(\d{3})+\.)/g : /(\d)(?=(?:\d{3})+$)/g;
        return str.replace(reg, "$1,");
    },
    /**
     *
     * 根据参数名，获取当前url的查询参数值
     * @param {string} paramName 
     * @returns
     */
    getParamByName(paramName) {
        var reg = new RegExp("(^|&)" + paramName + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]); return null;
    },
    /**
     * FormItem输入生成器
     * 使用例子
     * const inputGenerator = common.inputGenerator.call(this);
     * // inputGenerator的参数分别是( 输入框name，输入类型，{ 默认值，校验规则, 标签（label） } )
     * let setDefaultValueInput = inputGenerator('defaultValue', this.props.store.saveData.getType,
     *      { initialValue: this.props.store.saveData.getDefaultValue, label: '默认值' });
     * <FormItem label="默认值">{ setDefaultValueInput }</FormItem>
     * @returns {function(*=, *=, *): *}
     */
    inputGenerator() {
        const { getFieldDecorator } = this.props.form;
        let options = {};
        return function (name, type, {
            initialValue = '',
            rules = [],
            // label = '',
            onChange = () => { },
            required = true,
        } = {}) {
            let defaultValueInput = <Input placeholder="请输入" onChange={e => onChange(e.target.value)} />,
                defaultValueRules = [...rules];
            if (required) defaultValueRules.push({ required: true, message: `不能为空!` });

            switch (publicUtils.getVarDataType(Number(type))) {
                case 'string': // 字符串
                    break;
                case 'int': // 整型
                    defaultValueRules.push({
                        message: '请输入数字', pattern: new RegExp("^\-?[0-9]+$")
                    });
                    break;
                case 'float': // 双精度浮点型
                    defaultValueRules.push({
                        message: '请输入数字', pattern: new RegExp("^\-?[0-9]+(\.[0-9]+)?$")
                    });
                    break;
                case 'boolean': // 布尔类型
                    defaultValueInput = (<Select onChange={value => onChange(value)}>
                        <Select.Option value={true}>TRUE</Select.Option>
                        <Select.Option value={false}>FALSE</Select.Option>
                    </Select>);
                    break;
                case 'time': // 时间类型, value 类型为 moment 对象，所以在提交服务器前需要预处理。 value[name].format('YYYY-MM-DD HH:mm:ss')
                    defaultValueInput = <DatePicker showTime onChange={(time, timeString) => onChange({ time, timeString })} placeholder="选择时间" />;
                    initialValue = initialValue ? moment(initialValue) : '';
                    break;
            }
            options = {
                ...options,
                rules: [
                    ...defaultValueRules
                ],
                initialValue
            };
            const valueInput = getFieldDecorator(name, options)(
                defaultValueInput
            );
            return valueInput;
        }
    },
    tableSorter(dataIndex) {
        return (a, b) => (a[dataIndex] || '').localeCompare(b[dataIndex] || '');
    },
    randomKey() {
        return String(Math.random()).replace('.', '')
    },
    downloadFile(fileBlob, fileName) {
        if ('download' in document.createElement('a')) {
            let url = window.URL.createObjectURL(fileBlob);
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link);
            document.body.removeChild(link);
        } else if (navigator.msSaveBlob) {
            // 兼容ie9以上
            navigator.msSaveBlob(fileBlob, fileName);
        } else {
            window.alert('当前浏览器版本无法下载');
        }
    }
}