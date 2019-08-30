/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:47:56
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import TableAction from '@/components/business/strategy/output/TableAction';
import React from 'react';
import { message } from 'antd';

class store {

    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.getResultDetailForApi = this.getResultDetailForApi.bind(this);
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.initParams = this.initParams.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable selectedRowKeys = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '' };
    @observable _categoryList = {};
    @computed get categoryList() { return toJS(this._categoryList) }
    @action.bound setCategoryList(value) { this._categoryList = value; }

    @observable saveData = {
        id: null,
        name: "",
        code: "",
        type: "",
        typeLabel: "",
        value: null,
        defaultValue: '',
        _category: [],
        get category() { return toJS(this._category) },
        setCategory(value) { this._category = value; },
        get getId() { return toJS(this.id) },
        setId(value) { this.id = value },
        get getName() { return toJS(this.name) },
        setName(value) { this.name = value },
        get getCode() { return toJS(this.code) },
        setCode(value) { this.code = value },
        get getType() { return toJS(this.type) },
        setType(value) { this.type = value },
        get getTypeLabel() { return toJS(this.typeLabel) },
        setTypeLabel(value) { this.typeLabel = value },
        get getValue() { return toJS(this.value) },
        setValue(value) { this.value = value },
        get getDefaultValue() { return toJS(this.defaultValue) },
        setDefaultValue(value) { this.defaultValue = value },
        init() {
            this.id = null;
            this.name = '';
            this.code = '';
            this.type = '';
            this.typeLabel = '';
            this.value = null;
            this.defaultValue = '';
            this._category = '';
        }
    }

    @observable useTimesTree = {
        times: '',
        data: {},
        show: false,
        get getTimes() { return toJS(this.times) },
        setTimes(value) { this.times = value },
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value; },
        get getShow() { return toJS(this.show) },
        setShow(value) { this.show = value; }
    }


    @observable isShowModal = false;

    @computed get getIsShowModal() { return toJS(this.isShowModal) }
    @action.bound setIsShowModal(value) { this.isShowModal = value }
    @computed get getQuery() { return toJS(this.query) }
    @action.bound setQuery(value) { this.query = value; }
    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value; }
    @computed get getDataSource() { return toJS(this.dataSource) }
    @action.bound setDataSource(value) { this.dataSource = value; }
    @computed get getTotal() { return toJS(this.total) }
    @action.bound setTotal(value) { this.total = value; }
    @computed get getPageNum() { return toJS(this.pageNum) }
    @action.bound setPageNum(value) { this.pageNum = value; }
    @computed get getPageSize() { return toJS(this.pageSize) }
    @action.bound setPageSize(value) { this.pageSize = value; }
    @computed get getSelectedRowKeys() { return toJS(this.selectedRowKeys) }
    @action.bound setSelectedRowKeys(value) { this.selectedRowKeys = value; }

    responseData = [];

    initParams() {
        this.setQuery({ name: '', code: '' });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(0);
    }

    getUseTimesTreeForApi(type, id) {
        this.useTimesTree.setData({});
        common.loading.show();
        switch (type) {
            case 'rtq':
                variableService.getRtqUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'rule':
                strategyService.getRuleUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'strategy':
                strategyService.getStrategyUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'result':
                strategyService.getResultUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            default:
                break;
        }
    }
    @action.bound getUseTimesTreeForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let data = res.data.result;
        this.formatUseTimesTree(data);
        this.useTimesTree.setData(data);
        this.useTimesTree.setShow(true);
        console.log("data = ", data);
    }

    getDataSourceForApi() {
        strategyService.getResultList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.pageList.resultList)) {
            this.responseData = common.deepClone(res.data.pageList.resultList);
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = element;
                data.index = i + 1;
                data.key = i;
                if (!common.isEmpty(data.name)) {
                    if (data.name.length > 20) {
                        data.name = String(data.name).substr(0, 20) + '...';
                    }
                }
                if (!common.isEmpty(data.defaultValue)) {
                    if (data.defaultValue.length > 20) {
                        data.defaultValue = String(data.defaultValue).substr(0, 20) + '...';
                    }
                }
                let quoteSum = common.deepClone(data.quoteSum);
                data.quoteSum = <a href="javascript:;" onClick={() => { this.getUseTimesTreeForApi('result', this.getDataSource[i].id); this.useTimesTree.setTimes(quoteSum); }}>{quoteSum}</a>;
                data.action = <TableAction dataId={element.id} deleteOne={this.deleteOne} />;
                data.category = this.categoryList[element.category] !== undefined ? this.categoryList[element.category]: '';
                dataList.push(data);
            }
        } else {
            this.responseData = [];
        }
        this.setSelectedRowKeys([]);
        this.setPageNum(res.data.pageList.sum === 0 ? this.getPageNum : ++res.data.pageList.curPageNO);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);

    }

    deleteOne(id) {
        common.loading.show();
        strategyService.deleteResultById(id).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.getDataSourceForApi();
            message.success("删除成功");
        }).catch(() => {
            common.loading.hide();
        })
    }

    getResultDetailForApi(id) {
        common.loading.show();
        strategyService.getResultById(id).then(this.getResultDetailForApiCallback)
    }
    @action.bound getResultDetailForApiCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        this.saveData.setId(data.id);
        this.saveData.setName(data.name);
        this.saveData.setCode(data.code);
        this.saveData.setType(data.type);
        this.saveData.setDefaultValue(data.defaultValue);
        this.saveData.setTypeLabel(data.typeLabel);
        this.saveData.setCategory(data.category);
        if (data.value) {
            this.saveData.setValue(data.value);
        }
        this.setIsShowModal(true);
    }

    @action.bound saveResult() {
        let params = {
            id: this.saveData.getId,
            name: this.saveData.getName,
            code: this.saveData.getCode,
            type: this.saveData.getType,
            typeLabel: this.saveData.getTypeLabel,
            defaultValue: this.saveData.getDefaultValue,
            category: this.saveData.category
        }
        common.loading.show();
        strategyService.saveResult(params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("保存成功");
            this.getDataSourceForApi();
            this.setIsShowModal(false);
        }).catch(() => { common.loading.hide(); })
    }

    formatUseTimesTree(obj) {
        obj.collapsed = false;
        delete obj.id;
        obj.name = obj.name + this.getType(obj.type);
        delete obj.type;
        if (!common.isEmpty(obj.nodes)) {
            obj.children = obj.nodes;
            delete obj.nodes;
            obj.children.forEach(element => {
                this.formatUseTimesTree(element);
            })
        }
    }

    getType(type) {
        let typeStr = '';
        switch (type) {
            case 'rtqVar':
                typeStr = '（实时查询变量）';
                break;
            case 'rtqVarV2':
                typeStr = '（实时查询变量）';
                break;
            case 'extVar':
                typeStr = '（衍生变量）';
                break;
            case 'rule':
                typeStr = '（规则）';
                break;
            case 'ruleSet':
                typeStr = '（规则集）';
                break;
            case 'strategy':
                typeStr = '（决策流）';
                break;
            case 'strategyPackage':
                typeStr = '（策略包）';
                break;
            case 'scoreCard':
                typeStr = '（评分卡）';
                break;
            case 'decisionTable':
                typeStr = '（决策表）';
                break;
            default:
                break;
        }
        return typeStr
    }
}

export default new store