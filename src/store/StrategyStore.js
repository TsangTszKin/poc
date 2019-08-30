/* eslint-disable no-prototype-builtins */
/*
 * @Author: zengzijian
 * @LastEditors: zengzijian
 * @Description: 
 * @Date: 2019-04-03 15:07:46
 * @LastEditTime: 2019-08-12 16:44:27
 */
import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import strategyService from '@/api/business/strategyService';
import commonService from '@/api/business/commonService';
import { message } from 'antd';

// actionType: 操作类型：0新增，1修改，2删除
class StrategyStore {
    constructor() {
        this.updateIframeData = this.updateIframeData.bind(this);
        this.updateUiData = this.updateUiData.bind(this);
        this.getDetailForApi = this.getDetailForApi.bind(this);
        this.verifyHitPath = this.verifyHitPath.bind(this);
        this.getRuleListByC_E_DForApi = this.getRuleListByC_E_DForApi.bind(this);
        this.getRuleSetListByC_E_DForApi = this.getRuleSetListByC_E_DForApi.bind(this);
        this.isAllReady = this.isAllReady.bind(this);
        this.verifyConnectStatus = this.verifyConnectStatus.bind(this);
        this.verifyEndByOutputNode = this.verifyEndByOutputNode.bind(this);
        this.verifyAll = this.verifyAll.bind(this);
        this.verifyNodeAlone = this.verifyNodeAlone.bind(this);
        this.getSqlCodeByCondition = this.getSqlCodeByCondition.bind(this);
        this.reFixAssemblyParentId = this.reFixAssemblyParentId.bind(this);
        this.reFixHitAndElseId = this.reFixHitAndElseId.bind(this);
        this.getSqlCodeByCondition_singleBranch = this.getSqlCodeByCondition_singleBranch.bind(this);
        this.reFixBranchNodeData = this.reFixBranchNodeData.bind(this);
        this.reFixStrategyVO = this.reFixStrategyVO.bind(this);
        this.reset = this.reset.bind(this);
        this.sendUiData = this.sendUiData.bind(this);
        this.verifyNodeEntry = this.verifyNodeEntry.bind(this);
        this.getScoreCardListByC_E_DForApi = this.getScoreCardListByC_E_DForApi.bind(this);
        this.getDecisionTableListByC_E_DForApi = this.getDecisionTableListByC_E_DForApi.bind(this);
        this.getDetailByTemplateId = this.getDetailByTemplateId.bind(this);
    }

    passEndVerify = true;
    deleteIds = [];

    @observable loading = false;
    @computed get get_loading() { return toJS(this.loading) }
    @action set_loading(value) { this.loading = value }

    /**
     * 后端返回的数据，保存时候提交
     *
     * @memberof StrategyStore
     */
    @observable strategyVO = {
        data: {
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "name": "开始",
            "code": "",
            "category": '',
            "categoryName": "",
            "description": "",
            "processon": ""
        },
        get get_data() {
            return toJS(this.data)
        },
        set_data(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        }
    }

    conditionVOTemp = conditionVODemo//条件VO的中间变量，解决了条件组件的输入框失焦问题

    @observable modal = {
        control: false,
        query: false,
        dataSource: false,
        output: false,
        rule: false,
        ruleSet: false,
        sql: false,
        branchLinker: false,
        scoreCard: false,
        decisionTable: false,
        get getControl() { return toJS(this.control) },
        get getQuery() { return toJS(this.query) },
        get getDataSource() { return toJS(this.dataSource) },
        get getOutput() { return toJS(this.output) },
        get getRule() { return toJS(this.rule) },
        get getRuleSet() { return toJS(this.ruleSet) },
        get getSql() { return toJS(this.sql) },
        get getBranchLinker() { return toJS(this.branchLinker) },
        get getScoreCard() { return toJS(this.scoreCard) },
        get getDecisionTable() { return toJS(this.decisionTable) },
        setControl(value) { this.control = value },
        setQuery(value) { this.query = value },
        setDataSource(value) { this.dataSource = value },
        setOutput(value) { this.output = value },
        setRule(value) { this.rule = value },
        setRuleSet(value) { this.ruleSet = value },
        setSql(value) { this.sql = value },
        setBranchLinker(value) { this.branchLinker = value },
        setScoreCard(value) { this.scoreCard = value },
        setDecisionTable(value) { this.decisionTable = value }
    }

    @observable showType = '';// start, query, assign, rule, ruleSet, output, sql, branch, controlLinker, branchLinker
    @computed get get_showType() { return toJS(this.showType) }
    @action.bound set_showType(value) { this.showType = value }

    updateIframeData(data) {
        sessionStorage["def_local_1"] = JSON.stringify(data.value);
        sessionStorage["def_1"] = JSON.stringify(data.value);

        const childFrameObj = document.getElementById('myiframe');
        childFrameObj.contentWindow.postMessage(data, '*'); //code:0更新渲染UI
    }

    updateUiData(id, key, value, isBatch) {
        console.log("id, key, value, isBatch", id, key, value, isBatch)
        let uiData = JSON.parse(sessionStorage.def_local_1);
        if (!isBatch) {
            uiData.elements[id][key] = value;
            this.updateIframeData({ code: 0, value: uiData });
        } else {
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                uiData.elements[id][element] = value[i];

            }
            this.updateIframeData({ code: 0, value: uiData });
        }
    }

    sendUiData(element, isKeepSelected) {
        // console.log("element", element)
        let uiData = JSON.parse(sessionStorage.def_local_1);
        uiData.elements[element.id] = element
        this.updateIframeData({ code: 0, value: uiData, isKeepSelected: isKeepSelected });
    }

    @action.bound showModal(type) {
        switch (type) {
            case 'control':
                this.modal.setControl(true);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'query':
                this.modal.setControl(false);
                this.modal.setQuery(true);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'dataSource':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(true);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'output':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(true);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'ruleSet':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(true);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'sql':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(true);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'rule':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(true);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'branchLinker':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(true);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
            case 'scoreCard':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(true);
                this.modal.setDecisionTable(false);
                break;
            case 'decisionTable':
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(true);
                break;
            default:
                this.modal.setControl(false);
                this.modal.setQuery(false);
                this.modal.setDataSource(false);
                this.modal.setOutput(false);
                this.modal.setRuleSet(false);
                this.modal.setSql(false);
                this.modal.setRule(false);
                this.modal.setBranchLinker(false);
                this.modal.setScoreCard(false);
                this.modal.setDecisionTable(false);
                break;
        }
    }


    getDetailForApi(id, isResource) {
        this.set_loading(true);
        let getDataById = isResource ? strategyService.getResourceDetail : strategyService.getStrategyByIdV2;
        getDataById(id).then(this.getDetailForApiCallBack)
    }

    @action.bound getDetailForApiCallBack(res) {
        this.set_loading(false)
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        data.processon = JSON.parse(data.processon);

        this.strategyVO.set_data(data);

        sessionStorage.tempDimensionId = data.dimensionId;
        sessionStorage.tempEventSourceId = data.eventSourceId;
        this.updateIframeData({ code: 0, value: data.processon });
    }

    getDetailByTemplateId(id) {
        commonService.getTemplateDetails(id).then(this.getDetailForApiCallBack2);
    }

    @action.bound getDetailForApiCallBack2(res) {
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        data.name = "";
        data.code = "";
        data.version = "";
        data.processon = JSON.parse(data.processon);
        this.strategyVO.set_data(data);
        sessionStorage.tempDimensionId = data.dimensionId;
        sessionStorage.tempEventSourceId = data.eventSourceId;
        this.updateIframeData({ code: 0, value: data.processon });
    }

    /**
     * 开始节点信息
     * @memberof StrategyStore
     */
    @observable start = {
        data: {
            id: 'start',
            name: 'start',
            title: '开始',
            status: 0,
            data: {
                "eventSourceId": "",
                "eventSourceName": "",
                "dimensionId": "",
                "dimensionName": "",
                "name": "开始",
                "code": "",
                "category": '',
                "categoryName": "",
                "description": "",
            }
        },
        get get_data() {
            return toJS(this.data)
        },
        set_data(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    /**
     * 条件节点信息
     * @memberof StrategyStore
     */
    @observable control = {
        data: {
            id: 'control',
            name: 'control',
            title: '条件',
            status: 0,
            data: {
                "conditionNodeVO": {
                    'id': '',
                    'name': '条件',
                    'conditionVO': conditionVODemo,
                    'script': '',
                    'hitId': '',
                    'elseId': '',
                },
                'assemblyId': '',
                'assemblyParentId': '',
                'type': 0,
                "actionType": 1
            }
        },
        get get_data() {
            return toJS(this.data)
        },
        set_data(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }


    /**
     * 规则节点信息
     * @memberof StrategyStore
     */
    @observable rule = {
        data: {
            id: 'rule',
            name: 'rule',
            title: '规则',
            status: 0,
            data: {
                "ruleNodeVO": {
                    "name": "规则",
                    "ruleExeId": "",
                    "description": "",
                    "category": '',
                    "ruleCode": ""
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 2,
                "actionType": 1
            }
        },
        helper: {
            ruleList: [],//根据规则类别获取的规则列表，此字段只用于做下拉初始化，不做保存
            ruleListOriginData: [],
            versionList: []
        },
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    /**
     * 规则集节点信息
     * @memberof StrategyStore
     */
    @observable ruleSet = {
        data: {
            id: 'ruleSet',
            name: 'ruleSet',
            title: '规则集',
            status: 0,
            data: {
                "ruleSetNodeVO": {
                    "name": "规则集",
                    "ruleSetId": "",
                    "category": '',
                    "ruleSetCode": "",
                    "description": "",
                    "sqlCode": ""
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 4,
                "actionType": 1
            }
        },
        helper: {
            ruleSetList: [],//根据规则类别获取的规则列表，此字段只用于做下拉初始化，不做保存
            ruleSetListOriginData: [],
            versionList: []
        },
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    /**
     * 脚本节点信息
     * @memberof StrategyStore
     */
    @observable sql = {
        data: {
            id: 'sql',
            name: 'sql',
            title: '脚本',
            status: 0,
            data: {
                "scriptNodeVO": {
                    "name": "脚本",
                    "sqlCode": "",
                    "scriptId": ""
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 5,
                "actionType": 1
            }
        },
        helper: {},
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    /**
     * 输出节点信息
     * @memberof StrategyStore
     */
    @observable output = {
        data: {
            id: 'output',
            name: 'output',
            title: '输出',
            status: 0,
            data: {
                "outPutNodeVO": {
                    "name": "输出",
                    "parameters": [
                        // {
                        // 	"id": "402880f76b778601016b778d71c00000",
                        // 	"tenantId": "1561422932914",
                        // 	"name": "123",
                        // 	"code": "123",
                        // 	"type": 12,
                        // 	"defaultValue": "123123",
                        // 	"category": 2,
                        // 	"quoteSum": 0,
                        // 	"typeLabel": "字符串",
                        // 	"key": "402880f76b778601016b778d71c00000"
                        // }
                    ]
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 3,
                "actionType": 1
            }
        },
        helper: {
            parametersList: [],//只用于下拉初始化和比较，不保存
            parametersKey: []//只用于下拉初始化和比较，不保存
        },
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }


    /**
     * 分支节点信息
     * @memberof StrategyStore
     */
    @observable branch = {
        data: {
            id: 'branch',
            name: 'branch',
            title: '分支',
            status: 1,
            data: {
                "branchNodeVO": {
                    "name": "分支",
                    "branchMap": {
                        // "16bdfcf4915b3c": conditionVODemo
                    },
                    "sort": [
                        // "16bdfcf4915b3c"
                    ]
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 1,
                "actionType": 1
            }
        },
        helper: {
            dataSource: []
        },
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }


    /**
     * 条件节点linker信息
     * @memberof StrategyStore
     */
    @observable controlLinker = {
        data: {
            id: 'controlLinker',
            name: 'linker',
            text: '',
            status: 0,
            data: {}
        },
        helper: {},
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }


    /**
     * 分支节点linker信息
     * @memberof StrategyStore
     */
    @observable branchLinker = {
        data: {
            id: 'branchLinker',
            name: 'scoreCard',
            text: '分支',
            status: 0,
            data: {
                'conditionVO': conditionVODemo,
                'expression': ''
            }
        },
        helper: {},
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    /**
     * 评分卡节点信息
     * @memberof StrategyStore
     */
    @observable scoreCard = {
        data: {
            id: 'scoreCard',
            name: 'scoreCard',
            title: '评分卡',
            status: 0,
            data: {
                "scoreCardNodeVO": {
                    "name": "评分卡",
                    "scoreCardId": "",
                    "description": "",
                    "category": '',
                    "code": ""
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 7,
                "actionType": 1
            }
        },
        helper: {
            scoreCardList: [],//根据类别获取的列表，此字段只用于做下拉初始化，不做保存
            scoreCardListOriginData: [],
            versionList: []
        },
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    /**
     * 决策表节点信息
     * @memberof StrategyStore
     */
    @observable decisionTable = {
        data: {
            id: 'decisionTable',
            name: 'decisionTable',
            title: '决策表',
            status: 0,
            data: {
                "decisionTableNodeVO": {
                    "name": "决策表",
                    "decisionTableId": "",
                    "description": "",
                    "category": '',
                    "code": ""
                },
                'assemblyId': '',
                'assemblyParentId': '',
                "type": 8,
                "actionType": 1
            }
        },
        helper: {
            decisionTableList: [],//根据类别获取的列表，此字段只用于做下拉初始化，不做保存
            decisionTableListOriginData: [],
            versionList: []
        },
        get get_data() {
            return toJS(this.data)
        },
        get get_helper() {
            return toJS(this.helper)
        },
        set_data(value) {
            this.data = value
        },
        set_helper(value) {
            this.helper = value
        },
        updateData(key, value) {
            this.data[key] = value
        },
        updateHelper(key, value) {
            this.helper[key] = value
        },
        updatePropData(key, value) {
            this.data.data[key] = value
        }
    }

    verifyHitPath() {
        let result = true;
        let uiData = JSON.parse(sessionStorage.def_local_1);
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker') {
                    if (!element.to.id || !element.from.id) {
                        message.warn("箭头指向未完善");
                        result = false;
                        break;
                    }
                    if (!common.isEmpty(element.from.id)) {
                        if (!common.isEmpty(uiData.elements[element.from.id]) && uiData.elements[element.from.id].name === 'control') {
                            if (common.isEmpty(element.text)) {
                                message.warn("请设置完整条件控制节点的命中路径");
                                result = false;
                                break;
                            }
                        }
                    }
                }
            }
        }

        // 命中和非命中路径不能冲突
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'control') {
                    let linkerTextList = [];
                    for (const key2 in uiData.elements) {
                        if (uiData.elements.hasOwnProperty(key2)) {
                            const element2 = uiData.elements[key2];
                            if (element2.name === 'linker') {
                                if (element2.from.id && element2.from.id === element.id && !common.isEmpty(element2.text)) {
                                    if (linkerTextList.includes(element2.text)) {
                                        result = false;
                                        message.warn("条件节点下的命中或者非命中不能重复");
                                        break;
                                    } else {
                                        linkerTextList.push(element2.text)
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return result;
    }

    getRuleListByC_E_DForApi(category) {
        this.rule.updateHelper('ruleListOriginData', []);
        strategyService.getRuleListByC_E_D(sessionStorage.tempDimensionId, sessionStorage.tempEventSourceId, category).then(this.getRuleListByC_E_DForApiCallBack)
    }
    @action.bound getRuleListByC_E_DForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            this.rule.updateHelper('ruleListOriginData', res.data.result);

            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    versions: element.versions
                })
                if (element.code === this.rule.get_data.data.ruleNodeVO.ruleCode) {
                    this.rule.updateHelper('versionList', element.versions)
                }
            }

        }
        this.rule.updateHelper('ruleList', tempArray);
    }

    getRuleSetListByC_E_DForApi(category) {
        this.ruleSet.updateHelper('ruleSetListOriginData', []);
        strategyService.getRuleSetListByC_E_D(sessionStorage.tempDimensionId, sessionStorage.tempEventSourceId, category).then(this.getRuleSetListByC_E_DForApiCallBack)
    }
    @action.bound getRuleSetListByC_E_DForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            this.rule.updateHelper('ruleSetListOriginData', res.data.result);

            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    versions: element.versions
                })
                if (element.code === this.ruleSet.get_data.data.ruleSetNodeVO.ruleSetCode) {
                    this.ruleSet.updateHelper('versionList', element.versions)
                }
            }

        }
        this.ruleSet.updateHelper('ruleSetList', tempArray);
    }

    getScoreCardListByC_E_DForApi(category) {
        this.scoreCard.updateHelper('scoreCardListOriginData', []);
        strategyService.getScoreCardListByC_E_D(sessionStorage.tempDimensionId, sessionStorage.tempEventSourceId, category).then(this.getScoreCardListByC_E_DForApiCallBack)
    }
    @action.bound getScoreCardListByC_E_DForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            this.rule.updateHelper('scoreCardListOriginData', res.data.result);

            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    versions: element.versions
                })
                if (element.code === this.scoreCard.get_data.data.scoreCardNodeVO.code) {
                    this.scoreCard.updateHelper('versionList', element.versions)
                }
            }

        }
        this.scoreCard.updateHelper('scoreCardList', tempArray);
    }

    getDecisionTableListByC_E_DForApi(category) {
        this.scoreCard.updateHelper('decisionTableListOriginData', []);
        strategyService.getDecisionCardListByC_E_D(sessionStorage.tempDimensionId, sessionStorage.tempEventSourceId, category).then(this.getDecisionTableListByC_E_DForApiCallBack)
    }
    @action.bound getDecisionTableListByC_E_DForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            this.decisionTable.updateHelper('decisionTableListOriginData', res.data.result);

            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    versions: element.versions
                })
                if (element.code === this.decisionTable.get_data.data.decisionTableNodeVO.code) {
                    this.decisionTable.updateHelper('versionList', element.versions)
                }
            }

        }
        this.decisionTable.updateHelper('decisionTableList', tempArray);
    }

    isAllReady() {
        //检验基础信息
        if (common.isEmpty(this.strategyVO.get_data.name)) {
            console.log("基础信息-名称 不能为空");
            message.warn("基础信息-名称 不能为空");
            return false
        }
        if (common.isEmpty(this.strategyVO.get_data.code)) {
            console.log("基础信息-标识 不能为空");
            message.warn("基础信息-标识 不能为空");
            return false
        }
        if (common.isEmpty(this.strategyVO.get_data.eventSourceId)) {
            console.log("基础信息-事件源 不能为空");
            message.warn("基础信息-事件源 不能为空");
            return false
        }
        if (common.isEmpty(this.strategyVO.get_data.dimensionId)) {
            console.log("基础信息-维度 不能为空");
            message.warn("基础信息-维度 不能为空");
            return false
        }
        if (common.isEmpty(this.strategyVO.get_data.category)) {
            console.log("基础信息-类别 不能为空");
            message.warn("基础信息-类别 不能为空");
            return false
        }

        //检验节点
        let uiData = JSON.parse(sessionStorage.def_local_1);
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name !== 'start') {
                    let data = element.data
                    console.log("data", data)
                    switch (element.name) {
                        case 'control':
                            if (common.isEmpty(data.conditionNodeVO.name)) {
                                console.log("(条件控制节点)-名称 不能为空");
                                message.warn("(条件控制节点)-名称 不能为空");
                                return false
                            }
                            if (!publicUtils.verifyConditionTree(data.conditionNodeVO.conditionVO)) {
                                console.log("(条件控制节点)-条件 请填写完整");
                                message.warn("(条件控制节点)-条件 请填写完整");
                                return false
                            }
                            break;
                        case 'branch':
                            if (common.isEmpty(data.branchNodeVO.name)) {
                                console.log("分支节点-名称 不能为空");
                                message.warn("分支节点-名称 不能为空");
                                return false
                            }
                            break;
                        case 'rule'://规则节点
                            if (common.isEmpty(data.ruleNodeVO.name)) {
                                console.log("(规则节点)-名称 不能为空");
                                message.warn("(规则节点)-名称 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.ruleNodeVO.category)) {
                                console.log("(规则节点)-类别 不能为空");
                                message.warn("(规则节点)-类别 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.ruleNodeVO.ruleExeId)) {
                                console.log("(规则节点)-规则 不能为空");
                                message.warn("(规则节点)-规则 不能为空");
                                return false
                            }
                            break;
                        case 'output'://输出节点
                            if (common.isEmpty(data.outPutNodeVO.name)) {
                                console.log("(输出节点)-名称 不能为空");
                                message.warn("(输出节点)-名称 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.outPutNodeVO.parameters)) {
                                console.log("(输出节点)-输出结果 不能为空");
                                message.warn("(输出节点)-输出结果 不能为空");
                                return false
                            }
                            break;
                        case 'ruleSet'://规则集节点
                            if (common.isEmpty(data.ruleSetNodeVO.name)) {
                                console.log("(规则集节点)-名称 不能为空");
                                message.warn("(规则集节点)-名称 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.ruleSetNodeVO.category)) {
                                console.log("(规则集节点)-类别 不能为空");
                                message.warn("(规则集节点)-类别 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.ruleSetNodeVO.ruleSetId)) {
                                console.log("(规则集节点)-规则集 不能为空");
                                message.warn("(规则集节点)-规则集 不能为空");
                                return false
                            }
                            break;
                        case 'sql'://脚本节点
                            if (common.isEmpty(data.scriptNodeVO.name)) {
                                console.log("(脚本节点)-名称 不能为空");
                                message.warn("(脚本节点)-名称 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.scriptNodeVO.sqlCode)) {
                                console.log("(脚本节点)-脚本 不能为空");
                                message.warn("(脚本节点)-脚本 不能为空");
                                return false
                            }
                            break;
                        case 'scoreCard'://评分卡
                            if (common.isEmpty(data.scoreCardNodeVO.name)) {
                                console.log("(评分卡节点)-名称 不能为空");
                                message.warn("(评分卡节点)-名称 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.scoreCardNodeVO.category)) {
                                console.log("(评分卡节点)-类别 不能为空");
                                message.warn("(评分卡节点)-类别 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.scoreCardNodeVO.scoreCardId)) {
                                console.log("(评分卡节点)-评分卡 不能为空");
                                message.warn("(评分卡节点)-评分卡 不能为空");
                                return false
                            }
                            break;
                        case 'decisionTable'://决策表
                            if (common.isEmpty(data.decisionTableNodeVO.name)) {
                                console.log("(决策表节点)-名称 不能为空");
                                message.warn("(决策表节点)-名称 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.decisionTableNodeVO.category)) {
                                console.log("(决策表节点)-类别 不能为空");
                                message.warn("(决策表节点)-类别 不能为空");
                                return false
                            }
                            if (common.isEmpty(data.decisionTableNodeVO.decisionTableId)) {
                                console.log("(决策表节点)-决策表 不能为空");
                                message.warn("(决策表节点)-决策表 不能为空");
                                return false
                            }
                            break;
                        case 'linker':
                            for (const key2 in uiData.elements) {
                                if (uiData.elements.hasOwnProperty(key2)) {
                                    const element2 = uiData.elements[key2];
                                    if (element2.name === 'branch') {
                                        if (element2.id === element.from.id) {
                                            console.log("linker data", data)
                                            if (!data) {
                                                console.log("(分支)-条件 不能为空");
                                                message.warn("(分支)-条件 不能为空");
                                                return false
                                            } else {
                                                if (!publicUtils.verifyConditionTree(data.conditionVO)) {
                                                    console.log("(分支)-条件 请填写完整");
                                                    message.warn("(分支)-条件 请填写完整");
                                                    return false
                                                }
                                            }
                                        }
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
        console.log("isAllReady 验证完毕")
        return true
    }

    verifyConnectStatus() {
        let uiData = JSON.parse(sessionStorage.def_local_1);
        let startNode;
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'start') {
                    startNode = element;
                }
            }
        }
        //判断是否只有开始节点 start
        let isOnlyStartNode = true
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker' && element.from.id && element.from.id === 'start') isOnlyStartNode = false
            }
        }
        if (isOnlyStartNode) {
            this.passEndVerify = false;
            message.warning('请连接其他节点');
            return
        }

        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker' && element.from.id === startNode.id) {
                    console.log("verifyEndByOutputNode element", element)
                    this.verifyEndByOutputNode(element);
                }
            }
        }
    }

    verifyEndByOutputNode(linker) {
        let uiData = JSON.parse(sessionStorage.def_local_1);
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.id === linker.to.id) {//找到linker的to节点element
                    let nextLinker;
                    for (const key in uiData.elements) {
                        if (uiData.elements.hasOwnProperty(key)) {
                            const element2 = uiData.elements[key];
                            if (element2.name === 'linker' && element2.from.id === element.id) {//找到element节点的下一条linker element2
                                nextLinker = element2;
                                console.log("element", element)
                                console.log("nextLinker", nextLinker)
                            }
                        }
                    }
                    // console.log("haveLinker", haveLinker)
                    if (nextLinker) {//此节点有下条线
                        if (element.name !== 'output') {//此节点不是输出节点
                            this.verifyEndByOutputNode(nextLinker)
                        }
                    } else {//节点无下条线
                        console.log("节点无下条线", element)
                        if (element.name !== 'output') {//节点不是输出节点
                            this.passEndVerify = false;//把全局检验改为false
                            message.warn("请以输出节点结束");
                            break;
                        }
                    }
                }
            }
        }
    }

    verifyNodeAlone() {
        let uiData = JSON.parse(sessionStorage.def_local_1);
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name !== 'linker' && element.name !== 'start') {
                    let isAlone = true;
                    for (const key in uiData.elements) {
                        if (uiData.elements.hasOwnProperty(key)) {
                            const element2 = uiData.elements[key];
                            if (element2.name === 'linker' && element2.to.id === element.id) {
                                isAlone = false
                            }
                        }
                    }
                    if (isAlone) {
                        message.warn("节点尚未完成连接");
                        return false
                    }
                }
            }
        }
        return true
    }

    verifyAll() {
        this.verifyConnectStatus();
        if (this.verifyNodeEntry()
            && this.verifyHitPath()
            && this.passEndVerify
            && this.isAllReady()
            && this.verifyNodeAlone()) {
            return true
        } else {
            this.passEndVerify = true;
            return false
        }
    }


    getSqlCodeByCondition(conditionAll) {//conditionAll全部条件完整才会调用此方法
        strategyService.getSqlCodeByCondition(conditionAll).then(res => {
            if (!publicUtils.isOk(res)) return
            let conditionNodeVO = this.control.get_data.data.conditionNodeVO;
            conditionNodeVO.script = res.data.result;
            this.control.updatePropData('conditionNodeVO', conditionNodeVO);
            // this.sendUiData(this.control.get_data, isKeepSelected);
        });
    }

    getSqlCodeByCondition_singleBranch(conditionAll) {//conditionAll全部条件完整才会调用此方法
        strategyService.getSqlCodeByCondition(conditionAll).then(res => {
            if (!publicUtils.isOk(res)) return
            this.branchLinker.updatePropData('expression', res.data.result);
            this.sendUiData(this.branchLinker.get_data);
        });
    }

    reFixAssemblyParentId() {
        let uiData = JSON.parse(sessionStorage.def_local_1);

        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker' && element.from.id && element.to.id) {
                    //找到当前节点的上游linker element（非第一条）
                    //重新设置修正 assemblyParentId
                    uiData.elements[element.to.id].data.assemblyId = element.to.id;
                    if (element.from.id == 'start') {
                        uiData.elements[element.to.id].data.assemblyParentId = '';
                        continue
                    } else {
                        uiData.elements[element.to.id].data.assemblyParentId = element.from.id;
                    }
                }
            }
        }

        this.updateIframeData({ code: 0, value: uiData });
    }

    reFixHitAndElseId() { //重新设置修正 hitId 和 elseId
        let uiData = JSON.parse(sessionStorage.def_local_1);
        // 清掉命中和非命中id
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'control') {
                    element.data.conditionNodeVO.hitId = '';
                    element.data.conditionNodeVO.elseId = '';
                }
            }
        }
        // 设置命中和非命中id
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker' && element.from.id && element.to.id) {
                    //找到当前节点的下游linker element（非第一条）

                    if (element.from.id !== 'start') {
                        if (uiData.elements[element.from.id].name === 'control') {//找到条件节点

                            if (element.text === '命中') {
                                uiData.elements[element.from.id].data.conditionNodeVO.hitId = element.to.id;
                            }
                            if (element.text === '非命中') {
                                uiData.elements[element.from.id].data.conditionNodeVO.elseId = element.to.id;
                            }
                        }
                    }
                }
            }
        }

        this.updateIframeData({ code: 0, value: uiData });
    }

    reFixBranchNodeData() {
        let uiData = JSON.parse(sessionStorage.def_local_1);

        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'branch') {
                    let branch = element;
                    let branchLinker = [];//下游节点集合
                    for (const key2 in uiData.elements) {
                        if (uiData.elements.hasOwnProperty(key2)) {
                            const element2 = uiData.elements[key2];
                            if (element2.name === 'linker' && element2.from && element2.from.id === branch.id) {//找到下游的linker
                                branchLinker.push(element2)
                            }
                        }
                    }
                    let sort_old = branch.data.branchNodeVO.sort;
                    let dataSource = [];
                    if (!common.isEmpty(sort_old)) {
                        sort_old.forEach(element => {
                            branchLinker.forEach(element2 => {
                                if (!element2.hasOwnProperty('data')) return false
                                if (element !== element2.id) return false
                                console.log("element2.data 1", element2.data)
                                if (publicUtils.verifyConditionTree(element2.data.conditionVO, false)) {
                                    dataSource.push({
                                        id: element2.id,
                                        name: element2.text,
                                        expression: element2.data.expression
                                    })
                                }
                            })
                        })
                    } else {
                        branchLinker.forEach(element2 => {
                            if (!element2.hasOwnProperty('data')) return false
                            console.log("element2.data 2", element2.data)
                            if (publicUtils.verifyConditionTree(element2.data.conditionVO, false)) {
                                dataSource.push({
                                    id: element2.id,
                                    name: element2.text,
                                    expression: element2.data.expression
                                })
                            }
                        })
                    }


                    // 更新数据branchMap 更新数据sort
                    let branchMap = {}
                    let sort = [];
                    branchLinker.forEach(element2 => {
                        branchMap[element2.to.id] = element2.data.conditionVO;
                        sort.push(element2.to.id)
                    })
                    uiData.elements[key].data.branchNodeVO.branchMap = branchMap;
                    uiData.elements[key].data.branchNodeVO.sort = sort;

                }

            }
        }
        this.updateIframeData({ code: 0, value: uiData });
    }

    verifyNodeEntry() { //节点的入口不能有两个
        let uiData = JSON.parse(sessionStorage.def_local_1);

        let entryObj = {}

        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name !== 'linker' && element.name !== 'start') {//循环每个node

                    for (const key2 in uiData.elements) {
                        if (uiData.elements.hasOwnProperty(key2)) {
                            const element2 = uiData.elements[key2];
                            if (element2.name === 'linker' && element2.to.id === key) {//循环每个node的linker
                                if (entryObj.hasOwnProperty(key)) {
                                    if (entryObj[key].length > 0) {
                                        message.warn("节点的入口只能有一个");
                                        return false
                                    } else {
                                        entryObj[key].push(key2);
                                    }
                                } else {
                                    entryObj[key] = [key2];
                                }
                            }
                        }
                    }


                }
            }
        }
        console.warn("entryObj", entryObj)
        return true
    }


    reFixStrategyVO() {
        this.strategyVO.updateData('processon', sessionStorage.def_local_1);
    }

    reset() {
        sessionStorage.removeItem('tempDimensionId');
        sessionStorage.removeItem('tempEventSourceId');
        this.strategyVO.set_data({
            "eventSourceId": "",
            "eventSourceName": "",
            "dimensionId": "",
            "dimensionName": "",
            "name": "开始",
            "code": "",
            "category": '',
            "categoryName": "",
            "description": "",
            "processon": ""
        });
        this.passEndVerify = true;
        this.deleteIds = [];
        this.conditionVOTemp = conditionVODemo;
        this.set_showType('');
    }
}

export default new StrategyStore


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
