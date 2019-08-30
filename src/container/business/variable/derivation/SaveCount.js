/*
 * @Author: zengzijian
 * @Date: 2018-08-22 16:41:34
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-23 16:15:30
 * @Description: 衍生变量保存页面级组件
 */
import React, { Component } from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/variable/ext/Save';
import PageHeader from '@/components/PageHeader';
import FormHeader from '@/components/FormHeader';
import Form from '@/components/Form';
import FormItem from '@/components/FormItem';
import { message, Divider } from 'antd';
import FormButtonGroup from '@/components/FormButtonGroup';
import { withRouter } from 'react-router-dom';
import common from '@/utils/common';
import variableService from '@/api/business/variableService';
import '@/styles/business/variable/saveCount.less';
import publicUtils from '@/utils/publicUtils';
import FormBlock from '@/components/FormBlock';
import CountExpression from '@/components/countExpression/Panel.jsx';

@withRouter
@observer
class SaveCount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            index: 0,
            extRealdy: false,
            dataTypeList: []
        }
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.addRequiredVars = this.addRequiredVars.bind(this);
        this.getExtVarById = this.getExtVarById.bind(this);
        this.updateExpressionTree = this.updateExpressionTree.bind(this);
        this.computeExpressionVO = common.deepClone(computeExpressionVODemo)
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "type": 0,//类型 0计算变量 1正则变量 2函数变量
            "typeLabel": "计算变量",
            "defaultValue": "",
            "description": "",
            "category": '',
            "categoryName": "",
            "dataType": '',//数据类型
            "dataTypeLabel": '',//dataTypeLabel
            "expression": "",
            "expressionDesc": '',
            "requiredVars": ""
        }
    }
    componentDidMount() {
        // 如果是策略包资源就只能查看，获取数据的接口也不一样
        this.computeExpressionVO = common.deepClone(computeExpressionVODemo);
        // this.setState({ index: Math.random() })
        this.resource = this.props.resource;
        if (common.isEmpty(this.props.match.params.id)) {
            this.getInitDataList();
            this.getDataTypeList();
        } else {
            this.getExtVarById(this.props.match.params.id);
        }
        store.setCanDel(false);

    }
    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val + '·-·' + element.label,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }
    componentWillReceiveProps(nextProp) {
        if (nextProp.match.params.id !== this.props.match.params.id) {
            this.getExtVarById(nextProp.match.params.id);
        }
    }

    updateExpressionTree(value) {
        console.log("更新value", value)
        this.computeExpressionVO = value;
    }

    verify() {
        console.log(this.saveData);
        if (common.isEmpty(this.saveData.name)) {
            message.warning("基础信息 - 名称 不能为空");
            return
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warning("基础信息 - 名称 不能为空");
            return
        }
        // if (this.saveData.code.indexOf("ev_d_") !== 0) {
        //     message.warning('基本信息 - 标识 必须以 ev_d_ 开头');
        //     return
        // }
        if (common.isEmpty(this.saveData.eventSourceId)) {
            message.warning('基本信息 - 事件源 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.dimensionId)) {
            message.warning('基本信息 - 维度 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.type)) {
            message.warning('基本信息 - 数据类型 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.defaultValue)) {
            message.warning('基本信息 - 默认值 不能为空');
            return
        }
        if (common.isEmpty(this.saveData.category)) {
            message.warning('基本信息 - 类别 不能为空');
            return
        }

        // 验证计算表达式
        if (common.isEmpty(this.computeExpressionVO.fieldList)) {
            if (!result) {
                message.warning(`请配置完整计算公式`);
                return
            }
        }

        let result = true;
        let correct = true;

        function verifycomputeExpressionVO(computeExpressionVO) {
            if (computeExpressionVO.type === 2) {
                computeExpressionVO.fieldList.forEach(element => {
                    verifycomputeExpressionVO(element)
                })
            } else {
                const { categoryType, code, selectCode, type, value, computeFunction, params } = computeExpressionVO.computeVarVO
                const { computeOperator } = computeExpressionVO
                console.log('categoryType, code, selectCode, type, value, computeOperator', categoryType, code, selectCode, type, value, computeOperator)
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
                } else if (categoryType === 2) {//函数
                    if (common.isEmpty(computeFunction)) {
                        result = false
                    }
                    params.forEach(el => {
                        if (el.categoryType === 0) {//固定值
                            if (common.isEmpty(el.value)) result = false
                        } else if (el.categoryType === 1) {// 变量
                            if (common.isEmpty(el.code) || common.isEmpty(el.selectCode) || common.isEmpty(el.type)) {
                                result = false
                            }
                        }
                    })
                    if (computeOperator === 'DIVIDE' && value == 0) {
                        result = false
                        correct = false
                    }
                }
            }
        }
        verifycomputeExpressionVO(this.computeExpressionVO);
        if (!correct) {
            message.warning(`0不能做除数`);
            return
        }
        if (!result) {
            message.warning(`衍生变量的计算公式未配置完成，请配置`);
            return
        }

        this.saveData.computeExpressionVO = this.computeExpressionVO

        common.loading.show();
        variableService.saveExtVar(this.saveData).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.getExtVarById(res.data.result.id);
            this.props.history.push(`/business/variable/derivation/save-count/${res.data.result.id}`);
            if (res.data.result.approvalStatus == 3) {
                store.setIsCanCommit(true);
            }
        }).catch(() => {
            common.loading.hide();
        });

    }

    getExtVarById(id) {
        // 判断是否策略包资源
        if (this.resource) {
            this.handleResult(this.resource);
        } else {
            variableService.getExtVarById(id).then(res => {
                if (!publicUtils.isOk(res)) return;
                this.handleResult(res.data.result);
            })
        }
    }

    handleResult = result => {
        // 判断是否策略包资源
        let data = common.deepClone(result);
        if (!common.isEmpty(data.vars)) delete data.vars;
        if (!common.isEmpty(data.dicts)) delete data.dicts;
        this.saveData = data;
        this.computeExpressionVO = data.computeExpressionVO;
        sessionStorage.tempDataType = this.saveData.dataType;
        store.approvalSubmitParams.id = data.id;
        store.approvalSubmitParams.code = data.code;
        store.approvalSubmitParams.name = data.name;
        store.approvalSubmitParams.actionType = data.status == 0 ? 0 : 4;
        store.approvalSubmitParams.approvalStatus = common.isEmpty(data.approvalStatus) ? '' : data.approvalStatus;

        if (data.approvalStatus == 3) {
            store.setIsCanCommit(true);
        } else {
            store.setIsCanCommit(false);
        }

        if (!common.isEmpty(this.saveData.eventSourceId) && !common.isEmpty(this.saveData.dimensionId)) {
            sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
            sessionStorage.tempDimensionId = this.saveData.dimensionId;
            this.setState({
                extRealdy: true
            })
        }
        this.setState({
            index: 0
        })
    }

    getInitDataList = () => {
        let self = this;
        variableService.getEventSourceSelectList(true).then(res => {
            if (!publicUtils.isOk(res)) return
            let array1 = [];
            let temp2 = {};
            res.data.result.forEach(element => {
                // if (element.dimensionVOS.length <= 0) return;
                let temp1 = {};

                let tempArray = [];
                temp1.code = element.eventSourceId + '·-·' + element.eventSourceName;
                temp1.value = element.eventSourceName;
                element.dimensionVOS.forEach(element1 => {
                    tempArray.push({ code: element1.id + '·-·' + element1.name, value: element1.name })
                })
                temp2[element.eventSourceId + '·-·' + element.eventSourceName] = tempArray;
                array1.push(temp1);
            });
            // console.log(array1);
            // console.log(temp2);
            self.setState({
                eventSourceList: array1,
                dimensionListAll: temp2
            })
        })
    }
    updateSaveData = (key, value, isBatch) => {
        if (key === 'name' || key === 'code') {
            value = common.stripscript(value);
        }
        console.log("data-change", key, value)

        if (isBatch) {
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                this.saveData[element] = value[i];
            }
            if (key.indexOf('eventSourceId') >= 0 || key.indexOf('eventSourceName') >= 0) {
                this.saveData.dimensionId = '';
                this.saveData.dimensionName = '';
                this.setState({
                    dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                });
            }
            if (key.indexOf('dimensionId') >= 0 || key.indexOf('dimensionName') >= 0) {
                if (!common.isEmpty(this.saveData.eventSourceId) && !common.isEmpty(this.saveData.dimensionId)) {
                    sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
                    sessionStorage.tempDimensionId = this.saveData.dimensionId;
                    this.setState({
                        extRealdy: true
                    })
                }
            }
            if (key.indexOf('dataType') >= 0 || key.indexOf('dataTypeLabel') >= 0) {
                if (!common.isEmpty(this.saveData.eventSourceId) && !common.isEmpty(this.saveData.dimensionId)) {
                    sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
                    sessionStorage.tempDimensionId = this.saveData.dimensionId;
                    sessionStorage.tempDataType = this.saveData.dataType;
                    this.setState({
                        extRealdy: true
                    })
                }
            }
        } else {
            if (key === 'code') {
                this.saveData.code = value.replace(/[^\w_]/g, '');
            } else {
                this.saveData[key] = value;
            }
        }



        this.setState({
            index: Math.random()
        })
    }



    addRequiredVars(value) {
        let array = common.deepClone(common.stringToArray(this.saveData.requiredVars));
        array.push(value);
        this.saveData.requiredVars = common.arrayToString(array);
    }

    render() {
        //解决在mobx之间的通讯问题
        switch (store.getStoreBus) {
            case 1:
                if (!common.isEmpty(this.props.match.params.id)) {
                    this.getExtVarById(this.props.match.params.id);
                }
                store.setStoreBus(0);//info再初始化一次
                break;

            default:
                break;
        }
        const disableEdit = !!this.resource;
        return (
            <Provider store={store}>
                <div className='panel'>
                    <PageHeader meta={this.props.meta}></PageHeader>
                    <div className="pageContent" style={{ padding: '0 0 64px 0' }}>
                        <FormHeader title="计算变量" style={{ padding: '32px 0px 0px 32px' }}></FormHeader>
                        <div style={{ marginTop: '20px' }}>
                            <FormBlock header="基本信息">
                                <Form>
                                    <FormItem name="名称" disabled={disableEdit} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name} />
                                    <FormItem name="标识" placeHolder="请输入标识" disabled={this.props.match.params.id} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code} />
                                    <FormItem name="事件源" disabled={!!this.props.match.params.id} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceName} />
                                    <FormItem name="维度" disabled={!!this.props.match.params.id} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionName} />
                                    <FormItem name="数据类型" type="select" disabled={!!this.props.match.params.id} isNotNull={true} changeCallBack={this.updateSaveData} code={["dataType", "dataTypeLabel"]} selectData={this.state.dataTypeList} defaultValue={this.saveData.dataTypeLabel} />
                                    <FormItem name="默认值" disabled={disableEdit} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="defaultValue" dataType={this.saveData.dataType} defaultValue={this.saveData.defaultValue} />
                                    <FormItem name="类型" type="select" disabled={true} isNotNull={true} defaultValue={0} selectData={[{ code: 0, value: '计算变量' }]} />
                                    <FormItem name="类别" disabled={disableEdit} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="ext" defaultValue={this.saveData.categoryName} />
                                    <FormItem name="描述" disabled={disableEdit} type="textarea" isNotNull={false} changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description} />
                                </Form>
                            </FormBlock>
                            <Divider orientation="left">计算方式</Divider>
                            <div style={style.countContainer}>
                                <div className="clearfix" style={style.coutPanel}>
                                    <CountExpression
                                        eventSourceId={this.saveData.eventSourceId}
                                        dimensionId={this.saveData.dimensionId}
                                        update={this.updateExpressionTree}
                                        computeExpressionVO={this.computeExpressionVO}
                                        entityType={0}
                                    />
                                </div>
                            </div>

                        </div>
                        {
                            publicUtils.isAuth("business:variable:ext:edit") ?
                                <FormButtonGroup
                                    cancelCallBack={() => disableEdit ? this.props.history.goBack() : this.props.history.push('/business/variable/derivation')}
                                    saveCallBack={() => { this.verify() }}
                                    isShowSaveBtn={!disableEdit}
                                />
                                : ''
                        }

                    </div>
                </div>
            </Provider >
        )
    }
}
export default SaveCount;

const style = {
    coutPanel: {
        width: '2000px', marginTop: '5px'
    },
    countContainer: {
        height: '90px', padding: '32px 10px', border: '1px solid gainsboro', borderRadius: '5px', margin: '10px', overflowX: 'auto', overflowY: 'hidden'
    }
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
