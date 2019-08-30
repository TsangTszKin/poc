import React, { Component } from 'react';
import { inject, Provider } from 'mobx-react'
import { toJS } from 'mobx';
import "@/styles/treePanel.less"
import Then from '@/components/condition-tree/Then';
import ConditionThenStore from '@/store/ConditionThenStore';
import PropTypes from 'prop-types';
import common from "@/utils/common";
import publicUtils from "@/utils/publicUtils";

// 这个就是ThenPanel组件复制过来的，因为需要用到多个这个组件，
// 去掉了componentDidMount中获取接口代码，在上层组件获取然后通过props传入
// 还去掉了很多用不到的功能
class ThenWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeJson: this.props.treeData,
        }
        // console.log('this.props.treeData', this.props.treeData);
        ConditionThenStore.setConditionsAll(this.props.treeData);
        // ConditionThenStore.packData();
    }



    componentWillReceiveProps(nextProps) {//组件参数变化的生命周期
        // console.log('nextProps.treeData', nextProps.treeData);
        if (common.isEmpty(nextProps.treeData)) return ;
        ConditionThenStore.setConditionsAll(nextProps.treeData);
        // ConditionThenStore.setConditionsAll(this.props.treeData);
        // ConditionThenStore.packData();
        this.setState({
            treeJson: nextProps.treeData
        })
    }

    verifyConditionTreeFinish = () => {
        let treeJson = ConditionThenStore.getConditionsAll;
        console.log("treeJson ", toJS(treeJson))
        for (let i = 0; i < treeJson.length; i++) {
            var element = treeJson[i];
            if (common.isEmpty(element.parameterId)) {
                console.log("请选择完全您的参数变量" + i);
                return false
            }
            if (element.actionType === 0) {
                switch (element.type) {
                    case 1://变量类型
                        if (common.isEmpty(element.varType) || common.isEmpty(element.varCode) || common.isEmpty(element.varDataType)) {
                            console.log("请补充完整变量比较值" + i);
                            return false
                        }
                        break;
                    case 0://固定值类型
                        if (publicUtils.getVarDataType(element.fixedValueType) !== 'string') {
                            if (common.isEmpty(element.fixedValue)) {
                                console.log("非字符串的固定值不能为空" + i);
                                return false
                            }
                        }
                        break;
                    case 3://计算类型

                        // 验证计算表达式
                        if (common.isEmpty(element.computeExpressionVO.fieldList)) {
                            console.log(`请配置完整计算公式`);
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
                            const { categoryType, code, selectCode, type, value} = computeExpressionVO.computeVarVO
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
                            return false
                        }
                        if (!result) {
                            console.log(`衍生变量的计算公式未配置完成，请配置`);
                            return false
                        }
                        break;
                    default:
                        break;
                }
            } else if (element.actionType === 1) {
                if (common.isEmpty(element.executionManner)) {
                    console.log("请选择执行方法的类型" + i);
                    return false
                }
                if (common.isEmpty(element.rtqVarId)) {
                    console.log("请选择查询方法" + i);
                    return false
                }
                if (common.isEmpty(element.parameterId)) {
                    console.log("请选择查询的赋值参数" + i);
                    return false
                }
            }

        }
        this.props.conditionComplete(ConditionThenStore.getConditionsAll);
        console.log('······   then条件完成  ·········')
        return true
    }

    render() {
        let expressionVO = this.props.treeData[0];
        // 当执行方法没有选择方法时候就显示，因为缺少ThenViewer所以就写在这里了
        if (this.props.disabled && expressionVO.actionType === 1 && common.isEmpty(expressionVO.rtqVarId)) return <span>请选择方法</span>;
        let node = this.state.treeJson[0];
        return (
            <Provider conditionThenStore={ ConditionThenStore }>
                <div>
                    {/*<p>varName { this.props.treeData.conditions[0].expressionVO.varName }</p>*/}
                    {/*<p>actionType { this.props.treeData.conditions[0].expressionVO.actionType }</p>*/}
                    {/*<p>parameterName { this.props.treeData.conditions[0].expressionVO.parameterName }</p>*/}
                    {/*<p>computeJson { this.props.treeData.conditions[0].expressionVO.computeJson }</p>*/}
                    {/*<p>fixedValueType { this.props.treeData.conditions[0].expressionVO.fixedValue }</p>*/}
                    {/*<p>fixedValueType { this.props.treeData.conditions[0].expressionVO.fixedValueType }</p>*/}
                    {
                        // 简单决策表只有一个节点，交叉决策表和评分卡
                        <Then
                            rtqVarList={ this.props.rtqVarList }
                            key={ Math.random() }
                            verifyConditionTreeFinish={this.verifyConditionTreeFinish}
                            optTypeList={ this.props.optTypeList }
                            valueTypeList={ this.props.valueTypeList }
                            varTypeOfField={ this.props.varTypeOfField }
                            paramList={ this.props.paramList }
                            cascadeData={ this.props.cascadeData }
                            cascadeDataNumber={ this.props.cascadeDataNumber }
                            type="control"
                            updateConditionThen={ this.props.updateConditionThen }
                            node={ node }
                            p_relType={ this.props.p_relType }
                            nodeKey={ 0 }
                            extraType={ this.props.extraType }
                            disabled={ this.props.disabled }

                            // 优化追加
                            VAR_SELECTION_ALL={ this.props.VAR_SELECTION_ALL }
                            VAR_SELECTION_TIMESTAMP={ this.props.VAR_SELECTION_TIMESTAMP }
                            VAR_SELECTION_VARCHAR={ this.props.VAR_SELECTION_VARCHAR }
                            VAR_SELECTION_NUMBER={ this.props.VAR_SELECTION_NUMBER }
                            PARAMS_VAR_SELECTION_ALL={ this.props.PARAMS_VAR_SELECTION_ALL }
                            PARAMS_VAR_SELECTION_TIMESTAMP={ this.props.PARAMS_VAR_SELECTION_TIMESTAMP }
                            PARAMS_VAR_SELECTION_VARCHAR={ this.props.PARAMS_VAR_SELECTION_VARCHAR }
                            PARAMS_VAR_SELECTION_NUMBER={ this.props.PARAMS_VAR_SELECTION_NUMBER }

                        />
                    }
                </div>
            </Provider>
        );
    }
}

ThenWrapper.propTypes = {
    treeData: PropTypes.object,
    updateConditionThen: PropTypes.fun,
    conditionComplete: PropTypes.func,
    id: PropTypes.string,
    allVarListTypeForm: PropTypes.oneOf(['rtq', 'rule', 'strategy', 'ext', 'node']),
    initTempVarListCallBack: PropTypes.func,
    extRealdy: PropTypes.bool,
    rtqVarList: PropTypes.array,
    disabled: PropTypes.bool,
    extraType: PropTypes.string,
    // 优化追加
    entityType: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),//0衍生变量1实时查询变量2规则3策略4决策表5评分卡
    eventSourceId: PropTypes.string,
    dimensionId: PropTypes.string,
}
ThenWrapper.defaultProps = {
    updateConditionThen: () => { },
    conditionComplete: () => { },
    id: '',
    initTempVarListCallBack: () => { },
    extRealdy: false,
    rtqVarList: [],
    disabled: false,
    // 优化追加
    entityType: 2,
    eventSourceId: sessionStorage.tempEventSourceId ? sessionStorage.tempEventSourceId : '',
    dimensionId: sessionStorage.tempDimensionId ? sessionStorage.tempDimensionId : '',
}

export default ThenWrapper;
