/*
 * @Author: zengzijian
 * @Date: 2019-04-22 11:00:36
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-22 11:19:48
 * @Description: 
 */
import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Select, Cascader, Popover } from 'antd';
import '@/styles/condition-tree/tree.less';
import AddAndSub from '@/components/condition-tree/AddAndSub';
import common from '@/utils/common';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';
import CountExpression from '@/components/countExpression/Panel.jsx';

const valueTypeConstList = [
    { code: 0, value: '固定值' },
    { code: 1, value: '变量' },
    // { code: 2, value: '查询赋值' },
    { code: 3, value: '计算' },
    // { code: 4, value: '函数' }
];//等于的时候就有函数，否则没有函数选择

const valueTypeConstList_isNan = [
    { code: 0, value: '固定值' },
    { code: 1, value: '变量' },
    // { code: 2, value: '查询赋值' },
    // { code: 3, value: '计算' },
    // { code: 4, value: '函数' }
];//等于的时候就有函数，否则没有函数选择


const functionTypeList = [
    // { val: 0, label: '转大写' },
    // { val: 1, label: '转小写' },
    // { val: 2, label: '去除空格' },
    // { val: 3, label: '字符串截取' },
    { val: 4, label: '实时查询' },
]


@inject('conditionThenStore')
@observer
class Then extends Component {
    constructor(props) {
        super(props);
        this.state = {
            indentTimes: 0,
            isFirstNode: false,
            isFirstNodes: false,
            relWidth: 0,
            valueType: 0,
            functionTypeList: 'day',
            index: 0,
            optShow: false
        }
        this.saveData = thenDemo
        this.computeExpressionVO = computeExpressionVODemo
        this.changeData = this.changeData.bind(this);
        this.changeCategoryType = this.changeCategoryType.bind(this);
        this.updateExpressionTree = this.updateExpressionTree.bind(this);
        if (!this.props.node.treeData) {
            let node = common.deepClone(this.props.node);
            this.saveData = {
                "parameterId": node.parameterId,
                "parameterName": node.parameterName,
                'parameterType': node.parameterType,
                'parameterDefaultValue': node.parameterDefaultValue,
                'parameterCode': node.parameterCode,
                "fixedValueType": node.fixedValueType,
                "type": node.type,
                "varType": String(node.varType),
                "varDataType": node.varDataType,
                "varName": node.varName,
                "varCode": node.varCode,
                "fixedValue": node.fixedValue,
                "computeExpression": node.computeExpression,
                "actionType": node.actionType,
                "executionManner": node.executionManner,
                "rtqVarId": node.rtqVarId,
                "varDefaultValue": node.varDefaultValue,
                "rtqVarDataType": node.rtqVarDataType,
            }

            if (node.id) {
                this.saveData.id = node.id;
            }

        }

        // console.log('nodeKey =' + this.props.nodeKey);
    }

    componentWillReceiveProps(nextProps) {

        // console.log("tree  componentWillReceiveProps", nextProps);
        if (!nextProps.node.treeData) {
            this.saveData.parameterId = nextProps.node.parameterId;
            this.saveData.parameterName = nextProps.node.parameterName;
            this.saveData.parameterDefaultValue = nextProps.node.parameterDefaultValue;
            this.saveData.parameterCode = nextProps.node.parameterCode;
            this.saveData.parameterType = nextProps.node.parameterType;
            this.saveData.fixedValueType = nextProps.node.fixedValueType;
            this.saveData.type = nextProps.node.type;
            this.saveData.varType = String(nextProps.node.varType);
            this.saveData.varDataType = nextProps.node.varDataType;
            this.saveData.varName = nextProps.node.varName;
            this.saveData.fixedValue = nextProps.node.fixedValue;
            this.saveData.computeExpression = nextProps.node.computeExpression;
            this.saveData.actionType = nextProps.node.actionType;
            this.saveData.executionManner = nextProps.node.executionManner;
            this.saveData.rtqVarId = nextProps.node.rtqVarId;
            this.saveData.varDefaultValue = nextProps.node.varDefaultValue;
            this.saveData.rtqVarDataType = nextProps.node.rtqVarDataType;
            this.saveData.parameterType = nextProps.node.parameterType;
            if (nextProps.node.id) {
                this.saveData.id = nextProps.node.id;
            }
        }
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        this.saveData = thenDemo
    }

    updateExpressionTree(value) {
        console.log("更新value", value)
        this.computeExpressionVO = value;
        this.props.conditionThenStore.updateNodeData(this.props.nodeKey, 'computeExpressionVO', value);
        this.saveData.computeExpressionVO = value;

        this.props.updateConditionThen(this.props.conditionThenStore.getConditionsAll);
        this.props.verifyConditionTreeFinish();
    }


    changeData(name, value, nodeKey) {
        console.log("changeData", name, value);
        switch (name) {
            case 'varCode'://改变变量时，把fixValue清空
                this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', '');
                this.saveData.fixedValue = '';
                break;
            case 'type'://改变变量类型的时候，把等号右边的所有值清空
                this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varType', '');
                this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varDataType', '');
                this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varCode', '');
                this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', '');
                this.saveData.varType = '';
                this.saveData.varDataType = '';
                this.saveData.varCode = '';
                this.saveData.fixedValue = '';
                this.saveData.varDefaultValue = '';
                if (value === 3) {//计算类型
                    this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'computeExpressionVO', computeExpressionVODemo);
                    this.saveData.computeExpressionVO = computeExpressionVODemo;
                }
                break;
            case 'defaultValue':
                if (!common.isEmpty(value) && value.length > 30) {
                    this.saveData.fixedValue = String(value).substr(0, 30);
                } else {
                    this.saveData.fixedValue = value;
                }
                this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', this.saveData.fixedValue);
                break;
            case 'rtqVarId'://切换 （执行方法）的查询方法（实时查询变量），把参数清空
                if (this.saveData.actionType == 1) {
                    this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'parameterId', '');
                    this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'parameterName', '');
                    this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'parameterCode', '');
                    this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'parameterDefaultValue', '');
                    this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'parameterType', '');
                    this.saveData.parameterId = '';
                    this.saveData.parameterName = '';
                    this.saveData.parameterCode = '';
                    this.saveData.parameterDefaultValue = '';
                    this.saveData.parameterType = '';
                }
                break;
            case 'parameterId':
                if (this.saveData.actionType === 0) {//切换 （参数赋值）的参数变量，把等号右边清空
                    if (this.saveData.type == 1) {//变量
                        if (this.saveData.varType == 3) {
                            this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'rtqVarId', '');
                            this.saveData.rtqVarId = '';
                        }
                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varType', '');
                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varCode', '');
                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', '');
                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varDataType', '');
                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varName', '');
                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varDefaultValue', '');
                        this.saveData.varType = '';
                        this.saveData.varCode = '';
                        this.saveData.fixedValue = '';
                        this.saveData.varDataType = '';
                        this.saveData.varName = '';
                        this.saveData.varDefaultValue = '';
                    } else if (this.saveData.type == 3) {//计算类型
                        let computeExpression = {
                            "operators": [],
                            "varList": [
                                {
                                    "code": "",//变量CODE
                                    "varType": "",//变量 类型
                                    "dataType": "",//变量 数据类型
                                    "defaultValue": ""
                                }
                            ]
                        }

                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'type', 0);
                        this.saveData.type = 0;

                        this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'computeExpression', computeExpression);
                        this.saveData.computeExpression = computeExpression;
                    }
                }
                break;
            default:

                break;
        }

        if (name !== 'defaultValue') {
            this.saveData[name] = value;
            this.props.conditionThenStore.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, name, value);
        }

        this.props.updateConditionThen(this.props.conditionThenStore.getConditionsAll);
        // console.log("tree changeData this.props.conditionThenStore.getConditionsAll", this.props.conditionThenStore.getConditionsAll);
        this.props.verifyConditionTreeFinish();
        this.setState({ index: Math.random() })
    }


    changeCategoryType(value) {
        if (this.saveData.type == 3 && value != 3) {
            this.saveData.computeExpressionVO = {//计算类型才有
            }
        }
        this.changeData('type', value);
    }

    render() {
        // console.log("tree this.saveData",  this.saveData)
        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }

        const actionSelect = <Select
            disabled={this.props.disabled}
            size="small"
            showSearch={true}
            optionFilterProp="search"
            placeholder="选择"
            dropdownMatchSelectWidth={false}
            onChange={(value) => {
                this.changeData('actionType', value);
                this.changeData('executionManner', 4)
            }}
            className="fieldList"
            style={{ width: '75px' }}
            value={this.saveData.actionType}
        >
            <Select.Option value={0}>参数赋值</Select.Option>
            <Select.Option value={1}>执行方法</Select.Option>
        </Select>

        const categoryType_all = (
            <div className="category-type" >
                {
                    valueTypeConstList.map((item, i) =>
                        <p className="cate" key={i} onClick={() => this.changeCategoryType(item.code)}>{item.value}</p>
                    )
                }

            </div>
        )

        const categoryType_isNan = (
            <div className="category-type" >
                {
                    valueTypeConstList_isNan.map((item, i) =>
                        <p className="cate" key={i} onClick={() => this.changeCategoryType(item.code)}>{item.value}</p>
                    )
                }

            </div>
        )

        const canshufuzhi = <div className="cell-container" style={{ left: '0px' }}>
            {
                !this.props.disabled && !['easyStrategyTable', 'crossTable'].includes(this.props.extraType) ?
                    <p style={{ marginTop: '-2px', float: 'left' }}>
                        {
                            this.props.nodeKey != 0 ?
                                <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />
                                :
                                <AddAndSub type="add" add={this.props.add} />
                        }

                    </p>
                    : ''
            }
            {['easyStrategyTable'].includes(this.props.extraType) ? '' :
                <Fragment>
                    {actionSelect}
                    <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                        ：
                    </p>
                </Fragment>
            }
            <Select
                disabled={this.props.disabled}
                size="small"
                showSearch={true}
                optionFilterProp="search"
                placeholder="选择变量"
                dropdownMatchSelectWidth={false}
                onChange={(value, option) => {
                    this.changeData('parameterId', option.props.id);
                    this.changeData('parameterName', option.props.children);
                    this.changeData('fixedValueType', option.props.type);
                    this.changeData('fixedValue', '');
                    this.changeData('parameterCode', option.props.code);
                    this.changeData('parameterDefaultValue', option.props.defaultValue);
                    this.changeData('parameterType', option.props.type);
                }}
                className="fieldList"
                style={{ width: 'min-content', minWidth: '85px' }}
                // value={this.saveData.varName}
                value={common.isEmpty(this.saveData.parameterId) ? undefined : this.saveData.parameterName}
            >
                {this.props.PARAMS_VAR_SELECTION_ALL.map((item) =>
                    <Select.Option {...item} key={Math.random()}>{item.name}</Select.Option>
                )}
            </Select>
            <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                =
            </p>

            {
                (() => {
                    if (publicUtils.getVarDataType(this.saveData.parameterType) === 'int' || publicUtils.getVarDataType(this.saveData.parameterType) === 'float') {
                        return <Popover
                            content={categoryType_all} title="更换值类型" trigger="click" >
                            <p className="cate"></p>
                        </Popover>
                    } else {
                        return <Popover
                            content={categoryType_isNan} title="更换值类型" trigger="click" >
                            <p className="cate"></p>
                        </Popover>
                    }
                })()
            }



            {
                (() => {
                    switch (String(this.saveData.type)) {
                        case '0'://固定值
                            if (common.isEmpty(this.saveData.fixedValue)) {
                                return <FixedValue
                                    disabled={this.props.disabled}
                                    style={{ border: 'none', width: 'fit-content', float: 'left' }}
                                    className="fix-value"
                                    size="small"
                                    type="defaultValue"
                                    value={this.saveData.fixedValue}
                                    changeData={this.changeData}
                                    dataType={this.saveData.fixedValueType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                            } else {
                                return <FixedValue
                                    disabled={this.props.disabled}
                                    style={{ border: 'none', width: 'fit-content', float: 'left' }}
                                    className="fix-value"
                                    size="small"
                                    type="defaultValue"
                                    value={this.saveData.fixedValue}
                                    changeData={this.changeData}
                                    dataType={this.saveData.fixedValueType} />;//varDataType是整型或者浮点型&&optType是属于或者不属于，varDataType用字符串。sql才能用in(1,2,3)

                            }
                        case '1'://变量
                            return common.isEmpty(this.saveData.varCode) && common.isEmpty(this.saveData.varName) && common.isEmpty(this.saveData.varType) ?
                                <Cascader disabled={this.props.disabled} style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small" displayRender={label => label[1]}
                                    onChange={(value, option) => {
                                        console.log("option", option)
                                        this.changeData('varType', value[0]);
                                        this.changeData('varCode', value[1].split('·-·')[0]);
                                        this.changeData('fixedValue', '');
                                        this.changeData('varDataType', value[1].split('·-·')[1]);
                                        this.changeData('varName', option[1].label);
                                        this.changeData('varDefaultValue', option[1].defaultValue);
                                        if (value[0] == 3) {//实时查询变量
                                            let id = option[1].id;
                                            this.changeData('rtqVarId', id);
                                        }
                                    }} className="varList varlist-empty"
                                    options={(() => {
                                        switch (publicUtils.getVarDataType(this.saveData.parameterType)) {
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
                                    })()}
                                    placeholder="选择变量" showSearch={{ filter }}
                                />
                                :
                                <Cascader disabled={this.props.disabled} style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" displayRender={label => label[1]}
                                    value={[this.saveData.varType, this.saveData.varCode + '·-·' + this.saveData.varDataType]}
                                    onChange={(value, option) => {
                                        this.changeData('varType', value[0]);
                                        this.changeData('varCode', value[1].split('·-·')[0]);
                                        this.changeData('fixedValue', '');
                                        this.changeData('varDataType', value[1].split('·-·')[1]);
                                        this.changeData('varName', option[1].label);
                                        this.changeData('varDefaultValue', option[1].defaultValue);
                                        if (value[0] == 3) {//实时查询变量
                                            let id = option[1].id;
                                            this.changeData('rtqVarId', id);
                                        }
                                    }}
                                    className="varList"
                                    options={(() => {
                                        switch (publicUtils.getVarDataType(this.saveData.parameterType)) {
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
                                    })()}
                                    placeholder="选择变量" showSearch={{ filter }} />
                    }

                }
                )()

            }


            {
                this.saveData.type == 3 ?//计算类型

                    <div style={style.coutPanel}>
                        <CountExpression
                            eventSourceId={this.props.eventSourceId}
                            dimensionId={this.props.dimensionId}
                            update={this.updateExpressionTree}
                            computeExpressionVO={this.computeExpressionVO}
                            entityType={2}
                        />
                    </div>
                    : ''
            }


        </div>

        const zhixingfangfa =
            <div className="cell-container" style={{ left: '0px' }}>
                {
                    ['easyStrategyTable'].includes(this.props.extraType) ? '' :
                        <Fragment>
                            {actionSelect}
                            <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                                ：
                            </p>
                        </Fragment>
                }
                <Select
                    disabled={this.props.disabled}
                    size="small"
                    showSearch={true}
                    optionFilterProp="search"
                    placeholder="选择变量"
                    dropdownMatchSelectWidth={false}
                    onChange={(value) => {
                        this.changeData('executionManner', value);
                    }}
                    className="fieldList"
                    style={{ width: 'min-content' }}
                    // value={this.saveData.varName}
                    value={this.saveData.executionManner}
                >
                    {functionTypeList.map((item) =>
                        <Select.Option value={item.val} key={Math.random()}>{item.label}</Select.Option>
                    )}
                </Select>
                <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                    （查询方法：
                </p>
                {
                    common.isEmpty(this.saveData.rtqVarId) ?
                        <Select
                            disabled={this.props.disabled}
                            size="small"
                            showSearch={true}
                            optionFilterProp="search"
                            placeholder="请选择方法"
                            dropdownMatchSelectWidth={false}
                            onChange={(value, option) => {
                                this.changeData('rtqVarId', value);
                                this.changeData('rtqVarDataType', option.props.type);
                            }}
                            className="fieldList"
                            style={{ width: 'min-content' }}
                            value="请选择方法"
                        >
                            {this.props.rtqVarList.map((item) =>
                                <Select.Option {...item} value={item.id} key={Math.random()}>{item.name}</Select.Option>
                            )}
                        </Select>
                        :
                        <Select
                            disabled={this.props.disabled}
                            size="small"
                            showSearch={true}
                            optionFilterProp="search"
                            dropdownMatchSelectWidth={false}
                            onChange={(value, option) => {
                                this.changeData('rtqVarId', value);
                                this.changeData('rtqVarDataType', option.props.type);
                            }}
                            className="fieldList"
                            style={{ width: 'min-content' }}
                            value={this.saveData.rtqVarId}
                        >
                            {this.props.rtqVarList.map((item) =>
                                <Select.Option {...item} value={item.id} key={Math.random()}>{item.name}</Select.Option>
                            )}
                        </Select>
                }

                <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                    , 赋值参数：
                </p>
                {
                    common.isEmpty(this.saveData.parameterId) ?
                        <Select
                            disabled={this.props.disabled}
                            size="small"
                            showSearch={true}
                            optionFilterProp="search"
                            placeholder="选择变量"
                            dropdownMatchSelectWidth={false}
                            onChange={(value, option) => {
                                this.changeData('parameterId', option.props.id);
                                this.changeData('parameterName', option.props.children);
                                this.changeData('parameterCode', option.props.code);
                                this.changeData('parameterDefaultValue', option.props.defaultValue);
                                this.changeData('parameterType', option.props.type);
                            }}
                            className="fieldList"
                            style={{ width: '80px' }}
                            value={undefined}
                        >
                            {
                                (() => {
                                    switch (publicUtils.getVarDataType(this.saveData.rtqVarDataType)) {
                                        case 'string':
                                            return this.props.PARAMS_VAR_SELECTION_ALL
                                        case 'int':
                                            return this.props.PARAMS_VAR_SELECTION_NUMBER
                                        case 'float':
                                            return this.props.PARAMS_VAR_SELECTION_NUMBER
                                        case 'time':
                                            return this.props.PARAMS_VAR_SELECTION_TIMESTAMP
                                        default:
                                            return []
                                    }
                                })().map((item) =>
                                    <Select.Option {...item} key={Math.random()} >{item.name}</Select.Option>
                                )}
                        </Select>
                        :
                        <Select
                            disabled={this.props.disabled}
                            size="small"
                            showSearch={true}
                            optionFilterProp="search"
                            placeholder="选择变量"
                            dropdownMatchSelectWidth={false}
                            onChange={(value, option) => {
                                this.changeData('parameterId', option.props.id);
                                this.changeData('parameterName', option.props.children);
                                this.changeData('parameterCode', option.props.code);
                                this.changeData('parameterDefaultValue', option.props.defaultValue);
                                this.changeData('parameterType', option.props.type);
                            }}
                            className="fieldList"
                            style={{ width: 'min-content' }}
                            // value={this.saveData.varName}
                            value={this.saveData.parameterName}
                        >
                            {
                                (() => {
                                    switch (publicUtils.getVarDataType(this.saveData.rtqVarDataType)) {
                                        case 'string':
                                            return this.props.PARAMS_VAR_SELECTION_ALL
                                        case 'int':
                                            return this.props.PARAMS_VAR_SELECTION_NUMBER
                                        case 'float':
                                            return this.props.PARAMS_VAR_SELECTION_NUMBER
                                        case 'time':
                                            return this.props.PARAMS_VAR_SELECTION_TIMESTAMP
                                        default:
                                            return []
                                    }
                                })().map((item) =>
                                    <Select.Option {...item} key={Math.random()}>{item.name}</Select.Option>
                                )}
                        </Select>


                }

                <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                    ）
                </p>

                {
                    !this.props.disabled && !['easyStrategyTable', 'crossTable'].includes(this.props.extraType) ?
                        <p style={{ marginTop: '-2px', float: 'right' }}>
                            {
                                this.props.nodeKey != 0 ?
                                    <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />

                                    :
                                    <AddAndSub type="add" add={this.props.add} />

                            }

                        </p>
                        : ''
                }




            </div>
        // console.log("rtqVarList", this.props.rtqVarList);
        return (
            <div style={{ clear: 'both' }}>
                {
                    this.saveData.actionType === 0 ?
                        canshufuzhi
                        : zhixingfangfa

                }
            </div>

        )
    }
}
Then.propTypes = {
    typeList: PropTypes.array.isRequired,
    valueType: PropTypes.oneOf([1, 2, 3]).isRequired,
    verifyConditionTreeFinish: PropTypes.func,
    optTypeList: PropTypes.array,
    rtqVarList: PropTypes.array,
    // 优化追加
    VAR_SELECTION_ALL: PropTypes.array,
    VAR_SELECTION_TIMESTAMP: PropTypes.array,
    VAR_SELECTION_VARCHAR: PropTypes.array,
    VAR_SELECTION_NUMBER: PropTypes.array,
    PARAMS_VAR_SELECTION_ALL: PropTypes.array,
    PARAMS_VAR_SELECTION_TIMESTAMP: PropTypes.array,
    PARAMS_VAR_SELECTION_VARCHAR: PropTypes.array,
    PARAMS_VAR_SELECTION_NUMBER: PropTypes.array,
    eventSourceId: PropTypes.string,//事件源id
    dimensionId: PropTypes.string, //维度id
}
Then.defaultProps = {
    valueType: 1,
    verifyConditionTreeFinish: () => { },
    optTypeList: [],
    rtqVarList: [],
    // 优化追加
    VAR_SELECTION_ALL: [],
    VAR_SELECTION_TIMESTAMP: [],
    VAR_SELECTION_VARCHAR: [],
    VAR_SELECTION_NUMBER: [],
    PARAMS_VAR_SELECTION_ALL: [],
    PARAMS_VAR_SELECTION_TIMESTAMP: [],
    PARAMS_VAR_SELECTION_VARCHAR: [],
    PARAMS_VAR_SELECTION_NUMBER: [],
    eventSourceId: '',
    dimensionId: '',
}
export default Then;

const thenDemo = {
    "parameterId": "",
    "parameterName": '',
    "fixedValueType": "",
    "type": 0,
    "varType": "",//等号右边的变量
    "varDataType": '',//等号右边的变量
    "varName": "",//等号右边的变量
    "varCode": "",//等号右边的变量
    "fixedValue": "",//等号右边的固定值
    "computeExpressionVO": null,//计算类型才有
    "actionType": 0,
    "executionManner": 4,
    "rtqVarId": '',
    "varDefaultValue": '',
    "rtqVarDataType": '',
    "parameterType": ''
}


const computeExpressionVODemo = {
    "key": "0",
    "computeOperator": "PLUS",
    "computeVarVO": {
        "categoryType": 1,//0固定值，1变量，2函数（衍生变量）
        "code": "",
        "tableAlias": "",
        "type": 0,
        "value": "",
        "name": "",
        "dataType": "",
        "computeFunction": null,
        "params": []
    },
    "fieldList": [{
        "key": "0-0",
        "computeOperator": "PLUS",
        "computeVarVO": {
            "categoryType": 1,//0固定值，1变量，2函数（衍生变量）
            "code": "",
            "tableAlias": "",
            "type": 0,
            "value": "",
            "name": "",
            "dataType": "",
            "computeFunction": null,
            "params": []
        },
        "fieldList": [],
        "type": 1 //类型，1是计算变量， 2是计算表达式（或有括号）
    }],
    "type": 2 //类型，1是计算变量， 2是计算表达式（或有括号）
}


const style = {
    coutPanel: {
        width: '2000px', marginTop: '5px'
    },
    countContainer: {
        height: '90px', padding: '32px 10px', border: '1px solid gainsboro', borderRadius: '5px', margin: '10px', overflowX: 'auto', overflowY: 'hidden'
    }
}