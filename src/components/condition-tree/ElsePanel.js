/* eslint-disable no-inner-declarations */
/* eslint-disable no-case-declarations */
/*
 * @Author: zengzijian
 * @Date: 2019-04-22 11:00:12
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-22 15:31:45
 * @Description: 
 */
import React, { Component } from 'react';
import { Provider } from 'mobx-react'
import { toJS } from 'mobx';
import { Alert } from 'antd';
import "@/styles/treePanel.less"
import Else from '@/components/condition-tree/Else';
import ConditionElseStore from '@/store/ConditionElseStore';
import PropTypes from 'prop-types';
import variableService from '@/api/business/variableService';
import commonService from '@/api/business/commonService';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
import AddAndSub from '@/components/condition-tree/AddAndSub';

@withRouter
class TreePanel extends Component {
    constructor(props) {
        super(props);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
        this.updateTreeJsonCallBack = this.updateTreeJsonCallBack.bind(this);
        this.getAllVarList = this.getAllVarList.bind(this);
        this.getAllParamVarList = this.getAllParamVarList.bind(this);
        this.verifyConditionTreeFinish = this.verifyConditionTreeFinish.bind(this);
        this.getOptTypeList = this.getOptTypeList.bind(this);
        this.state = {
            treeJson: this.props.treeData,
            varTypeList: [],
            optTypeList: [],
            // 优化追加
            VAR_SELECTION_ALL: [],
            VAR_SELECTION_TIMESTAMP: [],
            VAR_SELECTION_VARCHAR: [],
            VAR_SELECTION_NUMBER: [],
            PARAMS_VAR_SELECTION_TIMESTAMP: [],
            PARAMS_VAR_SELECTION_VARCHAR: [],
            PARAMS_VAR_SELECTION_NUMBER: [],
            PARAMS_VAR_SELECTION_ALL: []
        }
        ConditionElseStore.setConditionsAll(this.props.treeData);
        this.setState({
            treeJson: this.props.treeData
        })
    }

    componentWillReceiveProps(nextProps) {//组件参数变化的生命周期
        ConditionElseStore.setConditionsAll(nextProps.treeData);
        this.setState({
            treeJson: nextProps.treeData
        })
        if (this.props.eventSourceId !== nextProps.eventSourceId || this.props.dimensionId !== nextProps.dimensionId) {
            if (!common.isEmpty(nextProps.dimensionId) && !common.isEmpty(nextProps.eventSourceId))
                this.getAllVarList(nextProps.dimensionId, nextProps.eventSourceId, nextProps.entityType);
        }

    }

    componentDidMount() {
        if (!common.isEmpty(this.props.dimensionId) && !common.isEmpty(this.props.eventSourceId)) {
            this.getAllVarList(this.props.dimensionId, this.props.eventSourceId, this.props.entityType);
        }
        this.getOptTypeList();
        this.getAllParamVarList();
    }

    updateTreeJsonCallBack = () => {
        this.props.updateConditionElse(toJS(ConditionElseStore.getConditionsAll));
        this.setState({
            treeJson: ConditionElseStore.getConditionsAll
        })
    }

    getAllVarList(dimensionId, eventSourceId, entityType) {
        let fixVarSeletion = (data) => {
            let tempArray = [];
            let tempArray2 = [];
            data.forEach(element => {
                let temp = {
                    value: String(element.type),
                    label: element.name,
                    children: []
                }
                element.list.forEach(element2 => {
                    temp.children.push({
                        value: element2.code + '·-·' + element2.type,
                        label: element2.name,
                        defaultValue: element2.defaultValue,
                        id: element2.id
                    });
                })
                tempArray.push(temp);
                if (element.type === 5) {
                    element.list.forEach(element2 => {
                        tempArray2.push({
                            code: element2.code + '·-·' + element2.name,
                            value: element2.name
                        })
                    })
                }
            })
            return tempArray
        }
        commonService.getAllVarSelection(dimensionId, eventSourceId, entityType).then(res => {
            if (!publicUtils.isOk(res)) return
            let VAR_SELECTION_ALL = [], VAR_SELECTION_TIMESTAMP = [], VAR_SELECTION_VARCHAR = [], VAR_SELECTION_NUMBER = [];
            if (res.data.result.VAR_SELECTION_ALL) VAR_SELECTION_ALL = fixVarSeletion(res.data.result.VAR_SELECTION_ALL);
            if (res.data.result.VAR_SELECTION_NUMBER) VAR_SELECTION_NUMBER = fixVarSeletion(res.data.result.VAR_SELECTION_NUMBER);
            if (res.data.result.VAR_SELECTION_TIMESTAMP) VAR_SELECTION_TIMESTAMP = fixVarSeletion(res.data.result.VAR_SELECTION_TIMESTAMP);
            if (res.data.result.VAR_SELECTION_VARCHAR) VAR_SELECTION_VARCHAR = fixVarSeletion(res.data.result.VAR_SELECTION_VARCHAR);
            this.setState({ VAR_SELECTION_ALL, VAR_SELECTION_TIMESTAMP, VAR_SELECTION_VARCHAR, VAR_SELECTION_NUMBER })
        })
    }

    getAllParamVarList() {

        let fixVarSeletion = (data) => {
            let tempArray = [];
            data.forEach(element => {
                const { id, name, type, defaultValue, code, } = element;
                tempArray.push({
                    // id,
                    name,
                    search: `${name}${id}`,
                    type,
                    defaultValue,
                    code,
                    value: id,
                })
            })
            return data
        }

        commonService.getAllParamsSelection().then(res => {
            if (!publicUtils.isOk(res)) return
            let PARAMS_VAR_SELECTION_ALL = [], PARAMS_VAR_SELECTION_TIMESTAMP = [], PARAMS_VAR_SELECTION_VARCHAR = [], PARAMS_VAR_SELECTION_NUMBER = [];
            if (res.data.result.VAR_SELECTION_ALL) PARAMS_VAR_SELECTION_ALL = fixVarSeletion(res.data.result.VAR_SELECTION_ALL);
            if (res.data.result.VAR_SELECTION_NUMBER) PARAMS_VAR_SELECTION_NUMBER = fixVarSeletion(res.data.result.VAR_SELECTION_NUMBER);
            if (res.data.result.VAR_SELECTION_TIMESTAMP) PARAMS_VAR_SELECTION_TIMESTAMP = fixVarSeletion(res.data.result.VAR_SELECTION_TIMESTAMP);
            if (res.data.result.VAR_SELECTION_VARCHAR) PARAMS_VAR_SELECTION_VARCHAR = fixVarSeletion(res.data.result.VAR_SELECTION_VARCHAR);
            this.setState({ PARAMS_VAR_SELECTION_ALL, PARAMS_VAR_SELECTION_TIMESTAMP, PARAMS_VAR_SELECTION_VARCHAR, PARAMS_VAR_SELECTION_NUMBER })
        })
    }

    /**
      * 删除操作回调
      */
    sub = (nodeKey) => {
        // console.log("sub nodeKey", nodeKey);
        ConditionElseStore.subNode(nodeKey);
        this.updateTreeJsonCallBack();
    }

    /**
     * 增加操作回调
     */
    add = () => {
        ConditionElseStore.addNode();
        this.updateTreeJsonCallBack();
    }


    getOptTypeList() {
        variableService.getOptTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                tempArray.push({
                    code: element.val,
                    value: element.label
                });
            });
            this.setState({
                optTypeList: tempArray
            })
        })
    }

    verifyConditionTreeFinish() {
        let treeJson = ConditionElseStore.getConditionsAll;
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

            element.varType = Number(element.varType);
        }
        this.props.conditionComplete(ConditionElseStore.getConditionsAll);
        console.log('······   else条件完成  ·········')
        return true
    }


    render() {
        console.log('this.state.treeJson', this.state.treeJson)
        return (
            <Provider conditionElseStore={ConditionElseStore}>
                {
                    common.isEmpty(this.props.eventSourceId) || common.isEmpty(this.props.dimensionId) ?
                        <Alert message={(() => {
                            if (common.isEmpty(this.props.eventSourceId)) return '请先选择事件源'
                            if (common.isEmpty(this.props.dimensionId)) return '请先选择维度'
                            return ''
                        })()} type="warning" />
                        :
                        <div className="tree-panel-container" style={{ paddingLeft: '0', clear: 'both', overfloat: 'scroll' }} >
                            {
                                !this.props.disabled ?
                                    <AddAndSub type="add" add={this.add} />
                                    : ''
                            }
                            {
                                this.state.treeJson.map((item, i) =>
                                    <Else
                                        key={Math.random()}
                                        disabled={this.props.disabled}
                                        rtqVarList={this.props.rtqVarList}
                                        optTypeList={this.state.optTypeList}
                                        verifyConditionTreeFinish={this.verifyConditionTreeFinish}
                                        updateConditionElse={this.props.updateConditionElse}
                                        add={this.add}
                                        sub={this.sub}
                                        node={item}
                                        nodeKey={i}
                                        extraType={this.props.extraType}
                                        // 优化追加
                                        VAR_SELECTION_ALL={this.state.VAR_SELECTION_ALL}
                                        VAR_SELECTION_TIMESTAMP={this.state.VAR_SELECTION_TIMESTAMP}
                                        VAR_SELECTION_VARCHAR={this.state.VAR_SELECTION_VARCHAR}
                                        VAR_SELECTION_NUMBER={this.state.VAR_SELECTION_NUMBER}
                                        PARAMS_VAR_SELECTION_ALL={this.state.PARAMS_VAR_SELECTION_ALL}
                                        PARAMS_VAR_SELECTION_TIMESTAMP={this.state.PARAMS_VAR_SELECTION_TIMESTAMP}
                                        PARAMS_VAR_SELECTION_VARCHAR={this.state.PARAMS_VAR_SELECTION_VARCHAR}
                                        PARAMS_VAR_SELECTION_NUMBER={this.state.PARAMS_VAR_SELECTION_NUMBER}
                                        eventSourceId={this.props.eventSourceId}
                                        dimensionId={this.props.dimensionId}
                                    />
                                )
                            }
                        </div>
                }


            </Provider>
        )
    }
}
TreePanel.propTypes = {
    treeData: PropTypes.object,// 条件数据
    updateConditionElse: PropTypes.fun,//用于更新全部条件, 形参是完整的参数treeData
    conditionComplete: PropTypes.func,//所有条件完成后出发的回调函数
    rtqVarList: PropTypes.array,//实时查询变量下拉选择列表
    disabled: PropTypes.bool, //是否禁止编辑
    extraType: PropTypes.string,//扩展类型（简单决策表， 交叉决策表）
    entityType: PropTypes.oneOf([0, 1, 2, 3, 4, 5]),//0衍生变量1实时查询变量2规则3策略4决策表5评分卡
    eventSourceId: PropTypes.string,//事件源id
    dimensionId: PropTypes.string, //维度id
}
TreePanel.defaultProps = {
    updateConditionElse: () => { },
    conditionComplete: () => { },
    rtqVarList: [],
    disabled: false,
    entityType: 2,
    eventSourceId: '',
    dimensionId: '',
}
export default TreePanel;