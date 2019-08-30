import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Select, Dropdown, InputNumber, Divider, Button, Cascader, Menu, Icon } from 'antd';
import '@/styles/condition-tree/tree.less';
import AddAndSub from '@/components/condition-tree/AddAndSub';
import TreeCopy from '@/components/condition-tree/Tree';
import common from '@/utils/common';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import { toJS } from 'mobx';

const IndentCell = 80;

const valueTypeConstList = [{ code: 'var', value: '变量' }, { code: 0, value: '固定值' }];//等于的时候就有函数，否则没有函数选择
const otherOptTypeConstList = [{
    "code": 0,
    "value": "等于"
},
{
    "code": 1,
    "value": "大于"
},
{
    "code": 2,
    "value": "小于"
},
{
    "code": 3,
    "value": "不等于"
},
{
    "code": 4,
    "value": "大于等于"
},
{
    "code": 5,
    "value": "小于等于"
},
{
    "code": 8,
    "value": "is null"
},
{
    "code": 9,
    "value": "is not null"
}];

const stringOptTypeList = [{
    "code": 0,
    "value": "等于"
},
{
    "code": 3,
    "value": "不等于"
},
{
    "code": 6,
    "value": "属于"
},
{
    "code": 7,
    "value": "不属于"
},
{
    "code": 8,
    "value": "is null"
},
{
    "code": 9,
    "value": "is not null"
},
{
    "code": 10,
    "value": "不类似"
},
{
    "code": 11,
    "value": "类似"
}];

const number_3_4__5OptTypeConstList = [{
    "code": 0,
    "value": "等于"
},
{
    "code": 1,
    "value": "大于"
},
{
    "code": 2,
    "value": "小于"
},
{
    "code": 3,
    "value": "不等于"
},
{
    "code": 4,
    "value": "大于等于"
},
{
    "code": 5,
    "value": "小于等于"
},
{
    "code": 8,
    "value": "is null"
},
{
    "code": 9,
    "value": "is not null"
},
{
    "code": 6,
    "value": "属于"
},
{
    "code": 7,
    "value": "不属于"
}];


const func_OptTypeConstList = [{
    "code": 0,
    "value": "等于"
}];

const timeFunc = [
    { code: 'day', label: '当天' }, { code: 'month', label: '当月' },
    //  { code: 'quarter', label: '当季' },
    { code: 'year', label: '当年' },
    { code: 'withinSecond', label: '近N秒' }, { code: 'withinMinute', label: '近N分钟' }, { code: 'withinHour', label: '近N小时' }, { code: 'withinDay', label: '近N天' }, { code: 'withinMonth', label: '近N月' },
    // { code: 'withinQuarter', label: '近N季' },
    { code: 'withinYear', label: '近N年' }
]


@inject('conditionTreeStore')
@observer
class Tree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indentTimes: 0,
            isFirstNode: false,
            isFirstNodes: false,
            relWidth: 0,
            valueType: 0,
            functionType: 'day',
            index: 0,
            valueTypeList: [],
            parantRelType: this.props.node.relType
        }
        this.saveData = {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": "",
            "varDataType": "",
            "valueDataType": "",
            "table": {
                "aliasName": "",
                "name": ""
            },
            "varDefaultValue": '',
            "valueDefaultValue": ''
        }
        this.changeData = this.changeData.bind(this);
        this.changeOptTypeListCallBack = this.changeOptTypeListCallBack.bind(this);
        if (!this.props.node.treeData && this.props.node.nodeType == 1) {
            let node = common.deepClone(this.props.node);
            this.saveData = {
                "varCode": node.expressionVO.varCode,
                "varName": node.expressionVO.varName,
                "varType": String(node.expressionVO.varType),
                "optType": node.expressionVO.optType,
                "value": node.expressionVO.value,
                "valueType": String(node.expressionVO.valueType),
                "valueCode": node.expressionVO.valueCode,
                "valueName": node.expressionVO.valueName,
                "varDataType": node.expressionVO.varDataType,
                "valueDataType": node.expressionVO.valueDataType,
                "table": common.isEmpty(node.expressionVO.table) ? {
                    "aliasName": "",
                    "name": ""
                } : node.expressionVO.table,
                "varDefaultValue": node.expressionVO.varDefaultValue,
                "valueDefaultValue": node.expressionVO.valueDefaultValue

            }

            if (node.expressionVO.valueType === 6) {
                let functionType = '';
                if (node.expressionVO.value === 'day') {
                    functionType = 'day';
                } else {
                    functionType = node.expressionVO.value.split('·-·')[0];
                }
                if (node.expressionVO.value === 'month') {
                    functionType = 'month';
                } else {
                    functionType = node.expressionVO.value.split('·-·')[0];
                }
                if (node.expressionVO.value === 'quarter') {
                    functionType = 'quarter';
                } else {
                    functionType = node.expressionVO.value.split('·-·')[0];
                }
                if (node.expressionVO.value === 'year') {
                    functionType = 'year';
                } else {
                    functionType = node.expressionVO.value.split('·-·')[0];
                }
                this.setState({
                    functionType: functionType,
                    valueType: node.expressionVO.valueType
                })
            } else {
                this.setState({ valueType: node.expressionVO.valueType })
            }
            if (node.id) {
                this.saveData.id = node.expressionVO.id;
            }
        }

        // console.log('nodeKey =' + this.props.nodeKey);
    }

    componentWillReceiveProps(nextProps) {

        console.log("tree  componentWillReceiveProps", nextProps);
        if (!nextProps.node.treeData && nextProps.node.nodeType === 1) {
            // alert(1)
            // console.warn(this.saveData);
            this.saveData.varCode = nextProps.node.expressionVO.varCode;
            this.saveData.varName = nextProps.node.expressionVO.varName;
            this.saveData.varType = String(nextProps.node.expressionVO.varType);
            this.saveData.optType = nextProps.node.expressionVO.optType;
            this.saveData.varDataType = nextProps.node.expressionVO.varDataType;
            this.saveData.valueDataType = nextProps.node.expressionVO.valueDataType;
            this.saveData.varDefaultValue = nextProps.node.expressionVO.varDefaultValue;
            this.saveData.valueDefaultValue = nextProps.node.expressionVO.valueDefaultValue;
            // this.saveData.table = nextProps.node.expressionVO.table;
            this.saveData.table = common.isEmpty(nextProps.node.expressionVO.table) ? {
                "aliasName": "",
                "name": ""
            } : nextProps.node.expressionVO.table
            // this.changeOptTypeListCallBack(nextProps.node.expressionVO.optType);
            this.saveData.value = nextProps.node.expressionVO.value;
            if (nextProps.node.expressionVO.valueType !== 0 && nextProps.node.expressionVO.valueType !== 6) {//变量
                this.saveData.valueType = String(nextProps.node.expressionVO.valueType);
                // console.log(typeof this.saveData.valueType);
                this.setState({
                    valueType: nextProps.node.expressionVO.valueType
                })
            } else {
                this.saveData.valueType = nextProps.node.expressionVO.valueType;

                if (nextProps.node.expressionVO.valueType === 6) {
                    // alert("1111")
                    let functionType = '';
                    if (nextProps.node.expressionVO.value === 'day') {
                        functionType = 'day';
                    } else {
                        functionType = nextProps.node.expressionVO.value.split('·-·')[0];
                    }
                    if (nextProps.node.expressionVO.value === 'month') {
                        functionType = 'month';
                    } else {
                        functionType = nextProps.node.expressionVO.value.split('·-·')[0];
                    }
                    if (nextProps.node.expressionVO.value === 'quarter') {
                        functionType = 'quarter';
                    } else {
                        functionType = nextProps.node.expressionVO.value.split('·-·')[0];
                    }
                    if (nextProps.node.expressionVO.value === 'year') {
                        functionType = 'year';
                    } else {
                        functionType = nextProps.node.expressionVO.value.split('·-·')[0];
                    }
                    this.setState({
                        functionType: functionType,
                        valueType: nextProps.node.expressionVO.valueType
                    })
                } else {
                    this.setState({
                        valueType: nextProps.node.expressionVO.valueType
                    })
                }
            }


            this.saveData.valueCode = nextProps.node.expressionVO.valueCode;
            this.saveData.valueName = nextProps.node.expressionVO.valueName;
            if (nextProps.node.id) {
                this.saveData.id = nextProps.node.expressionVO.id;
            }
            this.setState({ valueType: nextProps.node.expressionVO.valueType, valueTypeList: this.props.valueTypeList, parantRelType: nextProps.node.relType })
        }
    }

    componentWillMount() {
        // if (this.props.node.nodeType === 2) return
        let indentTimes;
        let nodeKey = this.props.nodeKey;
        let keyArray;
        let isFirstNode = false;
        let isFirstNodes = false;

        const NormalRelWidth = '20px';
        const FirstNodeRelWidth = '100px';
        const FirstNodesRelWidth = '190px';
        let relWidth = NormalRelWidth;

        if (!isNaN(nodeKey)) {//第一级
            if (nodeKey === 0) {
                indentTimes = 0;
                isFirstNode = true;
            }
            else {
                indentTimes = 1;
            }
        } else {//第二级
            keyArray = nodeKey.split('·-·');
            switch (keyArray.length) {
                case 2:
                    if (nodeKey === '0·-·0') {
                        indentTimes = 0;
                        relWidth = FirstNodesRelWidth;
                        isFirstNodes = true;
                    } else {
                        if (keyArray[1] == 0) {
                            indentTimes = 1;
                            relWidth = FirstNodeRelWidth;
                            isFirstNode = true;
                        }
                        else {
                            indentTimes = 2;
                        }
                    }

                    break;
                case 3:
                    if (nodeKey === '0·-·0·-·0') {
                        indentTimes = 0;
                        relWidth = FirstNodesRelWidth;
                        isFirstNodes = true;
                    } else {
                        if (keyArray[2] == 0) {

                            indentTimes = 2;
                            if (keyArray[1] == 0) {
                                indentTimes--;
                                if (keyArray[2] == 0) {
                                    relWidth = FirstNodesRelWidth;
                                    isFirstNodes = true;
                                }
                            } else {
                                if (keyArray[2] == 0) {
                                    isFirstNode = true;
                                    relWidth = FirstNodeRelWidth;
                                }
                            }
                        }
                        else {
                            indentTimes = 3;
                        }
                    }

                    break;
                case 4:
                    if (keyArray[3] == 0) {
                        indentTimes = 3;
                        if (keyArray[2] == 0) {
                            indentTimes--;
                            if (keyArray[3] == 0) {
                                relWidth = FirstNodesRelWidth;
                                isFirstNodes = true;
                            }
                        } else {
                            if (keyArray[3] == 0) {
                                isFirstNode = true;
                                relWidth = FirstNodeRelWidth;
                            }
                        }
                    }
                    else {
                        indentTimes = 4;
                    }
                    break;
                default:
                    break;
            }
        }
        this.setState({
            indentTimes: indentTimes,
            isFirstNode: isFirstNode,
            isFirstNodes: isFirstNodes,
            relWidth: relWidth
        })
    }

    componentWillUnmount() {
        this.saveData = {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": "",
            "varDataType": "",
            "valueDataType": "",
            "table": {
                "aliasName": "",
                "name": ""
            }
        }
    }


    changeData(name, value, nodeKey) {
        console.log("changeData", name, value);
        if (name === 'value' && value !== 'day') {
            value == '';
        }
        if (name === 'varDataType') {

            if (this.saveData.valueType != 6) {
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', '');
                this.saveData.value = '';
            }
        }
        if (name === 'valueType') {
            if (value == 6) {
                this.saveData.valueCode = 'day';
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueType', 'day');
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCode', 'day');
                this.setState({
                    functionType: 'day'
                })
            } else {
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', '');
                this.saveData.value = '';
            }

        }
        if (name === 'optType') {
            // this.changeOptTypeListCallBack(value);
        }
        this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, name, value);
        this.saveData[name] = value;

        if (name === 'value') {
            if (!common.isEmpty(value) && value.length > 30) {
                this.saveData.value = String(this.saveData.value).substr(0, 30);
            }
        }
        this.props.updateConditionTree(this.props.conditionTreeStore.getConditionsAll);
        // console.log("tree changeData this.props.conditionTreeStore.getConditionsAll", this.props.conditionTreeStore.getConditionsAll);
        this.props.verifyConditionTreeFinish();
        this.setState({ index: Math.random() })
    }
    /**
         * 当过滤选择‘等于’操作符时，才出现‘函数’选项。目前函数不支持其他操作符，因为这些都是自定义函数
         * @memberof TreePanel
         */
    changeOptTypeListCallBack(code) {

        let tempArray = this.state.valueTypeList;
        if (code == 0) {//0为等于，，此时optList出现函数选项
            let codeArray = []
            this.props.valueTypeList.forEach(element => {
                codeArray.push(element.code);
            })
            // alert(codeArray.indexOf(6) == -1);
            if (codeArray.indexOf(6) == -1) {
                tempArray = this.props.valueTypeList;
                tempArray.push({
                    code: 6,
                    value: '函数'
                });
                this.setState({
                    valueTypeList: tempArray
                })

            }
            // console.log('等于的时候');
            // console.log(tempArray);
            // console.log(codeArray.indexOf(6) == -1);
            // console.log(codeArray);
        } else {
            this.props.valueTypeList.forEach(element => {
                if (element.code != 6) tempArray.push(element)
            })
            this.setState({
                valueTypeList: tempArray
            })
            // console.log('不是等于的时候');
            // console.log(tempArray);
        }
    }
    render() {
        // console.log("tree this.saveData",  this.saveData)
        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        let prefixSelectorCommon1 =
            <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
                <Select
                    disabled={this.props.disabled}
                    style={{ zIndex: '1' }}
                    defaultValue={this.props.p_relType}
                    onChange={(value) => { this.changeData('relType', value) }}
                    size="small"
                    dropdownStyle={{
                        fontSize: '10px'
                    }}
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ padding: '8px', cursor: 'pointer' }}
                                onClick={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false)}
                            >
                                添加条件
                            </div>

                        </div>
                    )}
                >
                    <Select.Option value={0}>并且</Select.Option>
                    <Select.Option value={1}>或者</Select.Option>
                </Select>
            </div>
        let prefixSelectorCommon2 =
            <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
                <Select
                    disabled={this.props.disabled}
                    style={{ zIndex: '1' }}
                    defaultValue={this.props.p_relType}
                    onChange={(value) => { this.changeData('relType', value) }}
                    size="small"
                    dropdownStyle={{
                        fontSize: '10px'
                    }}
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ padding: '8px', cursor: 'pointer' }}
                                onClick={() => this.props.add(this.props.nodeKey.split('·-·')[0] + '·-·0', 'and', this.props.node.expressionVO, false)}
                            >
                                添加条件
                            </div>
                            <div style={{ padding: '8px', cursor: 'pointer' }}
                                onClick={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, true)}
                            >
                                添加联合条件
                        </div>
                        </div>
                    )}
                >
                    <Select.Option value={0}>并且</Select.Option>
                    <Select.Option value={1}>或者</Select.Option>
                </Select>
            </div>

        let prefixSelectorCommon3 =
            <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
                <Select
                    disabled={this.props.disabled}
                    style={{ zIndex: '1' }}
                    defaultValue={this.props.p_relType}
                    onChange={(value) => { this.changeData('relType', value) }}
                    size="small"
                    dropdownStyle={{
                        fontSize: '10px'
                    }}
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ padding: '8px', cursor: 'pointer' }}
                                onClick={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, true)}
                            >
                                添加联合条件
                            </div>
                        </div>
                    )}
                >
                    <Select.Option value={0}>并且3</Select.Option>
                    <Select.Option value={1}>或者3</Select.Option>
                </Select>
            </div>

        let prefixSelectorEnd =
            <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
                <Select
                    disabled={this.props.disabled}
                    style={{ zIndex: '1' }}
                    defaultValue={this.props.p_relType}
                    size="small"
                    onChange={(value) => { this.changeData('relType', value) }}
                >
                    <Select.Option value={0}>并且</Select.Option>
                    <Select.Option value={1}>或者</Select.Option>
                </Select>
            </div>

        const selectStart = <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
            <Select
                disabled={this.props.disabled}
                defaultValue={this.props.p_relType}
                onChange={(value) => { this.changeData('relType', value, 0) }}
                size="small"
                dropdownStyle={{
                    fontSize: '10px'
                }}
                style={{ zIndex: '1' }}
                className="start-select"
                dropdownRender={menu => (
                    <div>
                        {menu}
                        <Divider style={{ margin: '4px 0' }} />
                        <div style={{ padding: '8px', cursor: 'pointer' }}
                            onClick={() => this.props.add(0, 'and', this.props.node.expressionVO, false)}
                        >
                            添加条件
                        </div>
                        <div style={{ padding: '8px', cursor: 'pointer' }}
                            onClick={() => this.props.add(0, 'and', this.props.node.expressionVO, true)}
                        >
                            添加联合条件
                        </div>
                    </div>
                )}
            >
                <Select.Option value={0}>并且</Select.Option>
                <Select.Option value={1}>或者</Select.Option>
            </Select>
        </div>

        return (
            <div style={{ clear: 'both' }}>
                {/* {this.props.p_relType} */}
                {
                    this.props.node.nodeType === 1 ?
                        <div className="cell-container" style={{ left: IndentCell * this.state.indentTimes + 'px' }}>
                            {this.props.nodeKey === 0 ?
                                <div className="guide clearfix" style={{ marginLeft: '0px' }}>
                                    <div className="clearfix" >
                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                            {selectStart}
                                        </p>
                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>─────</p>
                                    </div>
                                </div>
                                :
                                this.props.nodeKey === '0·-·0' ?
                                    <div className="guide clearfix" style={{ marginLeft: '0px' }}>

                                        <div className="clearfix" >
                                            <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                {selectStart}
                                            </p>
                                            <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                ─────
                                            </p>
                                            <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                {prefixSelectorCommon2}
                                            </p>
                                            <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                {
                                                    this.state.isFirstNodes ? '─' :

                                                        this.state.isFirstNode ? '─' : ''
                                                }
                                            </p>
                                        </div>

                                    </div>
                                    :
                                    this.props.nodeKey === '0·-·0·-·0' ?
                                        <div className="guide clearfix" style={{ marginLeft: '0px' }}>

                                            <div className="clearfix" >
                                                <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                    {selectStart}
                                                </p>
                                                <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                    ─────
                                                </p>
                                                <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                    {prefixSelectorCommon2}
                                                </p>
                                                <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                    ──
                                                </p>
                                                <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                    {prefixSelectorCommon1}
                                                </p>
                                                <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                    {
                                                        this.state.isFirstNodes ? '─' :

                                                            this.state.isFirstNode ? '────────' : ''
                                                    }
                                                </p>
                                            </div>

                                        </div>
                                        :
                                        <div className="guide clearfix">
                                            {
                                                isNaN(this.props.nodeKey) ?
                                                    (() => {
                                                        let treejson = this.props.conditionTreeStore.conditionTreeJson;
                                                        let keyArray = this.props.nodeKey.split('·-·');
                                                        switch (keyArray.length) {
                                                            case 2:
                                                                if (keyArray[1] != 0) {
                                                                    if (keyArray[0] == treejson.length - 1 && treejson[keyArray[0]].conditions[keyArray[1]].nodeType == 1) {

                                                                    } else {
                                                                        if (keyArray[1] > keyArray[0]) {
                                                                            return <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                        } else {
                                                                            if (keyArray[1] > treejson.length && treejson[keyArray[0]].nodeType == 2) {
                                                                                return <div className="guide-l" style={{ marginLeft: '-' + IndentCell * 2 + 'px' }}></div>
                                                                            } else {
                                                                                return <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                            }

                                                                        }
                                                                    }


                                                                }
                                                                break;
                                                            case 3:
                                                                let rs;

                                                                if (keyArray[2] == 0 && keyArray[1] == 0) {
                                                                    rs = ''
                                                                } else {
                                                                    if (keyArray[0] == treejson.length - 1) {//第一级的最后节点
                                                                        if (treejson[keyArray[0]].conditions[keyArray[1]].nodeType == 2) {
                                                                            if (keyArray[2] == 0) {

                                                                            } else {
                                                                                if (keyArray[1] == 1) {
                                                                                    if (keyArray[1] < treejson[keyArray[0]].conditions.length - 1) {
                                                                                        rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                                    }
                                                                                } else {
                                                                                    if (keyArray[1] < treejson[keyArray[0]].conditions.length - 1) {
                                                                                        rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                                    } else {

                                                                                    }
                                                                                }
                                                                            }


                                                                        }

                                                                    } else {
                                                                        if (keyArray[2] != 0) {
                                                                            if (treejson.length - 1 == keyArray[0]) {
                                                                                rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>
                                                                            } else {
                                                                                if (treejson.length >= treejson[keyArray[0]].conditions.length && keyArray[1] == treejson[keyArray[0]].conditions.length - 1) {
                                                                                    rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell * 2 + 'px' }}></div>
                                                                                } else {
                                                                                    rs = <div><div className="guide-l" style={{ marginLeft: '-' + IndentCell * 2 + 'px' }}></div><div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div></div>
                                                                                }
                                                                            }


                                                                        } else {
                                                                            rs = <div className="guide-l" style={{ marginLeft: '-' + IndentCell + 'px' }}></div>

                                                                        }
                                                                    }

                                                                }
                                                                return rs;
                                                                break;
                                                            default:
                                                                break;
                                                        }
                                                    })() : ''
                                            }
                                            <div className="guide-l"></div>
                                            {
                                                isNaN(this.props.nodeKey) && this.props.nodeKey.split('·-·')[1] == 0 && this.props.nodeKey.split('·-·')[2] == 0 ?
                                                    <div className='claerfix' style={{ minWidth: this.state.relWidth, height: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            ─
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? '──' :

                                                                    this.state.isFirstNode ? '──────────' : ''
                                                            }
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? prefixSelectorCommon2 :

                                                                    this.state.isFirstNode ? prefixSelectorCommon2 : ''
                                                            }
                                                        </p>

                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? '──' :

                                                                    this.state.isFirstNode ? '──' : ''
                                                            }
                                                        </p>

                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? isNaN(this.props.nodeKey) && this.props.nodeKey.split('·-·').length >= 3 ? prefixSelectorCommon1 : prefixSelectorCommon2 :
                                                                    this.state.isFirstNode ? prefixSelectorCommon2 : ''
                                                            }
                                                        </p>

                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? '─' :

                                                                    this.state.isFirstNode ? '──────────' : ''
                                                            }
                                                        </p>
                                                    </div>
                                                    :
                                                    <div className='claerfix' style={{ minWidth: this.state.relWidth, height: 'inherit', overflow: 'hidden', whiteSpace: 'nowrap', marginLeft: '1px' }}>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            ─
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? '─' :

                                                                    this.state.isFirstNode ? '──' : ''
                                                            }
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? prefixSelectorCommon1 :
                                                                    this.state.isFirstNode ? isNaN(this.props.nodeKey) && this.props.nodeKey.split('·-·').length >= 3 ? prefixSelectorCommon1 : prefixSelectorCommon2 : '──'
                                                            }
                                                        </p>
                                                        <p style={{ width: 'fit-content', height: '27px', lineHeight: '27px', float: 'left' }}>
                                                            {
                                                                this.state.isFirstNodes ? '─────────' :

                                                                    this.state.isFirstNode ? '─' : ''
                                                            }
                                                        </p>

                                                    </div>
                                            }

                                        </div>
                            }
                            {
                                this.props.type === 'query' ?
                                    common.isEmpty(this.saveData.varCode) ?
                                        <Select
                                            disabled={this.props.disabled}
                                            size="small"
                                            showSearch={true}
                                            optionFilterProp="search"
                                            placeholder="选择表字段"
                                            dropdownMatchSelectWidth={true}
                                            onChange={(value, option) => {
                                                // console.log("tree option", option)
                                                this.changeData('varType', this.props.varTypeOfField);
                                                this.changeData('varCode', option.props.code);
                                                this.changeData('varName', option.props.varName);
                                                this.changeData('varDataType', Number(option.props.varDataType));
                                                this.changeData('table', { aliasName: "", name: option.props.table });
                                                this.changeData('optType', '');
                                            }}
                                            className="fieldList"
                                            style={{ width: '100px' }}
                                        // value={this.saveData.varName}
                                        // value={this.saveData.varCode ? `${this.saveData.table.name}·-·${this.saveData.varCode}` : ''}
                                        >
                                            {this.props.fieldList.map((item, i) =>
                                                item.fieldsList.map((item2, i) =>
                                                    // <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} search={`${item.name}${item2.code}${item.cnName}${item2.value}`} varName={item2.value} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                                                    <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} search={`${item.name}${item2.code}${item.cnName}${item2.value}`} varName={item2.value} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item2.value}</Select.Option>
                                                    // <Select.Option value={item.code} varDataType={item.varDataType}>{item.value}</Select.Option>
                                                )

                                            )}
                                        </Select>
                                        :
                                        <Select
                                            disabled={this.props.disabled}
                                            size="small"
                                            showSearch={true}
                                            optionFilterProp="search"
                                            placeholder="选择表字段"
                                            dropdownMatchSelectWidth={true}
                                            onChange={(value, option) => {
                                                // console.log("tree option", option)
                                                this.changeData('varType', this.props.varTypeOfField);
                                                this.changeData('varCode', option.props.code);
                                                this.changeData('varName', option.props.varName);
                                                this.changeData('varDataType', Number(option.props.varDataType));
                                                this.changeData('table', { aliasName: "", name: option.props.table });
                                                this.changeData('optType', '');
                                            }}
                                            className="fieldList"
                                            style={{ width: 'min-content' }}
                                            // value={this.saveData.varName}
                                            value={this.saveData.varCode ? `${this.saveData.table.name}·-·${this.saveData.varCode}` : ''}
                                        >
                                            {this.props.fieldList.map((item, i) =>
                                                item.fieldsList.map((item2, i) =>
                                                    // <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} search={`${item.name}${item2.code}${item.cnName}${item2.value}`} varName={item2.value} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item.cnName}.{item2.value}</Select.Option>
                                                    <Select.Option search={`${item.name}${item2.code}${item.cnName}${item2.value}`} value={`${item.name}·-·${item2.code}`} search={`${item.name}${item2.code}${item.cnName}${item2.value}`} varName={item2.value} code={item2.code} key={Math.random()} table={item.name} varDataType={item2.varDataType} index={i}>{item2.value}</Select.Option>
                                                    // <Select.Option value={item.code} varDataType={item.varDataType}>{item.value}</Select.Option>
                                                )

                                            )}
                                        </Select>


                                    :

                                    common.isEmpty(this.saveData.varType) && common.isEmpty(this.saveData.varCode) && common.isEmpty(this.saveData.varDataType) ?
                                        <Cascader
                                            disabled={this.props.disabled} style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量" title={this.saveData.varCode}
                                            onChange={(value, selectedOptions) => {
                                                this.changeData('varType', value[0]);
                                                this.changeData('varCode', value[1].split('·-·')[0]);
                                                this.changeData('varDataType', value[1].split('·-·')[1]);
                                                this.changeData('varDefaultValue', selectedOptions[1].defaultValue);
                                                this.changeData('varName', selectedOptions[1].label);
                                                this.changeData('optType', 0);
                                            }} className="varList varlist-empty clearfix" options={this.props.cascadeData} showSearch={{ filter }} />

                                        :
                                        <Cascader
                                            disabled={this.props.disabled} style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量" value={[this.saveData.varType, this.saveData.varCode + '·-·' + this.saveData.varDataType]} title={this.saveData.varCode}
                                            onChange={(value, selectedOptions) => {
                                                this.changeData('varType', value[0]);
                                                this.changeData('varCode', value[1].split('·-·')[0]);
                                                this.changeData('varDataType', value[1].split('·-·')[1]);
                                                this.changeData('varDefaultValue', selectedOptions[1].defaultValue);
                                                this.changeData('varName', selectedOptions[1].label);
                                                this.changeData('optType', 0);
                                            }} className="varList clearfix" options={this.props.cascadeData} showSearch={{ filter }} />

                            }
                            {
                                common.isEmpty(this.saveData.optType) ?
                                    <Select disabled={this.props.disabled} style={{ width: '65px' }} size="small" placeholder="选择关系"
                                        onChange={(value) => {
                                            this.changeData('optType', value)
                                        }}
                                        dropdownMatchSelectWidth={false}
                                        className="relationList" >
                                        {
                                            (() => {
                                                if (this.saveData.valueType == 6) {//等号右边选择函数的话，只有等于号
                                                    return func_OptTypeConstList.map((item, i) =>
                                                        <Select.Option value={item.code}>{item.value}</Select.Option>
                                                    )
                                                } else {

                                                    if (this.saveData.varDataType == 12) {//字符串类型用全部操作类型
                                                        return stringOptTypeList.map((item, i) =>
                                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                                        )
                                                    } else if (this.saveData.varDataType == 3 || this.saveData.varDataType == 4 || this.saveData.varDataType == -5) {//枚举好的数字操作类型
                                                        return number_3_4__5OptTypeConstList.map((item, i) =>
                                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                                        )
                                                    } else {
                                                        return otherOptTypeConstList.map((item, i) =>//其他操作类型
                                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                                        )
                                                    }
                                                }
                                                // this.props.optTypeList 这里是全部操作类型
                                            })()
                                        }
                                    </Select>
                                    :
                                    <Select disabled={this.props.disabled} style={{ width: 'fit-content' }} size="small" placeholder="选择关系" onChange={(value) => { this.changeData('optType', value) }} className="relationList"  dropdownMatchSelectWidth={false} value={this.saveData.optType}>
                                        {
                                            (() => {
                                                if (this.saveData.valueType == 6) {//等号右边选择函数的话，只有等于号
                                                    return func_OptTypeConstList.map((item, i) =>
                                                        <Select.Option value={item.code}>{item.value}</Select.Option>
                                                    )
                                                } else {

                                                    if (this.saveData.varDataType == 12) {//字符串类型用全部操作类型
                                                        return stringOptTypeList.map((item, i) =>
                                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                                        )
                                                    } else if (this.saveData.varDataType == 3 || this.saveData.varDataType == 4 || this.saveData.varDataType == -5) {//枚举好的数字操作类型
                                                        return number_3_4__5OptTypeConstList.map((item, i) =>
                                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                                        )
                                                    } else {
                                                        return otherOptTypeConstList.map((item, i) =>//其他操作类型
                                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                                        )
                                                    }
                                                }
                                                // this.props.optTypeList 这里是全部操作类型
                                            })()
                                        }
                                    </Select>
                            }

                            {
                                this.saveData.optType == 8 || this.saveData.optType == 9 ? ''
                                    :
                                    <Select dropdownMatchSelectWidth={false} disabled={this.props.disabled} size="small" placeholder="选择表达式值的类型"
                                        value={this.saveData.valueType == 0 ? 0 : this.saveData.valueType == 6 ? 6 : 'var'}
                                        onChange={(value) => {
                                            this.changeData('valueType', isNaN(value) ? 'var' : value);
                                            if (value === 6) {
                                                this.setState({ functionType: 'day', valueType: value });
                                                this.changeData('value', 'day');
                                            } else {
                                                this.setState({ valueType: value });
                                            }
                                        }} className="typeList">
                                        {
                                            (this.saveData.optType == 0 || this.props.node.valueType == 0) ?
                                                this.props.valueTypeList.map((item, i) =>
                                                    <Select.Option value={item.code}>{item.value}</Select.Option>
                                                )
                                                :
                                                valueTypeConstList.map((item, i) =>
                                                    <Select.Option value={item.code}>{item.value}</Select.Option>
                                                )
                                        }
                                    </Select>
                            }
                            {
                                (() => {
                                    if (this.saveData.optType != 8 && this.saveData.optType != 9) {
                                        switch (this.saveData.valueType) {
                                            case 0:
                                                if (common.isEmpty(this.saveData.value)) {
                                                    return <FixedValue disabled={this.props.disabled} style={{ border: 'none', width: 'fit-content' }} className="fix-value" size="small" type="tree" value={this.saveData.value} changeData={this.changeData} dataType={(publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float') && (this.saveData.optType == 6 || this.saveData.optType == 7) ? 12 : this.saveData.varDataType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                                                } else {
                                                    return <FixedValue disabled={this.props.disabled} style={{ border: 'none', width: 'fit-content' }} className="fix-value" size="small" type="tree" value={this.saveData.value} changeData={this.changeData} dataType={(publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float') && (this.saveData.optType == 6 || this.saveData.optType == 7) ? 12 : this.saveData.varDataType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                                                }
                                                break;
                                            case 6:
                                                return <Select
                                                    disabled={this.props.disabled}
                                                    size="small"
                                                    placeholder="选择函数"
                                                    value={this.saveData.value === 'day' ? 'day' : this.saveData.value === 'month' ? 'month' : this.saveData.value === 'quarter' ? 'quarter' : this.saveData.value === 'year' ? 'year' : this.saveData.value.split('·-·')[0]}
                                                    onChange={(value) => {
                                                        value === 'day' || value === 'month' || value === 'quarter' || value === 'year' ?
                                                            (() => { this.changeData('value', value); this.changeData('valueCode', value) })()
                                                            :
                                                            (() => { this.changeData('value', value + '·-·' + '1'); this.setState({ functionType: value }); })()
                                                    }}
                                                    className="functionList">
                                                    {timeFunc.map((item, i) =>
                                                        <Select.Option value={item.code} key={i}>{item.label}</Select.Option>
                                                    )}
                                                </Select>;
                                            case '0':
                                                if (common.isEmpty(this.saveData.value)) {
                                                    return <FixedValue disabled={this.props.disabled} style={{ border: 'none', width: 'fit-content' }} className="fix-value" size="small" type="tree" value={this.saveData.value} changeData={this.changeData} dataType={(publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float') && (this.saveData.optType == 6 || this.saveData.optType == 7) ? 12 : this.saveData.varDataType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                                                } else {
                                                    if (this.saveData.varDataType == 93) {
                                                        return <FixedValue disabled={this.props.disabled} style={{ border: 'none', width: '165px' }} className="fix-value" size="small" type="tree" value={this.saveData.value} changeData={this.changeData} dataType={(publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float') && (this.saveData.optType == 6 || this.saveData.optType == 7) ? 12 : this.saveData.varDataType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                                                    }
                                                    return <FixedValue disabled={this.props.disabled} style={{ border: 'none', width: 'fit-content' }} className="fix-value" size="small" type="tree" value={this.saveData.value} changeData={this.changeData} dataType={(publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float') && (this.saveData.optType == 6 || this.saveData.optType == 7) ? 12 : this.saveData.varDataType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                                                }
                                            case '6':
                                                return <Select
                                                    disabled={this.props.disabled}
                                                    size="small"
                                                    placeholder="选择函数"
                                                    value={this.saveData.value === 'day' ? 'day' : this.saveData.value === 'month' ? 'month' : this.saveData.value === 'quarter' ? 'quarter' : this.saveData.value === 'year' ? 'year' : this.saveData.value.split('·-·')[0]}
                                                    onChange={(value) => {
                                                        value === 'day' || value === 'month' || value === 'quarter' || value === 'year' ?
                                                            (() => { this.changeData('value', value); this.changeData('valueCode', value) })()
                                                            :
                                                            (() => { this.changeData('value', value + '·-·' + '1'); this.setState({ functionType: value }); })()
                                                    }}
                                                    className="functionList">
                                                    {timeFunc.map((item, i) =>
                                                        <Select.Option value={item.code} key={i}>{item.label}</Select.Option>
                                                    )}
                                                </Select>;
                                            default:
                                                return common.isEmpty(this.saveData.valueType) && common.isEmpty(this.saveData.valueCode) && common.isEmpty(this.saveData.valueDataType) ?
                                                    <Cascader style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量" value={common.isEmpty(this.saveData.value) ? [] : [this.saveData.valueType, this.saveData.valueCode + '·-·' + this.saveData.valueDataType]}
                                                        onChange={(value, selectedOptions) => {
                                                            this.changeData('valueType', value[0]);
                                                            this.changeData('valueCode', value[1].split('·-·')[0]);
                                                            this.changeData('value', value[1].split('·-·')[0]);
                                                            this.changeData('valueDataType', value[1].split('·-·')[1]);
                                                            this.changeData('valueName', selectedOptions[1].label);
                                                            this.changeData('valueDefaultValue', selectedOptions[1].defaultValue);
                                                        }} className="varList varlist-empty" options={this.props.cascadeData} placeholder="请选择" showSearch={{ filter }} />
                                                    :
                                                    <Cascader style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量" value={common.isEmpty(this.saveData.value) ? [] : [this.saveData.valueType, this.saveData.valueCode + '·-·' + this.saveData.valueDataType]}
                                                        onChange={(value, selectedOptions) => {
                                                            this.changeData('valueType', value[0]);
                                                            this.changeData('valueCode', value[1].split('·-·')[0]);
                                                            this.changeData('value', value[1].split('·-·')[0]);
                                                            this.changeData('valueDataType', value[1].split('·-·')[1]);
                                                            this.changeData('valueName', selectedOptions[1].label);
                                                            this.changeData('valueDefaultValue', selectedOptions[1].defaultValue);
                                                        }} className="varList" options={this.props.cascadeData} placeholder="请选择" showSearch={{ filter }} />

                                                break;
                                        }
                                    }

                                }
                                )()

                            }
                            {
                                this.saveData.optType == 8 || this.saveData.optType == 9 ? '' :
                                    this.saveData.value !== 'day' && this.saveData.value !== 'month' && this.saveData.value !== 'quarter' && this.saveData.value !== 'year' && this.saveData.valueType == 6 ?
                                        <InputNumber disabled={this.props.disabled} size="small" value={this.saveData.value ? Number(this.saveData.value.split('·-·')[1]) : 0} onChange={(value) => { this.changeData('value', this.state.functionType + '·-·' + value); this.changeData('valueCode', this.state.functionType + '·-·' + value); }} className="valueType" style={{ width: '95px' }} min={1} /> : ''
                            }
                            {/* 
                            {
                                this.props.nodeKey === 0 && toJS(this.props.conditionTreeStore.conditionTreeJson).length === 1 || this.props.disabled ? '' :
                                    <p style={{ marginTop: '-2px', float: 'right' }}>
                                        <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                    </p>
                            } */}
                            {
                                (() => {
                                    if (!this.props.disabled) {
                                        switch (this.props.nodeKey) {
                                            case 0:
                                                if (toJS(this.props.conditionTreeStore.conditionTreeJson).length === 1) {
                                                    return
                                                } else {
                                                    return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                        <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                    </p>
                                                }
                                                break;
                                            case '0·-·0':
                                                if (toJS(this.props.conditionTreeStore.conditionTreeJson).length === 1 && toJS(this.props.conditionTreeStore.conditionTreeJson)[0].conditions.length === 1) {
                                                    return
                                                } else {
                                                    return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                        <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                    </p>
                                                }
                                                break;
                                            case '0·-·0·-·0':
                                                if (toJS(this.props.conditionTreeStore.conditionTreeJson).length === 1 && toJS(this.props.conditionTreeStore.conditionTreeJson)[0].conditions.length === 1 && toJS(this.props.conditionTreeStore.conditionTreeJson)[0].conditions[0].conditions.length === 1) {
                                                    return
                                                } else {
                                                    return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                        <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                    </p>
                                                }
                                                break;
                                            default:
                                                return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                    <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                </p>
                                                break;
                                        }
                                    } else {

                                    }
                                })()
                            }


                        </div>
                        :
                        this.props.node.conditions.map((item, i) =>
                            <TreeCopy disabled={this.props.disabled} key={Math.random()} verifyConditionTreeFinish={this.props.verifyConditionTreeFinish} optTypeList={this.props.optTypeList} valueTypeList={this.props.valueTypeList} varTypeOfField={this.props.varTypeOfField} fieldList={this.props.fieldList} type={this.props.type} updateConditionTree={this.props.updateConditionTree} cascadeData={this.props.cascadeData} add={this.props.add} sub={this.props.sub} node={item} nodeKey={this.props.nodeKey + '·-·' + i} p_relType={this.state.parantRelType} ></TreeCopy>
                        )

                }
            </div>

        )
    }
}
Tree.propTypes = {
    typeList: PropTypes.array.isRequired,
    dimensionList: PropTypes.array.isRequired,
    valueType: PropTypes.oneOf([1, 2, 3]).isRequired,
    index: PropTypes.number,
    origin: PropTypes.oneOf(['and', 'or']),
    parentIndex: PropTypes.number,
    cascadeData: PropTypes.array,//级联选择数据
    cascadeDataNumber: PropTypes.array,//级联选择数据 number类型
    varTypeOfField: PropTypes.string,
    type: PropTypes.string,
    verifyConditionTreeFinish: PropTypes.func,
    optTypeList: PropTypes.array,
}
Tree.defaultProps = {
    valueType: 1,
    cascadeData: [],
    cascadeDataNumber: [],
    varTypeOfField: '',
    type: '',
    verifyConditionTreeFinish: () => { },
    optTypeList: [],
}
export default Tree;