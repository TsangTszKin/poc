import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import { Select, Dropdown, InputNumber, Divider, Button, Cascader, Menu, Icon, Popover } from 'antd';
import '@/styles/condition-tree/tree.less';
import AddAndSub from '@/components/condition-tree/AddAndSub';
import ThenCopy from '@/components/condition-tree/Then';
import common from '@/utils/common';
import FixedValue from '@/components/condition-tree/FixedValue';
import publicUtils from '@/utils/publicUtils';

const IndentCell = 80;

const valueTypeConstList = [
    { code: 0, value: '固定值' },
    { code: 1, value: '变量' },
    // { code: 2, value: '查询赋值' },
    { code: 3, value: '计算' },
    // { code: 4, value: '函数' }
];//等于的时候就有函数，否则没有函数选择

const functionTypeList = [
    { val: 0, label: '转大写' },
    { val: 1, label: '转小写' },
    { val: 2, label: '去除空格' },
    { val: 3, label: '字符串截取' },
    { val: 4, label: '实时查询' },
]

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
            valueTypeList: [],
            parantRelType: this.props.node.relType,
            optShow: false
        }
        this.saveData = {
            "parameterId": "",
            "parameterName": '',
            "fixedValueType": "",
            "type": 0,
            "varType": "",//等号右边的变量
            "varDataType": '',//等号右边的变量
            "varName": "",//等号右边的变量
            "varCode": "",//等号右边的变量
            "fixedValue": "",//等号右边的固定值
            "computeExpression": {//计算类型才有
                "operators": [],
                "varList": [
                    {
                        "code": "",//变量CODE
                        "varType": "",//变量 类型
                        "dataType": "",//变量 数据类型
                        "defaultValue": ""
                    }
                ]
            },
            "actionType": 0,
            "executionManner": 4,
            "rtqVarId": '',
            "varDefaultValue": ''
        }
        this.changeData = this.changeData.bind(this);
        this.optAdd = this.optAdd.bind(this);
        this.optSub = this.optSub.bind(this);
        if (!this.props.node.treeData && this.props.node.nodeType == 1) {
            let node = common.deepClone(this.props.node);
            this.saveData = {
                "parameterId": node.expressionVO.parameterId,
                "parameterName": node.expressionVO.parameterName,
                'parameterType': node.expressionVO.parameterType,
                'parameterDefaultValue': node.expressionVO.parameterDefaultValue,
                'parameterCode': node.expressionVO.parameterCode,
                "fixedValueType": node.expressionVO.fixedValueType,
                "type": node.expressionVO.type,
                "varType": String(node.expressionVO.varType),
                "varDataType": node.expressionVO.varDataType,
                "varName": node.expressionVO.varName,
                "varCode": node.expressionVO.varCode,
                "fixedValue": node.expressionVO.fixedValue,
                "computeExpression": node.expressionVO.computeExpression,
                "actionType": node.expressionVO.actionType,
                "executionManner": node.expressionVO.executionManner,
                "rtqVarId": node.expressionVO.rtqVarId,
                "varDefaultValue": node.expressionVO.varDefaultValue
            }

            if (node.id) {
                this.saveData.id = node.expressionVO.id;
            }

        }

        // console.log('nodeKey =' + this.props.nodeKey);
        // console.log('this.saveData', this.saveData);
    }

    componentWillReceiveProps(nextProps) {

        // console.log("tree  componentWillReceiveProps", nextProps);
        if (!nextProps.node.treeData && nextProps.node.nodeType === 1) {
            this.saveData.parameterId = nextProps.node.expressionVO.parameterId;
            this.saveData.parameterName = nextProps.node.expressionVO.parameterName;
            this.saveData.parameterDefaultValue = nextProps.node.expressionVO.parameterDefaultValue;
            this.saveData.parameterCode = nextProps.node.expressionVO.parameterCode;
            this.saveData.parameterType = nextProps.node.expressionVO.parameterType;
            this.saveData.fixedValueType = nextProps.node.expressionVO.fixedValueType;
            this.saveData.type = nextProps.node.expressionVO.type;
            this.saveData.varType = String(nextProps.node.expressionVO.varType);
            this.saveData.varDataType = nextProps.node.expressionVO.varDataType;
            this.saveData.varName = nextProps.node.expressionVO.varName;
            this.saveData.fixedValue = nextProps.node.expressionVO.fixedValue;
            this.saveData.computeExpression = nextProps.node.expressionVO.computeExpression;
            this.saveData.actionType = nextProps.node.expressionVO.actionType;
            this.saveData.executionManner = nextProps.node.expressionVO.executionManner;
            this.saveData.rtqVarId = nextProps.node.expressionVO.rtqVarId;
            this.saveData.varDefaultValue = nextProps.node.expressionVO.varDefaultValue;
            if (nextProps.node.id) {
                this.saveData.id = nextProps.node.expressionVO.id;
            }
        }
    }

    componentWillMount() {

    }

    componentWillUnmount() {
        this.saveData = {
            "parameterId": "",
            "parameterName": '',
            "fixedValueType": "",
            "type": 0,
            "varType": "",//等号右边的变量
            "varDataType": '',//等号右边的变量
            "varName": "",//等号右边的变量
            "varCode": "",//等号右边的变量
            "fixedValue": "",//等号右边的固定值
            "computeExpression": {//计算类型才有
                "operators": [],
                "varList": [
                    {
                        "code": "",//变量CODE
                        "varType": "",//变量 类型
                        "dataType": "",//变量 数据类型
                        "defaultValue": ""
                    }
                ]
            },
            "actionType": 0,
            "executionManner": 4,
            "rtqVarId": '',
            "varDefaultValue": ''
        }
    }


    changeData(name, value, nodeKey) {
        console.log("changeData", name, value);
        if (name === 'varCode') {//改变变量时，把fixValue清空
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', '');
            this.saveData.fixedValue = '';
        }
        if (name === 'type') {//改变变量类型的时候，把等号右边的所有值清空
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varType', '');
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varDataType', '');
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'varCode', '');
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', '');
            this.saveData.varType = '';
            this.saveData.varDataType = '';
            this.saveData.varCode = '';
            this.saveData.fixedValue = '';
            this.saveData.varDefaultValue = '';
        }

        if (name === 'defaultValue') {
            if (!common.isEmpty(value) && value.length > 30) {
                this.saveData.fixedValue = String(value).substr(0, 30);
            } else {
                this.saveData.fixedValue = value;
            }
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, 'fixedValue', this.saveData.fixedValue);
        } else {
            this.saveData[name] = value;
            this.props.updateNodeData(!common.isEmpty(nodeKey) ? nodeKey : this.props.nodeKey, name, value);
        }
        this.props.verifyConditionTreeFinish();
        this.setState({ index: Math.random() })
    }

    optAdd(opt) {//选择运算符的回调
        this.saveData.computeExpression.operators.push(opt);
        this.saveData.computeExpression.varList.push(
            {
                "code": "",//变量CODE
                "varType": "",//变量 类型
                "dataType": "",//变量 数据类型
                "defaultValue": ""
            }
        );
        this.props.updateNodeData(this.props.nodeKey, 'computeExpression', this.saveData.computeExpression);
        this.props.verifyConditionTreeFinish();
        this.setState({ optShow: false });
    }
    optSub() {//删除运算符的回调
        this.saveData.computeExpression.operators.pop();
        this.saveData.computeExpression.varList.pop();
        this.props.updateNodeData(this.props.nodeKey, 'computeExpression', this.saveData.computeExpression);
        this.props.verifyConditionTreeFinish();
        this.setState({ optShow: false });
    }
    render() {
        // console.log("tree this.saveData",  this.saveData)
        function filter(inputValue, path) {
            return (path.some(option => String(`${option.value}${option.label}`).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }

        const content = (
            <div className="then-opt" disabled={this.props.disabled}>
                <p className="opt" onClick={() => this.optAdd("+")}>+</p>
                <p className="opt" onClick={() => this.optAdd("-")}>-</p>
                <p className="opt" onClick={() => this.optAdd("*")}>*</p>
                <p className="opt" onClick={() => this.optAdd("/")}>/</p>
                <p className="action" onClick={() => this.optSub()}>删除</p>
            </div>
        );

        const actionSelect = <Select
            disabled={this.props.disabled}
            size="small"
            showSearch={true}
            optionFilterProp="search"
            placeholder="选择"
            dropdownMatchSelectWidth={false}
            onChange={(value, option) => {
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

        const canshufuzhi = <div className="cell-container" style={{ left: '0px' }}>
            { ['easyStrategyTable'].includes(this.props.extraType) ? '':
                <Fragment>
                    { actionSelect }
                    <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                        ：
                    </p>
                </Fragment>
            }
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
                            this.changeData('parameterId', value);
                            this.changeData('parameterName', option.props.children);
                            this.changeData('parameterCode', option.props.code);
                            this.changeData('parameterType', option.props.type);
                            this.changeData('parameterDefaultValue', option.props.defaultValue);
                            this.changeData('fixedValueType', option.props.type);
                            this.changeData('fixedValue', '');
                        }}
                        className="fieldList"
                        style={{ width: '80px' }}
                    >
                        {this.props.paramList.map((item, i) =>
                            <Select.Option { ...item } key={Math.random()} >{item.name}</Select.Option>
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
                            this.changeData('parameterId', value);
                            this.changeData('parameterName', option.props.children);
                            this.changeData('fixedValueType', option.props.type);
                            this.changeData('fixedValue', '');
                            this.changeData('parameterCode', option.props.code);
                            this.changeData('parameterType', option.props.type);
                            this.changeData('parameterDefaultValue', option.props.defaultValue);
                            this.changeData('type', 0);
                        }}
                        className="fieldList"
                        style={{ width: 'min-content' }}
                        // value={this.saveData.varName}
                        value={this.saveData.parameterName}
                    >
                        {this.props.paramList.map((item, i) =>
                            <Select.Option { ...item } key={Math.random()}>{item.name}</Select.Option>
                        )}
                    </Select>


            }
            <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                =
            </p>

            <Select size="small" placeholder="选择表达式值的类型"
                    dropdownMatchSelectWidth={false}
                    disabled={this.props.disabled}
                    value={this.saveData.type}
                    onChange={(value) => {
                        if (this.saveData.type == 3 && value != 3) {
                            this.saveData.computeExpression = {//计算类型才有
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
                        }
                        this.changeData('type', value);
                    }} className="typeList">
                {
                    valueTypeConstList.map((item, i) =>
                        <Select.Option disabled={ item.code === 3 && this.saveData.parameterType === 93 } value={item.code}>{item.value}</Select.Option>
                    )
                }
            </Select>

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
                                break;
                            case '1'://变量
                                return common.isEmpty(this.saveData.varCode) && common.isEmpty(this.saveData.varName) && common.isEmpty(this.saveData.varType) ?
                                    <Cascader disabled={this.props.disabled} style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量"
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
                                              }} className="varList varlist-empty" options={this.props.cascadeData} placeholder="选择变量" showSearch={{ filter }} />
                                    :
                                    <Cascader disabled={this.props.disabled} style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量" value={[this.saveData.varType, this.saveData.varCode + '·-·' + this.saveData.varDataType]}
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
                                              className="varList" options={this.props.cascadeData} placeholder="选择变量" showSearch={{ filter }} />
                        }

                    }
                )()

            }


            {
                this.saveData.type == 3 ?//计算类型
                    this.saveData.computeExpression.varList.map((item, i) =>
                        <div style={{ float: 'left', height: '24px', lineHeight: '24px' }} className="clearfix calc-var-item">
                            {
                                common.isEmpty(item.varType) || common.isEmpty(item.code) || common.isEmpty(item.dataType) ?
                                    <Cascader disabled={this.props.disabled} key={Math.random()} style={{ width: '73px', color: '#E44B4E' }} allowClear={false} size="small" displayRender={label => label[1]}
                                              onChange={(value, selectedOptions) => {
                                                  console.log("selectedOptions", selectedOptions)
                                                  let computeExpression = common.deepClone(this.saveData.computeExpression);
                                                  computeExpression.varList[i].varType = value[0];
                                                  computeExpression.varList[i].code = value[1].split('·-·')[0];
                                                  computeExpression.varList[i].dataType = value[1].split('·-·')[1];
                                                  computeExpression.varList[i].defaultValue = selectedOptions[1].defaultValue;
                                                  this.changeData('computeExpression', computeExpression);
                                              }}
                                              className="varList varlist-empty" options={this.props.cascadeDataNumber} placeholder="选择变量" showSearch={{ filter }} />
                                    :
                                    <Cascader disabled={this.props.disabled} key={Math.random()} style={{ width: 'min-content', color: '#1890FF' }} allowClear={false} size="small" displayRender={label => label[1]} placeholder="选择变量"
                                              value={common.isEmpty(item.varType) ? [] : [String(item.varType), item.code + '·-·' + item.dataType]}
                                              onChange={(value, selectedOptions) => {
                                                  console.log("selectedOptions", selectedOptions)
                                                  let computeExpression = common.deepClone(this.saveData.computeExpression);
                                                  computeExpression.varList[i].varType = value[0];
                                                  computeExpression.varList[i].code = value[1].split('·-·')[0];
                                                  computeExpression.varList[i].dataType = value[1].split('·-·')[1];
                                                  computeExpression.varList[i].defaultValue = selectedOptions[1].defaultValue;
                                                  this.changeData('computeExpression', computeExpression);
                                              }
                                              }
                                              className="varList" options={this.props.cascadeDataNumber} placeholder="选择变量" showSearch={{ filter }} />
                            }
                            {this.saveData.computeExpression.varList.length == (i + 1) ? '' :
                                <p style={{ float: 'left', height: '24px', lineHeight: '24px', margin: '0 10px' }}>
                                    {this.saveData.computeExpression.operators[i]}
                                </p>
                            }
                        </div>

                    ) : ''
            }

            {
                !this.props.disabled && !['easyStrategyTable'].includes(this.props.extraType) ?
                    <p style={{ marginTop: '-2px', float: 'right' }}>
                        {
                            this.props.nodeKey != 0 ?
                                <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />

                                :
                                <AddAndSub type="add" add={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} />

                        }

                    </p>
                    : ''
            }



            {
                this.saveData.type == 3 && !this.props.disabled ?
                    <Popover content={content} title="" trigger="click" visible={this.state.optShow}>
                        <p style={{ marginTop: '4px', float: 'right', cursor: 'pointer' }}>
                            <Icon type="caret-down" onClick={() => this.setState({ optShow: true })} />
                        </p>
                    </Popover>
                    : ''
            }


        </div>

        const zhixingfangfa =
            <div className="cell-container" style={{ left: '0px' }}>
                {
                    ['easyStrategyTable'].includes(this.props.extraType) ? '' :
                        <Fragment>
                            { actionSelect }
                            <p style={ { float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' } }>
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
                        this.changeData('executionManner', value);
                    }}
                    className="fieldList"
                    style={{ width: 'min-content' }}
                    // value={this.saveData.varName}
                    value={this.saveData.executionManner}
                >
                    {/* 只有实时查询可以用 */}
                    {functionTypeList.map((item, i) =>
                        <Select.Option value={ item.val } key={ Math.random() }
                                       disabled={ item.val !== 4 }>{ item.label }</Select.Option>
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
                            }}
                            className="fieldList"
                            style={{ width: 'min-content' }}
                            value="请选择方法"
                        >
                            {this.props.rtqVarList.map((item, i) =>
                                <Select.Option value={item.id} key={Math.random()}>{item.name}</Select.Option>
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
                            }}
                            className="fieldList"
                            style={{ width: 'min-content' }}
                            value={this.saveData.rtqVarId}
                        >
                            {this.props.rtqVarList.map((item, i) =>
                                <Select.Option value={item.id} key={Math.random()}>{item.name}</Select.Option>
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
                                this.changeData('parameterId', value);
                                this.changeData('parameterName', option.props.children);
                                this.changeData('parameterCode', option.props.code);
                                this.changeData('parameterType', option.props.type);
                                this.changeData('parameterDefaultValue', option.props.defaultValue);
                            }}
                            className="fieldList"
                            style={{ width: '80px' }}
                        >
                            {this.props.paramList.map((item, i) =>
                                <Select.Option { ...item } key={Math.random()} >{item.name}</Select.Option>
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
                                this.changeData('parameterId', value);
                                this.changeData('parameterName', option.props.children);
                                this.changeData('parameterCode', option.props.code);
                                this.changeData('parameterType', option.props.type);
                                this.changeData('parameterDefaultValue', option.props.defaultValue);
                            }}
                            className="fieldList"
                            style={{ width: 'min-content' }}
                            // value={this.saveData.varName}
                            value={this.saveData.parameterName}
                        >
                            {this.props.paramList.map((item, i) =>
                                <Select.Option { ...item } key={Math.random()}>{item.name}</Select.Option>
                            )}
                        </Select>


                }

                <p style={{ float: 'left', height: '24px', lineHeight: '24px', marginRight: '10px' }}>
                    ）
                </p>

                {
                    !this.props.disabled && !['easyStrategyTable'].includes(this.props.extraType) ?
                        <p style={{ marginTop: '-2px', float: 'right' }}>
                            {
                                this.props.nodeKey != 0 ?
                                    <AddAndSub type="sub" sub={() => this.props.sub(this.props.nodeKey)} />

                                    :
                                    <AddAndSub type="add" add={() => this.props.add(0, 'and', this.props.node.expressionVO, false)} />

                            }

                        </p>
                        : ''
                }




            </div>
        // console.log("rtqVarList", this.props.rtqVarList);
        return (
            <div style={{ clear: 'both' }}>
                {
                    this.props.node.nodeType === 1 ?
                        this.saveData.actionType === 0 ?
                            canshufuzhi
                            : zhixingfangfa
                        :
                        this.props.node.conditions.map((item, i) =>
                            <ThenCopy disabled={this.props.disabled} key={Math.random()} verifyConditionTreeFinish={this.props.verifyConditionTreeFinish} optTypeList={this.props.optTypeList} valueTypeList={this.props.valueTypeList} paramList={this.props.paramList} type={this.props.type} updateConditionThen={this.props.updateConditionThen} cascadeData={this.props.cascadeData} add={this.props.add} sub={this.props.sub} node={item} nodeKey={this.props.nodeKey + '·-·' + i} p_relType={this.state.parantRelType} rtqVarList={this.props.rtqVarList}></ThenCopy>
                        )

                }
            </div>

        )
    }
}
Then.propTypes = {
    typeList: PropTypes.array.isRequired,
    dimensionList: PropTypes.array.isRequired,
    valueType: PropTypes.oneOf([1, 2, 3]).isRequired,
    index: PropTypes.number,
    origin: PropTypes.oneOf(['and', 'or']),
    parentIndex: PropTypes.number,
    cascadeData: PropTypes.array,//级联选择数据
    cascadeDataNumber: PropTypes.array,//级联选择数据 number类型
    type: PropTypes.string,
    verifyConditionTreeFinish: PropTypes.func,
    optTypeList: PropTypes.array,
    paramList: PropTypes.array,
    rtqVarList: PropTypes.array
}
Then.defaultProps = {
    valueType: 1,
    cascadeData: [],
    cascadeDataNumber: [],
    type: '',
    verifyConditionTreeFinish: () => { },
    optTypeList: [],
    paramList: [],
    rtqVarList: []
}
export default Then;