/*
 * @Author: zengzijian
 * @LastEditors: zengzijian
 * @Description: 
 * @Date: 2019-04-03 15:07:46
 * @LastEditTime: 2019-06-17 11:32:54
 */

// type {
// 	0: '控制节点',
// 	1: '执行节点'
// }

// secondType {
// 	控制节点: {
// 		0: '条件控制',
// 		1: '分支控制', 
// 		2: '循环控制'
// 	},
// 	执行节点: {
// 		0: '规则',
// 		1: '规则集',
// 		2: '查询',
// 		3: '输出',
// 		4: '赋值'
// 	}
// }
const texst = {
    'id': '',
    'name': '',
    'branchId': '',
    'branchMap': {
        '111': {
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
    }
}
import { observable, action, computed, toJS, autorun } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import authService from '@/api/authService';
import strategyService from '@/api/business/strategyService';
import { observer } from 'mobx-react';
import commonService from '@/api/business/commonService';
import { message } from 'antd';
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
            "valueName": "",
            "valueOptType": 0
        },
        "nodeType": 1
    }
    ]
}
class EditorStore {

    constructor() {
        this.updateIframeData = this.updateIframeData.bind(this);
        this.updateUiData = this.updateUiData.bind(this);
        this.getConditionNodeVO = this.getConditionNodeVO.bind(this);
        this.checkNode = this.checkNode.bind(this);
        this.removeNode = this.removeNode.bind(this);
        this.getDetailForApi = this.getDetailForApi.bind(this);
        this.getDetailByTemplateId = this. getDetailByTemplateId.bind(this);
        this.getNodeForApi = this.getNodeForApi.bind(this);
        this.addOneProcessonNode = this.addOneProcessonNode.bind(this);
        this.verifyHitPath = this.verifyHitPath.bind(this);
        this.setHitPath = this.setHitPath.bind(this);
        this.getRuleNodeVO = this.getRuleNodeVO.bind(this);
        this.getRuleListByC_E_DForApi = this.getRuleListByC_E_DForApi.bind(this);
        this.getOutputNodeVO = this.getOutputNodeVO.bind(this);
        this.getRuleSetNodeVO = this.getRuleSetNodeVO.bind(this);
        this.getRuleSetListByC_E_DForApi = this.getRuleSetListByC_E_DForApi.bind(this);
        this.getScriptNodeVO = this.getScriptNodeVO.bind(this);
        this.getBranchNodeVO = this.getBranchNodeVO.bind(this);
        this.isAllReady = this.isAllReady.bind(this);
        this.verifyConnectStatus = this.verifyConnectStatus.bind(this);
        this.verifyEndByOutputNode = this.verifyEndByOutputNode.bind(this);
        this.verifyAll = this.verifyAll.bind(this);
        this.checkBranchIsReady = this.checkBranchIsReady.bind(this);
        this.getBranchNodeExpressionForApi = this.getBranchNodeExpressionForApi.bind(this);
        this.verifyNodeAlone = this.verifyNodeAlone.bind(this);
        this.getSqlCodeByCondition = this.getSqlCodeByCondition.bind(this);
        this.reFixAssemblyParentId = this.reFixAssemblyParentId.bind(this);
        this.getDetailByTemplateId = this.getDetailByTemplateId.bind(this);
        this.reFixHitAndElseId = this.reFixHitAndElseId.bind(this);
        this.getDetailForApi2 = this.getDetailForApi2.bind(this);
    }
    passEndVerify = true;
    syncTask = {
        hitPath: {//决策的命中路径回调渲染（如果本地originData没有此节点信息，则调API获取节点详情信息，再设置originData的当前的hitId或者elseId）
            active: false,
            linker: null
        },
        delBranchMap: {
            active: false,
            branchNode: null,
            linkerId: null,
            nextNodeId: null
        },
        setAssemblyParentId: {
            active: false,
            assemblyParentId: null
        },
        deleteBranchMapNode: {
            active: false,
            branchMapId: null
        }
    };

    originData = {//gateway返回的结果集（数据被处理完最后集中到这里封装在提交上去）
        processon: '',//在baseInfo编辑处理后在更新到这里
        // processonId: '',
        // id: '',
        type: '',//在baseInfo编辑处理后在更新到这里
        name: '',//在baseInfo编辑处理后在更新到这里
        code: '',//在baseInfo编辑处理后在更新到这里
        eventSourceId: '',//在baseInfo编辑处理后在更新到这里
        eventSourceName: '',//在baseInfo编辑处理后在更新到这里
        dimensionId: '',//在baseInfo编辑处理后在更新到这里
        dimensionName: '',//在baseInfo编辑处理后在更新到这里
        category: '',//在baseInfo编辑处理后在更新到这里
        categoryName: '',
        description: '',
        nodeMap: {},//在node编辑处理后在更新到这里

    }
    delNodeMapForNeverSave = {}
    delForBranchMap = {}//分支节点的linker的id为key，linker的下游组件的conditionVO和下游节点ID为value {111:{conditionVO: {}, nextNodeId: ''}}
    conditionVOTemp = conditionVODemo//条件VO的中间变量，解决了条件组件的输入框失焦问题
    initOriginData() {
        this.originData = {
            //gateway返回的结果集（数据被处理完最后集中到这里封装在提交上去）
            processon: '',//在baseInfo编辑处理后在更新到这里
            // processonId: '',
            // id: '',
            type: '',//在baseInfo编辑处理后在更新到这里
            name: '',//在baseInfo编辑处理后在更新到这里
            code: '',//在baseInfo编辑处理后在更新到这里
            eventSourceId: '',//在baseInfo编辑处理后在更新到这里
            eventSourceName: '',//在baseInfo编辑处理后在更新到这里
            dimensionId: '',//在baseInfo编辑处理后在更新到这里
            dimensionName: '',//在baseInfo编辑处理后在更新到这里
            category: '',//在baseInfo编辑处理后在更新到这里
            categoryName: '',
            description: '',
            nodeMap: {},//在node编辑处理后在更新到这里

        }
        this.delNodeMapForNeverSave = {};
        this.delForBranchMap = {};
        this.passEndVerify = true;
    }

    @observable lock = false;
    @computed get getLock() { return toJS(this.lock) }
    @action.bound setLock(value) { this.lock = value }

    @observable modal = {
        control: false,
        query: false,
        dataSource: false,
        output: false,
        rule: false,
        ruleSet: false,
        sql: false,
        branchLinker: false,
        get getControl() { return toJS(this.control) },
        get getQuery() { return toJS(this.query) },
        get getDataSource() { return toJS(this.dataSource) },
        get getOutput() { return toJS(this.output) },
        get getRule() { return toJS(this.rule) },
        get getRuleSet() { return toJS(this.ruleSet) },
        get getSql() { return toJS(this.sql) },
        get getBranchLinker() { return toJS(this.branchLinker) },
        setControl(value) { this.control = value },
        setQuery(value) { this.query = value },
        setDataSource(value) { this.dataSource = value },
        setOutput(value) { this.output = value },
        setRule(value) { this.rule = value },
        setRuleSet(value) { this.ruleSet = value },
        setSql(value) { this.sql = value },
        setBranchLinker(value) { this.branchLinker = value }
    }

    @observable commonUI_data = {
        id: '',
        title: '',
        type: '',
        init() {
            this.id = "";
            this.title = "";
            this.type = "";
        },
        get getId() { return toJS(this.id) },
        get getTitle() { return toJS(this.title) },
        get getType() { return toJS(this.type) },
        setId(value) { this.id = value },
        setTitle(value) { this.title = value },
        setType(value) { this.type = value }
    }

    updateIframeData(data) {
        const childFrameObj = document.getElementById('myiframe');
        childFrameObj.contentWindow.postMessage(data, '*'); //code:0更新渲染UI
    }

    updateUiData(id, key, value, isBatch) {
        console.log("id, key, value, isBatch", id, key, value, isBatch)
        let uiData = JSON.parse(localStorage.def_local_1);
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
                break;
        }
    }

    /**
     *基础信息
     *这里的数据两个作用，第一在页面双向绑定，第二修改后同步修改originData的下面对应的数据
     * @memberof EditorStore
     */
    @observable baseInfo = {
        processon: '',
        processonId: '',
        id: '',
        type: '',
        name: '',
        code: '',
        eventSourceId: '',
        eventSourceName: '',
        dimensionId: '',
        dimensionName: '',
        category: '',
        categoryName: '',
        description: '',
        init() {
            this.processon = '';
            this.id = '';
            this.type = '';
            this.name = '';
            this.code = '';
            this.eventSourceId = '';
            this.eventSourceName = '';
            this.dimensionId = '';
            this.dimensionName = '';
            this.category = '';
            this.categoryName = '';
            this.description = '';
            this.processonId = '';
        },
        get getProcesson() { return toJS(this.processon) },
        get getType() { return toJS(this.type) },
        get getName() { return toJS(this.name) },
        get getCode() { return toJS(this.code) },
        get getEventSourceId() { return toJS(this.eventSourceId) },
        get getEventSourceName() { return toJS(this.eventSourceName) },
        get getDimensionId() { return toJS(this.dimensionId) },
        get getDimensionName() { return toJS(this.dimensionName) },
        get getId() { return toJS(this.id) },
        get getCategory() { return toJS(this.category) },
        get getCategoryName() { return toJS(this.categoryName) },
        get getProcessonId() { return toJS(this.processonId) },
        get getDescription() { return toJS(this.description) },
        setProcesson(value) {
            this.processon = value;
        },
        setType(value) {
            this.type = value;
        },
        setName(value) {
            this.name = value;
        },
        setCode(value) {
            this.code = value;
        },
        setEventSourceId(value) {
            this.eventSourceId = value;
        },
        setEventSourceName(value) {
            this.eventSourceName = value;
        },
        setDimensionId(value) {
            this.dimensionId = value;
        },
        setDimensionName(value) {
            this.dimensionName = value;
        },
        setId(value) {
            this.id = value;
        },
        setCategory(value) {
            this.category = value;
        },
        setDescription(value) {
            this.description = value;
        },
        setCategoryName(value) {
            this.categoryName = value;
        },
        setProcessonId(value) {
            this.processonId = value
        }
    }

    /**
     *每个节点信息
     *这里的数据两个作用，第一在页面双向绑定，第二修改后同步修改originData的nodeMap的具体的节点
     * @memberof EditorStore
     */
    @observable node = {
        nodeId: '',
        type: '',//节点类型： 0("控制节点"),1("分支节点"),2("规则节点"),3("输出节点"),4("规则集节点"),5("脚本节点"),6("查询节点");
        actionType: '',//操作类型：0新增，1修改，2删除
        assemblyId: '',//前端UI节点ID
        assemblyParentId: '',//前端UI父节点ID
        init() {
            this.nodeId = '';
            this.type = '';
            this.actionType = '';
            this.assemblyId = '';
            this.assemblyParentId = '';
        },
        get getNodeId() { return toJS(this.nodeId) },//暂且无用
        get getType() { return toJS(this.type) },//暂且无用
        get getActionType() { return toJS(this.actionType) },//暂且无用
        get getAssemblyId() { return toJS(this.assemblyId) },//暂且无用
        get getAssemblyParentId() { return toJS(this.assemblyParentId) },//暂且无用
        setNodeId(value) {//暂且无用
            this.nodeId = value;
        },
        setType(value) {//暂且无用
            this.type = value;
        },
        setActionType(value) {//暂且无用
            this.actionType = value;
        },
        setAssemblyId(value) {//暂且无用
            this.assemblyId = value;
        },
        setAssemblyParentId(value) {//暂且无用
            this.assemblyParentId = value;
        }
    }

    /**
     *条件控制节点VO的conditionNodeVO字段对象
     *
     * @memberof EditorStore
     */
    @observable conditionNodeVO = {
        elseId: '',
        hitId: '',
        id: '',
        parentId: '',
        name: '',
        ruleId: '',//回传字段
        strategyId: '',//回传字段
        conditionVO: conditionVODemo,
        script: '',
        init() {
            this.elseId = '';
            this.hitId = '';
            this.id = '';
            this.parentId = '';
            this.name = '';
            this.ruleId = '';
            this.strategyId = '';
            this.conditionVO = conditionVODemo;
            this.script = ''
        },
        get getElseId() { return toJS(this.elseId) },
        get getHitId() { return toJS(this.hitId) },
        get getId() { return toJS(this.id) },
        get getParentId() { return toJS(this.parentId) },
        get getName() { return toJS(this.name) },
        get getRuleId() { return toJS(this.ruleId) },
        get getStrategyId() { return toJS(this.strategyId) },
        get getConditionVO() { return toJS(this.conditionVO) },
        get getScript() { return toJS(this.script) },
        setElseId(value) { this.elseId = value },
        setHitId(value) { this.hitId = value },
        setId(value) { this.id = value },
        setParentId(value) { this.parentId = value },
        setName(value) { this.name = value; },
        setRueId(value) { this.ruleId = value },
        setStrategyId(value) { this.strategyId = value },
        setConditionVO(value) { this.conditionVO = value },
        setScript(value) { this.script = value }
    }

    /**
     *返回conditionNodeVO的json对象
     *
     * @returns object
     * @memberof EditorStore
     */
    getConditionNodeVO() {
        let result = {
            elseId: this.conditionNodeVO.getElseId,
            hitId: this.conditionNodeVO.getHitId,
            id: this.conditionNodeVO.getId,
            parentId: this.conditionNodeVO.getParentId,
            name: this.conditionNodeVO.getName,
            ruleId: this.conditionNodeVO.getRuleId,//回传字段
            strategyId: this.conditionNodeVO.getStrategyId,//回传字段
            conditionVO: this.conditionNodeVO.getConditionVO
        }
        if (common.isEmpty(this.conditionNodeVO.getId)) {
            delete result.id
        }
        return result
    }

    /**
     *规则节点VO的ruleNodeVO字段对象
     *
     * @memberof EditorStore
     */
    @observable ruleNodeVO = {
        id: '',
        name: '',
        ruleExeId: '',
        description: '',
        category: '',
        ruleCode: '',
        ruleList: [],//根据规则类别获取的规则列表，此字段只用于做下拉初始化，不做保存
        ruleListOriginData: [],
        versionList: [],
        init() {
            this.id = '';
            this.name = '';
            this.ruleExeId = '';
            this.description = '';
            this.category = '';
            this.ruleCode = '';
            this.versionList = [];
        },
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        get getRuleExeId() { return toJS(this.ruleExeId) },
        get getDescription() { return toJS(this.description) },
        get getCategory() { return toJS(this.category) },
        get getRuleCode() { return toJS(this.ruleCode) },
        get getRuleList() { return toJS(this.ruleList) },
        get getVersionList() { return toJS(this.versionList) },
        setId(value) { this.id = value },
        setName(value) { this.name = value },
        setRuleExeId(value) { this.ruleExeId = value },
        setDescription(value) { this.description = value },
        setCategory(value) { this.category = value; console.log("call laoye", value); },
        setRuleCode(value) { this.ruleCode = value },
        setRuleList(value) { this.ruleList = value },
        setVersionList(value) { this.versionList = value }
    }
    getRuleNodeVO() {
        let result = {
            id: this.ruleNodeVO.getId,
            name: this.ruleNodeVO.getName,
            ruleExeId: this.ruleNodeVO.getName,
            description: this.ruleNodeVO.getDescription,
            category: this.ruleNodeVO.getCategory,
            ruleCode: this.ruleNodeVO.getRuleCode,
        }
        if (common.isEmpty(this.ruleNodeVO.getId)) {
            delete result.id
        }
        return result
    }

    /**
     *规则集节点VO的ruleSetNodeVO字段对象
     *
     * @memberof EditorStore
     */
    @observable ruleSetNodeVO = {
        id: '',
        name: '',
        ruleSetId: '',
        description: '',
        category: '',
        ruleSetCode: '',
        ruleList: [],
        sqlCode: '',
        typeName: '',
        ruleSetName: '',
        ruleSetList: [],//根据规则类别获取的规则列表，此字段只用于做下拉初始化，不做保存
        ruleSetListOriginData: [],
        versionList: [],
        init() {
            this.id = '';
            this.name = '';
            this.ruleSetId = '';
            this.description = '';
            this.category = '';
            this.ruleSetCode = '';
            this.ruleList = [];
            this.sqlCode = '';
            this.typeName = '';
            this.ruleSetName = '';
            this.versionList = [];
        },
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        get getRuleSetId() { return toJS(this.ruleSetId) },
        get getDescription() { return toJS(this.description) },
        get getCategory() { return toJS(this.category) },
        get getRuleSetCode() { return toJS(this.ruleSetCode) },
        get getRuleList() { return toJS(this.ruleList) },
        get getRuleSetList() { return toJS(this.ruleSetList) },
        get getSqlCode() { return toJS(this.sqlCode) },
        get getRuleSetListOriginData() { return toJS(this.ruleSetListOriginData) },
        get getTypeName() { return toJS(this.typeName) },
        get getRuleSetName() { return toJS(this.ruleSetName) },
        get getVersionList() { return toJS(this.versionList) },
        setId(value) { this.id = value },
        setName(value) { this.name = value },
        setRuleSetId(value) { this.ruleSetId = value },
        setDescription(value) { this.description = value },
        setCategory(value) { this.category = value; },
        setRuleSetCode(value) { this.ruleSetCode = value },
        setRuleList(value) { this.ruleList = value },
        setRuleSetList(value) { this.ruleSetList = value },
        setSqlCode(value) { this.sqlCode = value },
        setRuleSetListOriginData(value) { this.ruleSetListOriginData = value },
        setTypeName(value) { this.typeName = value },
        setRuleSetName(value) { this.ruleSetName = value },
        setVersionList(value) { this.versionList = value }
    }
    getRuleSetNodeVO() {
        let result = {
            id: this.ruleSetNodeVO.getId,
            name: this.ruleSetNodeVO.getName,
            ruleSetId: this.ruleSetNodeVO.getRuleSetId,
            description: this.ruleSetNodeVO.getDescription,
            category: this.ruleSetNodeVO.getCategory,
            ruleSetCode: this.ruleSetNodeVO.getRuleSetCode,
            ruleList: this.ruleSetNodeVO.getRuleList,
            sqlCode: this.ruleSetNodeVO.getSqlCode,
            typeName: this.ruleSetNodeVO.getTypeName,
            ruleSetName: this.ruleSetNodeVO.getRuleSetName,
        }
        if (common.isEmpty(this.ruleSetNodeVO.getId)) {
            delete result.id
        }
        return result
    }

    /**
     *输出节点VO的outPutNodeVO字段对象
     *
     * @memberof EditorStore
     */
    @observable outPutNodeVO = {
        id: '',
        name: '',
        parameters: [
            // {
            //     "id": "ff8080816a9a57cb016a9aa90d660000",
            //     "tenantId": "1540255306638",
            //     "name": "InitJ_1",
            //     "code": "InitJ_1",
            //     "type": -5,
            //     "defaultValue": "0",
            //     "quoteSum": 0,
            //     "typeLabel": "长整型"
            // }
        ],
        outPutId: '',//回传
        score: '',//回传
        eventSourceId: '',//回传
        strategyCode: '',//回传
        parametersList: [],//只用于下拉初始化和比较，不保存
        parametersKey: [],//只用于下拉初始化和比较，不保存
        init() {
            this.id = ''; this.name = ''; this.parameters = []; this.outPutId = ''; this.score = '';
        },
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        get getParameters() { return toJS(this.parameters) },
        get getOutOutId() { return toJS(this.outPutId) },
        get getScore() { return toJS(this.score) },
        get getEventSourceId() { return toJS(this.eventSourceId) },
        get getStrategyCode() { return toJS(this.strategyCode) },
        get getParametersKey() { return toJS(this.parametersKey) },
        get getParametersList() { return toJS(this.parametersList) },
        setId(value) { this.id = value },
        setName(value) { this.name = value },
        setParameters(value) { this.parameters = value },
        setOutPutId(value) { this.outPutId = value },
        setScore(value) { this.score = value },
        setEventSourceId(value) { this.eventSourceId = value },
        setStrategyCode(value) { this.strategyCode = value },
        setParametersKey(value) { this.parametersKey = value },
        setParametersList(value) { this.parametersList = value }
    }

    getOutputNodeVO() {
        let result = {
            id: this.outPutNodeVO.getId,
            name: this.outPutNodeVO.getName,
            parameters: this.outPutNodeVO.getParameters,
            outPutId: this.outPutNodeVO.getOutOutId,
            score: this.outPutNodeVO.getScore,
            eventSourceId: this.outPutNodeVO.getEventSourceId,
            strategyCode: this.outPutNodeVO.getStrategyCode,
        }
        if (common.isEmpty(this.outPutNodeVO.getId)) {
            delete result.id
        }
        if (common.isEmpty(this.outPutNodeVO.getScore)) {
            delete result.score
        }
        if (common.isEmpty(this.outPutNodeVO.getOutOutId)) {
            delete result.outPutId
        }
        return result
    }

    /**
     *脚本节点VO的scriptNodeVO字段对象
     *
     * @memberof EditorStore
     */
    @observable scriptNodeVO = {
        id: '',
        name: '',
        sqlCode: '',
        scriptId: '',//回传
        init() {
            this.id = ''; this.name = ''; this.sqlCode = ''; this.scriptId = '';
        },
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        get getSqlCode() { return toJS(this.sqlCode) },
        get getScriptId() { return toJS(this.scriptId) },
        setId(value) { this.id = value },
        setName(value) { this.name = value },
        setSqlCode(value) { this.sqlCode = value },
        setScriptId(value) { this.scriptId = value }
    }

    getScriptNodeVO() {
        let result = {
            id: this.scriptNodeVO.getId,
            name: this.scriptNodeVO.getName,
            sqlCode: this.scriptNodeVO.getSqlCode,
            scriptId: this.scriptNodeVO.getScriptId
        }
        if (common.isEmpty(this.scriptNodeVO.getId)) {
            delete result.id
        }
        return result
    }

    /**
     *脚本节点VO的scriptNodeVO字段对象
     *
     * @memberof EditorStore
     */
    @observable branchNodeVO = {
        id: '',
        name: '',
        branchId: '',
        branchMap: {},
        sort: [],
        tempConditionVO: conditionVODemo,//临时做中间件，不传到gateway
        tempFromId: '',
        tempToId: '',
        dataSource: [],
        singleExpression: '',
        init() {
            this.id = ''; this.name = ''; this.branchId = ''; this.branchMap = {}; this.tempConditionVO = conditionVODemo; this.tempFromId = ''; this.tempToId = ''; this.singleExpression = ''; this.sort = [];
        },
        initTempConditionVO() { this.tempConditionVO = conditionVODemo },
        get getId() { return toJS(this.id) },
        get getName() { return toJS(this.name) },
        get getBranchId() { return toJS(this.branchId) },
        get getBranchMap() { return toJS(this.branchMap) },
        get getTempConditionVO() { return toJS(this.tempConditionVO) },
        get getTempFromId() { return toJS(this.tempFromId) },
        get getTempToId() { return toJS(this.tempToId) },
        get getDataSource() { return toJS(this.dataSource) },
        get getSingleExpression() { return toJS(this.singleExpression) },
        get getSort() { return toJS(this.sort) },
        setId(value) { this.id = value },
        setName(value) { this.name = value },
        setBranchId(value) { this.branchId = value },
        setBranchMap(value) { this.branchMap = value },
        setTempConditionVO(value) { this.tempConditionVO = value },
        setTempFromId(value) { this.tempFromId = value },
        setTempToId(value) { this.tempToId = value },
        setDataSource(value) { this.dataSource = value },
        setSingleExpression(value) { this.singleExpression = value },
        setSort(value) { this.sort = value }
    }

    getBranchNodeVO() {
        let result = {
            id: this.branchNodeVO.getId,
            name: this.branchNodeVO.getName,
            branchId: this.branchNodeVO.getBranchId,
            branchMap: this.branchNodeVO.getBranchMap,
            sort: this.branchNodeVO.getSort,
            dataSource: this.branchNodeVO.getDataSource
        }
        if (common.isEmpty(this.branchNodeVO.getId)) {
            delete result.id
        }
        if (common.isEmpty(this.branchNodeVO.getBranchId)) {
            delete result.branchId
        }
        return result
    }
    /**
     *检查当前画布节点是否存在后端返回的数据模板中，不存在就添加进去map里面
     *
     * @memberof EditorStore
     */
    checkNode(uiDataNode) {
        if (uiDataNode.name === 'start' || uiDataNode.name === 'linker') return
        for (const key in this.delNodeMapForNeverSave) {
            if (this.delNodeMapForNeverSave.hasOwnProperty(key)) {
                const element = this.delNodeMapForNeverSave[key];
                if (this.originData.nodeMap[key]) {
                    delete this.originData.nodeMap[key]
                }
            }
        }
        if (!this.originData.nodeMap[uiDataNode.id]) {//在react数据模板不存在
            var uiData = JSON.parse(localStorage.def_local_1);
            if (uiData.elements[uiDataNode.id]) {//并且在processOn数据模板已存在  此时是已存在的节点，调接口获取节点详情
                this.getNodeForApi(uiDataNode);
            } else {//本地processon的模板没有，并且在delNodeMapForNeverSave也没有，则新增一条数据到nodeMap
                if (!this.delNodeMapForNeverSave[uiDataNode.id]) {
                    this.addOneProcessonNode(uiDataNode);
                }
            }
        } else if (this.originData.nodeMap[uiDataNode.id].actionType !== 2) {//在react数据模板存在
            switch (uiDataNode.name) {//解决有属性面板属性缓存问题
                case 'control':
                    if (publicUtils.verifyConditionTree(this.getConditionNodeVO().conditionVO, false))
                        this.getSqlCodeByCondition(this.getConditionNodeVO().conditionVO);
                    break;
                case 'rule':
                    this.ruleNodeVO.setName(this.originData.nodeMap[uiDataNode.id].ruleNodeVO.name);
                    this.ruleNodeVO.setCategory(this.originData.nodeMap[uiDataNode.id].ruleNodeVO.category);
                    this.ruleNodeVO.setRuleCode(this.originData.nodeMap[uiDataNode.id].ruleNodeVO.ruleCode);
                    this.ruleNodeVO.setRuleExeId(this.originData.nodeMap[uiDataNode.id].ruleNodeVO.ruleExeId);
                    this.ruleNodeVO.setDescription(this.originData.nodeMap[uiDataNode.id].ruleNodeVO.description);
                    this.getRuleListByC_E_DForApi(this.originData.nodeMap[uiDataNode.id].ruleNodeVO.category);
                    break;
                case 'ruleSet':
                    this.ruleSetNodeVO.setName(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.name);
                    this.ruleSetNodeVO.setCategory(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.category);
                    this.ruleSetNodeVO.setRuleSetCode(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.ruleSetCode);
                    this.ruleSetNodeVO.setRuleSetId(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.ruleSetId);
                    this.ruleSetNodeVO.setDescription(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.description);
                    // this.ruleSetNodeVO.setRuleList(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.ruleList);
                    this.getRuleSetListByC_E_DForApi(this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO.category);
                    break;
                case 'output':
                    this.outPutNodeVO.setName(this.originData.nodeMap[uiDataNode.id].outPutNodeVO.name);
                    this.outPutNodeVO.setParameters(this.originData.nodeMap[uiDataNode.id].outPutNodeVO.parameters);
                    break;
                case 'sql':
                    this.scriptNodeVO.setName(this.originData.nodeMap[uiDataNode.id].scriptNodeVO.name);
                    this.scriptNodeVO.setSqlCode(this.originData.nodeMap[uiDataNode.id].scriptNodeVO.sqlCode);
                    this.scriptNodeVO.setScriptId(this.originData.nodeMap[uiDataNode.id].scriptNodeVO.scriptId);
                    break;
                case 'branch':
                    this.branchNodeVO.setName(this.originData.nodeMap[uiDataNode.id].branchNodeVO.name);
                    this.branchNodeVO.setDataSource(this.originData.nodeMap[uiDataNode.id].branchNodeVO.dataSource);
                    this.getBranchNodeExpressionForApi(this.originData.nodeMap[uiDataNode.id].branchNodeVO.branchMap);
                    if (this.commonUI_data.getId !== this.branchNodeVO.getAssemblyId && this.commonUI_data.getType === 'branchLinker') {//点击分支节点下面的连线
                        let uiData = JSON.parse(localStorage.def_local_1_bk);//本地的数据

                        try {
                            let node = this.originData.nodeMap[uiData.elements[this.commonUI_data.getId].from.id];
                            if (node) {
                                let dataSource = node.branchNodeVO.dataSource;
                                dataSource.forEach(element => {
                                    if (element.key === uiData.elements[this.commonUI_data.getId].to.id) {
                                        this.branchNodeVO.setSingleExpression(element.expression);
                                    }
                                })
                            }
                        } catch (error) {
                            window.throwError(error);
                            this.setLock(false);
                            // 此处无需处理异常
                            return
                        }

                    }
                    break;
                default:
                    break;
            }
        }
    }

    addOneProcessonNode(uiDataNode) {
        let node = {
            actionType: 0,
            nodeId: '',
            assemblyId: uiDataNode.id,
            assemblyParentId: uiDataNode.from && uiDataNode.from.id && uiDataNode.from.id !== 'start' ? uiDataNode.from.id : ''
        }
        let nodeType = '';//
        switch (uiDataNode.name) {
            case 'control':
                nodeType = 0;
                node.conditionNodeVO = {
                    elseId: '',
                    hitId: '',
                    name: uiDataNode.title,
                    conditionVO: conditionVODemo
                }
                break;
            case 'rule':
                nodeType = 2;
                node.ruleNodeVO = {
                    name: uiDataNode.title,
                    ruleExeId: '',
                    description: '',
                    category: '',
                    ruleCode: '',
                }
                this.ruleNodeVO.init();
                this.ruleNodeVO.setName(uiDataNode.title);
                break;
            case 'ruleSet':
                nodeType = 4;
                node.ruleSetNodeVO = {
                    name: uiDataNode.title,
                    ruleSetId: '',
                    category: '',
                }
                this.ruleSetNodeVO.init();
                this.ruleSetNodeVO.setName(uiDataNode.title);
                break;
            case 'output':
                nodeType = 3;
                node.outPutNodeVO = {
                    name: uiDataNode.title,
                    parameters: [],
                }
                this.outPutNodeVO.setName(uiDataNode.title);
                break;
            case 'sql':
                nodeType = 5;
                node.scriptNodeVO = {
                    name: uiDataNode.title,
                    sqlCode: '',
                    scriptId: ''
                }
                this.scriptNodeVO.setName(uiDataNode.title);
                break;
            case 'branch':
                nodeType = 1;
                node.branchNodeVO = {
                    name: uiDataNode.title,
                    // branchId: '',
                    branchMap: {},
                    sort: [],
                    dataSource: []
                }
                this.branchNodeVO.setName(uiDataNode.title);
                break;
            default:
                break;
        }
        node.type = nodeType;
        this.originData.nodeMap[uiDataNode.id] = node;

        console.log("addOneProcessonNode 最新的orignData.nodeMap", this.originData.nodeMap)
    }

    removeNode(ids) {
        // console.log("ids", ids)
        // console.log("this.originData", this.originData)
        this.setLock(true);
        let nodeMap = this.originData.nodeMap;
        for (let i = 0; i < ids.length; i++) {
            const element = ids[i];

            //删除操作之前，优先此操作：如果删除的是分支节点的下游节点，则删除分支节点的对应的条件map的key start
            let uiData = JSON.parse(localStorage.def_local_1_bk);//本地的数据
            console.log("ids", ids)
            console.log("uiData", uiData)
            for (const key in uiData.elements) {
                if (uiData.elements.hasOwnProperty(key)) {
                    const element2 = uiData.elements[key];
                    if (element2.name === 'linker' && element2.to.id === element) {
                        if (uiData.elements[element2.from.id] && uiData.elements[element2.from.id].name === 'branch') {
                            // delete this.originData.nodeMap[uiData.elements[element2.from.id].id].branchNodeVO.branchMap[element]
                            let branchNode = uiData.elements[element2.from.id];
                            if (!this.originData.nodeMap[branchNode.id]) {//分支节点不在react模板，需要调接口获取
                                this.syncTask.delBranchMap.active = true;
                                this.syncTask.delBranchMap.branchNode = uiData.elements[element2.from.id];
                                this.syncTask.delBranchMap.linkerId = element2.id;
                                this.syncTask.delBranchMap.nextNodeId = element;
                                this.getNodeForApi(uiData.elements[element2.from.id]);
                            } else {
                                this.delForBranchMap[element2.id] = {
                                    conditionVO: this.originData.nodeMap[branchNode.id].branchNodeVO.branchMap[element],
                                    nextNodeId: element
                                }
                            }
                        }
                    }
                }
            }
            //end

            if (!common.isEmpty(nodeMap[element])) {
                if (nodeMap[element].actionType == 0) {//本来新增的，不保存在删除操作的数据中，直接删除数据(同时记录在delNodeMapForNeverSave中，解决了画布删除后有个点击推进以免再checkNode)
                    this.delNodeMapForNeverSave[element] = common.deepClone(nodeMap[element]);
                    delete this.originData.nodeMap[element];
                } else {
                    this.originData.nodeMap[element] = {
                        actionType: 2,
                        assemblyId: element
                    }
                }
            } else {//react数据模板为空，标识此节点未调接口获取详情
                this.originData.nodeMap[element] = {
                    actionType: 2,
                    assemblyId: element
                }
            }
        }

        this.setLock(false);
    }

    getDetailForApi2(data) {
        console.log("data",data)
        data.nodeMap = {};
        if(common.isEmpty(data.processon))return
        data.processon = JSON.parse(data.processon);
        this.originData = data;
        this.baseInfo.setProcesson(data.processon);
        this.baseInfo.setProcessonId(data.processonId);
        this.baseInfo.setId(data.id);
        this.baseInfo.setType(data.type);
        this.baseInfo.setName(data.name);
        this.baseInfo.setCode(data.code);
        this.baseInfo.setEventSourceId(data.eventSourceId);
        sessionStorage.tempEventSourceId = data.eventSourceId;
        this.baseInfo.setEventSourceName(data.eventSourceName);
        this.baseInfo.setDimensionId(data.dimensionId);
        sessionStorage.tempDimensionId = data.dimensionId;
        this.baseInfo.setDimensionName(data.dimensionName);
        this.baseInfo.setCategory(data.category);
        this.baseInfo.setCategoryName(data.categoryName);
        this.baseInfo.setDescription(data.description);
        this.updateIframeData({ code: 0, value: data.processon });
    }


    getDetailForApi(id) {
        strategyService.getStrategyById(id).then(this.getDetailForApiCallBack)
    }

    @action.bound getDetailForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        console.log("data",data);
        data.nodeMap = {};
        data.processon = JSON.parse(data.processon);
        this.originData = data;
        this.baseInfo.setProcesson(data.processon);
        this.baseInfo.setProcessonId(data.processonId);
        this.baseInfo.setId(data.id);
        this.baseInfo.setType(data.type);
        this.baseInfo.setName(data.name);
        this.baseInfo.setCode(data.code);
        this.baseInfo.setEventSourceId(data.eventSourceId);
        sessionStorage.tempEventSourceId = data.eventSourceId;
        this.baseInfo.setEventSourceName(data.eventSourceName);
        this.baseInfo.setDimensionId(data.dimensionId);
        sessionStorage.tempDimensionId = data.dimensionId;
        this.baseInfo.setDimensionName(data.dimensionName);
        this.baseInfo.setCategory(data.category);
        this.baseInfo.setCategoryName(data.categoryName);
        this.baseInfo.setDescription(data.description);
        this.updateIframeData({ code: 0, value: data.processon });
    }

    getDetailByTemplateId(id) {
        commonService.getTemplateDetails(id).then(this.getDetailForApiCallBack2);
    }
    @action.bound getDetailForApiCallBack2(res) {
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        data.processon = JSON.parse(data.processon);
        this.originData = data;
        this.baseInfo.setProcesson(data.processon);
        this.baseInfo.setProcessonId(data.processonId);
        this.baseInfo.setId(data.id);
        this.baseInfo.setType(data.type);
        this.baseInfo.setName("");
        this.baseInfo.setCode("");
        this.baseInfo.setEventSourceId(data.eventSourceId);
        sessionStorage.tempEventSourceId = data.eventSourceId;
        this.baseInfo.setEventSourceName(data.eventSourceName);
        this.baseInfo.setDimensionId(data.dimensionId);
        sessionStorage.tempDimensionId = data.dimensionId;
        this.baseInfo.setDimensionName(data.dimensionName);
        this.baseInfo.setCategory(data.category);
        this.baseInfo.setCategoryName(data.categoryName);
        this.baseInfo.setDescription(data.description);
        this.updateIframeData({ code: 0, value: data.processon });
    }

    getNodeForApi(uiDataNode) {
        if (common.isEmpty(uiDataNode)) return
        if (common.isEmpty(this.originData.id) || common.isEmpty(uiDataNode.id)) return
        console.log(" 获取单个节点详情 ");
        console.log("uiDataNode, this.originData", uiDataNode, this.originData)
        strategyService.getFlowNodeDetail(uiDataNode.id, this.originData.id).then((res) => {
            this.getNodeForApiCallBack(res, uiDataNode);
        }).catch(() => {
        })
    }
    @action.bound getNodeForApiCallBack(res, uiDataNode) {
        console.log("res, uiDataNoderes, uiDataNode",res, uiDataNode)
        // if (!publicUtils.isOk(res)) return
        if (res.data.resultCode !== 1000) return
        let node = res.data.result;

        //start
        let uiData = JSON.parse(localStorage.def_local_1).elements;
        console.log("uiData", uiData);
        console.log("uiDataNode", uiDataNode);

        let fromNode = {};
        for (const key in uiData) {
            if (uiData.hasOwnProperty(key)) {
                const element = uiData[key];
                if (element.name == 'linker') {
                    if (element.to.id == uiDataNode.id) {
                        fromNode = uiData[element.from.id];
                    }
                }
            }
        }
        console.log("fromNode", fromNode);
        node.actionType = 1;
        node.assemblyParentId = fromNode.id && fromNode.id === 'start' ? '' : fromNode.id;

        this.originData.nodeMap[uiDataNode.id] = node;

        //判断当前的获取接口详情的节点类型，做相应的回调操作
        switch (uiDataNode.name) {
            case 'control':
                let conditionNodeVO = res.data.result.conditionNodeVO;
                this.conditionNodeVO.setId(conditionNodeVO.id);
                this.conditionNodeVO.setName(conditionNodeVO.name);
                if (!common.isEmpty(conditionNodeVO.hitId)) {
                    this.conditionNodeVO.setHitId(conditionNodeVO.hitId);
                }
                if (!common.isEmpty(conditionNodeVO.elseId)) {
                    this.conditionNodeVO.setElseId(conditionNodeVO.elseId);
                }
                if (!common.isEmpty(conditionNodeVO.strategyId)) {
                    this.conditionNodeVO.getStrategyId(conditionNodeVO.strategyId);
                }
                if (!common.isEmpty(conditionNodeVO.ruleId)) {
                    this.conditionNodeVO.setRueId(conditionNodeVO.ruleId);
                }
                if (!common.isEmpty(conditionNodeVO.conditionVO)) {
                    this.conditionNodeVO.setConditionVO(conditionNodeVO.conditionVO);
                } else {
                    this.conditionNodeVO.setConditionVO(conditionVODemo);
                }
                this.getSqlCodeByCondition(this.getConditionNodeVO().conditionVO);
                break;
            case 'rule':
                let ruleNodeVO = res.data.result.ruleNodeVO;
                this.ruleNodeVO.setId(ruleNodeVO.id);
                this.ruleNodeVO.setCategory(ruleNodeVO.category);
                this.ruleNodeVO.setDescription(ruleNodeVO.description);
                this.ruleNodeVO.setName(ruleNodeVO.name);
                this.ruleNodeVO.setRuleCode(ruleNodeVO.ruleCode);
                this.ruleNodeVO.setRuleExeId(ruleNodeVO.ruleExeId);
                this.getRuleListByC_E_DForApi(ruleNodeVO.category);
                break;
            case 'ruleSet':
                let ruleSetNodeVO = res.data.result.ruleSetNodeVO;
                this.ruleSetNodeVO.setId(ruleSetNodeVO.id);
                this.ruleSetNodeVO.setName(ruleSetNodeVO.name);
                this.ruleSetNodeVO.setCategory(ruleSetNodeVO.category);
                this.ruleSetNodeVO.setRuleSetId(ruleSetNodeVO.ruleSetId);
                this.ruleSetNodeVO.setDescription(ruleSetNodeVO.ruleSetVO.description);
                this.ruleSetNodeVO.setRuleSetCode(ruleSetNodeVO.ruleSetVO.code);
                this.ruleSetNodeVO.setSqlCode(ruleSetNodeVO.ruleSetVO.sqlCode);
                this.ruleSetNodeVO.setTypeName(ruleSetNodeVO.ruleSetVO.typeName);
                this.ruleSetNodeVO.setRuleSetName(ruleSetNodeVO.ruleSetVO.name);
                let ruleList = [];
                if (common.isArray(ruleSetNodeVO.ruleSetVO.rules)) {
                    ruleSetNodeVO.ruleSetVO.rules.forEach(element => {
                        ruleList.push({
                            key: Math.random(),
                            name: element.name,
                            code: element.code,
                            version: element.version,
                            description: element.description ? element.description : '暂无'
                        })
                    })

                }
                this.ruleSetNodeVO.setRuleList(ruleList);
                this.originData.nodeMap[uiDataNode.id].ruleSetNodeVO = this.getRuleSetNodeVO();
                this.getRuleSetListByC_E_DForApi(ruleSetNodeVO.category);
                break;
            case 'output':
                let outPutNodeVO = res.data.result.outPutNodeVO;
                this.outPutNodeVO.setId(outPutNodeVO.id);
                this.outPutNodeVO.setOutPutId(outPutNodeVO.outPutId);
                this.outPutNodeVO.setScore(outPutNodeVO.score);
                this.outPutNodeVO.setName(outPutNodeVO.name);
                this.outPutNodeVO.setParameters(outPutNodeVO.parameters);
                break;
            case 'sql':
                let scriptNodeVO = res.data.result.scriptNodeVO;
                this.scriptNodeVO.setId(scriptNodeVO.id);
                this.scriptNodeVO.setName(scriptNodeVO.name);
                this.scriptNodeVO.setSqlCode(scriptNodeVO.sqlCode);
                this.scriptNodeVO.setScriptId(scriptNodeVO.scriptId);
                break;
            case 'branch':
                let branchNodeVO = res.data.result.branchNodeVO;
                this.branchNodeVO.setId(branchNodeVO.id);
                this.branchNodeVO.setName(branchNodeVO.name);
                this.branchNodeVO.setBranchId(branchNodeVO.branchId);
                this.branchNodeVO.setBranchMap(branchNodeVO.branchMap);
                if (!common.isEmpty(branchNodeVO.sort)) {
                    this.branchNodeVO.setSort(branchNodeVO.sort);
                } else {
                    this.branchNodeVO.setSort([]);
                }
                this.getBranchNodeExpressionForApi(branchNodeVO.branchMap);
                break;
            default:
                break;
        }

        console.log("最新的orignData.nodeMap", this.originData.nodeMap)

        //end

        // 判断是否有同步任务
        if (this.syncTask.hitPath.active) {
            this.setHitPath(this.syncTask.hitPath.linker);
        }
        if (this.syncTask.delBranchMap.active) {//删除分支节点的下游节点回调
            console.warn("delBranchMap")
            let branchNode = this.syncTask.delBranchMap.branchNode;
            let nextNodeId = this.syncTask.delBranchMap.nextNodeId;
            let linkerId = this.syncTask.delBranchMap.linkerId;
            this.delForBranchMap[linkerId] = {//暂存在delForBranchMap作比较，做逻辑删除
                conditionVO: this.originData.nodeMap[branchNode.id].branchNodeVO.branchMap[nextNodeId],
                nextNodeId: nextNodeId
            }
            this.syncTask.delBranchMap.active = false;
        }
        if (this.syncTask.setAssemblyParentId.active) {
            console.warn("setAssemblyParentId")
            this.originData.nodeMap[uiDataNode.id].assemblyParentId = this.syncTask.setAssemblyParentId.assemblyParentId === 'start' ? '' : this.syncTask.setAssemblyParentId.assemblyParentId;
            this.syncTask.setAssemblyParentId.active = false;
        }
        if (this.syncTask.deleteBranchMapNode.active) {
            console.warn("deleteBranchMapNode")
            console.log("this.originData.nodeMap[uiDataNode.id]", this.originData.nodeMap[uiDataNode.id])
            if (this.originData.nodeMap[uiDataNode.id].branchNodeVO.branchMap[this.syncTask.deleteBranchMapNode.branchMapId]) {
                delete this.originData.nodeMap[uiDataNode.id].branchNodeVO.branchMap[this.syncTask.deleteBranchMapNode.branchMapId];
                let sort = this.originData.nodeMap[uiDataNode.id].branchNodeVO.sort;
                if (!common.isEmpty(sort)) {
                    for (let i = 0; i < sort.length; i++) {
                        const element = sort[i];
                        if (element === this.syncTask.deleteBranchMapNode.branchMapId) {
                            this.originData.nodeMap[uiDataNode.id].branchNodeVO.sort.splice(i, 1);
                        }
                    }
                }
            }
        }
    }

    verifyHitPath() {
        let result = true;
        let uiData = JSON.parse(localStorage.def_local_1);
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
        return result;
    }

    setHitPath(linker) {
        this.syncTask.hitPath.active = false;
        let fromId = linker.from.id;
        let toId = linker.to.id;
        let uiData = JSON.parse(localStorage.def_local_1);//本地的数据
        console.log("this.originData.nodeMap", this.originData.nodeMap, linker);
        if (!common.isEmpty(uiData.elements[fromId]) && !common.isEmpty(this.originData.nodeMap[fromId])) {
            if (linker.text === '命中') {
                this.originData.nodeMap[fromId].conditionNodeVO.hitId = toId;//设置相反
                this.originData.nodeMap[fromId].conditionNodeVO.elseId = '';//设置相反
            } else {
                this.originData.nodeMap[fromId].conditionNodeVO.elseId = toId;
                this.originData.nodeMap[fromId].conditionNodeVO.hitId = '';
            }
        }
    }

    getRuleListByC_E_DForApi(category) {
        this.ruleNodeVO.ruleListOriginData = [];
        strategyService.getRuleListByC_E_D(sessionStorage.tempDimensionId, sessionStorage.tempEventSourceId, category).then(this.getRuleListByC_E_DForApiCallBack)
    }
    @action.bound getRuleListByC_E_DForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            this.ruleNodeVO.ruleListOriginData = res.data.result;

            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    versions: element.versions
                })
                if (element.code === this.ruleNodeVO.getRuleCode) {
                    this.ruleNodeVO.setVersionList(element.versions);
                }
            }

        }
        this.ruleNodeVO.setRuleList(tempArray);
    }

    getRuleSetListByC_E_DForApi(category) {
        this.ruleSetNodeVO.ruleSetListOriginData = [];
        strategyService.getRuleSetListByC_E_D(sessionStorage.tempDimensionId, sessionStorage.tempEventSourceId, category).then(this.getRuleSetListByC_E_DForApiCallBack)
    }
    @action.bound getRuleSetListByC_E_DForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        if (!common.isEmpty(res.data.result)) {
            this.ruleSetNodeVO.setRuleSetListOriginData(res.data.result);

            for (let i = 0; i < res.data.result.length; i++) {
                const element = res.data.result[i];
                tempArray.push({
                    code: element.code,
                    value: element.name,
                    versions: element.versions
                })
                if (element.code === this.ruleSetNodeVO.getRuleSetCode) {
                    this.ruleSetNodeVO.setVersionList(element.versions);
                }
            }

        }
        this.ruleSetNodeVO.setRuleSetList(tempArray);
    }

    isAllReady() {
        let data = this.originData;
        console.log("isAllReady data", data);
        //检验基础信息
        if (common.isEmpty(this.baseInfo.getName)) {
            console.log("基础信息-名称 不能为空");
            message.warn("基础信息-名称 不能为空");
            return false
        }
        if (common.isEmpty(this.baseInfo.getCode)) {
            console.log("基础信息-标识 不能为空");
            message.warn("基础信息-标识 不能为空");
            return false
        }
        if (common.isEmpty(data.eventSourceId)) {
            console.log("基础信息-事件源 不能为空");
            message.warn("基础信息-事件源 不能为空");
            return false
        }
        if (common.isEmpty(data.dimensionId)) {
            console.log("基础信息-维度 不能为空");
            message.warn("基础信息-维度 不能为空");
            return false
        }
        if (common.isEmpty(data.category)) {
            console.log("基础信息-类别 不能为空");
            message.warn("基础信息-类别 不能为空");
            return false
        }
        //检验节点
        for (const key in data.nodeMap) {
            if (data.nodeMap.hasOwnProperty(key)) {
                const node = data.nodeMap[key];
                if (node.actionType === 2) continue;//删除的节点跳过校验
                switch (node.type) {
                    case 0://控制节点
                        if (common.isEmpty(node.conditionNodeVO.name)) {
                            console.log("(条件控制节点)" + node.conditionNodeVO.name + "-名称 不能为空");
                            message.warn("(条件控制节点)" + node.conditionNodeVO.name + "-名称 不能为空");
                            return false
                        }
                        if (!publicUtils.verifyConditionTree(node.conditionNodeVO.conditionVO)) {
                            console.log("条件控制节点" + node.conditionNodeVO.name + "-条件 不能为空");
                            message.warn("(条件控制节点)" + node.conditionNodeVO.name + "-条件 不能为空");
                            return false
                        }
                        break;
                    case 1://分支节点
                        let allBranchLinkerId = [];
                        let uiData = JSON.parse(localStorage.def_local_1);//本地的数据
                        for (const key in uiData.elements) {
                            if (uiData.elements.hasOwnProperty(key)) {
                                const element = uiData.elements[key];
                                if (element.name == 'linker' && element.from.id === node.assemblyId) {//找到所有该分支节点下的分支连线linker
                                    allBranchLinkerId.push(element.to.id)
                                }
                            }
                        }

                        console.log("allBranchLinkerId", allBranchLinkerId)
                        for (let i = 0; i < allBranchLinkerId.length; i++) {
                            const element = allBranchLinkerId[i];
                            console.log("node", node)
                            if (node.branchNodeVO.branchMap[element]) {
                                if (!publicUtils.verifyConditionTree(node.branchNodeVO.branchMap[element])) {
                                    console.log("分支节点的分支-条件 不能为空");
                                    message.warn("(分支节点)的 - 分支-条件 不能为空");
                                    return false
                                }
                            } else {
                                let text = uiData.elements[element].text || '未命名';
                                console.log("分支节点的" + text + "分支-条件 不能为空");
                                message.warn("(分支节点)的 - " + text + "分支-条件 不能为空");
                                return false
                            }
                        }
                        break;
                    case 2://规则节点
                        if (common.isEmpty(node.ruleNodeVO.name)) {
                            console.log("(规则节点)" + node.ruleNodeVO.name + "-名称 不能为空");
                            message.warn("(规则节点)" + node.ruleNodeVO.name + "-名称 不能为空");
                            return false
                        }
                        if (common.isEmpty(node.ruleNodeVO.category)) {
                            console.log("(规则节点)" + node.ruleNodeVO.name + "-类别 不能为空");
                            message.warn("(规则节点)" + node.ruleNodeVO.name + "-类别 不能为空");
                            return false
                        }
                        if (common.isEmpty(node.ruleNodeVO.ruleExeId)) {
                            console.log("(规则节点)" + node.ruleNodeVO.name + "-规则 不能为空");
                            message.warn("(规则节点)" + node.ruleNodeVO.name + "-规则 不能为空");
                            return false
                        }
                        break;
                    case 3://输出节点
                        if (common.isEmpty(node.outPutNodeVO.name)) {
                            console.log("(输出节点)" + node.outPutNodeVO.name + "-名称 不能为空");
                            message.warn("(输出节点)" + node.outPutNodeVO.name + "-名称 不能为空");
                            return false
                        }
                        if (common.isEmpty(node.outPutNodeVO.parameters)) {
                            console.log("(输出节点)" + node.outPutNodeVO.name + "-输出结果 不能为空");
                            message.warn("(输出节点)" + node.outPutNodeVO.name + "-输出结果 不能为空");
                            return false
                        }
                        break;
                    case 4://规则集节点
                        if (common.isEmpty(node.ruleSetNodeVO.name)) {
                            console.log("(规则集节点)" + node.ruleSetNodeVO.name + "-名称 不能为空");
                            message.warn("(规则集节点)" + node.ruleSetNodeVO.name + "-名称 不能为空");
                            return false
                        }
                        if (common.isEmpty(node.ruleSetNodeVO.category)) {
                            console.log("(规则集节点)" + node.ruleSetNodeVO.name + "-类别 不能为空");
                            message.warn("(规则集节点)" + node.ruleSetNodeVO.name + "-类别 不能为空");
                            return false
                        }
                        if (common.isEmpty(node.ruleSetNodeVO.ruleSetId)) {
                            console.log("(规则集节点)" + node.ruleSetNodeVO.name + "-规则集 不能为空");
                            message.warn("(规则集节点)" + node.ruleSetNodeVO.name + "-规则集 不能为空");
                            return false
                        }
                        break;

                    case 5://脚本节点
                        if (common.isEmpty(node.scriptNodeVO.name)) {
                            console.log("(脚本节点)" + node.scriptNodeVO.name + "-名称 不能为空");
                            message.warn("(脚本节点)" + node.scriptNodeVO.name + "-名称 不能为空");
                            return false
                        }
                        if (common.isEmpty(node.scriptNodeVO.sqlCode)) {
                            console.log("(脚本节点)" + node.scriptNodeVO.name + "-脚本 不能为空");
                            message.warn("(脚本节点)" + node.scriptNodeVO.name + "-脚本 不能为空");
                            return false
                        }
                        break;

                    case 6://查询节点

                        break;
                    default:
                        break;
                }
            }
        }
        return true
    }

    verifyConnectStatus() {
        let uiData = JSON.parse(localStorage.def_local_1);
        let startNode;
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'start') {
                    startNode = element;
                }
            }
        }
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.name === 'linker' && element.from.id === startNode.id) {
                    this.verifyEndByOutputNode(element);
                }
            }
        }
    }
    verifyEndByOutputNode(linker) {
        let uiData = JSON.parse(localStorage.def_local_1);
        for (const key in uiData.elements) {
            if (uiData.elements.hasOwnProperty(key)) {
                const element = uiData.elements[key];
                if (element.id === linker.to.id) {//找到linker的to节点element
                    let haveLinker = false;
                    let nextLinker;
                    for (const key in uiData.elements) {
                        if (uiData.elements.hasOwnProperty(key)) {
                            const element2 = uiData.elements[key];
                            if (element2.name === 'linker' && element2.from.id === element.id) {//找到element节点的下一条linker element2
                                haveLinker = true;
                                nextLinker = element2;
                            }
                        }
                    }
                    if (haveLinker) {//此节点有下条线
                        if (element.name !== 'output') {//此节点不是输出节点
                            this.verifyEndByOutputNode(nextLinker)
                        }
                    } else {//节点无下条线
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
        let uiData = JSON.parse(localStorage.def_local_1);
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
        if (this.verifyHitPath()
            && this.passEndVerify
            && this.isAllReady()
            && this.verifyNodeAlone()) {
            return true
        } else {
            this.passEndVerify = true;
            return false
        }
    }
    checkBranchIsReady(nodeId, isTips) {
        console.log("nodeId", nodeId);
        console.log("this.originData.nodeMap[nodeId]", this.originData.nodeMap[nodeId])
        if (this.originData.nodeMap[nodeId]) {//本地react数据模板有此数据纪录
            // 判断名字
            if (common.isEmpty(this.originData.nodeMap[nodeId].branchNodeVO.name)) {
                console.log("分支名字为空");
                if (isTips) {
                    message.warn('分支名字为空');
                }
                return false
            }
            // 判断各个分支条件
            for (const key in this.originData.nodeMap[nodeId].branchNodeVO.branchMap) {
                if (this.originData.nodeMap[nodeId].branchNodeVO.branchMap.hasOwnProperty(key)) {
                    const condiionVO = this.originData.nodeMap[nodeId].branchNodeVO.branchMap[key];
                    if (!publicUtils.verifyConditionTree(condiionVO, false)) {
                        console.log("分支条件不完整");
                        if (isTips) {
                            message.warn('分支条件不完整');
                        }
                        return false
                    }
                }
            }
            // 判断分支是否存在
            let uiData = JSON.parse(localStorage.def_local_1);
            for (const key in uiData.elements) {
                if (uiData.elements.hasOwnProperty(key)) {
                    const element = uiData.elements[key];
                    if (element.name === 'linker' && element.from.id === nodeId) {
                        if (!this.originData.nodeMap[nodeId].branchNodeVO.branchMap[element.to.id]) {
                            console.log("分支条件不存在");
                            if (isTips) {
                                message.warn('分支条件不存在');
                            }
                            return false
                        }
                    }
                }
            }

            return true
        } else {
            return false
        }


    }

    getBranchNodeExpressionForApi(branchMap) {
        for (const key in branchMap) {
            if (branchMap.hasOwnProperty(key)) {
                const element = branchMap[key];
                if (!publicUtils.verifyConditionTree(element, false)) return
            }
        }
        strategyService.getBranchNodeExpression(branchMap).then((res) => {
            this.getBranchNodeExpressionForApiCallBack(res, branchMap);
        })
    }
    @action.bound getBranchNodeExpressionForApiCallBack(res, branchMap) {
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        // let nodeVO = this.originData.nodeMap[this.commonUI_data.getId];
        let dataSource = [];
        let branchId = '';
        let sort = this.branchNodeVO.getSort
        let uiData = JSON.parse(localStorage.def_local_1);//本地的数据
        switch (this.commonUI_data.getType) {
            case 'branch':
                sort = this.originData.nodeMap[this.commonUI_data.getId].branchNodeVO.sort
                break;
            case 'branchLinker':
                this.branchNodeVO.setSingleExpression('');//先清理缓存
                let linker = uiData.elements[this.commonUI_data.getId]
                console.log("linker", linker)
                try {
                    let branch = uiData.elements[linker.from.id]
                    sort = this.originData.nodeMap[branch.id].branchNodeVO.sort
                } catch (error) {
                    window.throwError(error);
                    this.setLock(false);
                    // 此处无需处理异常
                    return
                }

                break;
            default:
                break;
        }
        for (const key in branchMap) {
            if (branchMap.hasOwnProperty(key)) {
                const element = branchMap[key];
                let name = ''
                let uiData = JSON.parse(localStorage.def_local_1);//本地的数据
                for (const key2 in uiData.elements) {
                    if (uiData.elements.hasOwnProperty(key2)) {
                        const element2 = uiData.elements[key2];
                        if (element2.name === 'linker' && element2.to.id === key) {
                            name = element2.text;
                            branchId = element2.from.id;
                        }
                    }
                }
                if (common.isEmpty(name)) continue
                dataSource.push({
                    key: key,
                    index: dataSource.length + 1,
                    name: name,
                    expression: data[key].expression,
                })
            }
        }
        let dataSourceNew = [];
        sort.forEach(element => {
            dataSource.forEach(element2 => {
                if (element === element2.key) {
                    dataSourceNew.push(element2);
                }
            })
        })
        console.log("branchId", branchId)
        try {
            this.originData.nodeMap[branchId].branchNodeVO.dataSource = dataSourceNew;
        } catch (error) {
            this.setLock(false);
            window.throwError(error)
            // return
        }
        this.branchNodeVO.setDataSource(dataSourceNew);
        console.log("sort", sort)
        console.log("dataSourceNew", dataSourceNew)
        console.log("dataSource", dataSource)

        if (this.commonUI_data.getId !== this.branchNodeVO.getAssemblyId && this.commonUI_data.getType === 'branchLinker') {//点击分支节点下面的连线
            let uiData = JSON.parse(localStorage.def_local_1);//本地的数据
            let node = this.originData.nodeMap[uiData.elements[this.commonUI_data.getId].from.id];
            if (node) {
                let dataSource = node.branchNodeVO.dataSource;
                dataSource.forEach(element => {
                    if (element.key === uiData.elements[this.commonUI_data.getId].to.id) {
                        this.branchNodeVO.setSingleExpression(element.expression);
                    }
                })
            }
        }
    }
    getSqlCodeByCondition(conditionAll) {//conditionAll全部条件完整才会调用此方法
        strategyService.getSqlCodeByCondition(conditionAll).then(res => {
            if (!publicUtils.isOk(res)) return
            this.conditionNodeVO.setScript(res.data.result);
        });
    }

    reFixAssemblyParentId() {
        let uiData = JSON.parse(localStorage.def_local_1);
        console.log("this.originData.nodeMap", common.deepClone(this.originData.nodeMap))

        for (const key in this.originData.nodeMap) {
            if (this.originData.nodeMap.hasOwnProperty(key)) {
                const nodeId = key;

                for (const key2 in uiData.elements) {
                    if (uiData.elements.hasOwnProperty(key2)) {
                        const element = uiData.elements[key2];
                        console.log(nodeId, element);
                        if (element.name === 'linker' && element.from.id && element.to.id && element.to.id === nodeId) {
                            //找到当前节点的上游linker element（非第一条）
                            //重新设置修正 assemblyParentId
                            if (element.from.id !== 'start') {
                                this.originData.nodeMap[nodeId].assemblyParentId = element.from.id;
                            } else {
                                this.originData.nodeMap[nodeId].assemblyParentId = '';
                            }
                        }
                    }
                }
            }
        }
    }

    reFixHitAndElseId() { //重新设置修正 hitId 和 elseId
        let uiData = JSON.parse(localStorage.def_local_1);

        for (const key in this.originData.nodeMap) {
            if (this.originData.nodeMap.hasOwnProperty(key)) {
                const nodeId = key;

                for (const key2 in uiData.elements) {
                    if (uiData.elements.hasOwnProperty(key2)) {
                        const element = uiData.elements[key2];
                        if (element.name === 'linker' && element.from.id && element.to.id && element.from.id === nodeId) {
                            //找到当前节点的下游linker element（非第一条）

                            if (element.from.id !== 'start') {

                                if (uiData.elements[nodeId].name === 'control') {//uiData.elements[nodeId]  找到条件节点
                                    if (element.text === '命中') {
                                        this.originData.nodeMap[nodeId].conditionNodeVO.hitId = element.to.id;

                                        let init_elseId = false;
                                        for (const key3 in uiData.elements) {
                                            if (uiData.elements.hasOwnProperty(key3)) {
                                                const element3 = uiData.elements[key3];

                                                if (element3.name === 'linker' && element3.from.id && element3.to.id && element3.from.id === nodeId && element.text && element.text === '非命中') {
                                                    init_elseId = true;
                                                }
                                            }
                                        }
                                        if (init_elseId) {
                                            this.originData.nodeMap[nodeId].conditionNodeVO.elseId = '';
                                        }
                                    }
                                    if (element.text === '非命中') {
                                        this.originData.nodeMap[nodeId].conditionNodeVO.elseId = element.to.id;

                                        let init_hitId = false;
                                        for (const key3 in uiData.elements) {
                                            if (uiData.elements.hasOwnProperty(key3)) {
                                                const element3 = uiData.elements[key3];
                                                if (element3.name === 'linker' && element3.from.id && element3.to.id && element3.from.id === nodeId && element.text && element.text === '命中') {
                                                    init_hitId = true;
                                                }
                                            }
                                        }

                                        if (init_hitId) {
                                            this.originData.nodeMap[nodeId].conditionNodeVO.hitId = '';
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export default new EditorStore