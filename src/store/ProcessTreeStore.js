/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-04-01 10:30:51
 * @Description: ** 流程树形组件的Store数据仓库 **
 */
import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';

class ProcessTreeStore {

    constructor() {
        this.init = this.init.bind(this);
        this.addNodeForApi = this.addNodeForApi.bind(this);
        this.deleteNodeForApi = this.deleteNodeForApi.bind(this);
        this.getDataForApi = this.getDataForApi.bind(this);
        this.getDataForApi2 = this.getDataForApi2.bind(this);
    }
    type = '';//勿删，strategy特有的逻辑判断依据 基础信息返回的type
    @observable data = {};
    @observable activeNodeKey = '0';
    @observable editType = 'info';//info || control ||  query || output || assign || ruleSet  || greedy-ruleSet || rule
    @observable saveType = '';//rtq || rule || strategy
    @observable isFinishNode = true;
    @observable saveId = '';
    @observable isEdit = true;
    @observable nodeId = '';
    @observable haveSqlScript = false;
    @observable status = '';
    @observable approvalStatus = '';
    @observable deleteNodeParams = {
        id: '',
        ruleSetId: '',//用户贪婪模式策略的规则集节点的增删
        get getId() { return toJS(this.id) },
        get getRuleSetId() { return toJS(this.ruleSetId) },
        setId(value) { this.id = value },
        setRuleSetId(value) { this.ruleSetId = value }
    }
    @observable addNodeParams = {
        parentId: '',
        activeKey: '',
        name: '',
        get getParentId() { return toJS(this.parentId) },
        get getActiveKey() { return toJS(this.activeKey) },
        get getName() { return toJS(this.name) },
        setParentId(value) { this.parentId = value },
        setActiveKey(value) { this.activeKey = value },
        setName(value) { this.name = value }
    }
    @observable modal = {
        add: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        },
        sub: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        }
    }

    @observable isCanCommit = false;

    editType2 = '';
    @observable _isResource = false;
    @computed get isResource() { return toJS(this._isResource) }
    @action.bound setIsResource(value) { this._isResource = value; }
    @computed get getStatus() { return toJS(this.status); }
    @action setStatus(value) { this.status = value; }
    @computed get getIsCanCommit() { return toJS(this.isCanCommit); }
    @action setApprovalStatus(value) { this.approvalStatus = value; }
    @computed get getApprovalStatus() { return toJS(this.approvalStatus); }
    @action setIsCanCommit(value) { this.isCanCommit = value; }
    @computed get getHaveSqlScript() { return toJS(this.haveSqlScript) }
    @action setHaveSqlScript(value) { this.haveSqlScript = value }
    @computed get getNodeId() { return toJS(this.nodeId) }
    @action setNodeId(value) { this.nodeId = value }
    @computed get getIsEdit() { return toJS(this.isEdit) }
    @action setIsEdit(value) { this.isEdit = value }
    @computed get getSaveId() { return toJS(this.saveId) }
    @action setSaveId(value) { this.saveId = value }
    @computed get getIsFinishNode() { return toJS(this.isFinishNode) }
    @action setIsFinishNode(value) { this.isFinishNode = value }
    @computed get getSaveType() { return toJS(this.saveType) }
    @action setSaveType(value) { this.saveType = value }
    @computed get getEditType() { return toJS(this.editType) }
    @action setEditType(value) { this.editType = value }
    @computed get getData() { return toJS(this.data) }
    @action setData(value) { this.data = value }
    @computed get getActiveNodeKey() { return toJS(this.activeNodeKey) }
    @action setActiveNodeKey(value) { this.activeNodeKey = value }

    @action.bound addNode(name, type, secondType, nodeKey) {
        nodeKey = String(nodeKey);
        let keyArray;
        nodeKey === '0' ? keyArray = '0' :
            keyArray = nodeKey.split('-');
        let elememnt = {
            name: name,
            type: type,
            secondType: secondType
        }
        let data = this.getData;
        switch (keyArray.length) {
            case 1:
                data.push(elememnt);
                break;
            case 2:
                if (data[keyArray[1]].nodes) {
                    data[keyArray[1]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes = [];
                    data[keyArray[1]].nodes.push(elememnt);
                }
                break;
            case 3:
                if (data[keyArray[1]].nodes[keyArray[2]].nodes) {
                    data[keyArray[1]].nodes[keyArray[2]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes[keyArray[2]].nodes = [];
                    data[keyArray[1]].nodes[keyArray[2]].nodes.push(elememnt);
                }
                break;
            case 4:
                if (data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes) {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes = [];
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes.push(elememnt);
                }
                break;
            case 5:
                if (data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes) {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes = [];
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes.push(elememnt);
                }
                break;
            case 6:
                if (data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes) {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes = [];
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes.push(elememnt);
                }
                break;
            case 7:
                if (data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes) {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes = [];
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes.push(elememnt);
                }
                break;
            case 8:
                if (data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes) {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes.push(elememnt);
                } else {
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes = [];
                    data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes.push(elememnt);
                }
                break;
            default:
                break;
        }
        this.setData(data);
    }
    @action.bound subNode(nodeKey) {
        nodeKey = String(nodeKey);
        var keyArray;
        nodeKey === '0' ? keyArray = '0' :
            keyArray = nodeKey.split('-');
        var tempArray = [];
        var newTempArray = [];
        let data = getData;
        switch (keyArray.length) {
            case 1:

                break;
            case 2:
                tempArray = data;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[1]) continue;
                    newTempArray.push(element);
                }
                data = newTempArray;
                break;
            case 3:
                tempArray = data[keyArray[1]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[2]) continue;
                    newTempArray.push(element);
                }
                data[keyArray[1]].nodes = newTempArray;
                break;
            case 4:
                tempArray = data[keyArray[1]].nodes[keyArray[2]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[3]) continue;
                    newTempArray.push(element);
                }
                data[keyArray[1]].nodes[keyArray[2]].nodes = newTempArray;
                break;
            case 5:
                tempArray = data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[4]) continue;
                    newTempArray.push(element);
                }
                data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes = newTempArray;
                break;
            case 6:
                tempArray = data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[5]) continue;
                    newTempArray.push(element);
                }
                data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes = newTempArray;
                break;
            case 7:
                tempArray = data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[6]) continue;
                    newTempArray.push(element);
                }
                data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes = newTempArray;
                break;
            case 8:
                tempArray = data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes;
                for (let i = 0; i < tempArray.length; i++) {
                    const element = tempArray[i];
                    if (i == keyArray[7]) continue;
                    newTempArray.push(element);
                }
                data[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes = newTempArray;
                break;
            default:
                break;
        }
        this.setData(data);
    }
    @action.bound changeActiveNode(newNodeKey) {
        newNodeKey = String(newNodeKey);
        let treeJson = this.getData;
        let keyArray;
        newNodeKey === '0' ? keyArray = '0' :
            keyArray = newNodeKey.split('-');
        let oldKeyArray;
        this.getActiveNodeKey === '0' ? oldKeyArray = '0' :
            oldKeyArray = this.getActiveNodeKey.split('-');
        switch (oldKeyArray.length) {
            case 1:
                treeJson.active = false;
                break;
            case 2:
                treeJson.nodes[oldKeyArray[1]].active = false;
                break;
            case 3:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].active = false;
                break;
            case 4:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].active = false;
                break;
            case 5:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].active = false;
                break;
            case 6:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].nodes[oldKeyArray[5]].active = false;
                break;
            case 7:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].nodes[oldKeyArray[5]].nodes[oldKeyArray[6]].active = false;
                break;
            case 8:
                treeJson.nodes[oldKeyArray[1]].nodes[oldKeyArray[2]].nodes[oldKeyArray[3]].nodes[oldKeyArray[4]].nodes[oldKeyArray[5]].nodes[oldKeyArray[6]].nodes[oldKeyArray[7]].active = false;
                break;
            default:
                break;
        }
        switch (keyArray.length) {
            case 1:
                treeJson.active = true;
                break;
            case 2:
                console.log("treeJson keyArray[1]", treeJson, keyArray[1])
                treeJson.nodes[keyArray[1]].active = true;
                break;
            case 3:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].active = true;
                break;
            case 4:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].active = true;
                break;
            case 5:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].active = true;
                break;
            case 6:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].active = true;
                break;
            case 7:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].active = true;
                break;
            case 8:
                treeJson.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].active = true;
                break;
            default:
                break;
        }
        this.setActiveNodeKey(newNodeKey);
        this.setData(treeJson);
        console.log("treeJson", treeJson)
    }

    @action.bound changeActiveNodeForAddCallBack(parentNodeActiveNodeKey) {
        let activeKey;
        if (parentNodeActiveNodeKey == '0') {
            let length = this.getData.nodes.length - 1;
            // alert('0-' + length);
            activeKey = '0-' + length;
        } else {
            let keyArray = parentNodeActiveNodeKey.split('-');
            // console.log("before add new node keyArray  = ", keyArray);
            let length;
            switch (keyArray.length) {
                case 2:
                    if (this.getData.nodes[keyArray[1]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                case 3:
                    if (this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                case 4:
                    if (this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                case 5:
                    if (this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                case 6:
                    if (this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                case 7:
                    if (this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                case 8:
                    if (this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes) {
                        length = this.getData.nodes[keyArray[1]].nodes[keyArray[2]].nodes[keyArray[3]].nodes[keyArray[4]].nodes[keyArray[5]].nodes[keyArray[6]].nodes[keyArray[7]].nodes.length - 1;
                    } else {
                        length = 0;
                    }
                    break;
                default:
                    break;
            }
            activeKey = parentNodeActiveNodeKey + '-' + length;

        }
        console.log("after add new node keyArray  = ", activeKey);
        this.changeActiveNode(activeKey);
    }

    init() {
        this.setData(null);
        this.setActiveNodeKey('0');
        this.setEditType('info');
        this.saveType('');
        this.setIsFinishNode(true);
    }

    //弹窗新建节点，id可以是rqt的id，或者是rule或者是strategy的id
    addNodeForApi(nodeType, parentId, id, nodeName, firstType, secondType, activeKey) {
        let saveType;
        switch (this.getSaveType) {
            case 'rtq':
                saveType = 'rtqId';
                break;
            case 'rule':
                saveType = 'ruleId';
                break;
            case 'strategy':
                saveType = 'strategyId';
                break;
            default:
                if (!saveType) return //未知类型直接返回
                break;
        }

        if (!common.isEmpty(activeKey)) {
            if (!common.isEmpty(nodeName)) {
                if (isNaN(activeKey) && activeKey == '0') {//根节点不传parentId
                    parentId = null;
                }
            }
        }

        let params = { 'parentId': parentId, 'name': nodeName, 'type': firstType, 'secondType': secondType }
        params[saveType] = id;

        params.strategyCode = sessionStorage.rootProcessTreeCode;

        common.loading.show();
        if (nodeType === 'control') {
            this.editType2 = "control";
            variableService.saveControlNode(params).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }
        if (nodeType === 'query') {
            this.editType2 = 'query';
            variableService.saveQueryNode(params).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }
        if (nodeType === 'assign') {
            this.editType2 = 'assign';
            strategyService.saveOutPutNode(params).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }
        if (nodeType === 'output') {
            this.editType2 = 'output';
            strategyService.saveOutPutNode(params).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }
        if (nodeType === 'rule') {
            this.editType2 = 'rule';
            variableService.saveRuleNode(params).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }
        if (nodeType === 'ruleSet') {
            this.editType2 = 'ruleSet';
            variableService.saveRuleSetNode(params).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }
        if (nodeType === 'greedy-ruleSet') {
            this.editType2 = 'greedy-ruleSet';
            //此时parentId为ruleSetId, id是strategyId
            variableService.saveRuleSetNodeForGreedy(parentId, id).then(this.addNodeForApiCallBack).catch(res => { common.loading.hide(); });
        }

        this.addNodeParams.setName(nodeName);
    }
    @action.bound addNodeForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("新增节点成功");
        this.getDataForApi(this.getSaveId);
        if (this.editType2 !== 'greedy-ruleSet') this.setIsFinishNode(false);
        this.setEditType(this.editType);
        this.setNodeId(res.data.result.id);
        sessionStorage.lastestId = res.data.result.id;
    }

    deleteNodeForApi(id, id2) {
        common.loading.show();
        if (!common.isEmpty(id2)) {
            //此时id是ruleSetId，id2是strategyId
            variableService.deleteRuleSetNodeForGreedy(id, id2).then(this.deleteNodeForApiCallBack).catch(() => common.loading.hide());
        } else {
            //此时id是节点id
            variableService.deleteNode(id).then(this.deleteNodeForApiCallBack).catch(() => common.loading.hide());
        }
    }
    @action.bound deleteNodeForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("删除节点成功");
        this.getDataForApi(this.getSaveId);
        this.setEditType('info');
        this.addNodeParams.setActiveKey('');
    }

    //获取流程树数据
    getDataForApi = (id) => {
        this.setHaveSqlScript(true);
        switch (this.getSaveType) {
            case 'rtq':
                (this.isResource ? strategyService.getResourceDetail(id): variableService.getRtqVarById(id)).then(this.getDataForApiCallBack);
                break;
            case 'rule':
                strategyService.getRuleById(id).then(this.getDataForApiCallBack);
                break;
            case 'strategy':
                strategyService.getStrategyById(id).then(this.getDataForApiCallBack);
                break;
            default:
                break;
        }
    }
    @action.bound getDataForApiCallBack(res) {
        // alert("左侧树形数据-获取数据详情");
        // alert(res.data.result.approvalStatus)
        if (!publicUtils.isOk(res)) return ;
        let result = res.data.result;
        let tree = {
            name: result.name,
            type: -1,
            active: false,
            nodes: result.treeNode
        }
        if (common.isEmpty(result.script)) {
            this.setHaveSqlScript(false);
        } else {
            this.setHaveSqlScript(true);
        }
        if (!common.isEmpty(this.addNodeParams.getActiveKey)) {
            this.setData(tree);
            this.changeActiveNodeForAddCallBack(this.addNodeParams.getActiveKey);
            this.setEditType(this.editType2);
        } else {
            tree.active = true;
            this.setData(tree);
            this.addNodeParams.setActiveKey('');
            this.setActiveNodeKey('0');
            this.setEditType('info');
        }

        if (!common.isEmpty(result.approvalStatus)) {
            if (result.approvalStatus == 3) {
                this.setIsCanCommit(true);
            } else {
                this.setIsCanCommit(false);
            }
        } else {
            this.setIsCanCommit(false);
        }

        this.type = result.type;
        sessionStorage.rootProcessTreeName = result.name;
        sessionStorage.rootProcessTreeCode = result.code;
        sessionStorage.rootProcessTreeVersion = result.version;

        this.setStatus(result.status);
        this.setApprovalStatus(result.approvalStatus);
    }

    //获取流程树数据,只同步数据作用，不做交互和数据传递处理
    getDataForApi2 = (id) => {
        switch (this.getSaveType) {
            case 'rtq':
                variableService.getRtqVarById(id).then(this.getDataForApiCallBack2);
                break;
            case 'rule':
                strategyService.getRuleById(id).then(this.getDataForApiCallBack2);
                break;
            case 'strategy':
                strategyService.getStrategyById(id).then(this.getDataForApiCallBack2);
                break;
            default:
                break;
        }
    }
    @action.bound getDataForApiCallBack2(res) {
        // alert("左侧树形数据-获取数据详情");
        // alert(res.data.result.approvalStatus)
        if (!publicUtils.isOk(res))
            return

        if (!common.isEmpty(res.data.result.approvalStatus)) {
            if (res.data.result.approvalStatus == 3) {
                this.setIsCanCommit(true);
            } else {
                this.setIsCanCommit(false);
            }
        } else {
            this.setIsCanCommit(false);
        }
    }


    autoAdjustHeight() {
        let leftPageContentHeight = window.document.querySelector("#panel-left .pageContent").offsetHeight;
        let rightPageContentHeight = window.document.querySelector("#panel-right .pageContent").offsetHeight;
        if (leftPageContentHeight != rightPageContentHeight) {
            window.document.querySelector("#panel-left .pageContent").style.height = rightPageContentHeight + 'px';

        }
    }

}

export default new ProcessTreeStore