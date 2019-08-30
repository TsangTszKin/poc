import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PageHeader2 from '@/components/PageHeader2';
import { Drawer, Button, message, Table, Spin } from 'antd';
import { Provider, observer } from 'mobx-react';
import store from '@/store/business/strategy/strategy/Save';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import StrategyStore from '@/store/StrategyStore';
import Rule from '@/components/common/node/Rule.jsx';
import RuleSet from '@/components/common/node/RuleSet.jsx';
import Control from '@/components/common/node/Control.jsx';
import Linker from '@/components/common/node/Linker.jsx';
import OutPut from '@/components/common/node/OutPut.jsx';
import Sql from '@/components/common/node/Sql.jsx';
import Start from '@/components/common/node/Start';
import Query from '@/components/common/node/Query.jsx';
import Assign from '@/components/common/node/Assign';
import Branch from '@/components/common/node/Branch';
import BranchLinker from '@/components/common/node/BranchLinker';
import ScoreCard from '@/components/common/node/ScoreCard.jsx';
import DecisionTable from '@/components/common/node/DecisionTable.jsx';
import Toolbar from '@/components/common/Toolbar.jsx';
import '@/styles/editor-panel.less';
import FormButtonGroupFor2_0 from '@/components/FormButtonGroupFor2_0';
import strategyService from '@/api/business/strategyService';
import { withRouter } from 'react-router-dom';
import Code from '@/components/Code';
import ModalControl from '@/components/business/strategy/definition/ModalControl.jsx';
import ModalRule from '@/components/business/strategy/definition/ModalRule.jsx';
import ModalRuleSet from '@/components/business/strategy/definition/ModalRuleSet.jsx';
import ModalSql from '@/components/business/strategy/definition/ModalSql.jsx';
import ModalOutput from '@/components/business/strategy/definition/ModalOutput.jsx';
import ModalBranchLinker from '@/components/business/strategy/definition/ModalBranchLinker.jsx';
import ModalScoreCard from '@/components/business/strategy/definition/ModalScoreCard.jsx';
import ModalDecisionTable from '@/components/business/strategy/definition/ModalDecisionTable.jsx';
import FixedBottomBar from "@/components/common/FixedBottomBar";

@withRouter
@observer
class Testing extends Component {
    constructor(props) {
        super(props);
        this.saveStrategy = this.saveStrategy.bind(this);
        this.saveStrategyForNewVersion = this.saveStrategyForNewVersion.bind(this);
        this.iframeOnloaded = this.iframeOnloaded.bind(this);
        this.state = {
            iFrameHeight: 0,
            index: 0
        }
    }

    toolbarCallBack(toolbarEventType) {
        const childFrameObj = document.getElementById('myiframe');
        childFrameObj.contentWindow.postMessage({ code: 1, value: toolbarEventType }, '*'); //code:1工具栏方法触发
    }

    componentWillMount() {
        sessionStorage.removeItem("def_local_1");
        sessionStorage.removeItem("title_local_1");
        sessionStorage.removeItem("def_1");
        StrategyStore.reset();
    }

    componentDidMount() {
        if (!common.isEmpty(this.props.match.params.id)) {
            store.setId(this.props.match.params.id);
            store.allVersionForApi();
        }
        window.receiveMessageFromIndex = function (event) {
            if (event != undefined) {

                let data = JSON.parse(event.data);
                console.log('我是react,我接受到了来自iframe的信息：', data);

                switch (data.code) {
                    case 0://单击基础信息
                        StrategyStore.set_showType('');
                        if (data.value.name !== 'branch') StrategyStore.set_showType(data.value.name);
                        switch (data.value.name) {
                            case 'start':
                                StrategyStore.start.set_data(data.value);
                                break;
                            case 'control':
                                StrategyStore.control.set_data(data.value);
                                StrategyStore.conditionVOTemp = common.deepClone(data.value.data.conditionNodeVO.conditionVO);
                                if (publicUtils.verifyConditionTree(data.value.data.conditionNodeVO.conditionVO, false)) {
                                    StrategyStore.getSqlCodeByCondition(data.value.data.conditionNodeVO.conditionVO, true);
                                }
                                break;
                            case 'rule':
                                StrategyStore.rule.set_data(data.value);
                                break;
                            case 'ruleSet':
                                StrategyStore.ruleSet.set_data(data.value);
                                break;
                            case 'scoreCard':
                                StrategyStore.scoreCard.set_data(data.value);
                                break;
                            case 'decisionTable':
                                StrategyStore.decisionTable.set_data(data.value);
                                break;
                            case 'sql':
                                StrategyStore.sql.set_data(data.value);
                                break;
                            case 'output':
                                StrategyStore.output.set_data(data.value);
                                break;
                            case 'branch':
                                if (StrategyStore.deleteIds.includes(data.value.id)) return
                                if (!common.isEmpty(data.value.title)) data.value.status = 1
                                StrategyStore.branch.set_data(data.value);
                                if (!common.isEmpty(data.value.title)) StrategyStore.sendUiData(StrategyStore.branch.get_data, true);
                                StrategyStore.set_showType(data.value.name);
                                break;
                            case 'linker':
                                switch (data.type) {
                                    case 'control':
                                        StrategyStore.controlLinker.set_data(data.value);
                                        StrategyStore.set_showType('controlLinker');
                                        break;
                                    case 'branch':
                                        if (!data.value.data) {
                                            data.value.data = branchLinker_data;
                                        }
                                        StrategyStore.conditionVOTemp = common.deepClone(data.value.data.conditionVO);
                                        StrategyStore.branchLinker.set_data(data.value);
                                        StrategyStore.set_showType('branchLinker');
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case 1://双击

                        switch (data.value.name) {
                            case 'control':
                                if (common.isEmpty(sessionStorage.tempEventSourceId)) {
                                    message.warning("请先选择事件源");
                                    return
                                }
                                if (common.isEmpty(sessionStorage.tempDimensionId)) {
                                    message.warning("请先选择维度");
                                    return
                                }
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'output':
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'rule':
                                if (common.isEmpty(StrategyStore.rule.get_data.data.ruleNodeVO.ruleExeId)) {
                                    message.warning("请先选择规则");
                                    return
                                }
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'scoreCard':
                                if (common.isEmpty(StrategyStore.scoreCard.get_data.data.scoreCardNodeVO.scoreCardId)) {
                                    message.warning("请先选择评分卡");
                                    return
                                }
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'decisionTable':
                                if (common.isEmpty(StrategyStore.decisionTable.get_data.data.decisionTableNodeVO.decisionTableId)) {
                                    message.warning("请先选择决策表");
                                    return
                                }
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'ruleSet':
                                if (common.isEmpty(StrategyStore.ruleSet.get_data.data.ruleSetNodeVO.ruleSetId)) {
                                    message.warning("请先选择规则集");
                                    return
                                }
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'sql':
                                StrategyStore.showModal(data.value.name);
                                break;
                            case 'linker':
                                switch (data.type) {
                                    case 'branch':
                                        if (common.isEmpty(sessionStorage.tempEventSourceId)) {
                                            message.warning("请先选择事件源");
                                            return
                                        }
                                        if (common.isEmpty(sessionStorage.tempDimensionId)) {
                                            message.warning("请先选择维度");
                                            return
                                        }
                                        if (!data.value.data) {
                                            data.value.data = branchLinker_data;
                                        }
                                        StrategyStore.conditionVOTemp = common.deepClone(data.value.data.conditionVO);
                                        StrategyStore.branchLinker.set_data(data.value);
                                        StrategyStore.showModal('branchLinker');
                                        break;
                                    default:
                                        break;
                                }
                                break;
                            default:
                                break;
                        }
                        break;
                    case 2: //删除节点
                        StrategyStore.deleteIds.push(...data.value)
                        StrategyStore.set_showType('');
                        break
                    default:
                        break;
                }

            }
        }
        //监听message事件
        window.addEventListener("message", window.receiveMessageFromIndex, false);


    }

    saveStrategy() {
        StrategyStore.reFixAssemblyParentId();
        StrategyStore.reFixHitAndElseId();
        StrategyStore.reFixBranchNodeData();
        StrategyStore.reFixStrategyVO();
        let deleteIds = StrategyStore.deleteIds;
        common.loading.show();
        strategyService.saveStrategyV2(StrategyStore.strategyVO.get_data, deleteIds).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            store.version.setValue("V" + res.data.result.version);
            StrategyStore.deleteIds = []
            if (!common.isEmpty(this.props.match.params.id)) {
                StrategyStore.getDetailForApi(res.data.result.id);
                this.props.history.push(`/business/strategy/definition/save/1/${res.data.result.id}`);
            } else {
                this.props.history.push(`/business/strategy/definition/save/1/${res.data.result.id}`);
            }
            store.setId(res.data.result.id);
        }).catch(() => {
            common.loading.hide();
        })
    }

    saveStrategyForNewVersion() {
        StrategyStore.reFixAssemblyParentId();
        StrategyStore.reFixHitAndElseId();
        StrategyStore.reFixBranchNodeData();
        StrategyStore.reFixStrategyVO();
        let deleteIds = StrategyStore.deleteIds;
        common.loading.show();
        strategyService.saveStrategyForNewVersionV2(StrategyStore.strategyVO.get_data, deleteIds).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            StrategyStore.deleteIds = []
            this.props.history.push(`/business/strategy/definition/save/1/${res.data.result.id}`)
            store.setId(res.data.result.id);
            StrategyStore.getDetailForApi(res.data.result.id);
            store.allVersionForApi();
        }).catch(() => common.loading.hide())
    }

    iframeOnloaded() {
        const parantHeight = document.body.offsetHeight;
        // eslint-disable-next-line react/no-find-dom-node
        const childFrameObj = ReactDOM.findDOMNode(window.document.getElementById("myiframe"));
        const iframeHeight = childFrameObj.contentWindow.document.body.scrollHeight;
        this.setState({
            iFrameHeight: parantHeight > iframeHeight ? parantHeight : iframeHeight + 'px'
        });

        if (!common.isEmpty(this.props.match.params.id)) {
            switch (this.props.match.params.type) {
                case '1':
                    StrategyStore.getDetailForApi(this.props.match.params.id);
                    break;
                case '2':
                    StrategyStore.getDetailByTemplateId(this.props.match.params.id);
                    break;
                case '3':
                    this.isResource = this.props.match.path === '/business/release/definition/:type/:id';
                    childFrameObj.contentWindow.postMessage({ code: 2 }, '*'); //code:2隐藏工具栏
                    StrategyStore.getDetailForApi(this.props.match.params.id, this.isResource);
                    break;
                default:
                    break;
            }
        } else {
            childFrameObj.contentWindow.postMessage({
                code: 0,
                value: !common.isEmpty(sessionStorage.def_local_1) ? JSON.stringify(JSON.parse(sessionStorage.def_local_1).elements) != '{}' ? JSON.parse(sessionStorage.def_local_1) : defaultUIData : defaultUIData
            }, '*'); //code:0更新渲染UI
        }


    }

    render() {
        //解决在mobx之间的通讯问题
        switch (store.getStoreBus) {
            case 1:
                StrategyStore.set_showType('');
                StrategyStore.getDetailForApi(store.getId);
                store.setStoreBus(2);//info再初始化一次
                break;

            default:
                break;
        }
        return (
            <Provider store={store} editorStore={StrategyStore}>
                <div className='panel editor-panel'>
                    <PageHeader2
                        meta={this.props.meta}
                        isShowBtns={!common.isEmpty(this.props.match.params.id) ? this.props.match.params.type !== '2' ? true : false : false}
                        isShowSelect={!common.isEmpty(this.props.match.params.id) ? this.props.match.params.type !== '2' ? true : false : false}
                        auth={{
                            test: publicUtils.isAuth("business:strategy:rule:view"),
                            sql: publicUtils.isAuth("business:strategy:rule:view"),
                            version: publicUtils.isAuth("business:strategy:rule:view"),
                        }}
                    ></PageHeader2>
                    <div className="pageContent" style={{ padding: '0' }}>
                        <div className="main">
                            {
                                this.props.match.params.type !== '3' ?
                                    <Toolbar callBack={this.toolbarCallBack} />
                                    : ''
                            }
                            <Spin spinning={StrategyStore.get_loading} size="large">
                                <iframe
                                    src="/static/strategy/html/index/flow/flow.html"
                                    style={{ height: this.state.iFrameHeight }}
                                    frameBorder="0"
                                    scrolling="no"
                                    id="myiframe"
                                    className="myiframe"
                                    name="myiframe"
                                    width="100%"
                                    height={this.state.iFrameHeight}
                                    onLoad={this.iframeOnloaded}
                                ></iframe>

                            </Spin>

                            {/* 单击节点显示右侧属性面板 */}
                            <div className="node-attribute" style={{
                                display: common.isEmpty(StrategyStore.get_showType) ? 'none' : 'block',
                                borderLeft: '1px solid #eee',
                                zIndex: '3',
                                marginTop: this.props.match.params.type === '3' ? '0' : '42px',
                                backgroundColor: '#FFF'
                            }}>
                                {
                                    (() => {
                                        switch (StrategyStore.get_showType) {
                                            case 'control':
                                                return <Control />
                                            case 'query':
                                                return <Query />
                                            case 'assign':
                                                return <Assign />
                                            case 'rule':
                                                return <Rule />
                                            case 'ruleSet':
                                                return <RuleSet />
                                            case 'start':
                                                return <Start />
                                            case 'output':
                                                return <OutPut />
                                            case 'sql':
                                                return <Sql />
                                            case 'branch':
                                                return <Branch />
                                            case 'controlLinker':
                                                return <Linker />
                                            case 'branchLinker':
                                                return <BranchLinker />
                                            case 'scoreCard':
                                                return <ScoreCard />
                                            case 'decisionTable':
                                                return <DecisionTable />
                                            default:
                                                break;
                                        }
                                    })()
                                }
                            </div>
                        </div>
                    </div>

                    {/* 双击弹出的模态框 */}
                    <ModalControl />
                    <ModalRule />
                    <ModalRuleSet />
                    <ModalSql />
                    <ModalOutput />
                    <ModalBranchLinker />
                    <ModalScoreCard />
                    <ModalDecisionTable />

                    {
                        this.props.match.params.type !== '3' ?
                            <FormButtonGroupFor2_0
                                saveCallBack={() => {
                                    if (StrategyStore.verifyAll()) {
                                        common.loading.show();
                                        setTimeout(() => {
                                            common.loading.hide()
                                            this.saveStrategy();
                                        }, 1000);
                                    }
                                }}
                                saveNewCallBack={() => {
                                    if (common.isEmpty(this.props.match.params.id)) {
                                        message.warn("请先保存");
                                        return
                                    } else {
                                        this.saveStrategyForNewVersion();
                                    }

                                }}
                                cancelCallBack={() => this.props.history.push("/business/strategy/definition")}
                                isTemplate={this.props.match.params.type === '2' ? true : false}
                            />
                            :
                            this.isResource ?
                                <FixedBottomBar>
                                    <Button type="default" htmlType="button" onClick={ () => this.props.history.goBack() }>返回</Button>
                                </FixedBottomBar>
                                : ''
                    }


                    <Drawer
                        title="总览"
                        placement="right"
                        closable={true}
                        onClose={() => {
                            store.setIsShowDrawerForSql(false)
                        }}
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
                        onClose={() => {
                            store.setIsShowDrawerForTest(false)
                        }}
                        visible={store.getIsShowDrawerForTest}
                        width="720"
                        destroyOnClose={true}
                    >
                        <p style={style.test.input}>输入</p>
                        <Table columns={testInputColumns} dataSource={store.getInputDataSource} pagination={false} />

                        <p style={style.test.output}>输出</p>
                        <Table columns={testOutputColumns} dataSource={store.getOutputDataSource} pagination={false} />

                        <Button type="primary" style={style.test.btn}
                            disabled={!store.getIsCanTest}
                            onClick={store.getTestOutputForApi}
                        >测试</Button>
                    </Drawer>

                </div>
            </Provider>
        )
    }
}

export default Testing

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


const branchLinker_data = {
    'conditionVO': {
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
    },
    'expression': ''
}

const defaultUIData = {
    "page": {
        "backgroundColor": "transparent",
        "width": 1370.3999999999999,
        "height": 600,
        "padding": 20,
        "showGrid": false,
        "gridSize": 15,
        "orientation": "portrait"
    }, "elements": {
        "start": {
            "id": "start",
            "name": "start",
            "title": "开始",
            "category": "dataSource",
            "group": "",
            "groupName": null,
            "locked": false,
            "link": "",
            "data": {
                "eventSourceId": "",
                "eventSourceName": "",
                "dimensionId": "",
                "dimensionName": "",
                "name": "开始",
                "code": "",
                "category": "",
                "categoryName": "",
                "description": ""
            },
            "icon": "<img class=\"icon\" src=\"/static/processon/img/node/start.png\" style=\"height: 18px;\">",
            "selected": ["control", "branch", "rule", "ruleSet", "sql", "scoreCard", "decisionTable"],
            "status": 0,
            "children": [],
            "parent": "",
            "resizeDir": ["tl", "tr", "br", "bl"],
            "attribute": {
                "container": false,
                "visible": true,
                "rotatable": true,
                "linkable": true,
                "collapsable": false,
                "collapsed": false,
                "markerOffset": 5
            },
            "dataAttributes": [],
            "props": { "x": 235, "y": 59, "w": 150, "h": 40, "zindex": 2, "angle": 0 },
            "shapeStyle": { "alpha": 0.8 },
            "lineStyle": { "lineWidth": 1, "lineColor": "228,75,78", "lineStyle": "solid" },
            "fillStyle": { "type": "solid", "color": "228,75,78" },
            "path": [{
                "actions": [{ "action": "move", "x": "Math.min(w,h)/2.5", "y": "0" }, {
                    "action": "line",
                    "x": "w-Math.min(w,h)/2.5",
                    "y": "0"
                }, {
                    "action": "curve",
                    "x1": "w+Math.min(w,h)/2.5/2.5",
                    "y1": "0",
                    "x2": "w+Math.min(w,h)/2.5/2.5",
                    "y2": "h",
                    "x": "w-Math.min(w,h)/2.5",
                    "y": "h"
                }, { "action": "line", "x": "Math.min(w,h)/2.5", "y": "h" }, {
                    "action": "curve",
                    "x1": "-Math.min(w,h)/2.5/2.5",
                    "y1": "h",
                    "x2": "-Math.min(w,h)/2.5/2.5",
                    "y2": "0",
                    "x": "Math.min(w,h)/2.5",
                    "y": "0"
                }, { "action": "close" }]
            }],
            "fontStyle": {
                "fontFamily": "微软雅黑",
                "size": 13,
                "color": "255,255,255",
                "bold": false,
                "italic": false,
                "underline": false,
                "textAlign": "center",
                "vAlign": "middle",
                "orientation": "vertical"
            },
            "textBlock": [{ "position": { "x": 10, "y": 0, "w": "w-50", "h": "h" }, "text": "开始" }],
            "anchors": [{ "x": "w/2", "y": "0" }, { "x": "w/2", "y": "h" }]
        }
    }
}

const style = {
    test: {
        input: {
            font: 'Microsoft Tai Le',
            fontSize: '16px',
            margin: '0',
            height: '58px',
            lineHeight: '58px',
            color: '#000',
            opacity: '0.85'
        },
        output: {
            font: 'Microsoft Tai Le',
            fontSize: '16px',
            margin: '0',
            height: '58px',
            lineHeight: '58px',
            color: '#000',
            opacity: '0.85',
            marginTop: '70px'
        },
        btn: {
            position: 'fixed', right: '20px', bottom: '20px', zIndex: '1'
        }
    }
}