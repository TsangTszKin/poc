import React from 'react';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/rule/Save';
import processTreeStore from '@/store/ProcessTreeStore';
import PageHeader2 from '@/components/PageHeader2';
import '@/styles/business/variable/real-time-query-edit.less';
import { withRouter } from 'react-router-dom';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import { message, Row, Col, Spin, Drawer, Table, Button, Descriptions } from 'antd';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import Code from '@/components/Code';
import FormBlock from '@/components/FormBlock'
import FormButtonGroupCommon from '@/components/FormButtonGroupCommon';
import TreePanel from '@/components/condition-tree/TreePanel2.0.jsx';
import ThenPanel from '@/components/condition-tree/ThenPanel';
import ElsePanel from '@/components/condition-tree/ElsePanel';

const conditionVODemo = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
            "varCode": "",
            "varName": "",
            "varType": "",
            "optType": "",
            "value": "",
            "valueType": 0,
            "valueCode": "",
            "valueName": ""
        },
        "nodeType": 1
    }
    ]
}
const conditionVODemoThen = {
    "relType": 0,
    "nodeType": 2,
    "conditions": [{
        "relType": 0,
        "expressionVO": {
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
                "operators": [],
                "varList": [
                    {
                        "code": "",//变量CODE
                        "varType": "",//变量 类型
                        "dataType": ""//变量 数据类型
                    }
                ]
            },
            "actionType": 0,
            "executionManner": 4,
            "rtqVarId": ''
        },
        "nodeType": 1
    }]
}
const conditionVODemoElse = {
    "relType": 0,
    "nodeType": 2,
    "conditions": []
}
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
                "computeExpression": {//计算类型才有
                    "operators": [],
                    "varList": [
                        {
                            "code": "",//变量CODE
                            "varType": "",//变量 类型
                            "dataType": ""//变量 数据类型
                        }
                    ]
                },
                "actionType": 0,
                "executionManner": 4,
                "rtqVarId": ''
            }
        ]
    }
]
@withRouter
@observer
class Details extends React.Component {
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
                            "computeExpression": {//计算类型才有
                                "operators": [],
                                "varList": [
                                    {
                                        "code": "",//变量CODE
                                        "varType": "",//变量 类型
                                        "dataType": ""//变量 数据类型
                                    }
                                ]
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

    componentWillUpdate(nextProps) {
        if (nextProps.match.params.id !== this.props.match.params.id) {
            this.init(nextProps.match.params.id);
        }
    }

    init(id) {
        if (!common.isEmpty(id)) {
            store.setId(id);
            store.allVersionForApi();
        }
        this.id = id;
        this.isResource = this.props.match.path === '/business/release/rule/details/:id';
        this.getInitDataList();
        this.getDataTypeList();
    }

    getRuleById(id) {
        const apiGet = this.isResource ? strategyService.getResourceDetail : strategyService.getRuleById;
        apiGet(id).then(res => {
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
                        tempArray.push(element2);
                    })

                    this.conditionThen = {
                        "relType": 0,
                        "nodeType": 2,
                        "conditions": []
                    }

                    tempArray.forEach(element2 => {
                        this.conditionThen.conditions.push({
                            "relType": 0,
                            "nodeType": 1,
                            "expressionVO": element2
                        })
                    })
                } else {
                    let tempArray = [];
                    element.assignmentVOS.forEach(element2 => {
                        tempArray.push(element2);
                    })

                    this.conditionElse = {
                        "relType": 0,
                        "nodeType": 2,
                        "conditions": []
                    }

                    tempArray.forEach(element2 => {
                        this.conditionElse.conditions.push({
                            "relType": 0,
                            "nodeType": 1,
                            "expressionVO": element2
                        })
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
                this.props.history.push(`/business/strategy/rule/save/${res.data.result.id}`)
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

    updateConditionTree = (conditionsAll) => {
        console.log("------ updateConditionTree  ------", conditionsAll);
        this.saveData.conditionVO = conditionsAll;
    }
    updateConditionThen = (conditionsAll) => {
        console.log("updateConditionThen", conditionsAll)
        this.conditionThen = conditionsAll;
        let assignmentVOs = [];
        for (let i = 0; i < conditionsAll.conditions.length; i++) {
            const vo = conditionsAll.conditions[i].expressionVO;
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
        for (let i = 0; i < conditionsAll.conditions.length; i++) {
            const vo = conditionsAll.conditions[i].expressionVO;
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
                this.getRuleById(this.id);
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
                store.setE_and_d_Ready(false);
                this.saveData.dimensionName = '';
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
                processTreeStore.getDataForApi(store.getId);
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
                        isShowBtns={!common.isEmpty(this.props.match.params.id) && !this.isResource}
                        isShowSelect={!common.isEmpty(this.props.match.params.id) && !this.isResource}
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
                                    <Descriptions title="">
                                        <Descriptions.Item label="名称">{this.saveData.name}</Descriptions.Item>
                                        <Descriptions.Item label="标识">{this.saveData.code}</Descriptions.Item>
                                        <Descriptions.Item label="事件源">{this.saveData.eventSourceName}</Descriptions.Item>
                                        <Descriptions.Item label="维度">{this.saveData.dimensionName}</Descriptions.Item>
                                        <Descriptions.Item label="类别">{this.saveData.categoryName}</Descriptions.Item>
                                        <Descriptions.Item label="描述">{this.saveData.description}</Descriptions.Item>
                                    </Descriptions>
                                </FormBlock>

                                <FormBlock header="如果">
                                    <Row>
                                        <Col md={24} lg={24} xl={24} style={{ overflowX: 'auto', overflowY: 'hidden' }}>
                                            <TreePanel
                                                disabled={true}
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
                                                disabled={true}
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
                                                disabled={true}
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

                    <FormButtonGroupCommon
                        isShowSaveBtn={false}
                        cancelText="返回"
                        cancelCallBack={() => this.props.history.push("/business/strategy/rule")}
                    />

                </div>
            </Provider>

        )
    }
}
export default Details