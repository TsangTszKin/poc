/* eslint-disable no-empty */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Select, Divider, Cascader, Modal, Icon, Popover } from 'antd';
import '@/styles/condition-tree/tree.less';
import AddAndSub from '@/components/condition-tree/AddAndSub';
import TreeCopy from '@/components/condition-tree/Tree2.0.jsx';
import common from '@/utils/common';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import { toJS } from 'mobx';

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
            index: 0,
            parantRelType: this.props.node.relType,
            varParas: [],
            valueParas: [],
            varParamsModal: false,
            valueParamsModal: false,
            cateLeftVisible: false,
            cateRightVisible: false
        }
        this.saveData = {
            "varCategoryType": 1,
            "varTableAlias": "",
            "varType": '',
            "varDataType": "",
            "varCode": "",
            "varName": "",
            "varDefaultValue": "",
            "varValue": "",
            "varParas": [
                // {
                //   "code": "string",
                //   "dataSources": [
                //     {
                //       "additionalProp1": {},
                //       "additionalProp2": {},
                //       "additionalProp3": {}
                //     }
                //   ],
                //   "dataType": "string",
                //   "descript": "string",
                //   "formType": 0,
                //   "isDynamic": true,
                //   "name": "string",
                //   "value": {},
                //   "varType": 0
                // }
            ],

            "optType": '',

            "valueCategoryType": 0,//固定值
            "valueTableAlias": "",
            "valueType": '',
            "valueDataType": "",
            "valueCode": "",
            "valueName": "",
            "valueDefaultValue": "",
            "value": "",
            "valueParas": [
                // {
                //   "code": "string",
                //   "dataSources": [
                //     {
                //       "additionalProp1": {},
                //       "additionalProp2": {},
                //       "additionalProp3": {}
                //     }
                //   ],
                //   "dataType": "string",
                //   "descript": "string",
                //   "formType": 0,
                //   "isDynamic": true,
                //   "name": "string",
                //   "value": {},
                //   "varType": 0
                // }
            ]
        }
        this.staticConditionsAll = this.props.conditionsAll
        this.changeData = this.changeData.bind(this);
        if (!this.props.node.treeData && this.props.node.nodeType == 1) {
            let node = common.deepClone(this.props.node);
            this.saveData = {
                "varCategoryType": node.expressionVO.varCategoryType,
                "varTableAlias": node.expressionVO.varTableAlias,
                "varType": node.expressionVO.varType,
                "varDataType": node.expressionVO.varDataType,
                "varCode": node.expressionVO.varCode,
                "varName": node.expressionVO.varName,
                "varDefaultValue": node.expressionVO.varDefaultValue,
                "optType": node.expressionVO.optType,
                "valueCategoryType": node.expressionVO.valueCategoryType,
                "valueTableAlias": node.expressionVO.valueTableAlias,
                "valueType": node.expressionVO.valueType,
                "valueDataType": node.expressionVO.valueDataType,
                "valueCode": node.expressionVO.valueCode,
                "valueName": node.expressionVO.valueName,
                "valueDefaultValue": node.expressionVO.valueDefaultValue,
                "value": node.expressionVO.value,
                "varValue": node.expressionVO.varValue,
                "varParas": node.expressionVO.varParas ? node.expressionVO.varParas : [],
                "valueParas": node.expressionVO.valueParas ? node.expressionVO.valueParas : []
            }
            if (node.id) {
                this.saveData.id = node.expressionVO.id;
            } else {
                node.id = ''
            }
        }

    }

    componentWillReceiveProps(nextProps) {

        if (!nextProps.node.treeData && nextProps.node.nodeType === 1) {
            // console.warn(this.saveData);
            this.saveData.varCategoryType = nextProps.node.expressionVO.varCategoryType;
            this.saveData.varTableAlias = nextProps.node.expressionVO.varTableAlias;
            this.saveData.varType = nextProps.node.expressionVO.varType;
            this.saveData.varDataType = nextProps.node.expressionVO.varDataType;
            this.saveData.varCode = nextProps.node.expressionVO.varCode;
            this.saveData.varName = nextProps.node.expressionVO.varName;
            this.saveData.varDefaultValue = nextProps.node.expressionVO.varDefaultValue;
            this.saveData.valueDefaultValue = nextProps.node.expressionVO.valueDefaultValue;
            this.saveData.optType = nextProps.node.expressionVO.optType;
            this.saveData.valueCategoryType = nextProps.node.expressionVO.valueCategoryType;
            this.saveData.valueTableAlias = nextProps.node.expressionVO.valueTableAlias;
            this.saveData.valueType = nextProps.node.expressionVO.valueType;
            this.saveData.valueDataType = nextProps.node.expressionVO.valueDataType;
            this.saveData.valueCode = nextProps.node.expressionVO.valueCode;
            this.saveData.valueName = nextProps.node.expressionVO.valueName;
            this.saveData.valueDefaultValue = nextProps.node.expressionVO.valueDefaultValue;
            this.saveData.value = nextProps.node.expressionVO.value;
            this.saveData.varValue = nextProps.node.expressionVO.varValue;
            this.saveData.varParas = nextProps.node.expressionVO.varParas ? nextProps.node.expressionVO.varParas : [];
            this.saveData.valueParas = nextProps.node.expressionVO.valueParas ? nextProps.node.expressionVO.valueParas : [];
            if (!common.isEmpty(nextProps.node.id)) {
                this.saveData.id = nextProps.node.expressionVO.id;
            } else {
                this.saveData.id = '';
            }
            this.staticConditionsAll = nextProps.conditionsAll
            this.setState({ parantRelType: nextProps.node.relType })
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
            indentTimes,
            isFirstNode,
            isFirstNodes,
            relWidth
        })
    }

    componentWillUnmount() {
        this.saveData = this.props.conditionVODemo
    }


    changeData(name, value, nodeKey) {
        switch (name) {
            case 'value':
                if (!common.isEmpty(value) && value.length > 30 && this.saveData.valueCategoryType !== 1) {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', String(value).substr(0, 30));
                    this.saveData.value = String(value).substr(0, 30);
                } else {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', value);
                    this.saveData[name] = value;
                }
                // 输入固定值时候清空valueCode
                if (this.saveData.valueCategoryType === 0) {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCode', '');
                }
                break;
            case 'varValue':
                if (!common.isEmpty(value) && value.length > 30 && this.saveData.varCategoryType !== 1) {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varValue', String(value).substr(0, 30));
                    this.saveData.varValue = String(value).substr(0, 30);
                } else {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varValue', value);
                    this.saveData[name] = value;
                }
                break;
            case 'varDataType':
                if (value !== this.saveData.varDataType) {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'optType', '');
                    this.saveData.optType = '';
                }
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, name, value);
                this.saveData[name] = value;
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCategoryType', 0);
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCode', '');
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueType', 0);
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', '');
                this.saveData.valueCategoryType = 0;
                this.saveData.valueCode = '';
                this.saveData.valueType = 0;
                this.saveData.value = '';

                break;
            case 'valueCategoryType':
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCategoryType', value);
                this.saveData.valueCategoryType = value;
                if (value == 2) {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCode', '');
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueType', 6);
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', '');
                    this.saveData.valueCode = '';
                    this.saveData.valueType = 6;
                    this.saveData.value = '';
                } else {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCode', '');
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueType', '');
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', '');
                    this.saveData.valueCode = '';
                    this.saveData.valueType = '';
                    this.saveData.value = '';
                }
                break;
            case 'varCategoryType':
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varCategoryType', value);
                this.saveData.varCategoryType = value;
                if (value == 2) {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varCode', '');
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varType', 6);
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varValue', '');
                    this.saveData.varCode = '';
                    this.saveData.varType = 6;
                    this.saveData.varValue = '';
                    this.setState({
                        functionType_left: ''
                    })
                } else {
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varCode', '');
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varType', '');
                    this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varValue', '');
                    this.saveData.varCode = '';
                    this.saveData.varType = '';
                    this.saveData.varValue = '';
                }

                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCategoryType', 0);
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueCode', '');
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueType', 0);
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'valueDataType', '');
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'value', '');
                this.saveData.valueCategoryType = 0;
                this.saveData.valueCode = '';
                this.saveData.valueType = 0;
                this.saveData.valueDataType = '';
                this.saveData.value = '';
                break;
            default:
                this.props.conditionTreeStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, name, value);
                this.saveData[name] = value;
                break;
        }
        this.props.updateConditionTree(this.props.conditionTreeStore.getConditionsAll);
        this.props.verifyConditionTreeFinish();
        this.staticConditionsAll = common.deepClone(this.props.conditionTreeStore.getConditionsAll)
        this.setState({ index: Math.random() })
    }

    render() {


        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
        let prefixSelectorCommon1 =
            <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
                <Select
                    disabled={this.props.disabled}
                    style={{ zIndex: '1' }}
                    // defaultValue={this.props.p_relType}
                    defaultValue={(() => {
                        try {
                            let nodeKey = String(this.props.nodeKey);
                            let keys = nodeKey.split('·-·');
                            let conditionsAll = this.staticConditionsAll
                            return conditionsAll.conditions[keys[0]].conditions[keys[1]].relType
                        } catch (error) {
                            return undefined
                        }
                    })()}
                    dropdownMatchSelectWidth={false}
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
                                onClick={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, false, this.props.extraType)}
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
                    // defaultValue={this.props.p_relType}
                    defaultValue={(() => {
                        try {
                            let nodeKey = String(this.props.nodeKey);
                            let keys = nodeKey.split('·-·');
                            let conditionsAll = this.staticConditionsAll
                            switch (keys.length) {
                                case 2:
                                    return conditionsAll.conditions[keys[0]].relType
                                case 3:
                                    return conditionsAll.conditions[keys[0]].relType
                                default:
                                    return undefined
                            }
                        } catch (error) {
                            return undefined
                        }
                    })()}
                    onChange={(value) => {
                        let realNodeKey = '';

                        let nodeKey = String(this.props.nodeKey);
                        let keys = nodeKey.split('·-·');
                        switch (keys.length) {
                            case 2:
                                realNodeKey = `${keys[0]}·-·${keys[1]}`;
                                break
                            case 3:
                                realNodeKey = `${keys[0]}·-·${keys[1]}`;
                                break
                            default:
                                break
                        }

                        this.changeData('relType', value, realNodeKey)
                    }}
                    size="small"
                    dropdownStyle={{
                        fontSize: '10px'
                    }}
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ padding: '8px', cursor: 'pointer' }}
                                onClick={() => this.props.add(this.props.nodeKey.split('·-·')[0] + '·-·0', 'and', this.props.node.expressionVO, false, this.props.extraType)}
                            >
                                添加条件
                            </div>
                            {
                                ['easyStrategyTable', 'crossTable'].includes(this.props.extraType) ? '' :
                                    <div style={{ padding: '8px', cursor: 'pointer' }}
                                        onClick={() => this.props.add(this.props.nodeKey, 'and', this.props.node.expressionVO, true, this.props.extraType)}
                                    >
                                        添加联合条件
                                    </div>
                            }
                        </div>
                    )}
                >
                    <Select.Option value={0}>并且</Select.Option>
                    <Select.Option value={1}>或者</Select.Option>
                </Select>
            </div>

        const selectStart = <div onMouseDown={(e) => { e.preventDefault(); return false; }} >
            <Select
                disabled={this.props.disabled}
                // defaultValue={this.props.p_relType}
                defaultValue={(() => {
                    try {
                        let conditionsAll = this.staticConditionsAll
                        return conditionsAll.relType
                    } catch (error) {
                        return undefined
                    }
                })()}
                dropdownMatchSelectWidth={false}
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
                            onClick={() => this.props.add(0, 'and', this.props.node.expressionVO, false, this.props.extraType)}
                        >
                            添加条件
                        </div>
                        {
                            ['easyStrategyTable', 'crossTable'].includes(this.props.extraType) ? '' :
                                <div style={{ padding: '8px', cursor: 'pointer' }}
                                    onClick={() => this.props.add(0, 'and', this.props.node.expressionVO, true, this.props.extraType)}
                                >
                                    添加联合条件
                                </div>
                        }
                    </div>
                )}
            >
                <Select.Option value={0}>并且</Select.Option>
                <Select.Option value={1}>或者</Select.Option>
            </Select>
        </div>
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        // 左边类型选择 start
        let changeCategoryTypeLeft = (value) => {
            this.changeData('varParas', []);
            this.changeData('varCategoryType', value);
            if (value !== 2) {
                this.changeData('varParas', []);
            }
            this.setState({ cateLeftVisible: false })
        }

        const categoryTypeLeft_Common = (
            <div className="category-type" >
                <p className="cate" onClick={() => changeCategoryTypeLeft(1)}>变量</p>
                <p className="cate" onClick={() => changeCategoryTypeLeft(2)}>函数</p>
            </div>
        )

        const categoryTypeLeft_decisionTable = (
            <div className="category-type" >
                <p className="cate" onClick={() => changeCategoryTypeLeft(1)}>变量</p>
            </div>
        )

        const categoryTypeLeft_having = (
            <div className="category-type" >
                {
                    this.props.leftExpressionCategoryType.map((item, i) =>
                        <p className="cate" key={i} onClick={() => changeCategoryTypeLeft(item.val)}>{item.label}</p>
                    )
                }

            </div>
        )
        // end

        //右边类型选择 satrt
        let changeCategoryTypeRight = (value) => {
            this.changeData('valueParas', []);
            this.changeData('valueCategoryType', value);
            if (value !== 2) {
                this.changeData('valueParas', []);
            }
            this.setState({ cateRightVisible: false })
        }

        const categoryTypeRight_Common = (
            <div className="category-type" >
                {
                    this.props.expressionCategoryType.map((item, i) =>
                        <p className="cate" key={i} onClick={() => changeCategoryTypeRight(item.val)}>{item.label}</p>
                    )
                }
            </div>
        )

        const categoryTypeRight_having = (
            <div className="category-type" >
                {
                    this.props.rightExpressionCategoryType.map((item, i) =>
                        <p className="cate" key={i} onClick={() => changeCategoryTypeRight(item.val)}>{item.label}</p>
                    )
                }
            </div>
        )

        return (
            <div style={{ clear: 'both' }}>
                {/* {this.props.p_relType} */}
                {/* {this.props.nodeKey} */}
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
                                                        let rs;
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
                            {/* varCategoryType */}
                            {
                                (() => {
                                    switch (this.props.type) {
                                        case 'common':
                                            // 简单决策表、评分卡不显示
                                            if (['easyStrategyTable'].includes(this.props.extraType)) {
                                                return '';
                                            }
                                            // 交叉决策表只可以选择变量
                                            else if (['crossTable'].includes(this.props.extraType)) {
                                                return <Popover content={categoryTypeLeft_decisionTable} title="更换值类型" trigger="click" >
                                                    <p className="cate"></p>
                                                </Popover>
                                            }
                                            else {
                                                return <Popover
                                                    content={categoryTypeLeft_Common} title="更换值类型" trigger="click" >
                                                    <p className="cate"></p>
                                                </Popover>
                                            }
                                        case 'having':
                                            return <Popover content={categoryTypeLeft_having} title="更换值类型" trigger="click" >
                                                <p className="cate" ></p>
                                            </Popover>
                                        default:
                                            break;
                                    }
                                })()
                            }
                            {/* varType */}
                            {
                                (() => {
                                    switch (this.saveData.varCategoryType) {
                                        case 1://变量
                                            //字符串（全部变量下拉选择）
                                            return common.isEmpty(this.saveData.varType) && common.isEmpty(this.saveData.varCode) ?
                                                <Cascader
                                                    style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small"
                                                    displayRender={label => label[1]}
                                                    onChange={(value, selectedOptions) => {
                                                        this.changeData('varType', selectedOptions[0].type);
                                                        this.changeData('varCode', selectedOptions[1].code);
                                                        this.changeData('varValue', selectedOptions[1].varJson);
                                                        this.changeData('varDataType', selectedOptions[1].type);
                                                        this.changeData('varName', selectedOptions[1].name);
                                                        this.changeData('varTableAlias', selectedOptions[1].tableAlias);
                                                        if (this.props.type === 'having') {
                                                            this.changeData('varTableAlias', 'H');
                                                        }
                                                        this.changeData('varDefaultValue', selectedOptions[1].defaultValue);
                                                    }}
                                                    className="varList varlist-empty"
                                                    options={(() => {
                                                        switch (this.props.type) {
                                                            case 'common':
                                                                return this.props.VAR_SELECTION_ALL
                                                            case 'having':
                                                                return this.props.LEFT_VAR_SELECTION
                                                            default:
                                                                return []
                                                        }
                                                    })()}
                                                    fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                    placeholder="请选择变量"
                                                    showSearch={{ filter }}
                                                    disabled={this.props.disabled || ['easyStrategyTable'].includes(this.props.extraType)}
                                                />
                                                :
                                                <Cascader
                                                    style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" value={[this.saveData.varType, this.saveData.varCode]}
                                                    displayRender={label => label[1]}
                                                    onChange={(value, selectedOptions) => {
                                                        console.log("value, selectedOptions", value, selectedOptions)
                                                        this.changeData('varType', selectedOptions[0].type);
                                                        this.changeData('varCode', selectedOptions[1].code);
                                                        this.changeData('varValue', selectedOptions[1].varJson);
                                                        this.changeData('varDataType', selectedOptions[1].type);
                                                        this.changeData('varName', selectedOptions[1].name);
                                                        this.changeData('varTableAlias', selectedOptions[1].tableAlias);
                                                        if (this.props.type === 'having') {
                                                            this.changeData('varTableAlias', 'H');
                                                        }
                                                        this.changeData('varDefaultValue', selectedOptions[1].defaultValue);
                                                    }}
                                                    className="varList"
                                                    options={(() => {
                                                        switch (this.props.type) {
                                                            case 'common':
                                                                return this.props.VAR_SELECTION_ALL
                                                            case 'having':
                                                                return this.props.LEFT_VAR_SELECTION
                                                            default:
                                                                return []
                                                        }
                                                    })()}
                                                    fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                    placeholder="请选择变量"
                                                    showSearch={{ filter }}
                                                    disabled={this.props.disabled || ['easyStrategyTable'].includes(this.props.extraType)}
                                                />
                                        case 2://函数
                                            return <Select
                                                disabled={this.props.disabled}
                                                dropdownMatchSelectWidth={false}
                                                size="small"
                                                placeholder="选择函数"
                                                style={{ minWidth: '85px' }}
                                                value={common.isEmpty(this.saveData.varCode) ? undefined : this.saveData.varCode}
                                                onChange={(value, option) => {
                                                    this.changeData('varCode', value);
                                                    this.changeData('varName', option.props.label);
                                                    this.changeData('varDataType', option.props.dataTypeOrdinal);
                                                    this.changeData('valueParas', []);
                                                    let params = [];
                                                    common.deepClone(option.props.params).forEach(element => {
                                                        element.descript = '';
                                                        element.value = '';
                                                        element.varType = '';
                                                        params.push(element);
                                                    })
                                                    this.changeData('varParas', params);
                                                    if (this.props.type === 'having') {
                                                        this.changeData('varTableAlias', 'H');
                                                    }
                                                    console.log("option.props.params", option.props.params)
                                                }}
                                                className="functionList">
                                                {
                                                    (() => {
                                                        switch (this.props.type) {
                                                            case 'common':
                                                                return this.props.functionComputeType.map((item, i) =>
                                                                    <Select.Option value={item.val} key={i} label={item.label} params={item.params} dataTypeOrdinal={item.dataTypeOrdinal}>{item.label}</Select.Option>
                                                                )
                                                            case 'having':
                                                                return this.props.functionAggType.map((item, i) =>
                                                                    <Select.Option value={String(item.val)} key={i} label={item.label} params={item.params} dataTypeOrdinal={item.dataTypeOrdinal}>{item.label}</Select.Option>
                                                                )
                                                            default:
                                                                break;
                                                        }
                                                    })()
                                                }
                                            </Select>;
                                    }

                                }
                                )()

                            }
                            {/* varParas */}
                            <p
                                disabled={this.props.disabled}
                                onClick={() => {
                                    if (this.props.disabled) return
                                    this.setState({ varParamsModal: true });
                                }}
                                style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px', display: this.saveData.varCategoryType === 2 ? 'block' : 'none' }}
                            >
                                <a
                                    style={{ cursor: this.props.disabled ? 'not-allowed' : 'pointer' }}
                                >
                                    {
                                        (() => {
                                            let getParamName = (varType, value) => {
                                                let name = '';
                                                (() => {
                                                    switch (this.props.type) {
                                                        case 'common':
                                                            return this.props.VAR_SELECTION_ALL
                                                        case 'having':
                                                            return this.props.LEFT_FUN_SELECTION
                                                        default:
                                                            break;
                                                    }
                                                })().forEach(element => {
                                                    if (varType === element.type) {
                                                        element.list.forEach(element2 => {
                                                            if (element2.code === value) name = element2.name
                                                        })
                                                    }
                                                })
                                                return name
                                            }

                                            if (common.isEmpty(this.saveData.varParas)) {
                                                return ''
                                            } else {
                                                let params = [];
                                                common.deepClone(this.saveData.varParas).forEach((element) => {
                                                    let parmaLabel = '';
                                                    if (element.formType === 3) {
                                                        parmaLabel = getParamName(element.varType, element.value);
                                                    } else {
                                                        parmaLabel = element.value
                                                    }
                                                    params.push(common.isEmpty(element.value) ? '未定义参数' : parmaLabel);
                                                })
                                                return `（${params.join('，')}）`;
                                            }
                                        })()
                                    }
                                </a>
                            </p>
                            {/* optType */}
                            {
                                this.saveData.varCategoryType === 2 && (() => {
                                    let functionComputeType = (() => {
                                        switch (this.props.type) {
                                            case 'common':
                                                return this.props.functionComputeType
                                            case 'having':
                                                return this.props.functionAggType
                                            default:
                                                break;
                                        }
                                    })()
                                    for (let i = 0; i < functionComputeType.length; i++) {
                                        const element = functionComputeType[i];
                                        if (element.val === this.saveData.varCode) {
                                            return element.dataType
                                        }
                                    }
                                    return ''
                                })() === 'EXPRESSION' ?//函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                                    '' :
                                    < Select disabled={this.props.disabled} style={{ width: common.isEmpty(this.saveData.optType) ? '68px' : 'fit-content' }} size="small" placeholder="选择关系" onChange={(value) => { this.changeData('optType', value) }} className="relationList"
                                        dropdownMatchSelectWidth={false} value={common.isEmpty(this.saveData.optType) ? undefined : this.saveData.optType}>
                                        {
                                            (() => {
                                                let _stringOptTypeList = stringOptTypeList;
                                                let _number_3_4__5OptTypeConstList = number_3_4__5OptTypeConstList;
                                                let _otherOptTypeConstList = otherOptTypeConstList;
                                                if (this.props.extraType === 'connect') {
                                                    _stringOptTypeList = _stringOptTypeList.filter(el => el.value !== '不类似' && el.value !== '类似')
                                                    _number_3_4__5OptTypeConstList = _number_3_4__5OptTypeConstList.filter(el => el.value !== '不类似' && el.value !== '类似')
                                                    _otherOptTypeConstList = _otherOptTypeConstList.filter(el => el.value !== '不类似' && el.value !== '类似')
                                                }
                                                if (this.saveData.varDataType == 12) {//字符串类型用字符串下拉选择操作类型
                                                    return _stringOptTypeList.map((item, i) =>
                                                        <Select.Option value={item.code} key={i}>{item.value}</Select.Option>
                                                    )
                                                } else if (this.saveData.varDataType == 3 || this.saveData.varDataType == 4 || this.saveData.varDataType == -5) {//枚举好的数字操作类型
                                                    return _number_3_4__5OptTypeConstList.map((item, i) =>
                                                        <Select.Option value={item.code} key={i}>{item.value}</Select.Option>
                                                    )
                                                } else {
                                                    return _otherOptTypeConstList.map((item, i) =>//其他操作类型
                                                        <Select.Option value={item.code} key={i}>{item.value}</Select.Option>
                                                    )
                                                }
                                                // this.props.optTypeList 这里是全部操作类型
                                            })()
                                        }
                                    </Select>

                            }
                            {/* valueCategoryType */}
                            {
                                this.saveData.optType == 8 || this.saveData.optType == 9 ||
                                    this.saveData.varCategoryType === 2 && (() => {
                                        let functionComputeType = (() => {
                                            switch (this.props.type) {
                                                case 'common':
                                                    return this.props.functionComputeType
                                                case 'having':
                                                    return this.props.functionAggType
                                                default:
                                                    break;
                                            }
                                        })()
                                        for (let i = 0; i < functionComputeType.length; i++) {
                                            const element = functionComputeType[i];
                                            if (element.val === this.saveData.varCode) {
                                                return element.dataType
                                            }
                                        }
                                        return ''
                                    })() === 'EXPRESSION' ? ''//is null或者 is not null就不显示   或者 是 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                                    :
                                    (() => {
                                        switch (this.props.type) {
                                            case 'common':
                                                return <Popover
                                                    content={categoryTypeRight_Common} title="更换值类型" trigger="click" >
                                                    <p className="cate"></p>
                                                </Popover>
                                            case 'having':
                                                return <Popover content={categoryTypeRight_having} title="更换值类型" trigger="click" >
                                                    <p className="cate" ></p>
                                                </Popover>
                                            default:
                                                break;
                                        }
                                    })()
                            }
                            {/* valueType */}
                            {
                                this.saveData.varCategoryType === 2 && (() => {
                                    let functionComputeType = (() => {
                                        switch (this.props.type) {
                                            case 'common':
                                                return this.props.functionComputeType
                                            case 'having':
                                                return this.props.functionAggType
                                            default:
                                                break;
                                        }
                                    })()
                                    for (let i = 0; i < functionComputeType.length; i++) {
                                        const element = functionComputeType[i];
                                        if (element.val === this.saveData.varCode) {
                                            return element.dataType
                                        }
                                    }
                                    return ''
                                })() === 'EXPRESSION' ?//函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                                    '' :
                                    (() => {
                                        if (this.saveData.optType != 8 && this.saveData.optType != 9) {//不是is null和is not null的时候
                                            switch (this.saveData.valueCategoryType) {
                                                case 0://固定值
                                                    const maxAndMin = {};
                                                    if (this.saveData.varDataType === -5) {
                                                        maxAndMin.min = -2147483647;
                                                        maxAndMin.max = 2147483647;
                                                    }
                                                    return <FixedValue
                                                        { ...maxAndMin }
                                                        disabled={this.props.disabled}
                                                        style={{ border: 'none', width: this.saveData.varDataType == 93 ? '165px' : 'fit-content' }}
                                                        className="fix-value" size="small" type="tree" value={this.saveData.value}
                                                        changeData={this.changeData}
                                                        dataType={
                                                            (publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float')
                                                                &&
                                                                (this.saveData.optType == 6 || this.saveData.optType == 7)
                                                                ? 12//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)（伟东说的） 
                                                                : this.saveData.varDataType
                                                        } />;
                                                case 2://函数
                                                    return <Select
                                                        disabled={this.props.disabled}
                                                        dropdownMatchSelectWidth={false}
                                                        size="small"
                                                        placeholder="选择函数"
                                                        style={{ minWidth: '85px' }}
                                                        value={common.isEmpty(this.saveData.valueCode) ? undefined : this.saveData.valueCode}
                                                        onChange={(value, option) => {
                                                            this.changeData('valueCode', value);
                                                            this.changeData('valueName', option.props.label);
                                                            this.changeData('valueDataType', option.props.dataTypeOrdinal);
                                                            let params = [];
                                                            common.deepClone(option.props.params).forEach(element => {
                                                                element.descript = '';
                                                                element.value = '';
                                                                element.varType = '';
                                                                params.push(element);
                                                            })
                                                            this.changeData('valueParas', params);
                                                            if (this.props.type === 'having') {
                                                                this.changeData('valueTableAlias', 'H');
                                                            }
                                                        }}
                                                        className="functionList">
                                                        {
                                                            (() => {
                                                                let functionComputeType = []
                                                                switch (this.props.type) {
                                                                    case 'common':
                                                                        functionComputeType = this.props.functionComputeType
                                                                        break;
                                                                    case 'having':
                                                                        functionComputeType = this.props.functionAggType
                                                                        break;
                                                                    default:
                                                                        break;
                                                                }

                                                                let result = [];
                                                                for (let i = 0; i < functionComputeType.length; i++) {
                                                                    const element = functionComputeType[i];
                                                                    if (publicUtils.getVarDataType(this.saveData.varDataType) === 'int' || publicUtils.getVarDataType(this.saveData.varDataType) === 'float') {
                                                                        if (publicUtils.getVarDataType(element.dataTypeOrdinal) === 'int' || publicUtils.getVarDataType(element.dataTypeOrdinal) === 'float') {
                                                                            result.push(element)
                                                                        }
                                                                    } else {
                                                                        if (element.dataTypeOrdinal === this.saveData.varDataType) {
                                                                            result.push(element)
                                                                        }
                                                                    }

                                                                }
                                                                return result
                                                            })().map((item, i) =>
                                                                <Select.Option value={item.val} key={i} label={item.label} params={item.params} dataTypeOrdinal={item.dataTypeOrdinal}>{item.label}</Select.Option>
                                                            )}
                                                    </Select>;
                                                default:
                                                    //变量
                                                    return common.isEmpty(this.saveData.valueType) && common.isEmpty(this.saveData.valueCode) ?
                                                        <Cascader style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small"
                                                            displayRender={label => label[1]}
                                                            onChange={(value, selectedOptions) => {
                                                                this.changeData('valueType', selectedOptions[0].type);
                                                                this.changeData('valueCode', selectedOptions[1].code);
                                                                this.changeData('value', selectedOptions[1].varJson);
                                                                this.changeData('valueDataType', selectedOptions[1].type);
                                                                this.changeData('valueName', selectedOptions[1].name);
                                                                this.changeData('valueTableAlias', selectedOptions[1].tableAlias);
                                                                if (this.props.type === 'having') {
                                                                    this.changeData('valueTableAlias', 'H');
                                                                }
                                                                this.changeData('valueDefaultValue', selectedOptions[1].defaultValue);
                                                            }}
                                                            className="varList varlist-empty"
                                                            options={(() => {
                                                                if (this.props.type === 'common') {
                                                                    switch (publicUtils.getVarDataType(this.saveData.varDataType)) {
                                                                        case 'string':
                                                                            return this.props.VAR_SELECTION_ALL
                                                                        case 'int':
                                                                            return this.props.VAR_SELECTION_NUMBER
                                                                        case 'float':
                                                                            return this.props.VAR_SELECTION_NUMBER
                                                                        case 'time':
                                                                            return this.props.VAR_SELECTION_TIMESTAMP
                                                                        default:
                                                                            return []
                                                                    }
                                                                }
                                                                if (this.props.type === 'having') {
                                                                    return this.props.RIGHT_VAR_SELECTION_NUMBER
                                                                }
                                                                return []
                                                            })()}
                                                            fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                            placeholder="请选择变量"
                                                            showSearch={{ filter }}
                                                            disabled={this.props.disabled} />
                                                        :
                                                        <Cascader style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" value={common.isEmpty(this.saveData.valueType) ? [] : [this.saveData.valueType, this.saveData.valueCode]}
                                                            displayRender={label => label[1]}
                                                            onChange={(value, selectedOptions) => {
                                                                this.changeData('valueType', selectedOptions[0].type);
                                                                this.changeData('valueCode', selectedOptions[1].code);
                                                                this.changeData('value', selectedOptions[1].varJson);
                                                                this.changeData('valueDataType', selectedOptions[1].type);
                                                                this.changeData('valueName', selectedOptions[1].name);
                                                                this.changeData('valueTableAlias', selectedOptions[1].tableAlias);
                                                                if (this.props.type === 'having') {
                                                                    this.changeData('valueTableAlias', 'H');
                                                                }
                                                                this.changeData('valueDefaultValue', selectedOptions[1].defaultValue);
                                                            }}
                                                            className="varList"
                                                            options={(() => {
                                                                if (this.props.type === 'common') {
                                                                    switch (publicUtils.getVarDataType(this.saveData.varDataType)) {
                                                                        case 'string':
                                                                            return this.props.VAR_SELECTION_ALL
                                                                        case 'int':
                                                                            return this.props.VAR_SELECTION_NUMBER
                                                                        case 'float':
                                                                            return this.props.VAR_SELECTION_NUMBER
                                                                        case 'time':
                                                                            return this.props.VAR_SELECTION_TIMESTAMP
                                                                        default:
                                                                            return []
                                                                    }
                                                                }
                                                                if (this.props.type === 'having') {
                                                                    return this.props.RIGHT_VAR_SELECTION_NUMBER
                                                                }
                                                                return []
                                                            })()}
                                                            fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                            placeholder="请选择变量"
                                                            showSearch={{ filter }}
                                                            disabled={this.props.disabled}
                                                        />
                                            }
                                        }

                                    }
                                    )()
                            }
                            {/* valueParas */}
                            {
                                this.saveData.varCategoryType === 2 && (() => {
                                    let functionComputeType = (() => {
                                        switch (this.props.type) {
                                            case 'common':
                                                return this.props.functionComputeType
                                            case 'having':
                                                return this.props.functionAggType
                                            default:
                                                break;
                                        }
                                    })()
                                    for (let i = 0; i < functionComputeType.length; i++) {
                                        const element = functionComputeType[i];
                                        if (element.val === this.saveData.varCode) {
                                            return element.dataType
                                        }
                                    }
                                    return ''
                                })() === 'EXPRESSION' ?//函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                                    '' :
                                    <p disabled={this.props.disabled}
                                        onClick={() => {
                                            if (this.props.disabled) return
                                            this.setState({ valueParamsModal: true });
                                        }} style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px', display: this.saveData.valueCategoryType === 2 ? 'block' : 'none' }}>
                                        <a>
                                            {
                                                (() => {
                                                    let getParamName = (varType, value) => {
                                                        let name = '';
                                                        (() => {
                                                            switch (this.props.type) {
                                                                case 'common':
                                                                    return this.props.VAR_SELECTION_ALL
                                                                case 'having':
                                                                    return this.props.RIGHT_VAR_SELECTION_ALL
                                                                default:
                                                                    break;
                                                            }
                                                        })().forEach(element => {
                                                            if (varType === element.type) {
                                                                element.list.forEach(element2 => {
                                                                    if (element2.code === value) name = element2.name
                                                                })
                                                            }
                                                        })
                                                        return name
                                                    }

                                                    if (common.isEmpty(this.saveData.valueParas)) {
                                                        return ''
                                                    } else {
                                                        let params = [];
                                                        common.deepClone(this.saveData.valueParas).forEach((element) => {
                                                            let parmaLabel = '';
                                                            if (element.formType === 3) {
                                                                parmaLabel = getParamName(element.varType, element.value);
                                                            } else {
                                                                parmaLabel = element.value
                                                            }
                                                            params.push(common.isEmpty(element.value) ? '未定义参数' : parmaLabel);
                                                        })
                                                        return `（${params.join('，')}）`;
                                                    }
                                                })()
                                            }
                                        </a>
                                    </p>
                            }
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
                                            case '0·-·0':
                                                if (toJS(this.props.conditionTreeStore.conditionTreeJson).length === 1 && toJS(this.props.conditionTreeStore.conditionTreeJson)[0].conditions.length === 1) {
                                                    return
                                                } else {
                                                    return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                        <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                    </p>
                                                }
                                            case '0·-·0·-·0':
                                                if (toJS(this.props.conditionTreeStore.conditionTreeJson).length === 1 && toJS(this.props.conditionTreeStore.conditionTreeJson)[0].conditions.length === 1 && toJS(this.props.conditionTreeStore.conditionTreeJson)[0].conditions[0].conditions.length === 1) {
                                                    return
                                                } else {
                                                    return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                        <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                    </p>
                                                }
                                            default:
                                                return <p style={{ marginTop: '-2px', float: 'right' }}>
                                                    <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                                </p>
                                        }
                                    } else {

                                    }
                                })()
                            }


                        </div>
                        :
                        this.props.node.conditions.map((item, i) =>
                            <TreeCopy
                                key={Math.random()}
                                type={this.props.type}
                                extraType={this.props.extraType}
                                disabled={this.props.disabled}
                                add={this.props.add}
                                sub={this.props.sub}
                                node={item}
                                p_relType={this.state.parantRelType}//父节点的relTyoe
                                nodeKey={this.props.nodeKey + '·-·' + i}
                                updateConditionTree={this.props.updateConditionTree}//更新条件树的回调
                                verifyConditionTreeFinish={this.props.verifyConditionTreeFinish}//校验条件树形是否填写完整的回调函数
                                conditionVODemo={this.props.conditionVODemo}
                                conditionsAll={this.props.conditionsAll}
                                // 后端统一返回的下拉选择数据 start
                                // common start
                                VAR_SELECTION_ALL={this.props.VAR_SELECTION_ALL}
                                VAR_SELECTION_DECIMAL={this.props.VAR_SELECTION_DECIMAL}
                                VAR_SELECTION_INTEGER={this.props.VAR_SELECTION_INTEGER}
                                VAR_SELECTION_NUMBER={this.props.VAR_SELECTION_NUMBER}
                                VAR_SELECTION_TIMESTAMP={this.props.VAR_SELECTION_TIMESTAMP}
                                VAR_SELECTION_VARCHAR={this.props.VAR_SELECTION_VARCHAR}
                                expressionCategoryType={this.props.expressionCategoryType}
                                expressionVarType={this.props.expressionVarType}
                                functionComputeType={this.props.functionComputeType}
                                optTypeList={this.props.optTypeList}
                                // common end
                                // having start
                                LEFT_VAR_SELECTION={this.props.LEFT_VAR_SELECTION}
                                LEFT_FUN_SELECTION={this.props.LEFT_FUN_SELECTION}
                                RIGHT_VAR_SELECTION_ALL={this.props.RIGHT_VAR_SELECTION_ALL}
                                RIGHT_VAR_SELECTION_DECIMAL={this.props.RIGHT_VAR_SELECTION_DECIMAL}
                                RIGHT_VAR_SELECTION_INTEGER={this.props.RIGHT_VAR_SELECTION_INTEGER}
                                RIGHT_VAR_SELECTION_NUMBER={this.props.RIGHT_VAR_SELECTION_NUMBER}
                                RIGHT_VAR_SELECTION_TIMESTAMP={this.props.RIGHT_VAR_SELECTION_TIMESTAMP}
                                RIGHT_VAR_SELECTION_VARCHAR={this.props.RIGHT_VAR_SELECTION_VARCHAR}
                                functionAggType={this.props.functionAggType}
                                leftExpressionCategoryType={this.props.leftExpressionCategoryType}
                                leftExpressionVarType={this.props.leftExpressionVarType}
                                rightExpressionCategoryType={this.props.rightExpressionCategoryType}
                                rightExpressionVarType={this.props.rightExpressionVarType}
                            // having end
                            // 后端统一返回的下拉选择数据 end
                            ></TreeCopy>
                        )

                }

                <Modal
                    title="编辑函数的参数"
                    visible={this.state.varParamsModal}
                    onOk={() => {
                        this.setState({
                            varParamsModal: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            varParamsModal: false
                        })
                    }}
                    wrapClassName="params-modal"
                    destroyOnClose={true}
                >

                    {
                        this.saveData.varParas.map((item, i) => {
                            return (() => {
                                switch (item.formType) {
                                    case 1:
                                        return <div style={style.paramsCell}> {item.name}：
                                            <FixedValue
                                                key={i}
                                                style={{ width: item.dataType === 'DATE' ? '165px' : 'fit-content' }}
                                                size="small" type="tree"
                                                value={item.value}
                                                changeData={(name, value) => {
                                                    let varParas = this.saveData.varParas;
                                                    varParas[i].value = value;
                                                    this.changeData('varParas', varParas);
                                                }}
                                                dataType={(() => {
                                                    switch (item.dataType) {
                                                        case 'STRING':
                                                            return 12
                                                        case 'OBJECT':
                                                            return 12
                                                        case 'INTEGER':
                                                            return 5
                                                        case 'FLOAT':
                                                            return 3
                                                        case 'DATE':
                                                            return 93
                                                        default:
                                                            return ''
                                                    }
                                                })()}
                                                min={!common.isEmpty(item.min) ? item.min : -32768}
                                                max={!common.isEmpty(item.max) ? item.max : 32767}
                                            />
                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let varParas = common.deepClone(this.saveData.varParas);
                                                let newItem = common.deepClone(item);
                                                newItem.value = '';
                                                newItem.varType = '';
                                                varParas.splice(i + 1, 0, newItem);
                                                this.changeData('varParas', varParas);
                                            }} />
                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let varParas = common.deepClone(this.saveData.varParas);
                                                varParas.splice(i, 1);
                                                this.changeData('varParas', varParas);
                                            }} />
                                        </div>
                                    case 2:
                                        return <div style={style.paramsCell}>
                                            {item.name}：<Select key={i} style={{ minWidth: '100px', width: 'fit-content' }} size="small"
                                                dropdownMatchSelectWidth={false} placeholder="请选择参数"
                                                onChange={(value, option) => {
                                                    let varParas = this.saveData.varParas;
                                                    varParas[i].value = option.props.val;
                                                    this.changeData('varParas', varParas);
                                                }}
                                                value={common.isEmpty(item.value) ? undefined : item.value}
                                            >
                                                {
                                                    item.dataSources.map((item2, j) =>
                                                        <Select.Option key={j} value={item2.val} val={item2.val} label={item2.label}>{item2.label}</Select.Option>
                                                    )
                                                }
                                            </Select>
                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let varParas = common.deepClone(this.saveData.varParas);
                                                let newItem = common.deepClone(item);
                                                newItem.value = '';
                                                newItem.varType = '';
                                                varParas.splice(i + 1, 0, newItem);
                                                this.changeData('varParas', varParas);
                                            }} />
                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let varParas = common.deepClone(this.saveData.varParas);
                                                varParas.splice(i, 1);
                                                this.changeData('varParas', varParas);
                                            }} />
                                        </div>
                                    case 3:
                                        return <div style={style.paramsCell}> {item.name}：
                                        <Cascader style={{ minWidth: '100px', width: 'fit-content' }} allowClear={false} size="small"
                                                displayRender={label => label[1]}
                                                onChange={(value, selectedOptions) => {
                                                    console.log("value, selectedOptions", value, selectedOptions)
                                                    let varParas = this.saveData.varParas;
                                                    varParas[i].varType = selectedOptions[0].type;
                                                    varParas[i].value = selectedOptions[1].code;
                                                    varParas[i].dbDataType = selectedOptions[1].type;
                                                    varParas[i].defaultValue = selectedOptions[1].defaultValue;
                                                    varParas[i].tableAlias = selectedOptions[1].tableAlias;
                                                    varParas[i].tableAlias = selectedOptions[1].tableAlias;
                                                    varParas[i].name = selectedOptions[1].name;
                                                    if (this.props.type === 'having') {
                                                        varParas[i].code = `h_${selectedOptions[1].code}_${S4()}`
                                                    }
                                                    this.changeData('varParas', varParas);
                                                }}
                                                options={(() => {
                                                    if (this.props.type === 'common') {
                                                        switch (item.dataType) {
                                                            case 'STRING':
                                                                return this.props.VAR_SELECTION_VARCHAR
                                                            case 'OBJECT':
                                                                return this.props.VAR_SELECTION_VARCHAR
                                                            case 'INTEGER':
                                                                return this.props.VAR_SELECTION_NUMBER
                                                            case 'FLOAT':
                                                                return this.props.VAR_SELECTION_NUMBER
                                                            case 'DATE':
                                                                return this.props.VAR_SELECTION_TIMESTAMP
                                                            case 'UNLIMITED':
                                                                return this.props.VAR_SELECTION_ALL
                                                            default:
                                                                console.warn("未知数据类型");
                                                                return []
                                                        }
                                                    }
                                                    if (this.props.type === 'having') {
                                                        return this.props.LEFT_FUN_SELECTION
                                                    }
                                                    return []
                                                })()}
                                                fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                                placeholder="请选择参数"
                                                showSearch={{ filter }}
                                                value={[item.varType, item.value]}
                                            />
                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let varParas = common.deepClone(this.saveData.varParas);
                                                let newItem = common.deepClone(item);
                                                newItem.value = '';
                                                newItem.varType = '';
                                                varParas.splice(i + 1, 0, newItem);
                                                this.changeData('varParas', varParas);
                                            }} />
                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let varParas = common.deepClone(this.saveData.varParas);
                                                varParas.splice(i, 1);
                                                this.changeData('varParas', varParas);
                                            }} />
                                        </div>
                                    default:
                                        break;
                                }
                            })()
                        }
                        )
                    }

                </Modal>

                <Modal
                    title="编辑函数的参数"
                    visible={this.state.valueParamsModal}
                    onOk={() => {
                        this.setState({
                            valueParamsModal: false
                        })
                    }}
                    onCancel={() => {
                        this.setState({
                            valueParamsModal: false
                        })
                    }}
                    wrapClassName="params-modal"
                    destroyOnClose={true}
                >

                    {
                        this.saveData.valueParas.map((item, i) => {
                            return (() => {
                                switch (item.formType) {
                                    case 1:
                                        return <div style={style.paramsCell}> {item.name}：
                                            <FixedValue
                                                key={i}
                                                style={{ width: item.dataType === 'DATE' ? '165px' : 'fit-content' }}
                                                size="small" type="tree"
                                                value={item.value}
                                                changeData={(name, value) => {
                                                    let valueParas = this.saveData.valueParas;
                                                    valueParas[i].value = value;
                                                    this.changeData('valueParas', valueParas);
                                                }}
                                                dataType={(() => {
                                                    switch (item.dataType) {
                                                        case 'STRING':
                                                            return 12
                                                        case 'OBJECT':
                                                            return 12
                                                        case 'INTEGER':
                                                            return 5
                                                        case 'FLOAT':
                                                            return 3
                                                        case 'DATE':
                                                            return 93
                                                        default:
                                                            return ''
                                                    }
                                                })()}
                                                min={!common.isEmpty(item.min) ? item.min : -32768}
                                                max={!common.isEmpty(item.max) ? item.max : 32767}
                                            />
                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let valueParas = common.deepClone(this.saveData.valueParas);
                                                let newItem = common.deepClone(item);
                                                newItem.value = '';
                                                newItem.varType = '';
                                                valueParas.splice(i + 1, 0, newItem);
                                                this.changeData('valueParas', valueParas);
                                            }} />
                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let valueParas = common.deepClone(this.saveData.valueParas);
                                                valueParas.splice(i, 1);
                                                this.changeData('valueParas', valueParas);
                                            }} />
                                        </div>
                                    case 2:
                                        return <div style={style.paramsCell}>
                                            {item.name}：<Select key={i} dropdownMatchSelectWidth={false} style={{ minWidth: '100px', width: 'fit-content' }} size="small" placeholder="请选择参数"
                                                onChange={(value, option) => {
                                                    let valueParas = this.saveData.valueParas;
                                                    valueParas[i].value = option.props.val;
                                                    this.changeData('valueParas', valueParas);
                                                }}
                                                value={common.isEmpty(item.value) ? undefined : item.value}
                                            >
                                                {
                                                    item.dataSources.map((item2, j) =>
                                                        <Select.Option key={j} value={item2.val} val={item2.val} label={item2.label}>{item2.label}</Select.Option>
                                                    )
                                                }
                                            </Select>
                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let valueParas = common.deepClone(this.saveData.valueParas);
                                                let newItem = common.deepClone(item);
                                                newItem.value = '';
                                                newItem.varType = '';
                                                valueParas.splice(i + 1, 0, newItem);
                                                this.changeData('valueParas', valueParas);
                                            }} />
                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let valueParas = common.deepClone(this.saveData.valueParas);
                                                valueParas.splice(i, 1);
                                                this.changeData('valueParas', valueParas);
                                            }} />
                                        </div>
                                    case 3:
                                        return <div style={style.paramsCell}> {item.name}：<Cascader style={{ minWidth: '100px', width: 'fit-content' }} allowClear={false} size="small"
                                            displayRender={label => label[1]}
                                            onChange={(value, selectedOptions) => {
                                                let valueParas = this.saveData.valueParas;
                                                valueParas[i].varType = selectedOptions[0].type;
                                                valueParas[i].value = selectedOptions[1].code;
                                                valueParas[i].dbDataType = selectedOptions[1].type;
                                                valueParas[i].defaultValue = selectedOptions[1].defaultValue;
                                                valueParas[i].tableAlias = selectedOptions[1].tableAlias;
                                                valueParas[i].name = selectedOptions[1].name;
                                                this.changeData('valueParas', valueParas);
                                            }}
                                            options={(() => {
                                                if (this.props.type === 'common') {
                                                    switch (item.dataType) {
                                                        case 'STRING':
                                                            return this.props.VAR_SELECTION_VARCHAR
                                                        case 'OBJECT':
                                                            return this.props.VAR_SELECTION_VARCHAR
                                                        case 'INTEGER':
                                                            return this.props.VAR_SELECTION_NUMBER
                                                        case 'FLOAT':
                                                            return this.props.VAR_SELECTION_NUMBER
                                                        case 'DATE':
                                                            return this.props.VAR_SELECTION_TIMESTAMP
                                                        case 'UNLIMITED':
                                                            return this.props.VAR_SELECTION_ALL
                                                        default:
                                                            console.warn("未知数据类型");
                                                            return []
                                                    }
                                                }
                                                if (this.props.type === 'having') {
                                                    switch (item.dataType) {
                                                        case 'STRING':
                                                            return this.props.RIGHT_VAR_SELECTION_VARCHAR
                                                        case 'OBJECT':
                                                            return this.props.RIGHT_VAR_SELECTION_VARCHAR
                                                        case 'INTEGER':
                                                            return this.props.RIGHT_VAR_SELECTION_NUMBER
                                                        case 'FLOAT':
                                                            return this.props.RIGHT_VAR_SELECTION_NUMBER
                                                        case 'DATE':
                                                            return this.props.RIGHT_VAR_SELECTION_TIMESTAMP
                                                        case 'UNLIMITED':
                                                            return this.props.VAR_SELECTION_ALL
                                                        default:
                                                            console.warn("未知数据类型");
                                                            return []
                                                    }
                                                }
                                                return []
                                            })()}
                                            fieldNames={{ label: 'name', value: 'value', children: 'list' }}
                                            placeholder="请选择参数"
                                            showSearch={{ filter }}
                                            value={[item.varType, item.value]}
                                        />
                                            <Icon type="plus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let valueParas = common.deepClone(this.saveData.valueParas);
                                                let newItem = common.deepClone(item);
                                                newItem.value = '';
                                                newItem.varType = '';
                                                valueParas.splice(i + 1, 0, newItem);
                                                this.changeData('valueParas', valueParas);
                                            }} />
                                            <Icon type="minus-circle" style={{ marginLeft: '10px', display: item.isDynamic ? 'inline' : 'none' }} onClick={() => {
                                                let valueParas = common.deepClone(this.saveData.valueParas);
                                                valueParas.splice(i, 1);
                                                this.changeData('valueParas', valueParas);
                                            }} />
                                        </div>
                                    default:
                                        break;
                                }
                            })()
                        }
                        )
                    }

                </Modal>

            </div >

        )
    }
}
Tree.propTypes = {
    type: PropTypes.string,
    extraType: PropTypes.string,
    disabled: PropTypes.bool,
    add: PropTypes.func,
    sub: PropTypes.func,
    node: PropTypes.object.isRequired,
    p_relType: PropTypes.number,
    nodeKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    updateConditionTree: PropTypes.func,
    verifyConditionTreeFinish: PropTypes.func,
    conditionVODemo: PropTypes.object.isRequired,
    // common start
    VAR_SELECTION_ALL: PropTypes.array,//字符串
    VAR_SELECTION_DECIMAL: PropTypes.array,//单双精度
    VAR_SELECTION_INTEGER: PropTypes.array,//整型，长整型
    VAR_SELECTION_NUMBER: PropTypes.array,//浮点型
    VAR_SELECTION_TIMESTAMP: PropTypes.array,//时间类型
    VAR_SELECTION_VARCHAR: PropTypes.array,//变量
    expressionCategoryType: PropTypes.array,//值类别
    expressionVarType: PropTypes.array,//变量类型
    functionComputeType: PropTypes.array,//函数计算类型
    optTypeList: PropTypes.array,//操作的比较类型
    // common end
    //having start
    LEFT_VAR_SELECTION: PropTypes.array,//左变量选择
    LEFT_FUN_SELECTION: PropTypes.array,//左函数选择
    RIGHT_VAR_SELECTION_ALL: PropTypes.array,//右字符串类型
    RIGHT_VAR_SELECTION_DECIMAL: PropTypes.array,//右单双精度类型
    RIGHT_VAR_SELECTION_INTEGER: PropTypes.array,//右整型，长整型
    RIGHT_VAR_SELECTION_NUMBER: PropTypes.array,//右浮点型
    RIGHT_VAR_SELECTION_TIMESTAMP: PropTypes.array,//右时间类型
    RIGHT_VAR_SELECTION_VARCHAR: PropTypes.array,//右变量类型
    functionAggType: PropTypes.array,//having函数
    leftExpressionCategoryType: PropTypes.array,//左值类别
    leftExpressionVarType: PropTypes.array,//左变量类型
    rightExpressionCategoryType: PropTypes.array,//右值类别
    rightExpressionVarType: PropTypes.array//右值类别
    //having end
}
Tree.defaultProps = {
    type: 'common',
    disabled: false,
    add: () => { },
    sub: () => { },
    node: {},
    p_relType: null,
    nodeKey: '',
    updateConditionTree: () => { },
    verifyConditionTreeFinish: () => { },
    conditionVODemo: {},
    // common start
    VAR_SELECTION_ALL: [],
    VAR_SELECTION_DECIMAL: [],
    VAR_SELECTION_INTEGER: [],
    VAR_SELECTION_NUMBER: [],
    VAR_SELECTION_TIMESTAMP: [],
    VAR_SELECTION_VARCHAR: [],
    expressionCategoryType: [],
    expressionVarType: [],
    functionComputeType: [],
    optTypeList: [],
    // common end
    //having start
    LEFT_VAR_SELECTION: [],
    LEFT_FUN_SELECTION: [],
    RIGHT_VAR_SELECTION_ALL: [],
    RIGHT_VAR_SELECTION_DECIMAL: [],
    RIGHT_VAR_SELECTION_INTEGER: [],
    RIGHT_VAR_SELECTION_NUMBER: [],
    RIGHT_VAR_SELECTION_TIMESTAMP: [],
    RIGHT_VAR_SELECTION_VARCHAR: [],
    functionAggType: [],
    leftExpressionCategoryType: [],
    leftExpressionVarType: [],
    rightExpressionCategoryType: [],
    rightExpressionVarType: []
    //having end
}
export default Tree;

const style = {
    paramsCell: {
        marginBottom: '10px'
    }
}

const IndentCell = 80;

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

