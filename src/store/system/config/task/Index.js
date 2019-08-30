/* eslint-disable no-prototype-builtins */
/*
 * @Author: zengzijian
 * @Date: 2019-01-29 08:44:12
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:01:38
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import React from 'react';
import { message, Input } from 'antd';
import eventSourceService from '@/api/system/eventSourceService';
import taskService from '@/api/system/config/taskService';

const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '值',
    dataIndex: 'value',
    key: 'value',
}];

class Store {
    constructor() {
        this.initParams = this.initParams.bind(this);
        this.getListForApi = this.getListForApi.bind(this);
        this.saveForApi = this.saveForApi.bind(this);
        this.verify = this.verify.bind(this);
        this.getEventSourceSelectListForApi = this.getEventSourceSelectListForApi.bind(this);
        this.syncExtVarToRTDForApi = this.syncExtVarToRTDForApi.bind(this);
        this.syncRTDForApi = this.syncRTDForApi.bind(this);
        this.tableChange = this.tableChange.bind(this);
    }

    initParams() { }

    @observable loading = {
        a: {
            isLoading: true,
            get get() { return toJS(this.isLoading) },
            set(value) { this.isLoading = value }
        },

    }
    @observable table = {
        a: {
            columns: columns,
            dataSource: [],
            get getColumns() { return toJS(this.columns) },
            get getDataSource() { return toJS(this.dataSource) },
            setColumns(value) { this.columns = value },
            setDataSource(value) { this.dataSource = value }
        },

    }
    @observable data = {
        a: [],
        get getA() { return toJS(this.a) },
        setA(value) { this.a = value }
    }
    @observable modal = {
        a: false,
        get getA() { return toJS(this.a) },
        setA(value) { this.a = value }
    }
    @observable eventSourceSelectList = [];

    eventSourceId = '';

    @computed get getEventSourceSelectList() { return toJS(this.eventSourceSelectList) }
    @action setEventSourceSelectList(value) { this.eventSourceSelectList = value }


    getListForApi() {
        this.loading.a.set(true);
        taskService.getList().then(this.getListForApiCallBack);
    }
    @action.bound getListForApiCallBack(res) {
        this.loading.a.set(false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {
            let data = common.deepClone(res.data.result);
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                element.key = i;
                element.index = i + 1;
                element.value = <Input defaultValue={res.data.result[i].value} onChange={(e) => this.tableChange('value', e.target.value, i)} />
            }
            this.table.a.setDataSource(data);
            this.data.setA(res.data.result);
        } else {
            this.table.a.setDataSource([]);
            this.data.setA([]);
        }
    }

    tableChange(key, value, i) {
        let data = common.deepClone(this.data.getA);
        data[i][key] = value;
        this.data.setA(data);
    }

    saveForApi() {
        common.loading.show();
        taskService.save(this.data.getA).then(this.saveForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound saveForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
    }

    verify() {
        for (const key in this.data.getA) {
            if (this.data.getA.hasOwnProperty(key)) {
                const element = this.data.getA[key];
                if (key === 'value') {
                    if (common.isEmpty(element)) {
                        message.warning("请把列表的数值补充完整");
                        return false
                    }
                }

            }
        }
        return true
    }

    getEventSourceSelectListForApi() {
        eventSourceService.getList({ query: '', page: 1, size: 1000 }).then(this.getEventSourceSelectListForApiCallBack)
    }
    @action.bound getEventSourceSelectListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result.resultList)) {
            this.setEventSourceSelectList(res.data.result.resultList);
            this.eventSourceId = res.data.result.resultList[0].eventSourceId;
        } else {
            this.setEventSourceSelectList([]);
            this.eventSourceId = '';
        }
    }

    syncExtVarToRTDForApi(eventSourceId) {
        common.loading.show();
        taskService.syncExtVarToRTD(eventSourceId).then(this.syncExtVarToRTDForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound syncExtVarToRTDForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("同步成功");
    }

    syncRTDForApi() {
        common.loading.show();
        taskService.syncRTD().then(this.syncRTDForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound syncRTDForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("同步成功");
    }


}
export default new Store
