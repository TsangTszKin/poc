import React from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule/Save';
import PageHeader2 from '@/components/PageHeader2';
import '@/styles/business/variable/real-time-query-edit.less';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import commonService from '@/api/business/commonService';
import { message, Row, Col, Spin, Drawer, Table, Button } from 'antd';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import Code from '@/components/Code';
import FormBlock from '@/components/FormBlock'
import FormButtonGroupFor2_0 from '@/components/FormButtonGroupFor2_0';
import FormItem from '@/components/FormItem';
import Form from '@/components/Form';
import TreePanel from '@/components/condition-tree/TreePanel2.0.jsx';
import ThenPanel from '@/components/condition-tree/ThenPanel';
import ElsePanel from '@/components/condition-tree/ElsePanel';

@withRouter
@observer
class Save2_0 extends React.Component {
    constructor(props) {
        super(props);
        this.conditionComplete = this.conditionComplete.bind(this);
        this.conditionThenComplete = this.conditionThenComplete.bind(this);
        this.updateConditionTree = this.updateConditionTree.bind(this);
        this.updateConditionThen = this.updateConditionThen.bind(this);
        this.updateConditionElse = this.updateConditionElse.bind(this);
        this.getDataTypeList = this.getDataTypeList.bind(this);
        this.getInitDataList = this.getInitDataList.bind(this);
        this.updateSaveData = this.updateSaveData.bind(this);
        this.verify = this.verify.bind(this);
        this.save = this.save.bind(this);
        this.getRuleById = this.getRuleById.bind(this);
        this.getRtqvarList = this.getRtqvarList.bind(this);
        this.saveRuleForNewVersion = this.saveRuleForNewVersion.bind(this);
        this.init = this.init.bind(this);
        this.state = {
            eventSourceList: [],
            dimensionList: [],
            dimensionListAll: [],
            index: 0,
            dataTypeList: [],
            isLoading: false,
            rtqVarList: []
        }
        this.conditionThen = conditionVODemoThen;//桥梁， 把assignmentMappingVos解析成前端通用的组件结构，保存的时候在逆解析
        this.conditionElse = conditionVODemoElse;//桥梁， 把assignmentMappingVos解析成前端通用的组件结构，保存的时候在逆解析
        this.saveData = {
            "name": "",
            "code": "",
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "description": "",
            "category": "",
            "categoryName": "",
            "sqlCode": '',
            "type": 0,
            "conditionVO": conditionVODemo,
            "assignmentMappingVOS": [
                {
                    "type": "1",//1真，0假
                    "assignmentVOS": [
                        {
                            "id": "",
                            "type": "",
                            "fixedValueType": "",
                            "parameterId": "",
                            "parameterName": '',
                            // "selectId": "",//暂时没用到
                            "varName": "",
                            "varCode": "",
                            "varType": "",
                            "fixedValue": "",
                            "computeExpressionVO": {//计算类型才有
                            },
                            "actionType": 0,
                            "executionManner": 4,
                            "rtqVarId": ''
                        }
                    ]
                },
                {
                    "type": "0",//1真，0假
                    "assignmentVOS": [
                    ]
                }
            ]
        }
    }
    componentDidMount() {
        this.init(this.props.match.params.id);
    }

    init(id) {
        if (!common.isEmpty(id)) {
            store.setId(id);
            store.allVersionForApi();
            if (this.props.match.params.type === '2') {
                this.getRuleByTemplateId(id);
            } else {
                this.getRuleById(id);
            }
        } else {
            this.getInitDataList();
        }
        this.getDataTypeList();
    }
    getRuleById(id) {
        strategyService.getRuleById(id).then(res => {
            if (!publicUtils.isOk(res)) return
            this.saveData = res.data.result;
            if (this.props.match.params.type === '2') {
                delete this.saveData.id;
                delete res.data.result.id;
            }
            if (!common.isEmpty(this.saveData.eventSourceId)) sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
            if (!common.isEmpty(this.saveData.dimensionId)) sessionStorage.tempDimensionId = this.saveData.dimensionId;
            store.setE_and_d_Ready(true);
            if (common.isEmpty(this.saveData.assignmentMappingVOS)) {
                this.saveData.assignmentMappingVOS = assignmentMappingVOS;
            }
            this.saveData.assignmentMappingVOS.forEach(element => {
                if (element.type == 1) {//1是真，“那么”
                    let tempArray = [];
                    element.assignmentVOS.forEach(element2 => {
                        if (!element2.computeExpressionVO) {
                            element2.computeExpressionVO = computeExpressionVODemo
                        }
                        tempArray.push(element2);
                    })

                    this.conditionThen = []

                    tempArray.forEach(element2 => {
                        this.conditionThen.push(element2)
                    })
                } else {
                    let tempArray = [];
                    element.assignmentVOS.forEach(element2 => {
                        if (!element2.computeExpressionVO) {
                            element2.computeExpressionVO = computeExpressionVODemo
                        }
                        tempArray.push(element2);
                    })

                    this.conditionElse = []

                    tempArray.forEach(element2 => {
                        this.conditionElse.push(element2)
                    })
                }
            })
            console.log("getRuleById this.saveData = ", this.saveData);
            console.log("getRuleById this.conditionThen = ", this.conditionThen);
            console.log("getRuleById this.conditionElse = ", this.conditionElse);
            this.setState({ index: Math.random() });

            if (!common.isEmpty(sessionStorage.tempDimensionId) && !common.isEmpty(sessionStorage.tempEventSourceId)) {
                this.getRtqvarList();
            }

        })
    }
    getRuleByTemplateId(id) {
        commonService.getTemplateDetails(id).then(res => {
            if (!publicUtils.isOk(res)) return
            this.saveData = res.data.result;
            if (!common.isEmpty(this.saveData.eventSourceId)) sessionStorage.tempEventSourceId = this.saveData.eventSourceId;
            if (!common.isEmpty(this.saveData.dimensionId)) sessionStorage.tempDimensionId = this.saveData.dimensionId;
            store.setE_and_d_Ready(true);
            if (common.isEmpty(this.saveData.assignmentMappingVOS)) {
                this.saveData.assignmentMappingVOS = assignmentMappingVOS;
            }
            this.saveData.assignmentMappingVOS.forEach(element => {
                if (element.type == 1) {//1是真，“那么”
                    let tempArray = [];
                    element.assignmentVOS.forEach(element2 => {
                        if (!element2.computeExpression) {
                            element2.computeExpression = {//计算类型才有
                            }
                        }
                        tempArray.push(element2);
                    })

                    this.conditionThen = []

                    tempArray.forEach(element2 => {
                        this.conditionThen.push(element2)
                    })
                } else {
                    let tempArray = [];
                    element.assignmentVOS.forEach(element2 => {
                        if (!element2.computeExpression) {
                            element2.computeExpression = {//计算类型才有
                            }
                        }
                        tempArray.push(element2);
                    })

                    this.conditionElse = []

                    tempArray.forEach(element2 => {
                        this.conditionElse.push(element2)
                    })
                }
            })
            console.log("getRuleById this.saveData = ", this.saveData);
            console.log("getRuleById this.conditionThen = ", this.conditionThen);
            console.log("getRuleById this.conditionElse = ", this.conditionElse);
            this.setState({ index: Math.random() });

            if (!common.isEmpty(sessionStorage.tempDimensionId) && !common.isEmpty(sessionStorage.tempEventSourceId)) {
                this.getRtqvarList();
            }

        })
    }
    getRtqvarList() {
        strategyService.getRtqvarList(sessionStorage.tempEventSourceId, sessionStorage.tempDimensionId).then(res => {
            if (!publicUtils.isOk(res)) return
            console.log("res.data.result[0].list", res.data.result[0].list)
            this.setState({
                rtqVarList: res.data.result[0].list
            })
        })
    }
    verify() {
        if (common.isEmpty(this.saveData.name)) {
            message.warn("名称不能为空");
            return false
        }
        if (common.isEmpty(this.saveData.code)) {
            message.warn("标识不能为空");
            return false
        }
        if (common.isEmpty(this.saveData.eventSourceId)) {
            message.warn("事件源不能为空");
            return false
        }
        if (common.isEmpty(this.saveData.dimensionId)) {
            message.warn("维度不能为空");
            return false
        }
        // if (common.isEmpty(this.saveData.description)) {
        //     message.warn("描述不能为空");
        //     return false
        // }
        if (common.isEmpty(this.saveData.category)) {
            message.warn("类别不能为空");
            return false
        }
        if (common.isEmpty(this.saveData.type)) {
            message.warn("规则类型不能为空");
            return false
        }
        if (!publicUtils.verifyConditionTree(this.saveData.conditionVO, true)) return false
        if (!publicUtils.verifyConditionThen(this.conditionThen, true)) return false
        if (!publicUtils.verifyConditionThen(this.conditionElse, true)) return false
        return true
    }
    save() {
        console.log("this.saeData", this.saveData);
        let data = common.deepClone(this.saveData);
        common.loading.show();
        strategyService.saveRule(data).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            if (common.isEmpty(this.props.match.params.id)) {
                this.props.history.push(`/business/strategy/rule/save/1/${res.data.result.id}`)

            } else {
                if (this.props.match.params.type === '1') {//自定义
                    this.getRuleById(res.data.result.id);
                } else {//模板
                    this.props.history.push(`/business/strategy/rule/save/1/${res.data.result.id}`)
                    this.getRuleById(res.data.result.id);
                }
            }
        }).catch(() => common.loading.hide())
    }

    conditionComplete() {
        // variableService.controlNodeTranslateToSql(conditionAll).then(res => {
        //     if (!publicUtils.isOk(res)) return
        //     this.codeForTree.changeCode(res.data.result);

        // });
    }

    conditionThenComplete() {
        // variableService.controlNodeTranslateToSql(conditionAll).then(res => {
        //     if (!publicUtils.isOk(res)) return
        //     this.codeForThen.changeCode(res.data.result);

        // });
    }

    conditionElseComplete() {
        // variableService.controlNodeTranslateToSql(conditionAll).then(res => {
        //     if (!publicUtils.isOk(res)) return
        //     this.codeForElse.changeCode(res.data.result);
        // });
    }

    updateConditionTree = (conditionsAll, refresh) => {
        console.log("------ updateConditionTree  ------", conditionsAll);
        this.saveData.conditionVO = conditionsAll;
        // 解决多级“并且或者”被覆盖问题的回调刷新同步
        if (refresh) this.setState({ index: Math.random() })
    }
    updateConditionThen = (conditionsAll) => {
        console.log("updateConditionThen", conditionsAll)
        this.conditionThen = conditionsAll;
        let assignmentVOs = [];
        for (let i = 0; i < conditionsAll.length; i++) {
            const vo = conditionsAll[i];
            let assignmentVO = vo;

            assignmentVOs.push(assignmentVO);
        }
        console.log("assignmentVOs", assignmentVOs);
        for (let i = 0; i < this.saveData.assignmentMappingVOS.length; i++) {
            const element = this.saveData.assignmentMappingVOS[i];
            if (element.type == 1) {//“那么”
                element.assignmentVOS = assignmentVOs;
            }
        }
        console.log("this.saveData.assignmentMappingVOS", this.saveData.assignmentMappingVOS);
    }
    updateConditionElse = (conditionsAll) => {
        console.log("updateConditionElse", conditionsAll)
        this.conditionThen = conditionsAll;
        let assignmentVOs = [];
        for (let i = 0; i < conditionsAll.length; i++) {
            const vo = conditionsAll[i];
            let assignmentVO = vo;

            assignmentVOs.push(assignmentVO);
        }
        console.log("assignmentVOs", assignmentVOs);
        for (let i = 0; i < this.saveData.assignmentMappingVOS.length; i++) {
            const element = this.saveData.assignmentMappingVOS[i];
            if (element.type == 0) {//“那么”
                element.assignmentVOS = assignmentVOs;
            }
        }
        console.log("this.saveData.assignmentMappingVOS", this.saveData.assignmentMappingVOS);
    }
    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
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

            // self.saveData.eventSourceId = array1[0].code;
            // self.saveData.dimensionId = temp2[array1[0].code];
            if (!common.isEmpty(this.props.match.params.id)) {
                // this.getRuleById(this.props.match.params.id);
            } else {
                this.codeForThen = conditionVODemoThen;
                this.codeForElse = conditionVODemoElse;
            }
        })
    }
    updateSaveData(key, value, isBatch) {
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
                sessionStorage.tempEventSourceId = value[0];
                sessionStorage.tempDimensionId = '';
                store.setE_and_d_Ready(false);
                this.saveData.dimensionName = '';
                this.saveData.dimensionId = '';
                this.setState({
                    dimensionList: this.state.dimensionListAll[value[0] + '·-·' + value[1]],
                });
                this.setState({
                    rtqVarList: []
                })
            }
            if (key.indexOf('dimensionId') >= 0 || key.indexOf('dimensionName') >= 0) {
                sessionStorage.tempDimensionId = value[0];
                store.setE_and_d_Ready(true);
                this.getRtqvarList();
            }
        } else {
            if (key === 'code') {
                this.saveData.code = value.replace(/[^\w_]/g, '');
            } else {
                this.saveData[key] = value;
            }
            switch (key) {
                case 'name':
                    this.saveData.name = this.saveData.name.substr(0, 30);
                    break;
                case 'code':
                    this.saveData.code = this.saveData.code.substr(0, 30);
                    break;
                case 'description':
                    this.saveData.description = this.saveData.description.substr(0, 255);
                    break;
                case 'type':
                    this.saveData.defaultValue = '';
                    break;
                default:
                    break;
            }
        }

        this.setState({
            index: Math.random()
        })
    }

    saveRuleForNewVersion() {
        console.log("this.saeData", this.saveData);
        let data = common.deepClone(this.saveData);

        common.loading.show();
        strategyService.saveRuleForNewVersion(data).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.props.history.push(`/business/strategy/rule/save/1/${res.data.result.id}`)
            store.setId(res.data.result.id);
            this.getRuleById(res.data.result.id);
            store.allVersionForApi();
        }).catch(() => common.loading.hide())
    }

    render() {
        const testInputColumns = [{
            title: '名称',
            dataIndex: 'name',
            key: 'name',

        }, {
            title: '标识',
            dataIndex: 'code',
            key: 'code',

        }, {
            title: '值',
            dataIndex: 'value',
            key: 'value',

        }]
        const testOutputColumns = [{
            title: '名称',
            dataIndex: 'resultName',
            key: 'resultName',

        }, {
            title: '值',
            dataIndex: 'resultValue',
            key: 'resultValue',

        }]
        //解决在mobx之间的通讯问题
        switch (store.getStoreBus) {
            case 1:
                this.getRuleById(store.getId);
                store.setStoreBus(2);//info再初始化一次
                break;

            default:
                break;
        }
        return (
            <Provider store={store}>
                <div className="panel">
                    <PageHeader2
                        meta={this.props.meta}
                        isShowBtns={!common.isEmpty(this.props.match.params.id) ? this.props.match.params.type !== '2' ? true : false : false}
                        isShowSelect={!common.isEmpty(this.props.match.params.id) ? this.props.match.params.type !== '2' ? true : false : false}
                        auth={{
                            test: publicUtils.isAuth("business:strategy:rule:view"),
                            sql: publicUtils.isAuth("business:strategy:rule:view"),
                            version: publicUtils.isAuth("business:strategy:rule:view"),
                        }}>
                    </PageHeader2>
                    <div className="pageContent" style={{ marginLeft: '24px', padding: '0 0 64px 0' }}>
                        {/* <FormHeader title="信息维护" style={{ padding: '32px 0px 0px 32px' }}></FormHeader> */}
                        <div style={{ marginTop: '20px', paddingTop: '16px' }}>
                            <Spin spinning={this.state.isLoading} size="large">
                                <FormBlock header="基本信息">
                                    <Form>
                                        <FormItem name="名称" type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="name" defaultValue={this.saveData.name}></FormItem>
                                        <FormItem name="标识" placeHolder="请输标识" disabled={this.props.match.params.id && this.props.match.params.type === '1' ? true : false} type="input" isNotNull={true} changeCallBack={this.updateSaveData} code="code" defaultValue={this.saveData.code}></FormItem>
                                        <FormItem name="事件源" disabled={this.props.match.params.id && this.props.match.params.type === '1' ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={["eventSourceId", "eventSourceName"]} selectData={this.state.eventSourceList} defaultValue={this.saveData.eventSourceName}></FormItem>
                                        <FormItem name="维度" disabled={this.props.match.params.id && this.props.match.params.type === '1' ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['dimensionId', 'dimensionName']} selectData={this.state.dimensionList} defaultValue={this.saveData.dimensionName}></FormItem>
                                        {/* <FormItem name="规则类型" disabled={this.props.match.params.id && this.props.match.params.type === '1' ? true : false} type="select" isNotNull={true} changeCallBack={this.updateSaveData} code="type" selectData={[{ code: 0, value: "普通规则" }, { code: 1, value: '过滤规则' }]} defaultValue={this.saveData.type}></FormItem> */}
                                        <FormItem name="类别" type="select" isNotNull={true} changeCallBack={this.updateSaveData} code={['category', 'categoryName']} categoryType="rule" defaultValue={this.saveData.categoryName}></FormItem>
                                        <FormItem name="描述" type="textarea" isNotNull={false} placeHolder="请简单描述" changeCallBack={this.updateSaveData} code="description" defaultValue={this.saveData.description}></FormItem>
                                    </Form>
                                </FormBlock>

                                <FormBlock header="如果">
                                    <Row>
                                        <Col md={24} lg={24} xl={24} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                                            <TreePanel
                                                entityType={2}
                                                conditionComplete={this.conditionComplete}
                                                conditionInComplete={() => { }}
                                                updateConditionTree={this.updateConditionTree}
                                                treeData={this.saveData.conditionVO}
                                                eventSourceId={this.saveData.eventSourceId}
                                                dimensionId={this.saveData.dimensionId}
                                            />

                                        </Col>
                                    </Row>
                                </FormBlock>
                                <FormBlock header="那么">
                                    <Row>
                                        <Col md={24} lg={24} xl={24}>
                                            <ThenPanel
                                                rtqVarList={this.state.rtqVarList}
                                                conditionComplete={this.conditionThenComplete}
                                                updateConditionThen={this.updateConditionThen}
                                                treeData={this.conditionThen}
                                                eventSourceId={this.saveData.eventSourceId}
                                                dimensionId={this.saveData.dimensionId}
                                            />
                                        </Col>
                                    </Row>
                                </FormBlock>
                                <FormBlock header="否则">
                                    <Row>
                                        <Col md={24} lg={24} xl={24}>
                                            <ElsePanel
                                                rtqVarList={this.state.rtqVarList}
                                                conditionComplete={this.conditionElseComplete}
                                                updateConditionElse={this.updateConditionElse}
                                                treeData={this.conditionElse}
                                                eventSourceId={this.saveData.eventSourceId}
                                                dimensionId={this.saveData.dimensionId}
                                            />
                                        </Col>
                                    </Row>
                                </FormBlock>

                            </Spin>
                        </div>

                    </div>

                    <FormButtonGroupFor2_0
                        saveCallBack={() => {
                            if (this.verify()) {
                                this.save();
                            }
                        }}
                        saveNewCallBack={() => {
                            if (common.isEmpty(this.props.match.params.id)) {
                                message.warn("请先保存");
                                return
                            } else {
                                if (this.verify())
                                    this.saveRuleForNewVersion();
                            }
                        }}
                        cancelCallBack={() => this.props.history.push("/business/strategy/rule")}
                        isTemplate={this.props.match.params.type === '2' ? true : false}
                    />


                    <Drawer
                        title="总览"
                        placement="right"
                        closable={true}
                        onClose={() => { store.setIsShowDrawerForSql(false) }}
                        visible={store.getIsShowDrawerForSql}
                        width="720"
                        destroyOnClose={true}
                    >
                        <Code sqlCode={store.getSqlPreview} type={1} />
                    </Drawer>

                    <Drawer
                        title="测试"
                        placement="right"
                        closable={true}
                        onClose={() => { store.setIsShowDrawerForTest(false) }}
                        visible={store.getIsShowDrawerForTest}
                        width="720"
                        destroyOnClose={true}
                    >
                        <p style={{ font: 'Microsoft Tai Le', fontSize: '16px', margin: '0', height: '58px', lineHeight: '58px', color: '#000', opacity: '0.85' }}>输入</p>
                        <Table columns={testInputColumns} dataSource={store.getInputDataSource} pagination={false} />

                        <p style={{ font: 'Microsoft Tai Le', fontSize: '16px', margin: '0', height: '58px', lineHeight: '58px', color: '#000', opacity: '0.85', marginTop: '70px' }}>输出</p>
                        <Table columns={testOutputColumns} dataSource={store.getOutputDataSource} pagination={false} />

                        <Button type="primary" style={{ position: 'fixed', right: '20px', bottom: '20px', zIndex: '1' }} disabled={!store.getIsCanTest}
                            onClick={store.getTestOutputForApi}
                        >测试</Button>
                    </Drawer>

                </div>
            </Provider>

        )
    }
}
export default Save2_0

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

            "optType": '',

            "valueCategoryType": 0,//固定值
            "valueTableAlias": "",
            "valueType": '',
            "valueDataType": "",
            "valueCode": "",
            "valueName": "",
            "valueDefaultValue": "",
            "value": ""
        },
        "nodeType": 1
    }
    ]
}
const conditionVODemoThen = [{
    "fixedValueType": "",
    "parameterId": "",
    "parameterName": '',
    "type": 0,
    "varType": "",//等号右边的变量
    "varDataType": '',//等号右边的变量
    "varName": "",//等号右边的变量
    "varCode": "",//等号右边的变量
    "fixedValue": "",//等号右边的固定值
    "computeExpression": {//计算类型才有
    },
    "actionType": 0,
    "executionManner": 4,
    "rtqVarId": ''
}]
const conditionVODemoElse = []
const assignmentMappingVOS = [
    {
        "type": "1",//1真，0假
        "assignmentVOS": [
            {
                "id": "",
                "parameterId": "",
                "parameterName": '',
                "fixedValueType": "",//等号左边的参数变量的数据类型
                "type": 0,
                "varType": "",//等号右边的变量
                "varDataType": '',//等号右边的变量
                "varName": "",//等号右边的变量
                "varCode": "",//等号右边的变量
                "fixedValue": "",//等号右边的固定值
                "computeExpressionVO": {//计算类型才有
                }
            }
        ]
    }
]

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
