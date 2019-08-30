/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:01:23
 * @Description: 
 */

import {observable, action, computed, toJS, autorun} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, Modal} from 'antd';
import Status from '@/components/system/config/system-var/Status';
import TableAction from '@/components/system/config/system-var/TableAction';
import React from 'react';
import systemVarService from '@/api/system/config/systemVarService';
import filter from '@/filters/variable';
import AddAndSub from '@/components/AddAndSub';

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '名称',
        dataIndex: 'keyName',
        key: 'keyName',
    }, {
        title: '标识',
        dataIndex: 'keyCode',
        key: 'keyCode',
        sorter: (a, b) => {
            return a.keyCode.localeCompare(b.keyCode)
        }
    }, {
        title: '创建时间',
        dataIndex: 'createdTime',
        key: 'createdTime',
        sorter: (a, b) => {
            return String(a.createdTime).localeCompare(String(b.createdTime))
        }
    }, {
        title: '类型',
        dataIndex: 'dataType',
        key: 'dataType'
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status'
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 80
    },
]

const columns2 = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '名称',
        dataIndex: 'dataName',
        key: 'dataName',
    }, {
        title: '标识',
        dataIndex: 'dataCode',
        key: 'dataCode',
        sorter: (a, b) => {
            return a.keyCode.localeCompare(b.dataCode)
        }
    }, {
        title: '值',
        dataIndex: 'dataValue',
        key: 'dataValue',
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action'
    },
]


class store {
    constructor() {
        this.getListForApi = this.getListForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.deleteForApi = this.deleteForApi.bind(this);
        this.changeStatusForApi = this.changeStatusForApi.bind(this);
        this.saveForApi = this.saveForApi.bind(this);
        this.getDetailsForApi = this.getDetailsForApi.bind(this);
        this.getDetailsListForApi = this.getDetailsListForApi.bind(this);
        this.saveDetailsListDetailsForApi = this.saveDetailsListDetailsForApi.bind(this);
        this.getDetailsListDetailsForApi = this.getDetailsListDetailsForApi.bind(this);
        this.deleteDetailsListDetailsForApi = this.deleteDetailsListDetailsForApi.bind(this);
        this.multiControl = this.multiControl.bind(this);
        autorun(() => {
            // this.getListForApi();
        })
    }

    resultDataList = [];

    keyCode = '';

    @observable selectedRowKeys = [];
    @observable isLoading = true;
    @observable flag = true;
    @observable page = {
        num: 1,
        size: 10,
        total: 0,
        get getNum() {
            return toJS(this.num)
        },
        get getSize() {
            return toJS(this.size)
        },
        get getTotal() {
            return toJS(this.total)
        },
        setNum(value) {
            this.num = value
        },
        setSize(value) {
            this.size = value
        },
        setTotal(value) {
            this.total = value
        }
    }
    @observable params = {
        query: '',
        get getQuery() {
            return toJS(this.query)
        },
        setQuery(value) {
            this.query = value
        },
    }
    @observable table = {
        columns: columns,
        dataSource: [],
        selectKeys: [],
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
        get getSelectKeys() {
            return toJS(this.selectKeys)
        },
        setColumns(value) {
            this.colums = value
        },
        setDataSource(value) {
            this.dataSource = value
        },
        setSelectKeys(value) {
            this.selectKeys = value
        }
    }

    @observable table2 = {
        columns: columns2,
        dataSource: [],
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
        setColumns(value) {
            this.colums = value
        },
        setDataSource(value) {
            this.dataSource = value
        },
    }

    @observable modal = {
        save: {
            isShow: false,
            get getIsShow() {
                return toJS(this.isShow)
            },
            setIsShow(value) {
                this.isShow = value
            },
        },
        drawer1: {
            isShow: false,
            get getIsShow() {
                return toJS(this.isShow)
            },
            setIsShow(value) {
                this.isShow = value
            },
        },
        drawer2: {
            isShow: false,
            get getIsShow() {
                return toJS(this.isShow)
            },
            setIsShow(value) {
                this.isShow = value
            },
        }
    }

    @observable data = {
        "keyName": null,
        "keyCode": null,
        "dataType": null,
        "status": 2
    }

    @computed get getData() {
        return toJS(this.data)
    }

    @action setData(value) {
        this.data = value
    }

    @observable data2 = {
        "dataName": null,
        "dataCode": null,
        "keyCode": null,
        "dataValue": null,
        "sort": 0,
        "status": 2
    }

    @computed get getData2() {
        return toJS(this.data2)
    }

    @action setData2(value) {
        this.data2 = value
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getFlag() {
        return toJS(this.flag)
    }

    @action.bound setFlag(value) {
        this.flag = value;
    }

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

    getListForApi() {
        this.setIsLoading(true);
        let params = {
            query: this.params.getQuery,
            page: this.page.getNum,
            size: this.page.getSize
        }
        systemVarService.getList(params).then(this.getListForApiCallBack);
    }

    @action.bound getListForApiCallBack(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        this.resultDataList = common.deepClone(res.data.pageList.resultList);
        if (!common.isEmpty(res.data.pageList.resultList)) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = common.deepClone(element);
                data.action = <TableAction status={data.status} dataId={data.id} deleteOne={this.deleteForApi}
                                           changeStatus={this.changeStatusForApi}/>
                data.key = i;
                data.index = i + 1;
                data.dataType = data.dataType == 2003 ? <a onClick={() => {
                    this.modal.drawer1.setIsShow(true);
                    this.getDetailsListForApi(data.keyCode)
                }}>{filter.systemVarDataType(data.dataType)}</a> : filter.systemVarDataType(data.dataType);
                data.status = <Status status={data.status}/>;
                tempArray.push(data);
            }
        } else {
            this.resultDataList = [];
        }
        this.table.setSelectKeys([]);
        this.page.setNum(res.data.pageList.sum === 0 ? this.page.getNum : ++res.data.pageList.curPageNO);
        this.page.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.table.setDataSource(tempArray);
    }


    multiControl(option) {
        var ids = [];
        for (let i = 0; i < this.resultDataList.length; i++) {
            for (let j = 0; j < this.getSelectedRowKeys.length; j++) {
                const element = this.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(this.resultDataList[i]);
                    ids.push(row.id);
                }
            }
        }
        if (ids.length === 0) {
            message.warning('暂无符合条件的数据');
            return
        }

        if (option === '删除') {
            // 可通过改接口对批量操作优化
            ids.forEach(item => {
                this.deleteForApi(item);
            })
        }
    }

    deleteForApi(id) {
        common.loading.show();
        systemVarService.delete(id).then(this.deleteForApiCallaBack).catch(() => common.loading.hide());
    }

    @action.bound deleteForApiCallaBack(res) {
        common.loading.hide();
        this.selectedRowKeys = [];
        if (!publicUtils.isOk(res)) return
        message.success("删除成功");
        this.getListForApi();
    }

    changeStatusForApi(id, isToOnline) {
        common.loading.show();
        systemVarService.changeStatus(id, isToOnline).then(this.changeStatusForApiCallBack).catch(() => common.loading.hide());
    }

    @action.bound changeStatusForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("操作成功");
        this.getListForApi();
    }

    saveForApi() {
        common.loading.show();
        systemVarService.save(this.getData).then(this.saveForApiCallBack).catch(() => common.loading.hdie());
    }

    @action.bound saveForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
        this.modal.save.setIsShow(false);
        this.getListForApi();
        this.setSelectedRowKeys([]);
    }

    getDetailsForApi(id) {
        common.loading.show();
        systemVarService.getDetails(id).then(this.getDetailsForApiCallBack).catch(() => common.loading.hide());
    }

    @action.bound getDetailsForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.setData(res.data.result);
        this.modal.save.setIsShow(true);
        this.getListForApi();
        this.setSelectedRowKeys([]);
    }

    getDetailsListForApi(keyCode) {
        this.keyCode = keyCode;
        common.loading.show();
        systemVarService.getDetailsList(keyCode).then(this.getDetailsListForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound getDetailsListForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.pageList.resultList)) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                element.key = i;
                element.index = i + 1;
                element.dataName = <a onClick={() => {
                    this.getDetailsListDetailsForApi(element.id);
                }}>{element.dataName}</a>;
                element.action = publicUtils.isAuth("system:config:systemVar:delete") ?
                    <AddAndSub type="sub" sub={() => this.deleteDetailsListDetailsForApi(element.id)}/> : '';
            }
            this.table2.setDataSource(res.data.pageList.resultList);
        } else {
            this.table2.setDataSource([]);
        }
    }

    saveDetailsListDetailsForApi() {
        common.loading.show();
        systemVarService.saveDetailsListDetails(this.getData2).then(this.saveDetailsForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound saveDetailsForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("保存成功");
        this.modal.drawer2.setIsShow(false);
        this.getDetailsListForApi(this.keyCode);
    }

    getDetailsListDetailsForApi(id) {
        common.loading.show();
        systemVarService.getDetailsListDetails(id).then(this.getDetailsListDetailsForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound getDetailsListDetailsForApiCallBack(res) {
        common.loading.hide();
        this.modal.drawer2.setIsShow(true);
        if (!publicUtils.isOk(res)) return
        this.setData2(res.data.result);
    }

    deleteDetailsListDetailsForApi(id) {
        let self = this;
        Modal.confirm({
            title: '确定删除？',
            content: '',
            okText: '确定',
            okType: 'danger',
            cancelText: '取消',
            onOk() {
                console.log('OK');
                common.loading.show();
                systemVarService.deleteDetailsListDetails(id).then(self.deleteDetailsListDetailsForApiCallBack).catch(() => common.loading.hide())
            },
            onCancel() {
                console.log('Cancel');
            },
        });

    }

    @action.bound deleteDetailsListDetailsForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("删除成功");
        this.getDetailsListForApi(this.keyCode);
        this.setSelectedRowKeys([]);
    }

    initParams() {
        this.page.setNum(1);
        this.page.setSize(10);
        this.page.setTotal(0);
        this.params.setQuery({keyword: '', dataType: ''});
        this.table.setSelectKeys([]);
    }

}

export default new store