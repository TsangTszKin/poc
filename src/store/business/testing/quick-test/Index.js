import {action, computed, flow, observable, toJS} from "mobx";
import common from "@/utils/common";
import {DatePicker, Icon, Input, InputNumber, Popconfirm, Select} from "antd";
import React from "react";
import Status from "@/components/business/testing/result/Status";
import strategyService from "@/api/business/strategyService";
import variableService from "@/api/business/variableService";
import publicUtils from "@/utils/publicUtils";
import eventService from "@/api/analysis/eventService";
import moment from 'moment';

class Store {
    constructor() {

    }

    @observable messageSource = [];
    @observable resultSource = [];
    @observable isLoadingMessage = true;
    @observable isLoadingResult = true;
    @observable _testId = '';
    @computed get getMessageSource() { return toJS(this.messageSource) }
    @action.bound setMessageSource(value) { this.messageSource = value }
    @computed get getResultSource() { return toJS(this.resultSource) }
    @action.bound setResultSource(value) { this.resultSource = value }
    @computed get testId() { return toJS(this._testId) }
    @action.bound setTestId(value) { this._testId = value }

    // 报文字段
    @observable reportField = {
        _date: '',
        _cardNo: '',
        _outputField: '',
        _varType: '',
        _fieldType: {},
        _fieldList: [],
        _fieldForm: [],
        _isLoading: true,
        _maxLength: {},
        get maxLength() { return toJS(this._maxLength) },
        setMaxLength(value) { this._maxLength = value; },
        get data() { return toJS(this._date) },
        setDate(value) { this._date = value },
        get cardNo() { return toJS(this._cardNo) },
        setCardNo(value) { this._cardNo = value },
        get outputField() { return toJS(this._outputField) },
        setOutputField(value) { this._outputField = value },
        get varType() { return toJS(this._varType) },
        setVarType(value) { this._varType = value },
        get fieldType() { return toJS(this._fieldType) },
        setFieldType(value) { this._fieldType = value },
        get fieldList() { return toJS(this._fieldList) },
        setFieldList(value) { this._fieldList = value },
        get fieldForm() { return toJS(this._fieldForm) },
        setFieldForm(value) { this._fieldForm = value },
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value },
    };

    // 测试结果
    @observable testResult = {
        _resultList: [],
        _viewFlowNumber: '',
        _isLoading: false,
        get resultList() { return toJS(this._resultList) },
        setResultList(value) { this._resultList = value },
        addResult(value) { this._resultList.push(value) },
        get viewFlowNumber() { return toJS(this._viewFlowNumber) },
        setViewFlowNumber(value) { this._viewFlowNumber = value },
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value },
    };

    // 获取报文输入的变量类型
    fetchFieldTypeFromApi = flow(function* () {
        const res = yield variableService.getDataTypeList();
        if(!publicUtils.isOk(res)) return;
        const result = res.data.result;
        let reportField = {};
        let maxLength = {};
        result.forEach(item=> {
            reportField[item.val] = item.label;
            maxLength[item.val] = item.maxLength || 12;
        });
        this.reportField.setFieldType(reportField);
        this.reportField.setMaxLength(maxLength);
    });

    fetchFieldListFromApi = flow(function* (testId) {
        const response = yield strategyService.getQuickTestField(testId);
        // console.log(response);
        if(!publicUtils.isOk(response)) return;
        const result = response.data.result;
        let fieldForm = common.deepClone(result);
        fieldForm.forEach(item => {
            item.typeText = this.reportField.fieldType[item.type];
        });
        // console.log(fieldForm);
        this.reportField.setFieldForm(fieldForm);
        this.reportField.setIsLoading(false);
    });

    sendFastTestField = () => {
        let postBody = this.reportField.fieldForm.map(({eventSourceId, name, testId, type, value}) => {
            return {
                eventSourceId,
                name,
                testId,
                type,
                value
            }
        });
        common.loading.show();
        strategyService.sendFastTestField(postBody).then(this.sendFastTestFieldCallBack);
    };

    sendFastTestFieldCallBack = (res) => {
        if(publicUtils.isOk(res)) {
            const result = res.data.result;
            let element = common.deepClone(result);
            element.index = this.testResult.resultList.length + 1;
            element.flowNumber = <a href="javascript:void(0);" onClick={() => this.showFlowNumberDetail(element.seqNo)}>查看</a>;
            element.status = <Status status={result.status} />;
            element.action = <Icon title="删除" type="delete" onClick={() => { this.deleteResult(element.id)}} />;
            this.testResult.addResult(element);
            common.loading.hide();
        }
        common.loading.hide();
    };

    deleteResult = id => {
        const list = common.deepClone(this.testResult.resultList);
        let deleteIndex;
        for(let i=0;i<list.length;i++) {
            if(list[i].id === id) deleteIndex = i;
            if(deleteIndex !== undefined) list[i].index = i;
        }
        list.splice(deleteIndex, 1);
        this.testResult.setResultList(list);
    };

    // 以下是查看流水号相关
    @observable drawer = {
        _isShow: false,
        get isShow() { return toJS(this._isShow) },
        setIsShow(value) { this._isShow = value },
    };

    @observable _drawerData = {};
    @computed get getDrawerData() { return toJS(this._drawerData) }
    @computed get drawerData() { return toJS(this._drawerData) }
    @action.bound setDrawerData(value) { this._drawerData = value; }

    showFlowNumberDetail = seqNo => {
        common.loading.show();
        strategyService.getFastDetail(seqNo).then(this.getEventDetailsCallBack);
    };
    @action.bound getEventDetailsCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let temp = {
            eventVarList: res.data.result.eventVarList,
            batchVarList: res.data.result.batchVarList,
            rtqVarList: res.data.result.rtqVarList,
            extVarList: res.data.result.extVarList,
            ruleResultOut: !common.isEmpty(res.data.result.ruleResultOut) ? res.data.result.ruleResultOut : [],
            hitNodeTree: res.data.result.hitNodeTree,
            headerInfo: {
                seqNo: res.data.result.seqNo,
                name: res.data.result.dsTypeName,
                eventCode: res.data.result.dsType,
                bingoStrategy: !common.isEmpty(res.data.result.finalResultOut) && !common.isEmpty(res.data.result.finalResultOut.packageName) ? res.data.result.finalResultOut.packageName : '无',
                bingoRule: !common.isEmpty(res.data.result.finalResultOut) && !common.isEmpty(res.data.result.finalResultOut.name) ? res.data.result.finalResultOut.name : '无',
                status: res.data.result.statusName,
                ddApdate: moment(Number(res.data.result.ddApdate)).format("YYYY-MM-DD HH:mm:ss"),
                timeConsuming: res.data.result.decisionCostTime + '毫秒',
            },
            strategyResultOut: res.data.result.strategyResultOut
        };
        console.log(temp);
        this.setDrawerData(temp);
        this.drawer.setIsShow(true);
        // console.log("res.data", res.data)
    }
}

export default new Store;