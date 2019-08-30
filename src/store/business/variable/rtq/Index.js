/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:53:00
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';
import TableAction from '@/components/business/variable/real-time-query/TableAction1.0';
import Status from '@/components/Status';
import ApprovalStatus from '@/components/ApprovalStatus';
import React from 'react';

class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.initParams = this.initParams.bind(this);
    }
    @observable isShowDrawerForSql = false;
    @observable sqlPreview = "";
    @observable isCanSubmit = false;
    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', category: '', eventSourceId: '', type: '' };
    @observable selectedRowKeys = [];
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
    @computed get getIsShowDrawerForSql() { return toJS(this.isShowDrawerForSql); }
    @action.bound setIsShowDrawerForSql(value) { this.isShowDrawerForSql = value; }
    @computed get getSqlPreview() { return toJS(this.sqlPreview); }
    @action.bound setSqlPreview(value) { this.sqlPreview = value; }
    @action.bound getSqlPreviewForAPI(id) { variableService.getRtqSqlPreview(id).then(this.getSqlPreviewCallback); }
    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
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
        variableService.getRTQVarList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
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
                let quoteSum = common.deepClone(data.quoteSum);
                data.quoteSum = <a href="javascript:;" onClick={() => { this.getUseTimesTreeForApi('rtq', this.getDataSource[i].id); this.useTimesTree.setTimes(quoteSum); }}>{data.quoteSum}</a>;
                data.statusNumber = status;
                data.status = <div style={{ width: '170px' }}>
                    <Status status={status} style={{ float: 'left' }} />
                    <ApprovalStatus status={data.approvalStatus} style={{ float: 'left', marginLeft: '15px' }} />
                </div>;
                data.action = <TableAction dataId={element.id} status={status} changeStatus={this.changeStatus} deleteOne={this.deleteOne} shareCallBack={() => { this.setState({ isShowShareModal: true }) }} editPath={{ pathname: '/business/variable/real-time-query/save/' + element.id }} />;
                dataList.push(data);
            }
        } else {
            this.responseData = [];
        }

        this.setPageNum(res.data.pageList.sum === 0 ? this.getPageNum : ++res.data.pageList.curPageNO);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        // console.table(dataList);
        this.setDataSource(dataList);

    }

    deleteOne(id) {

        let dataList = this.getDataSource;
        dataList.forEach(element => {
            if (element.id === id) {
                element.status = <Status status={5} />;
            }
        })
        this.setDataSource(dataList);

        let rowsData = [];
        this.responseData.forEach(element => {
            if (element.id === id) {
                let row = common.deepClone(element);
                rowsData = [row.id]
            }
        })
        common.loading.show();
        variableService.changeRtqVarStatus(rowsData, 'delete').then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.getDataSourceForApi();
            message.success(res.data.resultMessage);
        }).catch(() => {
            common.loading.hide();
        })

    }

    changeStatus(id, status) {
        let dataList = this.getDataSource;
        switch (status) {
            case 1:
                dataList.forEach(element => {
                    if (element.id === id) {
                        element.status = <Status status={2} />;
                    }
                })
                this.setDataSource(dataList);
                common.loading.show();
                variableService.changeRtqVarStatus([id], "online").then(res => {
                    common.loading.hide();
                    this.getDataSourceForApi();
                    if (!publicUtils.isOk(res)) return
                    message.success("上线成功");
                }).catch(() => {
                    common.loading.hide();
                })
                break;
            case 4:
                dataList.forEach(element => {
                    if (element.id === id) {
                        element.status = <Status status={3} />;
                    }
                })
                this.setDataSource(dataList);
                common.loading.show();
                variableService.changeRtqVarStatus([id], "offline").then(res => {
                    common.loading.hide();
                    this.getDataSourceForApi();
                    if (!publicUtils.isOk(res)) return
                    message.success("下线成功");
                    this.getDataSourceForApi();
                }).catch(() => {
                    common.loading.hide();
                })
                break;
            default:
                Modal.info({
                    title: '提示',
                    content: (
                        <div>
                            <p>请稍等~</p>
                        </div>
                    ),
                    onOk() { },
                });
                break;
        }
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
            default:
                break;
        }
        return typeStr
    }

    initParams() {
        this.setQuery({ name: '', code: '', category: '', eventSourceId: '', type: '' });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(10);
    }
}

export default new store