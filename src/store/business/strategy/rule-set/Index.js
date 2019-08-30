/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-20 14:03:36
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';
import TableAction from '@/components/business/strategy/rule-set/TableAction';
import TableActionForVersion from '@/components/business/strategy/rule-set/TableActionForVersion';
import Status from '@/components/Status';
import ApprovalStatus from '@/components/ApprovalStatus';
import React from 'react';

class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.initParams = this.initParams.bind(this);
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.getVersionListForApi= this.getVersionListForApi.bind(this);
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

    @observable modal = {
        version: {
            value: false,
            show() { this.value = true },
            hide() { this.value = false },
        },
        shareTemplate: {
            value: false,
            show() { this.value = true },
            hide() { this.value = false },
        },
        useTemplate: {
            value: false,
            show() { this.value = true },
            hide() { this.value = false; },
        }
    }
    @observable versionList = [];
    @observable templateList = [];
    @observable templateType = 1;//1自定义，2用模板
    @observable templateVO = {
        data: {
            "authorizationType": 0,//模板所有权 0:私有 1:公有
            "description": "",
            "id": "",
            "name": "",
            "type": 2//模板类型 0:实时查询变量 1:衍生变量 2:规则 3:规则集 4:策略
        },
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value },
        updateData(key, value) { this.data[key] = value }
    }

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
    @computed get getVersionList() { return toJS(this.versionList) }
    @action.bound setVersionList(value) { this.versionList = value }
    @computed get getTemplateList() { return toJS(this.templateList) }
    @action setTemplateList(value) { this.templateList = value }
    
    initParams() {
        this.setQuery({ name: '', code: '', category: '', eventSourceId: '', status: '', type: '' });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(0);
    }

    @action.bound submit(id) {
        common.loading.show();
        strategyService.submitRtq(id).then(this.submitRtqCallback).catch(() => { common.loading.hide(); })
    }
    @action.bound submitRtqCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getDataSourceForApi() {
        strategyService.getRuleSetList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        // if (!publicUtils.isOk(res)) return
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
                data.typeStr = data.type == '0' ? '优先级' : '全规则';
                data.statusNumber = status;
                data.status = <div style={{ width: '170px' }}>
                    <Status status={status} style={{ float: 'left' }} />
                    <ApprovalStatus status={data.approvalStatus} style={{ float: 'left', marginLeft: '15px' }} />
                </div>;
                let quoteSum = common.deepClone(data.quoteSum);
                data.quoteSum = <a href="javascript:;" onClick={() => { this.getUseTimesTreeForApi('ruleSet', this.getDataSource[i].id); this.useTimesTree.setTimes(quoteSum); }}>{data.quoteSum}</a>;
                data.action = <TableAction
                    dataId={element.id}
                    status={element.status}
                    deleteOne={this.deleteOne}
                    versionFunc={() => {
                        this.modal.version.show();
                        this.getVersionListForApi(element.id);
                    }}
                    templateFunc={() => {
                        this.templateVO.updateData('id', element.id);
                        this.modal.shareTemplate.show();
                    }}
                    detailPath={{ pathname: '/business/strategy/rule-set/details/' + element.id }}
                    editPath={{ pathname: '/business/strategy/rule-set/save/' + element.type + '/' + element.id }}
                />;
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
        strategyService.deleteRuleSetById(id).then(res => {
            common.loading.hide();
            this.getDataSourceForApi();
            if (!publicUtils.isOk(res)) return
             // 测试要求删除都统一为“删除成功”
             message.success("删除成功");
        }).catch(() => {
            common.loading.hide();
        })
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
            case 'ruleSet':
                strategyService.getRuleSetUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
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

    getVersionListForApi(id) {
        strategyService.ruleSetAllVersion(id).then((res) => {
            this.getVersionListForApiCallBack(res, id);
        });
    }
    @action.bound getVersionListForApiCallBack(res, ruleId) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        for (let i = 0; i < res.data.result.length; i++) {
            const element = res.data.result[i];
            element.key = i;
            element.index = i + 1;
            element.action = <TableActionForVersion dataId={element.id} deleteRuleVersion={() => {
                this.deleteRuleVersionForApi(element.id, ruleId);
            }}
                editPath={`/business/strategy/rule-set/save/${element.type}/${element.id}`}
                detailPath={'/business/strategy/rule-set/details/' + element.id}
            />
            tempArray.push(element)
        }
        this.setVersionList(tempArray);
    }

    deleteRuleVersionForApi(versionId) {
        strategyService.deleteRuleSetVersion(versionId).then((res) => {
            this.deleteRuleVersionForApiCallBack(res);
        });
    }
    @action.bound deleteRuleVersionForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
         // 测试要求删除都统一为“删除成功”
         message.success("删除成功");
        this.getVersionListForApi(res.data.result);
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

}

export default new store