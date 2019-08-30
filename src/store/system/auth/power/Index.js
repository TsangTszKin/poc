/*
 * @Author: zengzijian
 * @Date: 2018-12-18 09:28:16
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:00:36
 * @Description: 
 */
/* eslint-disable no-prototype-builtins */
/* eslint-disable no-inner-declarations */
import { observable, action, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import powerService from '@/api/system/auth/powerService';
import React from 'react';
import { Input, Select, message, Modal } from 'antd';
import AddAndSub from '@/components/AddAndSub';

const method = ["ALL", "POST", "GET", "DELETE", "PUT", "SEARCH"]

class Store {
    constructor() {
        this.getTreeForApi = this.getTreeForApi.bind(this);
        this.getDetailsByIdForApi = this.getDetailsByIdForApi.bind(this);
        this.renderTable = this.renderTable.bind(this);
        this.tableDataChange = this.tableDataChange.bind(this);
        this.saveDetailsForApi = this.saveDetailsForApi.bind(this);
        this.addAction = this.addAction.bind(this);
        this.subAction = this.subAction.bind(this);
        this.deleteOneForApi = this.deleteOneForApi.bind(this);
        this.addOneMenu = this.addOneMenu.bind(this);
        this.moveNodeForApi = this.moveNodeForApi.bind(this);
    }

    @observable loading = {
        left: true,
        right: true,
        get getLeft() { return toJS(this.left) },
        get getRight() { return toJS(this.right) },
        setLeft(value) { this.left = value },
        setRight(value) { this.right = value }
    }
    @observable tree = {
        data: [],
        defaultSelectEdNodeKey: '',
        get getData() { return toJS(this.data) },
        get getDefaultSelectEdNodeKey() { return toJS(this.defaultSelectEdNodeKey) },
        setData(value) { this.data = value },
        setDefaultSelectEdNodeKey(value) { this.defaultSelectEdNodeKey = value }
    }
    @observable details = {
        data: {},
        table: {
            columns: [],
            dataSource: [],
            data: [],
            get getColumns() { return toJS(this.columns) },
            get getDataSource() { return toJS(this.dataSource) },
            get getData() { return toJS(this.data) },
            setColumns(value) { this.columns = value },
            setDataSource(value) { this.dataSource = value },
            setData(value) { this.data = value }
        },
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value },
    }

    getTreeForApi() {
        this.loading.setLeft(true);
        powerService.getTree().then(this.getTreeForApiCallBack).catch(() => { this.loading.setLeft(false) });
    }
    @action.bound getTreeForApiCallBack(res) {
        this.loading.setRight(false);
        if (!publicUtils.isOk(res)) return
        if (common.isEmpty(res.data.result)) {
            this.tree.setData([]);
        } else {

            let data = common.deepClone(res.data.result);
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                element.key = String(i);
                assignKey(element);
            }

            function assignKey(item) {
                if (!common.isEmpty(item.child)) {
                    for (let i = 0; i < item.child.length; i++) {
                        const element = item.child[i];
                        element.key = `${item.key}-${i}`
                        assignKey(element);
                    }
                }
            }


            console.log("data", data)

            this.tree.setData(data);
            this.getDetailsByIdForApi(res.data.result[0].id);
            this.tree.setDefaultSelectEdNodeKey('0');
        }
    }

    getDetailsByIdForApi(id) {
        common.loading.show();
        powerService.getDetailsById(id).then(this.getDetailsByIdForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getDetailsByIdForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result))
            this.details.setData(res.data.result);
        this.details.table.setColumns([{
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            width: '40%'
        }, {
            title: '授权标识',
            dataIndex: 'label',
            key: 'label',
        },
        // {
        //     title: 'URL路径',
        //     dataIndex: 'url',
        //     key: 'url',
        // }, 
        {
            title: '操作',
            dataIndex: 'action',
            key: 'action'
        }]);

        let tableData = [];
        for (const key in res.data.result.actions) {
            if (res.data.result.actions.hasOwnProperty(key)) {
                const element = res.data.result.actions[key];
                tableData.push(element);
            }
        }
        this.details.table.setData(tableData);
        this.details.table.setDataSource(this.renderTable(tableData));

    }

    renderTable(list) {
        let dataSource = [];
        if (common.isEmpty(list)) return dataSource
        for (let i = 0; i < list.length; i++) {
            const element = list[i];
            dataSource.push({
                key: common.getGuid(),
                name: <Input defaultValue={element.name} onChange={(e) => this.tableDataChange(i, 'name', e.target.value)} />,
                label: <Input defaultValue={element.label} onChange={(e) => this.tableDataChange(i, 'label', e.target.value)} />,
                url: <Input.Group compact>
                    <Select style={{ minWidth: '100px' }} defaultValue={element.method} onChange={(value) => this.tableDataChange(i, 'method', value)} >
                        {
                            method.map((item, i) =>
                                <Select.Option key={i} value={item}>{item}</Select.Option>
                            )
                        }
                    </Select>
                    <Input style={{ width: 'calc(100% - 100px)' }} defaultValue={element.url} onChange={(e) => this.tableDataChange(i, 'url', e.target.value)} />
                </Input.Group>,
                action: <AddAndSub type="sub" sub={() => {
                    this.subAction(i);
                }} />
            })

        }
        return dataSource
    }

    tableDataChange(i, key, value) {
        let tableData = this.details.table.getData;
        if (key === 'name')
            value = common.stripscript(value);
        tableData[i][key] = value;
        this.details.table.setData(tableData);
        // this.details.table.setDataSource(this.renderTable(tableData));
    }

    addAction() {
        let tableData = this.details.table.getData;
        tableData.push({ label: "", method: "", name: "", url: "", })
        this.details.table.setData(tableData);
        this.details.table.setDataSource(this.renderTable(tableData));
    }

    subAction(index) {
        let tableData = this.details.table.getData;
        tableData.splice(index, 1);
        console.log("tableData", tableData);
        this.details.table.setData(tableData);
        this.details.table.setDataSource(this.renderTable(tableData));
    }

    saveDetailsForApi() {
        let actions = {}
        this.details.table.getData.forEach(element => {
            actions[element.label] = element;
        })
        let data = this.details.getData;
        data.actions = actions;

        common.loading.show();
        powerService.saveDetails(data).then(this.saveDetailsForApiCallBack).catch(() => common.loading.hide());
    }
    @action.bound saveDetailsForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
        if (common.isEmpty(this.details.getData.id))
            this.getTreeForApi();
        this.getDetailsByIdForApi(res.data.result.id);
    }

    deleteOneForApi(id) {

        let self = this;
        Modal.confirm({
            title: '确定删除吗？',
            content: '同时删除所有子节点',
            onOk() {
                console.log('OK');
                common.loading.show();
                powerService.deleteOne(id).then(self.deleteOneForApiCallBack).catch(() => common.loading.hide())
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    }
    @action.bound deleteOneForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.getTreeForApi();

        message.success("删除成功");
    }

    moveNodeForApi(id, parentId, ids) {
        common.loading.show();
        powerService.moveNode(id, parentId, ids).then(this.moveNodeForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound moveNodeForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return

    }

    addOneMenu(parentId) {
        common.loading.show();
        let menu = {
            actions: {},
            label: "",
            method: "",
            name: "",
            url: "",
            parentId: parentId
        }
        this.details.setData(menu);
        this.details.table.setDataSource([]);
        common.loading.hide();

        message.info('请在右侧填写基本信息');
    }
}
export default new Store