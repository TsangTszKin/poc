/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:52:30
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';
import TableAction from '@/components/business/variable/derivation/TableAction';
import Status from '@/components/Status';
import ApprovalStatus from '@/components/ApprovalStatus';
import React from 'react';

class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.initParams = this.initParams.bind(this);
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
    }
    @observable isCanSubmit = false;
    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', category: '', eventSourceId: '', status: '', type: '' };
    @observable selectedRowKeys = [];
    @observable showToolBarType = 1;

    responseData = [];

    @computed get getShowToolBarType() { return toJS(this.showToolBarType) }
    @action.bound setShowToolBarType(value) { this.showToolBarType = value; }
    @computed get getSelectedRowKeys() { return toJS(this.selectedRowKeys) }
    @action.bound setSelectedRowKeys(value) { this.selectedRowKeys = value; }
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
    @computed get getIsCanSubmit() { return toJS(this.isCanSubmit); }
    @action.bound setIsCanSubmit(value) { this.isCanSubmit = value; }

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

    @action.bound submit(id) {
        common.loading.show();
        variableService.submitRtq(id).then(this.submitRtqCallback).catch(() => { common.loading.hide(); })
    }
    @action.bound submitRtqCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getDataSourceForApi() {
        variableService.getExtVarList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        this.setSelectedRowKeys([]);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.pageList.resultList)) {
            this.responseData = common.deepClone(res.data.pageList.resultList);
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                const status = element.status;
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
                data.statusNumber = status;
                data.status = <div style={{ width: '170px' }}>
                    <Status status={status} style={{ float: 'left' }} />
                    <ApprovalStatus status={data.approvalStatus} style={{ float: 'left', marginLeft: '15px' }} />
                </div>;
                let routerStr = "";
                switch (data.type) {
                    case 0:
                        routerStr = 'save-count';
                        break;
                    case 1:
                        routerStr = 'save-regular';
                        break;
                    case 2:
                        routerStr = 'save-func';
                        break;

                    default:
                        break;
                }
                let quoteSum = common.deepClone(data.quoteSum);
                data.quoteSum = <a href="javascript:;" onClick={() => { this.getUseTimesTreeForApi('ext', this.getDataSource[i].id); this.useTimesTree.setTimes(quoteSum); }}>{data.quoteSum}</a>;
                data.action = <TableAction dataId={element.id} status={status} deleteOne={this.deleteOne} editPath={{ pathname: `/business/variable/derivation/${routerStr}/${element.id}` }} />;
                dataList.push(data);
                console.log(status)
            }
        } else {
            this.responseData = [];
        }

        this.setPageNum(res.data.pageList.sum === 0 ? this.getPageNum : ++res.data.pageList.curPageNO);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);

    }

    deleteOne(id) {
        common.loading.show();

        let rowsData = [];
        this.responseData.forEach(element => {
            if (element.id === id) {
                let row = common.deepClone(element);
                row.extVarId = element.id;
                row.extVarCode = element.code;
                row.extVarName = element.name;
                row.actionType = 3;
                row.type = 1;
                // delete row.id;
                rowsData = [row.id];
            }
        })
        common.loading.show();
        variableService.changeExtVarStatus(rowsData, 'delete').then(res => {
            common.loading.hide();
            this.getDataSourceForApi();
            if (!publicUtils.isOk(res)) return
            message.success(res.data.resultMessage);
        }).catch(() => {
            common.loading.hide();
        })
    }

    getUseTimesTreeForApi(type, id) {
        this.useTimesTree.setData({});
        common.loading.show();
        switch (type) {
            case 'ext':
                variableService.getExtUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'rtq':
                variableService.getRtqUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'rule':
                strategyService.getRuleUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'strategy':
                strategyService.getStrategyUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
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
            case 'eventVar':
                typeStr = '（事件变量）';
                break;
            case 'batchVar':
                typeStr = '（批次变量）';
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

    initParams() {
        this.setQuery({ name: '', code: '', category: '', eventSourceId: '', status: '', type: '' });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(10);
    }
}

export default new store