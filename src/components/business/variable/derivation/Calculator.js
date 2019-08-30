/*
 * @Author: zengzijian
 * @Date: 2018-08-23 09:36:20
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:24:17
 * @Description: 衍生变量：计算变量的计算器
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Button, message, Select } from 'antd';
import deleteImg from '@/assets/calculator-delete.png';
import '@/styles/calculator.less';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { observer, inject } from 'mobx-react';


// eslint-disable-next-line no-unused-vars
const Btnleft = [{ type: '1', name: '1/x' }, { type: '1', name: 'x^2' }, { type: '1', name: 'x^3' }, { type: '1', name: 'x!' }, { type: '1', name: 'x^y' }, { type: '1', name: 'y√x' }, { type: '1', name: 'sin' }, { type: '1', name: 'cos' }, { type: '1', name: 'tan' }, { type: '1', name: 'in' }, { type: '1', name: 'log' }, { type: '1', name: 'e^x' }, { type: '1', name: '√' }, { type: '1', name: 'π' }, { type: '1', name: 'e' }]

const lastAndNextString = {
    "number": ["number", "opt", "%", "point", ")", "#"],//数字类型
    "x": ["opt"],//函数 或者 ) 或者 %
    "point": ["number"],//.
    "opt": ["var", "number", "(", "pie"], //操作符号
    "(": ["var", "number", "#", "pie"],//(符号
    "var": ["opt", ")", "#"],//变量
    "pie": ["opt", ")", "#"]//常量
};

@inject('store')
@observer
class Calculator extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectData: {
                event: [],
                batch: [],
                rtq: []
            }
        }
        this.currentVar = '';//当前计算器最后一个运算符以后的变量或者数字
        this.currentVarDesc = '';//当前计算器最后一个运算符以后的变量或者数字
        this.getAllVarList = this.getAllVarList.bind(this);
        this.getLastStringType = this.getLastStringType.bind(this);
        this.valueDescResult = this.valueDescResult.bind(this);
        this.selectChange = this.selectChange.bind(this);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.extRealdy) {
            this.getAllVarList();
        }
        if (!isNaN(nextProps.value) && !isNaN(nextProps.valueCode)) {
            this.currentVar = nextProps.value;
            this.currentVarDesc = nextProps.valueCode;
        }
    }
    getAllVarList() {
        let dataType = sessionStorage.tempDataType
        variableService.getAllVarList('', 'ext', publicUtils.getVarDataType(dataType) === 'int' || publicUtils.getVarDataType(dataType) === 'float').then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray1 = [];
            let tempArray2 = [];
            let tempArray3 = [];
            res.data.result.forEach(element => {
                if (element.type === 1) {//事件变量
                    element.list.forEach(element2 => {
                        tempArray1.push({
                            code: element2.code + '·-·' + element2.name,
                            value: element2.name
                        })
                    })
                }
                if (element.type === 2) {//批次变量
                    element.list.forEach(element2 => {
                        tempArray2.push({
                            code: element2.code + '·-·' + element2.name,
                            value: element2.name
                        })
                    })
                }
                if (element.type === 3) {//实时查询变量
                    element.list.forEach(element2 => {
                        tempArray3.push({
                            code: element2.code + '·-·' + element2.name,
                            value: element2.name
                        })
                    })
                }
            })
            this.setState({
                selectData: {
                    event: tempArray1,
                    batch: tempArray2,
                    rtq: tempArray3
                }
            })
        })
    }

    getLastStringType(value) {
        if (common.isEmpty(value)) return null
        let rs = null;
        let lastString = String(value).substr(String(value).length - 1, 1);
        switch (lastString) {
            case '.':
                rs = 'point';
                break;
            case '+':
                rs = 'opt';
                break;
            case '-':
                rs = 'opt';
                break;
            case '*':
                rs = 'opt';
                break;
            case '/':
                rs = 'opt';
                break;
            case ')':
                if (value === 'math:PI()' || value === 'math:E()') rs = 'pie';
                else {
                    rs = 'x';
                }
                break;
            case '(':
                rs = '(';
                break;
            case '%':
                rs = 'x';
                break;
            default:
                // eslint-disable-next-line no-case-declarations
                let tempNumber = Number(lastString);
                if (isNaN(tempNumber)) {
                    rs = 'var';
                } else {
                    rs = 'number';
                }
                break;
        }
        return rs
    }

    valueDescResult(type, newValue) {
        let lastString = this.getLastStringType(this.props.value);
        let isContinue = false;
        if (!lastString) {
            if (type !== 'var' && type !== 'number' && type !== '#' && type !== '(' && type !== 'pie') return
            this.props.valueDescResult(newValue);
            isContinue = true;
        } else {
            for (let i = 0; i < lastAndNextString[lastString].length; i++) {
                const element = lastAndNextString[lastString][i];
                if (element == type) {
                    // if (newValue.indexOf('/0') === -1){
                    this.props.valueDescResult(newValue);
                    //  }
                    isContinue = true
                    break;
                }
            }
        }
        return isContinue
    }

    valueResult(type, newValue) {
        let lastString = this.getLastStringType(this.props.value);
        this.props.store.setCanDel(true);
        console.log("current type", type);
        console.log("currentVar", this.currentVar);
        let isContinue = false;
        if (!lastString) {
            if (type !== 'var' && type !== 'number' && type !== '#' && type !== '(' && type !== 'pie') return
            this.props.valueResult(newValue);
            isContinue = true;
        } else {
            console.log("lastAndNextString[lastString]", lastAndNextString[lastString])
            for (let i = 0; i < lastAndNextString[lastString].length; i++) {
                const element = lastAndNextString[lastString][i];
                if (element == type) {
                    console.log("newValue", newValue);
                    //   if (newValue.indexOf('/0') === -1){
                    this.props.valueResult(newValue);
                    //  }
                    isContinue = true
                    break;
                }
            }
        }
        return isContinue
    }

    selectChange(value) {
        console.log("selectChange value", value)

        let code = value.split("·-·")[0];
        let name = value.split("·-·")[1] + "变量";
        this.valueDescResult("var", `${this.props.value}${name}`);
        this.valueResult("var", `${this.props.valueCode}${code}`);
        this.currentVar = code;
        this.currentVarDesc = name;
        this.props.addRequiredVars(code);
    }

    render() {
        return (
            <div style={{ width: '909px' }} id="calculator">
                <Row>
                    <Col style={{}} lg={24} xl={4} xxl={4}>
                        <Row style={{ width: '150px', height: '227px' }} type="flex" justify="space-around" align="middle" >
                            <Select disabled={this.props.disabled} placeholder="事件变量" onChange={(value) => { this.selectChange(value) }} value="事件变量">
                                {
                                    this.state.selectData.event.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                            <Select disabled={this.props.disabled} placeholder="批次变量" onChange={(value) => { this.selectChange(value) }} value="批次变量">
                                {
                                    this.state.selectData.batch.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                            <Select disabled={this.props.disabled} placeholder="实时查询变量" onChange={(value) => { this.selectChange(value) }} value="实时查询变量">
                                {
                                    this.state.selectData.rtq.map((item, i) =>
                                        <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>
                            <Btn disabled={this.props.disabled} type="6" name="清除" callBack={() => {
                                this.props.valueDescResult("");
                                this.props.valueResult("");
                                this.currentVar = "";
                                this.currentVarDesc = "";
                            }} />
                        </Row>
                    </Col>
                    <Col style={{}} lg={24} xl={9} xxl={9}>
                        <Row style={{ width: '319px', height: '281px' }} type="flex" justify="space-around" align="middle" >

                            <Btn disabled={this.props.disabled} type="1" name="1/x" callBack={() => {
                                if (this.props.value == 0 || this.props.valueCode == 0) {
                                    message.warning("0不能用做分母");
                                    return
                                }
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:reciprocal(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:reciprocal(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:reciprocal(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:reciprocal(${this.currentVar})`)) this.currentVar = '';
                                }

                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="x^2" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:square(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:square(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:square(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:square(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="x^3" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:cube(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:cube(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:cube(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:cube(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />

                            <Btn disabled={this.props.disabled} type="1" name="x!" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:factorial(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:factorial(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:factorial(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:factorial(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="x^y" callBack={() => { message.warning("暂不支持此运算符") }} />
                            <Btn disabled={this.props.disabled} type="1" name="y√x" callBack={() => { message.warning("暂不支持此运算符") }} />

                            <Btn disabled={this.props.disabled} type="1" name="sin" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:sin(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:sin(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:sin(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:sin(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="cos" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:cos(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:cos(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:cos(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:cos(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="tan" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:tan(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:tan(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:tan(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:tan(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />

                            <Btn disabled={this.props.disabled} type="1" name="In" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:ln(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:ln(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:ln(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:ln(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="log" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:log(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:log(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:log(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:log(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="e^x" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:powE(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:powE(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:powE(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:powE(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />

                            <Btn disabled={this.props.disabled} type="1" name="√" callBack={() => {
                                if (this.props.value == this.currentVarDesc) {
                                    if (this.valueDescResult('#', `math:sqrt(${this.currentVarDesc})`))
                                        this.currentVarDesc = '';
                                    if (this.valueResult('#', `math:sqrt(${this.currentVar})`))
                                        this.currentVar = '';
                                } else {
                                    let prefixValueCode = this.props.valueCode.substr(0, this.props.valueCode.length - this.currentVar.length);
                                    let prefixValue = this.props.value.substr(0, this.props.value.length - this.currentVarDesc.length);
                                    if (this.valueDescResult('#', `${prefixValue}math:sqrt(${this.currentVarDesc})`)) this.currentVarDesc = '';
                                    if (this.valueResult('#', `${prefixValueCode}math:sqrt(${this.currentVar})`)) this.currentVar = '';
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="π" callBack={() => {
                                this.valueDescResult('pie', `${this.props.value}math:PI()`);
                                this.valueResult('pie', `${this.props.valueCode}math:PI()`);
                                this.currentVar = 'math:PI()';
                                this.currentVarDesc = 'math:PI()';
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="e" callBack={() => {
                                this.valueDescResult('pie', `${this.props.value}math:E()`);
                                this.valueResult('pie', `${this.props.valueCode}math:E()`);
                                this.currentVar = 'math:E()';
                                this.currentVarDesc = 'math:E()';
                            }} />
                        </Row>
                    </Col>
                    <Col style={{}} lg={24} xl={11} xxl={11}>
                        <Row style={{ width: '426px', height: '279px' }} type="flex" justify="space-around" align="middle" >
                            <Btn disabled={this.props.disabled} type="1" name="(" callBack={() => {
                                this.valueDescResult('(', `${this.props.value}(`);
                                this.valueResult('(', `${this.props.valueCode}(`);
                                this.currentVar = '';
                                this.currentVarDesc = '';
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name=")" callBack={() => {
                                if (this.props.value.indexOf('(') === -1)
                                    return
                                this.valueDescResult(')', `${this.props.value})`);
                                this.valueResult(')', `${this.props.valueCode})`);
                                this.currentVar = '';
                                this.currentVarDesc = '';
                            }} />
                            <Btn disabled={this.props.disabled} type="1" name="%" callBack={() => {
                                this.valueDescResult('%', `${this.props.value}%`);
                                this.valueResult('%', `${this.props.valueCode}%`);
                                if (!common.isEmpty(this.currentVar)) {
                                    this.currentVar = `${this.currentVar}%`;
                                    this.currentVarDesc = `${this.currentVarDesc}%`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="4" name="" callBack={() => {
                                // message.warning("正在开发此运算符号");
                                console.log("this.currentVar, this.currentVarDesc", this.currentVar, this.currentVarDesc);
                                if (!common.isEmpty(this.currentVar) && !common.isEmpty(this.currentVarDesc)) {
                                    if (String(this.props.valueCode).indexOf(this.currentVar) != -1 && String(this.props.value).indexOf(this.currentVarDesc) != -1) {
                                        let newValueResult = this.props.valueCode.split(this.currentVar)[0];
                                        let newValueResultDesc = this.props.value.split(this.currentVarDesc)[0];
                                        this.props.valueDescResult(newValueResultDesc);
                                        this.props.valueResult(newValueResult);
                                        this.currentVar = '';
                                        this.currentVarDesc = '';
                                    }

                                }
                            }} />

                            <Btn disabled={this.props.disabled} type="2" name="7" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}7`);
                                    this.valueResult('number', `${this.props.valueCode}7`);
                                    this.currentVar = `${this.currentVar}7`;
                                    this.currentVarDesc = `${this.currentVarDesc}7`;
                                }

                            }} />
                            <Btn disabled={this.props.disabled} type="2" name="8" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}8`);
                                    this.valueResult('number', `${this.props.valueCode}8`);
                                    this.currentVar = `${this.currentVar}8`;
                                    this.currentVarDesc = `${this.currentVarDesc}8`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="2" name="9" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}9`);
                                    this.valueResult('number', `${this.props.valueCode}9`);
                                    this.currentVar = `${this.currentVar}9`;
                                    this.currentVarDesc = `${this.currentVarDesc}9`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="3" name="/" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('opt', `${this.props.value}/`);
                                    this.valueResult('opt', `${this.props.valueCode}/`);
                                    this.currentVar = '';
                                    this.currentVarDesc = '';
                                }
                            }} />

                            <Btn disabled={this.props.disabled} type="2" name="4" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}4`);
                                    this.valueResult('number', `${this.props.valueCode}4`);
                                    this.currentVar = `${this.currentVar}4`;
                                    this.currentVarDesc = `${this.currentVarDesc}4`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="2" name="5" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}5`);
                                    this.valueResult('number', `${this.props.valueCode}5`);
                                    this.currentVar = `${this.currentVar}5`;
                                    this.currentVarDesc = `${this.currentVarDesc}5`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="2" name="6" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}6`);
                                    this.valueResult('number', `${this.props.valueCode}6`);
                                    this.currentVar = `${this.currentVar}6`;
                                    this.currentVarDesc = `${this.currentVarDesc}6`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="3" name="*" callBack={() => {
                                this.valueDescResult('opt', `${this.props.value}*`);
                                this.valueResult('opt', `${this.props.valueCode}*`);
                                this.currentVar = '';
                                this.currentVarDesc = '';
                            }} />

                            <Btn disabled={this.props.disabled} type="2" name="1" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}1`);
                                    this.valueResult('number', `${this.props.valueCode}1`);
                                    this.currentVar = `${this.currentVar}1`;
                                    this.currentVarDesc = `${this.currentVarDesc}1`;
                                }
                            }} />

                            <Btn disabled={this.props.disabled} type="2" name="2" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}2`);
                                    this.valueResult('number', `${this.props.valueCode}2`);
                                    this.currentVar = `${this.currentVar}2`;
                                    this.currentVarDesc = `${this.currentVarDesc}2`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="2" name="3" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    this.valueDescResult('number', `${this.props.value}3`);
                                    this.valueResult('number', `${this.props.valueCode}3`);
                                    this.currentVar = `${this.currentVar}3`;
                                    this.currentVarDesc = `${this.currentVarDesc}3`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="3" name="-" callBack={() => {
                                this.valueDescResult('opt', `${this.props.value}-`);
                                this.valueResult('opt', `${this.props.valueCode}-`);
                                this.currentVar = '';
                                this.currentVarDesc = '';
                            }} />

                            <Btn disabled={this.props.disabled} type="5" name="0" callBack={() => {
                                if (this.currentVar == '0') {
                                    return
                                } else {
                                    //判断当前表达式最后的一个符号是‘/’就return
                                    //if (String(this.props.value).substr(String(this.props.value).length - 1, 1) === '/') return
                                    this.valueDescResult('number', `${this.props.value}0`);
                                    this.valueResult('number', `${this.props.valueCode}0`)
                                    this.currentVar = `${this.currentVar}0`;
                                    this.currentVarDesc = `${this.currentVarDesc}0`;
                                }
                            }} />
                            <Btn disabled={this.props.disabled} type="2" name="." callBack={() => {
                                if (this.currentVar.indexOf('.') != -1) return
                                if (common.isEmpty(this.currentVar)) return
                                this.valueDescResult('point', `${this.props.value}.`);
                                this.valueResult('point', `${this.props.valueCode}.`)
                                this.currentVar = `${this.currentVar}.`;
                                this.currentVarDesc = `${this.currentVarDesc}.`;
                            }} />
                            <Btn disabled={this.props.disabled} type="3" name="+" callBack={() => {
                                this.valueDescResult('opt', `${this.props.value}+`);
                                this.valueResult('opt', `${this.props.valueCode}+`);
                                this.currentVar = '';
                                this.currentVarDesc = '';
                            }} />
                        </Row>
                    </Col>
                </Row>
            </div>
        )
    }
}

@inject('store')
@observer
class Btn extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            (() => {
                switch (Number(this.props.type)) {
                    case 1:
                        return <Button style={style.button1} onClick={this.props.callBack} disabled={this.props.disabled}>{this.props.name}</Button>
                    case 2:
                        return <Button style={style.button2} onClick={this.props.callBack} disabled={this.props.disabled}>{this.props.name}</Button>
                    case 3:
                        return <Button style={style.button3} onClick={this.props.callBack} disabled={this.props.disabled}>{this.props.name}</Button>
                    case 4:

                        if (this.props.store.getCanDel) {
                            return <Button style={style.button4} onClick={this.props.callBack} disabled={this.props.disabled}><img src={deleteImg} /></Button>
                        } else {
                            return <Button style={style.button4} onClick={this.props.callBack} disabled title="请先清除"><img src={deleteImg} /></Button>
                        }

                    case 6:
                        return <Button style={style.button6} onClick={this.props.callBack} disabled={this.props.disabled}>{this.props.name}</Button>
                    default:
                        return <Button style={style.button5} onClick={this.props.callBack} disabled={this.props.disabled}>0</Button>
                }
            })()

        )
    }
}
Btn.propTypes = {
    name: PropTypes.string,
    type: PropTypes.oneOf([1, 2, 3, 4, '1', '2', '3', '4']),//颜色由浅逐渐变深
    callBack: PropTypes.func,
    dimensionId: PropTypes.string,
    eventSourceId: PropTypes.eventSourceId,
    addRequiredVars: PropTypes.func,
    disabled: PropTypes.bool
}
Btn.defaultProps = {
    callBack: () => { },
    type: 1,
    addRequiredVars: () => { },
    disabled: false
}

const style = {
    button1: {
        width: '100px',
        height: '50px',
        backgroundColor: '#F3F3F3',
        fontSize: '18px',
    },
    button2: {
        width: '100px',
        height: '50px',
        backgroundColor: '#CCCCCC',
        fontSize: '20px',
    },
    button3: {
        width: '100px',
        height: '50px',
        backgroundColor: '#999999',
        fontSize: '20px',
    },
    button4: {
        width: '100px',
        height: '50px',
        backgroundColor: '#C74244',
        fontSize: '20px'
    },
    button5: {
        width: '200px',
        height: '50px',
        backgroundColor: '#CCCCCC',
        fontSize: '20px',
    },
    button6: {
        width: '150px',
        height: '50px',
        backgroundColor: '#C74244',
        fontSize: '20px',
        color: '#fff'
    }
}
Calculator.propTypes = {
    extRealdy: PropTypes.bool,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    valueDescResult: PropTypes.func,
    canDel: PropTypes.bool,
    disabled: PropTypes.bool,
    dataType: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ])
}
Calculator.defaultProps = {
    extRealdy: false,
    disabled: false,
    dataType: ''
}
export default Calculator;