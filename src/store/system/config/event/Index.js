/*
 * @Author: zengzijian
 * @Date: 2019-01-18 09:07:27
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:01:14
 * @Description: 
 */
/* eslint-disable no-prototype-builtins */
import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import organizationService from '@/api/system/auth/organizationService';
import eventService from '@/api/system/config/eventService';
import React from 'react';
import { message, Select, Input } from 'antd';
import AddAndSub from '@/components/AddAndSub';
import eventSourceService from '@/api/system/eventSourceService';

const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
}, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '标识',
    dataIndex: 'code',
    key: 'code',
}, {
    title: '',
    dataIndex: 'action',
    key: 'action'
}];

const columns2 = [
    { title: '统计名称', dataIndex: 'name', key: 'name' },
    { title: '统计标识', dataIndex: 'code', key: 'code' },
    { title: '统计维度', dataIndex: 'dimension', key: 'dimension' },
    { title: '', dataIndex: 'action', key: 'action', width: '80px' },
]

class Store {
    constructor() {
        this.initParams = this.initParams.bind(this);
        this.getAListForApi = this.getAListForApi.bind(this);
        this.getBListForApi = this.getBListForApi.bind(this);
        this.getCListForApi = this.getCListForApi.bind(this);
        this.getDimensionsListForApi = this.getDimensionsListForApi.bind(this);
        this.verify1 = this.verify1.bind(this);
        this.verify2 = this.verify2.bind(this);
        this.saveDetailsListForApi = this.saveDetailsListForApi.bind(this);
        this.saveDimensionListForApi = this.saveDimensionListForApi.bind(this);
    }

    @observable loading = {
        a: {
            isLoading: true,
            get get() { return toJS(this.isLoading) },
            set(value) { this.isLoading = value }
        },
        b: {
            isLoading: true,
            get get() { return toJS(this.isLoading) },
            set(value) { this.isLoading = value }
        },
        c: {
            isLoading: true,
            get get() { return toJS(this.isLoading) },
            set(value) { this.isLoading = value }
        }
    }
    @observable table = {
        details: {
            columns: columns,
            dataSource: [],
            get getColumns() { return toJS(this.columns) },
            get getDataSource() { return toJS(this.dataSource) },
            setColumns(value) { this.columns = value },
            setDataSource(value) { this.dataSource = value }
        },
        dimension: {
            columns: columns2,
            dataSource: [],
            get getColumns() { return toJS(this.columns) },
            get getDataSource() { return toJS(this.dataSource) },
            setColumns(value) { this.columns = value },
            setDataSource(value) { this.dataSource = value }
        }
    }
    @observable data = {
        a: [],
        b: [],
        c: [],
        get getA() { return toJS(this.a) },
        get getB() { return toJS(this.b) },
        get getC() { return toJS(this.c) },
        setA(value) { this.a = value },
        setB(value) { this.b = value },
        setC(value) { this.c = value },
    }
    @observable tree = {
        data: [],
        defaultSelectEdNodeKey: '',
        get getData() { return toJS(this.data) },
        get getDefaultSelectEdNodeKey() { return toJS(this.defaultSelectEdNodeKey) },
        setData(value) { this.data = value },
        setDefaultSelectEdNodeKey(value) { this.defaultSelectEdNodeKey = value }
    }

    @observable dimensionsList = [];
    @computed get getDimensionList() { return toJS(this.dimensionsList) }
    @action setDimensionList(value) { this.dimensionsList = value }

    organizationCode = '';

    getAListForApi() {
        this.loading.a.set(true);
        organizationService.getTree().then(this.getAListForApiCallBack).catch(() => { this.loading.setLeft(false) });
    }
    @action.bound getAListForApiCallBack(res) {

        if (!publicUtils.isOk(res)) return
        if (common.isEmpty(res.data.result)) {
            this.tree.setData([]);
        } else {
            this.tree.setData(res.data.result);
            this.getBListForApi(res.data.result[0].code);
            this.getCListForApi(res.data.result[0].code);
        }
        this.loading.a.set(false);
    }

    getBListForApi(organizationCode) {
        this.loading.b.set(true);
        this.organizationCode = organizationCode;
        eventService.getDetailsList(organizationCode).then(this.getBListForpiCallBack);
    }
    @action.bound getBListForpiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        this.data.setB(res.data.result);
        this.loading.b.set(false);
        this.table.details.setDataSource(this.renderTable1(this.data.getB));
    }

    getCListForApi(organizationCode) {
        this.loading.c.set(true);
        this.organizationCode = organizationCode;
        eventService.getDimensionList(organizationCode).then(this.getCListForpiCallBack);
    }
    @action.bound getCListForpiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        this.data.setC(res.data.result);
        this.loading.c.set(false);
        this.table.dimension.setDataSource(this.renderTable2(this.data.getC));
    }

    initParams() {
    }

    tableDataChange1 = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
        if (name === 'code') {
            value = value.replace(/[^\w_]/g, '');
        }
        let data = common.deepClone(this.data.getB);
        data[i][name] = value;
        this.data.setB(data);
    }
    tableDataChange2 = (i, name, value) => {
        console.log(`${i}  ${name}  ${value}`);
        let data = common.deepClone(this.data.getC);
        data[i][name] = value;
        this.data.setC(data);
    }
    subTableRow1 = (key) => {
        let arrayIndex;
        for (let i = 0; i < this.table.details.getDataSource.length; i++) {
            const element = this.table.details.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                break
            }
        }
        let data = common.deepClone(this.data.getB);
        data.splice(arrayIndex, 1)
        this.data.setB(data);
        var tempArray2 = this.renderTable1(data);
        this.table.details.setDataSource(tempArray2);
    }
    subTableRow2 = (key) => {
        let arrayIndex;
        for (let i = 0; i < this.table.dimension.getDataSource.length; i++) {
            const element = this.table.dimension.getDataSource[i];
            if (element.key === key) {
                arrayIndex = i;
                break
            }
        }
        let data = common.deepClone(this.data.getC);
        data.splice(arrayIndex, 1)
        this.data.setC(data);
        var tempArray2 = this.renderTable2(data);
        this.table.dimension.setDataSource(tempArray2);
    }
    addTableRow1 = () => {
        let data = common.deepClone(this.data.getB);
        data.push({
            "code": "",
            "name": "",
            "type": ""
        })
        this.data.setB(data);
        this.table.details.setDataSource(this.renderTable1(data));
    }
    addTableRow2 = () => {
        let data = common.deepClone(this.data.getC);
        data.push({
            "code": "",
            "name": "",
            "dimension": ""
        })
        this.data.setC(data);
        this.table.dimension.setDataSource(this.renderTable2(data));
    }
    renderTable1(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                index: i + 1,
                type: <Select defaultValue={element.type} style={{ width: '109px' }} onChange={(value) => this.tableDataChange1(i, 'type', value)} >
                    <Select.Option value={0}>系统字段</Select.Option>
                    <Select.Option value={1}>报文字段</Select.Option>
                </Select>,
                name: <Input defaultValue={element.name} style={{ width: '120px' }} onChange={(e) => this.tableDataChange1(i, 'name', e.target.value)} />,
                code: <Input style={{ width: 'auto' }} title={element.code} defaultValue={element.code} onChange={(e) => this.tableDataChange1(i, 'code', e.target.value)} />,
                action: publicUtils.isAuth("system:config:event:edit") ? <a style={{ color: '#D9D9D9' }}><AddAndSub type="sub" sub={() => { this.subTableRow1(uuid) }} /></a> : ''
            })
        }
        return tempArray
    }
    renderTable2(list) {
        let tempArray = [];
        if (common.isEmpty(list)) return tempArray
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            let uuid = common.getGuid();
            tempArray.push({
                key: uuid,
                name: <Input defaultValue={element.name} style={{ width: '120px' }} onChange={(e) => this.tableDataChange2(i, 'name', e.target.value)} />,
                code: <Input defaultValue={element.code} style={{ width: '120px' }} onChange={(e) => this.tableDataChange2(i, 'code', e.target.value)} />,
                dimension: <Select defaultValue={element.dimension} style={{ width: '109px' }} showSearch onChange={(value) => this.tableDataChange2(i, 'dimension', value)} >
                    {
                        this.getDimensionList.map((item, i) =>
                            <Select.Option key={i} value={item.code}>{item.name}</Select.Option>
                        )
                    }
                </Select>,
                action: publicUtils.isAuth("system:config:event:edit") ? <a style={{ color: '#D9D9D9' }}><AddAndSub type="sub" sub={() => { this.subTableRow2(uuid) }} /></a> : ''
            })
        }
        console.log("tempArray", tempArray)
        return tempArray
    }

    getDimensionsListForApi() {
        eventSourceService.getDimensionsList({ page: 1, size: 1000 }).then(this.getDimensionsListForApiCallBack)
    }
    @action.bound getDimensionsListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.pageList.resultList)) {
            this.setDimensionList(res.data.pageList.resultList);
        } else {
            this.setDimensionList([]);
        }
        this.getAListForApi();
    }

    saveDetailsListForApi() {
        common.loading.show();
        let data = common.deepClone(this.data.getB);
        data.forEach(element => {
            element.organization = this.organizationCode;
        });
        eventService.saveDetailsList(data, this.organizationCode).then(this.saveDetailsListForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound saveDetailsListForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.saveDimensionListForApi();
    }

    saveDimensionListForApi() {
        common.loading.show();
        let data = common.deepClone(this.data.getC);
        data.forEach(element => {
            element.organization = this.organizationCode;
        });
        eventService.saveDimensionList(data, this.organizationCode).then(this.saveDimensionListForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound saveDimensionListForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
    }

    verify1() {
        let data = this.data.getB;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const element = item[key];
                    switch (key) {
                        case 'type':
                            if (common.isEmpty(element)) {
                                message.warning("事件分析配置 - 事件明细列表配置 - 类型请补充完整");
                                return false
                            }
                            break;
                        case 'name':
                            if (common.isEmpty(element)) {
                                message.warning("事件分析配置 - 事件明细列表配置 - 名称请补充完整");
                                return false
                            }
                            break;
                        case 'code':
                            if (common.isEmpty(element)) {
                                message.warning("事件分析配置 - 事件明细列表配置 - 标识请补充完整");
                                return false
                            }
                            break;
                        default:
                            break;
                    }

                }
            }
        }

        return true
    }
    verify2() {
        let data = this.data.getC;
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const element = item[key];
                    switch (key) {

                        case 'name':
                            if (common.isEmpty(element)) {
                                message.warning("事件分析配置 - 事件统计维度配置 - 名称请补充完整");
                                return false
                            }
                            break;
                        case 'code':
                            if (common.isEmpty(element)) {
                                message.warning("事件分析配置 - 事件统计维度配置 - 标识请补充完整");
                                return false
                            }
                            break;
                        case 'dimension':
                            if (common.isEmpty(element)) {
                                message.warning("事件分析配置 - 事件统计维度配置 - 维度请补充完整");
                                return false
                            }
                            break;
                        default:
                            break;
                    }

                }
            }
        }
        return true
    }

}
export default new Store
