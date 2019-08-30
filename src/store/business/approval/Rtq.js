/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-03-13 11:40:18
 * @Description: 
 */

import { observable, action, computed, toJS, autorun } from 'mobx';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
// import { message, Modal, Icon } from 'antd';
import Status from '@/components/business/approval/Status';
import TableAction from '@/components/business/approval/rtq/TableAction';
import React from 'react';
import approvalService from '../../../api/business/approvalService';
import { message } from 'antd';
const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '名称',
        dataIndex: 'rtqName',
        key: 'rtqName'
    }, {
        title: '标识',
        dataIndex: 'rtqCode',
        key: 'rtqCode',
        sorter: (a, b) => {
            return a.rtqCode.localeCompare(b.rtqCode)
        }
    }, {
        title: '版本',
        dataIndex: 'version',
        key: 'version',
        sorter: (a, b) => {
            return String(a.version).localeCompare(String(b.version))
        }
    }, {
        title: '操作类型',
        dataIndex: 'actionTypeName',
        key: 'actionTypeName'
    }, {
        title: '提交时间',
        dataIndex: 'createdTime',
        key: 'createdTime'
    }, {
        title: '提交人',
        dataIndex: 'createdUser',
        key: 'createdUser'
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
class store {
    constructor() {
        this.getListForApi = this.getListForApi.bind(this);
        this.passForApi = this.passForApi.bind(this);
        this.rejectForApi = this.rejectForApi.bind(this);
        this.multiPassForApi = this.multiPassForApi.bind(this);
        this.multiRejectForApi = this.multiRejectForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        autorun(() => {
            // this.getListForApi();
        })
    }

    resultDataList = [];

    @observable selectedRowKeys = [];
    @observable isLoading = true;
    @observable page = {
        num: 1,
        size: 10,
        total: 0,
        get getNum() { return toJS(this.num) },
        get getSize() { return toJS(this.size) },
        get getTotal() { return toJS(this.total) },
        setNum(value) { this.num = value },
        setSize(value) { this.size = value },
        setTotal(value) { this.total = value }
    }
    @observable params = {
        code: '',
        name: '',
        status: 0,
        type: 0,
        get getCode() { return toJS(this.code) },
        get getName() { return toJS(this.name) },
        get getStatus() { return toJS(this.status) },
        get getType() { return toJS(this.type) },
        setCode(value) { this.code = value },
        setName(value) { this.name = value },
        setStatus(value) { this.status = value },
        setType(value) { this.type = value }
    }
    @observable table = {
        columns: columns,
        dataSource: [],
        selectedKey: [],
        get getColumns() { return toJS(this.columns) },
        get getDataSource() { return toJS(this.dataSource) },
        get getSelectKey() { return toJS(this.getSelectKey) },
        setColumns(value) { this.colums = value },
        setDataSource(value) { this.dataSource = value },
        setSelectKey(value) { this.selectedKey = value }
    }

    @observable modal = {
        auditProcess: {
            isShow: false,
            get get() { return toJS(this.isShow) },
            set(value) {
                this.isShow = value
            }
        }
    }

    @observable auditProcess = {
        info: {},
        info2: {},
        get getInfo() { return toJS(this.info) },
        setInfo(value) { this.info = value },
        get getInfo2() { return toJS(this.info2) },
        setInfo2(value) { this.info2 = value }
    }

    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value; }
    @computed get getSelectedRowKeys() { return toJS(this.selectedRowKeys) }
    @action.bound setSelectedRowKeys(value) { this.selectedRowKeys = value; }

    getListForApi() {
        this.setIsLoading(true);
        let params = {
            code: this.params.getCode,
            name: this.params.getName,
            status: this.params.getStatus,
            type: this.params.getType,
            page: this.page.getNum,
            size: this.page.getSize
        }
        approvalService.getList(params).then(this.getListForApiCallBack);
    }
    @action.bound getListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        this.resultDataList = common.deepClone(res.data.result.resultList);
        if (!common.isEmpty(res.data.result.resultList)) {
            for (let i = 0; i < res.data.result.resultList.length; i++) {
                const element = res.data.result.resultList[i];
                let data = common.deepClone(element);
                data.index = i + 1;
                data.key = i;
                data.status = <Status status={element.status} />;
                data.rtqName = <a onClick={() => {
                    this.auditProcess.setInfo({
                        avatar: element.createdUser ? element.createdUser.substr(0, 1) : '审',
                        createdUser: element.createdUser,
                        createdTime: element.createdTime,
                        remark: element.remark ? element.remark : '',
                        status: element.status,
                        actionTypeName: element.actionTypeName
                    });
                    this.auditProcess.setInfo2({
                        avatar: element.approvalUser ? element.approvalUser.substr(0, 1) : '审',
                        approvalUser: element.approvalUser,
                        approvalTime: element.approvalTime,
                        status: element.status
                    });
                    this.modal.auditProcess.set(true);
                }}>{data.rtqName}</a>
                data.action = <TableAction
                    passCallBack={this.passForApi}
                    refuseCallBack={this.rejectForApi}
                    isShowYOrN={this.params.getStatus === 0 ? true : false}
                    auditProcessCallBack={(value) => {
                        this.auditProcess.setInfo({
                            avatar: element.createdUser ? element.createdUser.substr(0, 1) : '审',
                            createdUser: element.createdUser,
                            createdTime: element.createdTime,
                            remark: element.remark ? element.remark : '',
                            status: element.status,
                            actionTypeName: element.actionTypeName
                        });
                        this.auditProcess.setInfo2({
                            avatar: element.approvalUser ? element.approvalUser.substr(0, 1) : '审',
                            approvalUser: element.approvalUser,
                            approvalTime: element.approvalTime,
                            status: element.status
                        });
                        this.modal.auditProcess.set(value);
                    }}
                    index={i}
                />;
                data.auditInfo = {
                    avatar: element.createdUser ? element.createdUser.substr(0, 1) : '审',
                    createdUser: element.createdUser,
                    createdTime: element.createdTime,
                    remark: element.remark ? element.remark : '',
                    status: element.status
                }
                tempArray.push(data);
            }
        } else {
            if (this.page.getNum > 1) {
            }
        }
        // if (this.params.getStatus !== 0 && this.table.getColumns.length === 8) {
        //     this.table.setColumns(this.table.getColumns.splice(-1, 1));
        // } else if (this.params.getStatus === 0 && this.table.getColumns.length === 7) {
        //     this.table.setColumns(this.table.getColumns.push({
        //         title: '操作',
        //         dataIndex: 'action',
        //         key: 'action'
        //     }));
        // }
        this.setSelectedRowKeys([]);
        this.page.setNum(res.data.result.sum === 0 ? this.page.getNum : ++res.data.result.curPageNO);
        this.page.setTotal(res.data.result.sum);
        this.setIsLoading(false);
        this.table.setDataSource(tempArray);
    }

    passForApi(i) {
        common.loading.show();
        approvalService.pass(this.resultDataList[i].rtqId, this.params.getType, this.resultDataList[i]).then(this.passForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound passForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("操作成功");
        this.getListForApi();
    }
    rejectForApi(i) {
        common.loading.show();
        approvalService.reject(this.resultDataList[i].rtqId, this.params.getType, this.resultDataList[i]).then(this.rejectForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound rejectForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("操作成功");
        this.getListForApi();
    }
    multiPassForApi() {
        common.loading.show();
        let params = [];
        for (let i = 0; i < this.resultDataList.length; i++) {
            for (let j = 0; j < this.getSelectedRowKeys.length; j++) {
                const element = this.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(this.resultDataList[i]);
                    params.push(row);
                }
            }
        }
        approvalService.multiPass(params).then(this.multiPassForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound multiPassForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("操作成功");
        this.setSelectedRowKeys([]);
        this.getListForApi();
    }
    multiRejectForApi() {
        common.loading.show();
        let params = [];
        for (let i = 0; i < this.resultDataList.length; i++) {
            for (let j = 0; j < this.getSelectedRowKeys.length; j++) {
                const element = this.getSelectedRowKeys[j];
                if (element === i) {
                    let row = common.deepClone(this.resultDataList[i]);
                    params.push(row);
                }
            }
        }
        approvalService.multiReject(params).then(this.multiRejectForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound multiRejectForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("操作成功");
        this.setSelectedRowKeys([]);
        this.getListForApi();
    }

    initParams() {
        this.page.setNum(1);
        this.page.setSize(10);
        this.page.setTotal(0);
        this.params.setCode('');
        this.params.setName('');
        this.params.setStatus(0);
        this.params.setType(0);
    }

}

export default new store