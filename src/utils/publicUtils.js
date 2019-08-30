/* eslint-disable no-inner-declarations */
/* eslint-disable no-case-declarations */
/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-23 15:44:14
 * @Description: 
 */
import { message, Modal } from 'antd';
import common from './common';
import { toJS } from 'mobx';
import React from "react";

export default {
    verifyConditionTree(conditionVO, isTips) {
        console.log(toJS(conditionVO));
        for (let i = 0; i < conditionVO.conditions.length; i++) {
            var element = conditionVO.conditions[i];
            if (element.nodeType == 1) {
                if (common.isEmpty(element.expressionVO.varCode)) {
                    console.log("请选择完全您的条件变量");
                    if (isTips) message.warning("请选择完全您的条件变量");
                    return false
                }

                //v2.0新增
                if (element.expressionVO.varCategoryType === 2) {
                    // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                    if (element.expressionVO.varCode === 'COALESCE') {
                        if (element.expressionVO.varParas.length < 2) {
                            console.log("返回第一个非空的参数的参数数量必须2个或以上");
                            if (isTips) message.warning("返回第一个非空的参数的参数数量必须2个或以上");
                            return false
                        }
                    }
                    for (let ii = 0; ii < element.expressionVO.varParas.length; ii++) {
                        const varParas = element.expressionVO.varParas[ii];
                        if (common.isEmpty(varParas.value)) {
                            if (varParas.formType !== 1 && varParas.dataType !== 'STRING') {
                                console.log("请选择完全您的函数参数");
                                if (isTips) message.warning("请选择完全您的函数参数");
                                return false
                            }
                        }
                    }
                }

                //v2.0新增
                if (element.expressionVO.varCategoryType === 2 && (() => {
                    let functionComputeTypeList = JSON.parse(sessionStorage.functionComputeTypeList);
                    for (let i = 0; i < functionComputeTypeList.length; i++) {
                        const functionComputeType = functionComputeTypeList[i];
                        if (functionComputeType.val === element.expressionVO.varCode) {
                            return functionComputeType.dataType
                        }
                    }
                    return ''
                })() === 'EXPRESSION') {
                    // 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                } else {
                    if (common.isEmpty(element.expressionVO.optType)) {
                        console.log("请选择完全您的变量关系类型");
                        if (isTips) message.warning("请选择完全您的变量关系类型");
                        return false
                    }

                    switch (element.expressionVO.valueCategoryType) {
                        case 0://固定值
                            if (element.expressionVO.varDataType !== 12 && element.expressionVO.varDataType !== 0 && element.expressionVO.optType !== 8 && element.expressionVO.optType !== 9) {//字符串类型，is null， is not null  后面不校验
                                if (common.isEmpty(element.expressionVO.value)) {
                                    console.log("请补充完整固定值");
                                    if (isTips) message.warning("请补充完整固定值");
                                    return false
                                }
                            }
                            // 左边：整型或者浮点型  属于或者不属于 右边：固定值，  则固定值的逗号分隔的每个元素的类型必须一一对应
                            if (element.expressionVO.optType === 6 || element.expressionVO.optType === 7) {// 属于或者不属于
                                let value = []
                                switch (this.getVarDataType(element.expressionVO.varDataType)) {
                                    case 'int':
                                        value = element.expressionVO.value.split(',');
                                        for (let i = 0; i < value.length; i++) {
                                            const el = value[i];
                                            console.log('Number(el)', Number(el))
                                            if (common.isEmpty(el)) {
                                                console.log("固定值的值类型不一致");
                                                if (isTips) message.warning("固定值的值类型不一致");
                                                return false
                                            }
                                            if (isNaN(Number(el))) {
                                                console.log("固定值的值类型不一致");
                                                if (isTips) message.warning("固定值的值类型不一致");
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
                                                if (isTips) message.warning("固定值的值类型不一致");
                                                return false
                                            }
                                            if (isNaN(Number(el))) {
                                                console.log("固定值的值类型不一致");
                                                if (isTips) message.warning("固定值的值类型不一致");
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
                                console.log("请补充完整变量比较值");
                                if (isTips) message.warning("请补充完整变量比较值");
                                return false
                            }
                            break;
                        case 2: //函数
                            if (common.isEmpty(element.expressionVO.valueCode)) {
                                console.log("请选择完全您的函数");
                                if (isTips) message.warning("请选择完全您的函数");
                                return false
                            }
                            // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                            if (element.expressionVO.valueCode === 'COALESCE') {
                                if (element.expressionVO.valueParas.length < 2) {
                                    console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                    if (isTips) message.warning("返回第一个非空的参数的参数数量必须2个或以上");
                                    return false
                                }
                            }
                            for (let ii = 0; ii < element.expressionVO.valueParas.length; ii++) {
                                const valueParas = element.expressionVO.valueParas[ii];
                                if (common.isEmpty(valueParas.value)) {
                                    if (!(valueParas.formType === 1 && valueParas.dataType === 'STRING')) {
                                        console.log("请选择完全您的函数参数");
                                        if (isTips) message.warning("请选择完全您的函数参数");
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
                            console.log("请选择完全您的条件变量");
                            if (isTips) message.warning("请选择完全您的条件变量");
                            return false
                        }

                        //v2.0新增
                        if (element2.expressionVO.varCategoryType === 2) {
                            // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                            if (element2.expressionVO.varCode === 'COALESCE') {
                                if (element2.expressionVO.varParas.length < 2) {
                                    console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                    if (isTips) message.warning("返回第一个非空的参数的参数数量必须2个或以上");
                                    return false
                                }
                            }
                            for (let ii = 0; ii < element2.expressionVO.varParas.length; ii++) {
                                const varParas = element2.expressionVO.varParas[ii];
                                if (common.isEmpty(varParas.value)) {
                                    if (varParas.formType !== 1 && varParas.dataType !== 'STRING') {
                                        console.log("请选择完全您的函数参数");
                                        if (isTips) message.warning("请选择完全您的函数参数");
                                        return false
                                    }
                                }
                            }
                        }

                        //v2.0新增
                        if (element2.expressionVO.varCategoryType === 2 && (() => {
                            let functionComputeTypeList = JSON.parse(sessionStorage.functionComputeTypeList);
                            for (let i = 0; i < functionComputeTypeList.length; i++) {
                                const functionComputeType = functionComputeTypeList[i];
                                if (functionComputeType.val === element2.expressionVO.varCode) {
                                    return functionComputeType.dataType
                                }
                            }
                            return ''
                        })() === 'EXPRESSION') {
                            // 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                        } else {
                            if (common.isEmpty(element2.expressionVO.optType)) {
                                console.log("请选择完全您的变量关系类型");
                                if (isTips) message.warning("请选择完全您的变量关系类型");
                                return false
                            }

                            switch (element2.expressionVO.valueCategoryType) {
                                case 0://固定值
                                    if (element2.expressionVO.varDataType !== 12 && element2.expressionVO.varDataType !== 0 && element2.expressionVO.optType !== 8 && element2.expressionVO.optType !== 9) {//字符串类型，is null， is not null  后面不校验
                                        if (common.isEmpty(element2.expressionVO.value)) {
                                            console.log("请补充完整固定值");
                                            if (isTips) message.warning("请补充完整固定值");
                                            return false
                                        }
                                    }
                                    // 左边：整型或者浮点型  属于或者不属于 右边：固定值，  则固定值的逗号分隔的每个元素的类型必须一一对应
                                    if (element2.expressionVO.optType === 6 || element2.expressionVO.optType === 7) {// 属于或者不属于
                                        let value = []
                                        switch (this.getVarDataType(element2.expressionVO.varDataType)) {
                                            case 'int':
                                                value = element2.expressionVO.value.split(',');
                                                for (let i = 0; i < value.length; i++) {
                                                    const el = value[i];
                                                    console.log('Number(el)', Number(el))
                                                    if (common.isEmpty(el)) {
                                                        console.log("固定值的值类型不一致");
                                                        if (isTips) message.warning("固定值的值类型不一致");
                                                        return false
                                                    }
                                                    if (isNaN(Number(el))) {
                                                        console.log("固定值的值类型不一致");
                                                        if (isTips) message.warning("固定值的值类型不一致");
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
                                                        if (isTips) message.warning("固定值的值类型不一致");
                                                        return false
                                                    }
                                                    if (isNaN(Number(el))) {
                                                        console.log("固定值的值类型不一致");
                                                        if (isTips) message.warning("固定值的值类型不一致");
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
                                        console.log("请补充完整变量比较值");
                                        if (isTips) message.warning("请补充完整变量比较值");
                                        return false
                                    }
                                    break;
                                case 2: //函数
                                    if (common.isEmpty(element2.expressionVO.valueCode)) {
                                        console.log("请选择完全您的函数");
                                        if (isTips) message.warning("请选择完全您的函数");
                                        return false
                                    }
                                    // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                                    if (element2.expressionVO.valueCode === 'COALESCE') {
                                        if (element2.expressionVO.valueParas.length < 2) {
                                            console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                            if (isTips) message.warning("返回第一个非空的参数的参数数量必须2个或以上");
                                            return false
                                        }
                                    }
                                    for (let ii = 0; ii < element2.expressionVO.valueParas.length; ii++) {
                                        const valueParas = element2.expressionVO.valueParas[ii];
                                        if (common.isEmpty(valueParas.value)) {
                                            if (!(valueParas.formType === 1 && valueParas.dataType === 'STRING')) {
                                                console.log("请选择完全您的函数参数");
                                                if (isTips) message.warning("请选择完全您的函数参数");
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
                                    console.log("请选择完全您的条件变量");
                                    if (isTips) message.warning("请选择完全您的条件变量");
                                    return false
                                }

                                //v2.0新增
                                if (element3.expressionVO.varCategoryType === 2) {
                                    // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                                    if (element3.expressionVO.varCode === 'COALESCE') {
                                        if (element3.expressionVO.varParas.length < 2) {
                                            console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                            if (isTips) message.warning("返回第一个非空的参数的参数数量必须2个或以上");
                                            return false
                                        }
                                    }
                                    for (let ii = 0; ii < element3.expressionVO.varParas.length; ii++) {
                                        const varParas = element3.expressionVO.varParas[ii];
                                        if (common.isEmpty(varParas.value)) {
                                            if (varParas.formType !== 1 && varParas.dataType !== 'STRING') {
                                                console.log("请选择完全您的函数参数");
                                                if (isTips) message.warning("请选择完全您的函数参数");
                                                return false
                                            }
                                        }
                                    }
                                }


                                //v2.0新增
                                if (element3.expressionVO.varCategoryType === 2 && (() => {
                                    let functionComputeTypeList = JSON.parse(sessionStorage.functionComputeTypeList);
                                    for (let i = 0; i < functionComputeTypeList.length; i++) {
                                        const functionComputeType = functionComputeTypeList[i];
                                        if (functionComputeType.val === element3.expressionVO.varCode) {
                                            return functionComputeType.dataType
                                        }
                                    }
                                    return ''
                                })() === 'EXPRESSION') {
                                    // 函数类型，并且函数的dataType等于EXPRESSION 后面不显示 （伟东需求）
                                } else {
                                    if (common.isEmpty(element3.expressionVO.optType)) {
                                        console.log("请选择完全您的变量关系类型");
                                        if (isTips) message.warning("请选择完全您的变量关系类型");
                                        return false
                                    }

                                    switch (element3.expressionVO.valueCategoryType) {
                                        case 0://固定值
                                            if (element3.expressionVO.varDataType !== 12 && element3.expressionVO.varDataType !== 0 && element3.expressionVO.optType !== 8 && element3.expressionVO.optType !== 9) {//字符串类型，is null， is not null  后面不校验
                                                if (common.isEmpty(element3.expressionVO.value)) {
                                                    console.log("请补充完整固定值");
                                                    if (isTips) message.warning("请补充完整固定值");
                                                    return false
                                                }
                                            }
                                            // 左边：整型或者浮点型  属于或者不属于 右边：固定值，  则固定值的逗号分隔的每个元素的类型必须一一对应
                                            if (element3.expressionVO.optType === 6 || element3.expressionVO.optType === 7) {// 属于或者不属于
                                                let value = []
                                                switch (this.getVarDataType(element3.expressionVO.varDataType)) {
                                                    case 'int':
                                                        value = element3.expressionVO.value.split(',');
                                                        for (let i = 0; i < value.length; i++) {
                                                            const el = value[i];
                                                            console.log('Number(el)', Number(el))
                                                            if (common.isEmpty(el)) {
                                                                console.log("固定值的值类型不一致");
                                                                if (isTips) message.warning("固定值的值类型不一致");
                                                                return false
                                                            }
                                                            if (isNaN(Number(el))) {
                                                                console.log("固定值的值类型不一致");
                                                                if (isTips) message.warning("固定值的值类型不一致");
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
                                                                if (isTips) message.warning("固定值的值类型不一致");
                                                                return false
                                                            }
                                                            if (isNaN(Number(el))) {
                                                                console.log("固定值的值类型不一致");
                                                                if (isTips) message.warning("固定值的值类型不一致");
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
                                                console.log("请补充完整变量比较值");
                                                if (isTips) message.warning("请补充完整变量比较值");
                                                return false
                                            }
                                            break;
                                        case 2: //函数
                                            if (common.isEmpty(element3.expressionVO.valueCode)) {
                                                console.log("请选择完全您的函数");
                                                if (isTips) message.warning("请选择完全您的函数");
                                                return false
                                            }
                                            // 单独判断“返回第一个非空的参数（COALESCE）”该函数必须有两个参数（后端要求写死）
                                            if (element3.expressionVO.valueCode === 'COALESCE') {
                                                if (element3.expressionVO.valueParas.length < 2) {
                                                    console.log("返回第一个非空的参数的参数数量必须2个或以上");
                                                    if (isTips) message.warning("返回第一个非空的参数的参数数量必须2个或以上");
                                                    return false
                                                }
                                            }
                                            for (let ii = 0; ii < element3.expressionVO.valueParas.length; ii++) {
                                                const valueParas = element3.expressionVO.valueParas[ii];
                                                if (common.isEmpty(valueParas.value)) {
                                                    if (!(valueParas.formType === 1 && valueParas.dataType === 'STRING')) {
                                                        console.log("请选择完全您的函数参数");
                                                        if (isTips) message.warning("请选择完全您的函数参数");
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
        return true
    },
    verifyConditionThen(conditionVO, isTips) {
        let treeJson = conditionVO;
        console.log("treeJson ", toJS(treeJson))
        for (let i = 0; i < treeJson.length; i++) {
            var element = treeJson[i];
            if (common.isEmpty(element.parameterId)) {
                console.log("请选择完全您的参数变量" + i);
                if (isTips) message.warning("请选择完全您的参数变量");
                return false
            }
            if (element.actionType === 0) {
                switch (element.type) {
                    case 1://变量类型
                        if (common.isEmpty(element.varType) || common.isEmpty(element.varCode) || common.isEmpty(element.varDataType)) {
                            console.log("请补充完整变量比较值" + i);
                            if (isTips) message.warning("请补充完整变量比较值");
                            return false
                        }
                        break;
                    case 0://固定值类型
                        if (this.getVarDataType(element.fixedValueType) !== 'string') {
                            if (common.isEmpty(element.fixedValue)) {
                                console.log("非字符串的固定值不能为空" + i);
                                if (isTips) message.warning("非字符串的固定值不能为空");
                                return false
                            }
                        }
                        break;
                    case 3://计算类型
                        // 验证计算表达式
                        if (common.isEmpty(element.computeExpressionVO.fieldList)) {
                            console.log("请配置完整计算公式");
                            if (isTips) message.warning("请配置完整计算公式");
                            return false
                        }

                        let result = true;
                        let correct = true;

                        function verifycomputeExpressionVO(computeExpressionVO) {
                            if (computeExpressionVO.type === 2) {
                                computeExpressionVO.fieldList.forEach(element => {
                                    verifycomputeExpressionVO(element)
                                })
                            } else {
                                const { categoryType, code, selectCode, type, value } = computeExpressionVO.computeVarVO
                                const { computeOperator } = computeExpressionVO
                                if (categoryType === 1) {//变量
                                    if (common.isEmpty(code) || common.isEmpty(selectCode) || common.isEmpty(type)) {
                                        result = false
                                    }
                                } else if (categoryType === 0) {//固定值
                                    if (common.isEmpty(value)) {
                                        result = false
                                    }
                                    if (computeOperator === 'DIVIDE' && value == 0) {
                                        result = false
                                        correct = false
                                    }
                                }
                            }
                        }
                        verifycomputeExpressionVO(element.computeExpressionVO);
                        if (!correct) {
                            console.log(`0不能做除数`);
                            if (isTips) message.warning(`0不能做除数`);
                            return false
                        }
                        if (!result) {
                            console.log(`衍生变量的计算公式未配置完成，请配置`);
                            if (isTips) message.warning(`衍生变量的计算公式未配置完成，请配置`);
                            return false
                        }
                        break;
                    default:
                        break;
                }
            } else if (element.actionType === 1) {
                if (common.isEmpty(element.executionManner)) {
                    console.log("请选择执行方法的类型" + i);
                    if (isTips) message.warning("请选择执行方法的类型");
                    return false
                }
                if (common.isEmpty(element.rtqVarId)) {
                    console.log("请选择查询方法" + i);
                    if (isTips) message.warning("请选择查询方法");
                    return false
                }
                if (common.isEmpty(element.parameterId)) {
                    console.log("请选择查询的赋值参数" + i);
                    if (isTips) message.warning("请选择查询的赋值参数");
                    return false
                }
            }

            element.varType = Number(element.varType);
        }
        return true
    },
    /**
     * resultFul的返回码判断
     * @param {*} res
     * @param isShowSuccess
     * @param isShowFail
     * @returns boolean
     */
    isOk: (res, isShowSuccess = false, isShowFail = true) => {
        if (common.isEmpty(res.data)) {
            // Modal.warning({
            //     title: '系统提示',
            //     content: "未能获取数据",
            // });
            console.error("接口返回的结果集为空");
            return false
        } else {
            if (res.data.resultCode !== 1000) {
                if (res.data.resultCode === 7018 || res.data.resultCode == 3008) {
                    // window.event.returnValue = false;
                    // alert("过期");
                    // alert(localStorage.token);
                    // console.log("过期的token", localStorage.token)
                    // message.error(res.data.resultMessage);
                    window.location.href = '/#/login';
                } else {
                    if (isShowFail) {
                        Modal.warning({
                            title: '系统提示',
                            content: <pre>{res.data.resultMessage}</pre>,
                        });
                    }
                }
                return false
            } else {
                if (isShowSuccess) {
                    Modal.success({
                        title: '系统提示',
                        content: <pre>{res.data.resultMessage}</pre>,
                    });
                }
                return true
            }
        }

    },
    /**
     *验证权限标识
     *
     * @param {*} label
     * @returns
     */
    isAuth(label) {
        if (common.isEmpty(label)) return false
        let authActionArray = common.stringToArray(localStorage.authAction);
        if (authActionArray.includes(label)) {
            return true
        } else {
            return false
        }
    },
    /**
     *获取数据字段的类型（数据库字段类型）
     *
     * @param {*} dataType
     * @returns
     */
    getVarDataType(dataType) {
        let rs = null;
        if (typeof dataType === 'string')
            dataType = Number(dataType)

        switch (dataType) {
            case 12:
                rs = 'string';
                break;
            case -3:
                rs = 'string';
                break;
            case -5:
                rs = 'int';
                break;
            case 4:
                rs = 'int';
                break;
            case -6:
                rs = 'int';
                break;
            case 5:
                rs = 'int';
                break;
            case 3:
                rs = 'float';
                break;
            case 2:
                rs = 'float';
                break;
            case 6:
                rs = 'float';
                break;
            case 16:
                rs = 'boolean';
                break;
            case 93:
                rs = 'time';
                break;
            case 1111:
                rs = 'string';
                break;
            case 0:
                rs = 'expression';
                break;
            default:
                break;
        }
        return rs
    }
}