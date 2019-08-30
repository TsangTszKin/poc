import React, { Component } from 'react';
import { Provider } from 'mobx-react'
import { toJS } from 'mobx';
import { Spin, Alert } from 'antd';
import "@/styles/treePanel.less"
import Tree from '@/components/condition-tree/Tree2.0.jsx';
import ConditionTreeStore from '@/store/ConditionTreeStore2.0';
import PropTypes from 'prop-types';
import commonService from '@/api/business/commonService';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';

@withRouter
class TreePanel extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
        this.verifyConditionTreeFinish = this.verifyConditionTreeFinish.bind(this);
        this.updateTreeJsonCallBack = this.updateTreeJsonCallBack.bind(this);
        this.getConditionData = this.getConditionData.bind(this);
        this.state = {
            loading: true,
            treeJson: this.props.treeData.conditions,
            cascadeData: [],
            cascadeDataNumber: [],
            varTypeList: [],
            valueTypeList: [],
            parantRelType: this.props.treeData.relType,
            // common start
            VAR_SELECTION_ALL: [],//字符串
            VAR_SELECTION_DECIMAL: [],//单双精度
            VAR_SELECTION_INTEGER: [],//整型，长整型
            VAR_SELECTION_NUMBER: [],//浮点型
            VAR_SELECTION_TIMESTAMP: [],//时间类型
            VAR_SELECTION_VARCHAR: [],//变量
            expressionCategoryType: [],//值类别
            expressionVarType: [],//变量类型
            functionComputeType: [],//函数计算类型
            optTypeList: [],//操作的比较类型
            // common start
            //having start
            LEFT_FUN_SELECTION: [],
            LEFT_VAR_SELECTION: [],
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
        ConditionTreeStore.updateConditionTreeJson(this.props.treeData.conditions);
        ConditionTreeStore.packData();
        this.setState({
            treeJson: this.props.treeData.conditions
        })
    }

    componentDidMount() {
        ConditionTreeStore.reset();
        if (!common.isEmpty(this.props.eventSourceId) && !common.isEmpty(this.props.dimensionId))
            this.getConditionData(this.props);
    }

    componentWillReceiveProps(nextProps) {//组件参数变化的生命周期
        ConditionTreeStore.updateConditionTreeJson(nextProps.treeData.conditions);
        ConditionTreeStore.setConditionsAll(nextProps.treeData);
        ConditionTreeStore.packData();
        this.setState({
            parantRelType: nextProps.treeData.relType,
            treeJson: nextProps.treeData.conditions
        })
        if (nextProps.eventSourceId !== this.props.eventSourceId
            || nextProps.dimensionId !== this.props.dimensionId
            || nextProps.entityType !== this.props.entityType
            || nextProps.fieldList !== this.props.fieldList
        ) {
            if (!common.isEmpty(nextProps.eventSourceId) && !common.isEmpty(nextProps.dimensionId))
                this.getConditionData(nextProps);
        }

    }

    getConditionData(props) {
        console.log("props", props)
        ConditionTreeStore.setConditionsAll(props.treeData);
        this.setState({ loading: true })
        let fixVarSeletion = (data) => {
            data.forEach(element => {
                element.value = element.type;
                element.list.forEach(element2 => {
                    element2.value = element2.code;
                    if (element.type === 0) {//数据库字段
                        element2.value = `${element2.tableAlias}_${element2.code}`;
                        element2.code = `${element2.tableAlias}_${element2.code}`;
                        element2.name = `${(() => {
                            switch (element2.tableAlias) {
                                case 'L':
                                    return '左表'
                                case 'R':
                                    return '右表'
                                case 'E':
                                    return '衍生'
                                case 'G':
                                    return '分组'
                                case 'A':
                                    return '聚合'
                                default:
                                    break;
                            }
                        })()}.${element2.name}`;
                    }
                })
            })
            return data
        }
        switch (props.type) {
            case 'common':
                commonService.getConditionData(props.dimensionId, props.eventSourceId, props.entityType, props.fieldList).then(res => {
                    if (!publicUtils.isOk(res)) return
                    let VAR_SELECTION_ALL = [],//字符串
                        VAR_SELECTION_DECIMAL = [],//单双精度
                        VAR_SELECTION_INTEGER = [],//整型，长整型
                        VAR_SELECTION_NUMBER = [],//浮点型
                        VAR_SELECTION_TIMESTAMP = [],//时间类型
                        VAR_SELECTION_VARCHAR = [],//变量
                        expressionCategoryType = [],//值类别
                        expressionVarType = [],//变量类型
                        functionComputeType = [],//函数计算类型
                        optTypeList = [];//操作的比较类型

                    if (res.data.result.VAR_SELECTION_ALL) VAR_SELECTION_ALL = fixVarSeletion(res.data.result.VAR_SELECTION_ALL);
                    if (res.data.result.VAR_SELECTION_DECIMAL) VAR_SELECTION_DECIMAL = fixVarSeletion(res.data.result.VAR_SELECTION_DECIMAL);
                    if (res.data.result.VAR_SELECTION_INTEGER) VAR_SELECTION_INTEGER = fixVarSeletion(res.data.result.VAR_SELECTION_INTEGER);
                    if (res.data.result.VAR_SELECTION_NUMBER) VAR_SELECTION_NUMBER = fixVarSeletion(res.data.result.VAR_SELECTION_NUMBER);
                    if (res.data.result.VAR_SELECTION_TIMESTAMP) VAR_SELECTION_TIMESTAMP = fixVarSeletion(res.data.result.VAR_SELECTION_TIMESTAMP);
                    if (res.data.result.VAR_SELECTION_VARCHAR) VAR_SELECTION_VARCHAR = fixVarSeletion(res.data.result.VAR_SELECTION_VARCHAR);
                    if (res.data.result.expressionCategoryType) expressionCategoryType = res.data.result.expressionCategoryType;
                    if (res.data.result.expressionVarType) expressionVarType = res.data.result.expressionVarType;
                    if (res.data.result.functionComputeType) {
                        if (props.type === 'common') {
                            functionComputeType = res.data.result.functionComputeType;
                        } else {
                            functionComputeType = res.data.result.functionAggType;
                        }
                    }
                    sessionStorage.functionComputeTypeList = JSON.stringify(functionComputeType);
                    if (res.data.result.optTypeList) optTypeList = res.data.result.optTypeList;
                    this.setState({ loading: false, VAR_SELECTION_ALL, VAR_SELECTION_DECIMAL, VAR_SELECTION_INTEGER, VAR_SELECTION_NUMBER, VAR_SELECTION_TIMESTAMP, VAR_SELECTION_VARCHAR, expressionCategoryType, expressionVarType, functionComputeType, optTypeList })
                }).catch(() => { this.setState({ loading: false }) })
                break;
            case 'having':
                commonService.getHavingConditionData(props.dimensionId, props.eventSourceId, props.fieldList).then(res => {
                    if (!publicUtils.isOk(res)) return
                    let LEFT_VAR_SELECTION = [],//左
                        LEFT_FUN_SELECTION = [],//左
                        RIGHT_VAR_SELECTION_ALL = [],//右字符串
                        RIGHT_VAR_SELECTION_DECIMAL = [],//右单双精度
                        RIGHT_VAR_SELECTION_INTEGER = [],//右整型，长整型
                        RIGHT_VAR_SELECTION_NUMBER = [],//右浮点型
                        RIGHT_VAR_SELECTION_TIMESTAMP = [],//右时间类型
                        RIGHT_VAR_SELECTION_VARCHAR = [],//右变量
                        functionAggType = [],//having函数
                        leftExpressionCategoryType = [],
                        leftExpressionVarType = [],
                        rightExpressionCategoryType = [],
                        rightExpressionVarType = [],
                        optTypeList = []

                    if (res.data.result.LEFT_VAR_SELECTION) LEFT_VAR_SELECTION = fixVarSeletion(res.data.result.LEFT_VAR_SELECTION);
                    if (res.data.result.LEFT_FUN_SELECTION) LEFT_FUN_SELECTION = fixVarSeletion(res.data.result.LEFT_FUN_SELECTION);
                    if (res.data.result.RIGHT_VAR_SELECTION_ALL) RIGHT_VAR_SELECTION_ALL = fixVarSeletion(res.data.result.RIGHT_VAR_SELECTION_ALL);
                    if (res.data.result.RIGHT_VAR_SELECTION_DECIMAL) RIGHT_VAR_SELECTION_DECIMAL = fixVarSeletion(res.data.result.RIGHT_VAR_SELECTION_DECIMAL);
                    if (res.data.result.RIGHT_VAR_SELECTION_INTEGER) RIGHT_VAR_SELECTION_INTEGER = fixVarSeletion(res.data.result.RIGHT_VAR_SELECTION_INTEGER);
                    if (res.data.result.RIGHT_VAR_SELECTION_NUMBER) RIGHT_VAR_SELECTION_NUMBER = fixVarSeletion(res.data.result.RIGHT_VAR_SELECTION_NUMBER);
                    if (res.data.result.RIGHT_VAR_SELECTION_TIMESTAMP) RIGHT_VAR_SELECTION_TIMESTAMP = fixVarSeletion(res.data.result.RIGHT_VAR_SELECTION_TIMESTAMP);
                    if (res.data.result.RIGHT_VAR_SELECTION_VARCHAR) RIGHT_VAR_SELECTION_VARCHAR = fixVarSeletion(res.data.result.RIGHT_VAR_SELECTION_VARCHAR);
                    if (res.data.result.functionAggType) functionAggType = res.data.result.functionAggType;
                    if (res.data.result.leftExpressionCategoryType) leftExpressionCategoryType = res.data.result.leftExpressionCategoryType;
                    if (res.data.result.leftExpressionVarType) leftExpressionVarType = res.data.result.leftExpressionVarType;
                    if (res.data.result.rightExpressionCategoryType) rightExpressionCategoryType = res.data.result.rightExpressionCategoryType;
                    if (res.data.result.rightExpressionVarType) rightExpressionVarType = res.data.result.rightExpressionVarType;
                    if (res.data.result.optTypeList) optTypeList = res.data.result.optTypeList;
                    this.setState({
                        loading: false,
                        LEFT_VAR_SELECTION,
                        LEFT_FUN_SELECTION,
                        RIGHT_VAR_SELECTION_ALL,
                        RIGHT_VAR_SELECTION_DECIMAL,
                        RIGHT_VAR_SELECTION_INTEGER,
                        RIGHT_VAR_SELECTION_NUMBER,
                        RIGHT_VAR_SELECTION_TIMESTAMP,
                        RIGHT_VAR_SELECTION_VARCHAR,
                        functionAggType,
                        leftExpressionCategoryType,
                        leftExpressionVarType,
                        rightExpressionCategoryType,
                        rightExpressionVarType,
                        optTypeList
                    })
                    console.log("leftExpressionCategoryType", leftExpressionCategoryType)
                }).catch(() => { this.setState({ loading: false }) })
                break;
            default:
                break;
        }
    }

    updateTreeJsonCallBack(refresh) {//增减条件节点的时候调用，用户解决强制更新每个根节点位置和类型
        console.log("ConditionTreeStore.getConditionsAll", ConditionTreeStore.getConditionsAll);
        this.props.updateConditionTree(ConditionTreeStore.getConditionsAll, refresh);
        this.setState({
            treeJson: ConditionTreeStore.conditionTreeJson,
            parantRelType: ConditionTreeStore.getConditionsAll.relType,
        })
    }

    /**
      * 删除操作回调
      */
    sub = (nodeKey) => {
        // console.log("sub nodeKey", nodeKey);
        ConditionTreeStore.subNode(nodeKey);
        this.updateTreeJsonCallBack(true);
    }

    /**
     * 增加操作回调
     */
    add = (nodeKey, type, expressionVO, isBranch, extraType) => {
        ConditionTreeStore.addNode(nodeKey, type, expressionVO, isBranch, extraType);
        this.updateTreeJsonCallBack(isBranch);
    }

    verifyConditionTreeFinish() {
        let treeJson = toJS(ConditionTreeStore.conditionTreeJson);
        console.log("treeJson", treeJson)
        for (let i = 0; i < treeJson.length; i++) {
            var element = treeJson[i];
            if (element.nodeType == 1) {
                if (common.isEmpty(element.expressionVO.varCode)) {
                    console.log("请选择完全您的条件变量" + i);
                    this.props.conditionInComplete();
                    return false
                }

                //v2.0新增
                if (element.expressionVO.varCategoryType === 2) {
                    // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                    if (element.expressionVO.varCode === 'COALESCE') {
                        if (element.expressionVO.varParas.length < 2) {
                            console.log("返回第一个非空的参数的参数数量必须2个或以上");
                            this.props.conditionInComplete();
                            return false
                        }
                    }
                    for (let ii = 0; ii < element.expressionVO.varParas.length; ii++) {
                        const varParas = element.expressionVO.varParas[ii];
                        if (common.isEmpty(varParas.value)) {
                            if (!(varParas.formType === 1 && varParas.dataType === 'STRING')) {
                                console.log("请选择完全您的函数参数" + i);
                                this.props.conditionInComplete();
                                return false
                            }
                        }
                    }
                }

                //v2.0新增
                if (element.expressionVO.varCategoryType === 2 && (() => {
                    for (let i = 0; i < this.state.functionComputeType.length; i++) {
                        const functionComputeType = this.state.functionComputeType[i];
                        if (functionComputeType.val === element.expressionVO.varCode) {
                            return functionComputeType.dataType
                        }
                    }
                    return ''
                })() === 'EXPRESSION') {
                    // 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                } else {
                    if (common.isEmpty(element.expressionVO.optType)) {
                        console.log("请选择完全您的变量关系类型" + i);
                        this.props.conditionInComplete();
                        return false
                    }


                    switch (element.expressionVO.valueCategoryType) {
                        case 0://固定值
                            if (element.expressionVO.varDataType !== 12 && element.expressionVO.varDataType !== 0 && element.expressionVO.optType !== 8 && element.expressionVO.optType !== 9) {//字符串类型，is null， is not null  后面不校验
                                if (common.isEmpty(element.expressionVO.value)) {
                                    console.log("请补充完整固定值" + i);
                                    this.props.conditionInComplete();
                                    return false
                                }
                            }
                            // 左边：整型或者浮点型  属于或者不属于 右边：固定值，  则固定值的逗号分隔的每个元素的类型必须一一对应
                            if (element.expressionVO.optType === 6 || element.expressionVO.optType === 7) {// 属于或者不属于
                                let value = []
                                switch (publicUtils.getVarDataType(element.expressionVO.varDataType)) {
                                    case 'int':
                                        value = element.expressionVO.value.split(',');
                                        for (let i = 0; i < value.length; i++) {
                                            const el = value[i];
                                            console.log('Number(el)', Number(el))
                                            if (common.isEmpty(el)) {
                                                console.log("固定值的值类型不一致");
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                            if (isNaN(Number(el))) {
                                                console.log("固定值的值类型不一致");
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                        }
                                        break;
                                    case 'float':
                                        value = element.expressionVO.value.split(',');
                                        for (let i = 0; i < value.length; i++) {
                                            const el = value[i];
                                            console.log('Number(el)', Number(el))
                                            if (common.isEmpty(el)) {
                                                console.log("固定值的值类型不一致");
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                            if (isNaN(Number(el))) {
                                                console.log("固定值的值类型不一致");
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                        }
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case 1: //变量
                            if (common.isEmpty(element.expressionVO.valueCode) || common.isEmpty(element.expressionVO.valueType)) {
                                console.log("请补充完整变量比较值" + i);
                                this.props.conditionInComplete();
                                return false
                            }
                            break;
                        case 2: //函数
                            if (common.isEmpty(element.expressionVO.valueCode)) {
                                console.log("请选择完全您的函数" + i);
                                this.props.conditionInComplete();
                                return false
                            }
                            // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                            if (element.expressionVO.valueCode === 'COALESCE') {
                                if (element.expressionVO.valueParas.length < 2) {
                                    console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                    this.props.conditionInComplete();
                                    return false
                                }
                            }
                            for (let ii = 0; ii < element.expressionVO.valueParas.length; ii++) {
                                const valueParas = element.expressionVO.valueParas[ii];
                                if (common.isEmpty(valueParas.value)) {
                                    if (!(valueParas.formType === 1 && valueParas.dataType === 'STRING')) {
                                        console.log("请选择完全您的函数参数" + i);
                                        this.props.conditionInComplete();
                                        return false
                                    }
                                }
                            }
                            break;
                        default:
                            break;
                    }
                }

            } else {
                for (let j = 0; j < element.conditions.length; j++) {
                    let element2 = element.conditions[j];
                    if (element2.nodeType === 1) {
                        if (common.isEmpty(element2.expressionVO.varCode)) {
                            console.log("请选择完全您的条件变量" + i + '-' + j);
                            this.props.conditionInComplete();
                            return false
                        }

                        //v2.0新增
                        if (element2.expressionVO.varCategoryType === 2) {
                            // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                            if (element2.expressionVO.varCode === 'COALESCE') {
                                if (element2.expressionVO.varParas.length < 2) {
                                    console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                    this.props.conditionInComplete();
                                    return false
                                }
                            }
                            for (let ii = 0; ii < element2.expressionVO.varParas.length; ii++) {
                                const varParas = element2.expressionVO.varParas[ii];
                                if (common.isEmpty(varParas.value)) {
                                    if (!(varParas.formType === 1 && varParas.dataType === 'STRING')) {
                                        console.log("请选择完全您的函数参数" + i + '-' + j);
                                        this.props.conditionInComplete();
                                        return false
                                    }
                                }
                            }
                        }

                        //v2.0新增
                        if (element2.expressionVO.varCategoryType === 2 && (() => {
                            for (let i = 0; i < this.state.functionComputeType.length; i++) {
                                const functionComputeType = this.state.functionComputeType[i];
                                if (functionComputeType.val === element2.expressionVO.varCode) {
                                    return functionComputeType.dataType
                                }
                            }
                            return ''
                        })() === 'EXPRESSION') {
                            // 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                        } else {
                            if (common.isEmpty(element2.expressionVO.optType)) {
                                console.log("请选择完全您的变量关系类型" + i + '-' + j);
                                this.props.conditionInComplete();
                                return false
                            }

                            switch (element2.expressionVO.valueCategoryType) {
                                case 0://固定值
                                    if (element2.expressionVO.varDataType !== 12 && element2.expressionVO.varDataType !== 0 && element2.expressionVO.optType !== 8 && element2.expressionVO.optType !== 9) {//字符串类型，is null， is not null  后面不校验
                                        if (common.isEmpty(element2.expressionVO.value)) {
                                            console.log("请补充完整固定值" + i + '-' + j);
                                            this.props.conditionInComplete();
                                            return false
                                        }
                                    }
                                    // 左边：整型或者浮点型  属于或者不属于 右边：固定值，  则固定值的逗号分隔的每个元素的类型必须一一对应
                                    if (element2.expressionVO.optType === 6 || element2.expressionVO.optType === 7) {// 属于或者不属于
                                        let value = []
                                        switch (publicUtils.getVarDataType(element2.expressionVO.varDataType)) {
                                            case 'int':
                                                value = element2.expressionVO.value.split(',');
                                                for (let i = 0; i < value.length; i++) {
                                                    const el = value[i];
                                                    console.log('Number(el)', Number(el))
                                                    if (common.isEmpty(el)) {
                                                        console.log("固定值的值类型不一致");
                                                        this.props.conditionInComplete();
                                                        return false
                                                    }
                                                    if (isNaN(Number(el))) {
                                                        console.log("固定值的值类型不一致");
                                                        this.props.conditionInComplete();
                                                        return false
                                                    }
                                                }
                                                break;
                                            case 'float':
                                                value = element2.expressionVO.value.split(',');
                                                for (let i = 0; i < value.length; i++) {
                                                    const el = value[i];
                                                    console.log('Number(el)', Number(el))
                                                    if (common.isEmpty(el)) {
                                                        console.log("固定值的值类型不一致");
                                                        this.props.conditionInComplete();
                                                        return false
                                                    }
                                                    if (isNaN(Number(el))) {
                                                        console.log("固定值的值类型不一致");
                                                        this.props.conditionInComplete();
                                                        return false
                                                    }
                                                }
                                                break;
                                            default:
                                                break;
                                        }
                                    }
                                    break;
                                case 1: //变量
                                    if (common.isEmpty(element2.expressionVO.valueCode) || common.isEmpty(element2.expressionVO.valueType)) {
                                        console.log("请补充完整变量比较值" + i + '-' + j);
                                        this.props.conditionInComplete();
                                        return false
                                    }
                                    break;
                                case 2: //函数
                                    if (common.isEmpty(element2.expressionVO.valueCode)) {
                                        console.log("请选择完全您的函数" + i + '-' + j);
                                        this.props.conditionInComplete();
                                        return false
                                    }
                                    // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                                    if (element2.expressionVO.valueCode === 'COALESCE') {
                                        if (element2.expressionVO.valueParas.length < 2) {
                                            console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                            this.props.conditionInComplete();
                                            return false
                                        }
                                    }
                                    for (let ii = 0; ii < element2.expressionVO.valueParas.length; ii++) {
                                        const valueParas = element2.expressionVO.valueParas[ii];
                                        if (common.isEmpty(valueParas.value)) {
                                            if (!(valueParas.formType === 1 && valueParas.dataType === 'STRING')) {
                                                console.log("请选择完全您的函数参数" + i + '-' + j);
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }

                        }

                    } else {
                        for (let k = 0; k < element2.conditions.length; k++) {
                            let element3 = element2.conditions[k];
                            if (element3.nodeType === 1) {
                                if (common.isEmpty(element3.expressionVO.varCode)) {
                                    console.log("请选择完全您的条件变量" + i + '-' + j + '-' + k);
                                    this.props.conditionInComplete();
                                    return false
                                }

                                //v2.0新增
                                if (element3.expressionVO.varCategoryType === 2) {
                                    // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                                    if (element3.expressionVO.varCode === 'COALESCE') {
                                        if (element3.expressionVO.varParas.length < 2) {
                                            console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                            this.props.conditionInComplete();
                                            return false
                                        }
                                    }
                                    for (let ii = 0; ii < element3.expressionVO.varParas.length; ii++) {
                                        const varParas = element3.expressionVO.varParas[ii];
                                        if (common.isEmpty(varParas.value)) {
                                            if (!(varParas.formType === 1 && varParas.dataType === 'STRING')) {
                                                console.log("请选择完全您的函数参数" + i + '-' + j + '-' + k);
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                        }
                                    }
                                }

                                //v2.0新增
                                if (element3.expressionVO.varCategoryType === 2 && (() => {
                                    for (let i = 0; i < this.state.functionComputeType.length; i++) {
                                        const functionComputeType = this.state.functionComputeType[i];
                                        if (functionComputeType.val === element3.expressionVO.varCode) {
                                            return functionComputeType.dataType
                                        }
                                    }
                                    return ''
                                })() === 'EXPRESSION') {
                                    // 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                                } else {
                                    if (common.isEmpty(element3.expressionVO.optType)) {
                                        console.log("请选择完全您的变量关系类型" + i + '-' + j + '-' + k);
                                        this.props.conditionInComplete();
                                        return false
                                    }

                                    switch (element3.expressionVO.valueCategoryType) {
                                        case 0://固定值
                                            if (element3.expressionVO.varDataType !== 12 && element3.expressionVO.varDataType !== 0 && element3.expressionVO.optType !== 8 && element3.expressionVO.optType !== 9) {//字符串类型，is null， is not null  后面不校验
                                                if (common.isEmpty(element3.expressionVO.value)) {
                                                    console.log("请补充完整固定值" + i + '-' + j + '-' + k);
                                                    this.props.conditionInComplete();
                                                    return false
                                                }
                                            }
                                            // 左边：整型或者浮点型  属于或者不属于 右边：固定值，  则固定值的逗号分隔的每个元素的类型必须一一对应
                                            if (element3.expressionVO.optType === 6 || element3.expressionVO.optType === 7) {// 属于或者不属于
                                                let value = []
                                                switch (publicUtils.getVarDataType(element3.expressionVO.varDataType)) {
                                                    case 'int':
                                                        value = element3.expressionVO.value.split(',');
                                                        for (let i = 0; i < value.length; i++) {
                                                            const el = value[i];
                                                            console.log('Number(el)', Number(el))
                                                            if (common.isEmpty(el)) {
                                                                console.log("固定值的值类型不一致");
                                                                this.props.conditionInComplete();
                                                                return false
                                                            }
                                                            if (isNaN(Number(el))) {
                                                                console.log("固定值的值类型不一致");
                                                                this.props.conditionInComplete();
                                                                return false
                                                            }
                                                        }
                                                        break;
                                                    case 'float':
                                                        value = element3.expressionVO.value.split(',');
                                                        for (let i = 0; i < value.length; i++) {
                                                            const el = value[i];
                                                            console.log('Number(el)', Number(el))
                                                            if (common.isEmpty(el)) {
                                                                console.log("固定值的值类型不一致");
                                                                this.props.conditionInComplete();
                                                                return false
                                                            }
                                                            if (isNaN(Number(el))) {
                                                                console.log("固定值的值类型不一致");
                                                                this.props.conditionInComplete();
                                                                return false
                                                            }
                                                        }
                                                        break;
                                                    default:
                                                        break;
                                                }
                                            }
                                            break;
                                        case 1: //变量
                                            if (common.isEmpty(element3.expressionVO.valueCode) || common.isEmpty(element3.expressionVO.valueType)) {
                                                console.log("请补充完整变量比较值" + i + '-' + j + '-' + k);
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                            break;
                                        case 2: //函数
                                            if (common.isEmpty(element3.expressionVO.valueCode)) {
                                                console.log("请选择完全您的函数" + i + '-' + j + '-' + k);
                                                this.props.conditionInComplete();
                                                return false
                                            }
                                            // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                                            if (element3.expressionVO.valueCode === 'COALESCE') {
                                                if (element3.expressionVO.valueParas.length < 2) {
                                                    console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                                    this.props.conditionInComplete();
                                                    return false
                                                }
                                            }
                                            for (let ii = 0; ii < element3.expressionVO.valueParas.length; ii++) {
                                                const valueParas = element3.expressionVO.valueParas[ii];
                                                if (common.isEmpty(valueParas.value)) {
                                                    if (!(valueParas.formType === 1 && valueParas.dataType === 'STRING')) {
                                                        console.log("请选择完全您的函数参数" + i + '-' + j + '-' + k);
                                                        this.props.conditionInComplete();
                                                        return false
                                                    }
                                                }
                                            }
                                            break;
                                        default:
                                            break;
                                    }

                                }

                            }
                        }
                    }
                }
            }
        }
        console.log('----  条件数数据完整如下  ----');
        // console.log(toJS(ConditionTreeStore.conditionTreeJson));
        console.log(toJS(ConditionTreeStore.conditionsAll));
        this.props.conditionComplete(ConditionTreeStore.conditionsAll);
        return true
    }

    render() {
        // console.log("this.state.treeJson", this.state.treeJson);
        // console.log("parantRelType", this.state.parantRelType)
        // console.log("toJS(ConditionTreeStore.conditionTreeJson)", toJS(ConditionTreeStore.conditionTreeJson))
        console.log('treePanel 重绘')
        return (
            <Provider conditionTreeStore={ConditionTreeStore}>
                {
                    common.isEmpty(this.props.eventSourceId) || common.isEmpty(this.props.dimensionId) ?
                        <Alert message={(() => {
                            if (common.isEmpty(this.props.eventSourceId)) return '请先选择事件源'
                            if (common.isEmpty(this.props.dimensionId)) return '请先选择维度'
                            return ''
                        })()} type="warning" />
                        :
                        <Spin spinning={this.state.loading}>
                            <div className="tree-panel-container" style={{ paddingLeft: '0', clear: 'both', overflow: 'auto' }} >
                                {
                                    this.state.treeJson.map((item, i) =>
                                        <Tree
                                            key={Math.random()}
                                            type={this.props.type}
                                            extraType={this.props.extraType}
                                            disabled={this.props.disabled}
                                            add={this.add}
                                            sub={this.sub}
                                            node={item}
                                            p_relType={this.state.parantRelType}//父节点的relTyoe
                                            nodeKey={i}
                                            updateConditionTree={this.props.updateConditionTree}//更新条件树的回调
                                            verifyConditionTreeFinish={this.verifyConditionTreeFinish}//校验条件树形是否填写完整的回调函数
                                            conditionVODemo={conditionVODemo}
                                            conditionsAll={this.props.treeData}
                                            // 后端统一返回的下拉选择数据 start
                                            // common start
                                            VAR_SELECTION_ALL={this.state.VAR_SELECTION_ALL}
                                            VAR_SELECTION_DECIMAL={this.state.VAR_SELECTION_DECIMAL}
                                            VAR_SELECTION_INTEGER={this.state.VAR_SELECTION_INTEGER}
                                            VAR_SELECTION_NUMBER={this.state.VAR_SELECTION_NUMBER}
                                            VAR_SELECTION_TIMESTAMP={this.state.VAR_SELECTION_TIMESTAMP}
                                            VAR_SELECTION_VARCHAR={this.state.VAR_SELECTION_VARCHAR}
                                            expressionCategoryType={this.state.expressionCategoryType}
                                            expressionVarType={this.state.expressionVarType}
                                            functionComputeType={this.state.functionComputeType}
                                            optTypeList={this.state.optTypeList}
                                            // common end
                                            // having start
                                            LEFT_VAR_SELECTION={this.state.LEFT_VAR_SELECTION}
                                            LEFT_FUN_SELECTION={this.state.LEFT_FUN_SELECTION}
                                            RIGHT_VAR_SELECTION_ALL={this.state.RIGHT_VAR_SELECTION_ALL}
                                            RIGHT_VAR_SELECTION_DECIMAL={this.state.RIGHT_VAR_SELECTION_DECIMAL}
                                            RIGHT_VAR_SELECTION_INTEGER={this.state.RIGHT_VAR_SELECTION_INTEGER}
                                            RIGHT_VAR_SELECTION_NUMBER={this.state.RIGHT_VAR_SELECTION_NUMBER}
                                            RIGHT_VAR_SELECTION_TIMESTAMP={this.state.RIGHT_VAR_SELECTION_TIMESTAMP}
                                            RIGHT_VAR_SELECTION_VARCHAR={this.state.RIGHT_VAR_SELECTION_VARCHAR}
                                            functionAggType={this.state.functionAggType}
                                            leftExpressionCategoryType={this.state.leftExpressionCategoryType}
                                            leftExpressionVarType={this.state.leftExpressionVarType}
                                            rightExpressionCategoryType={this.state.rightExpressionCategoryType}
                                            rightExpressionVarType={this.state.rightExpressionVarType}
                                        // having end
                                        // 后端统一返回的下拉选择数据 end
                                        ></Tree>
                                    )
                                }

                            </div>
                        </Spin>
                }

            </Provider>
        )
    }
}
TreePanel.propTypes = {
    // common start
    treeData: PropTypes.object, // 条件数据
    updateConditionTree: PropTypes.fun,//更新conditionsAll,形参是完整的consitionsAll
    conditionComplete: PropTypes.func, //所有条件完成后出发的回调函数
    conditionInComplete: PropTypes.func,//一旦有条件出现未完成后触发的回调函数
    disabled: PropTypes.bool, //是否禁止编辑
    entityType: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),//0衍生变量1实时查询变量2规则3策略4决策表5评分卡
    eventSourceId: PropTypes.string, //事件源id
    dimensionId: PropTypes.string, //维度id
    fieldList: PropTypes.array, //数据库字段列表（用于下拉选择）
    type: PropTypes.oneOf(['common', 'having']), // 条件类型（通用类型，having类型）
    extraType: PropTypes.oneOf(['easyStrategyTable', 'crossTable', 'connect']), //扩展类型（简单决策表， 交叉决策表, connect条件类型）
    // common start
}
TreePanel.defaultProps = {
    treeData: conditionVODemo,
    updateConditionTree: () => { },
    conditionComplete: () => { },
    conditionInComplete: () => { },
    disabled: false,
    entityType: 1,
    eventSourceId: '',
    dimensionId: '',
    fieldList: [],
    type: 'common'
}
export default TreePanel;

const conditionVODemo = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "varCategoryType": 1,
            "varTableAlias": "",
            "varType": '',
            "varDataType": "",
            "varCode": "",
            "varName": "",
            "varDefaultValue": "",
            "varValue": "",
            "varParas": [],
            
            "optType": '',

            "valueCategoryType": 0,//固定值
            "valueTableAlias": "",
            "valueType": '',
            "valueDataType": "",
            "valueCode": "",
            "valueName": "",
            "valueDefaultValue": "",
            "value": "",
            "valueParas": []
        },
        "nodeType": 1
    }
    ]
}