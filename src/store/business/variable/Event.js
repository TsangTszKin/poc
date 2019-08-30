/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-05-13 15:42:24
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message, Modal } from 'antd';
import TableAction from '@/components/business/variable/event/TableAction';
import Status from '@/components/Status';
import React from 'react';

class store {

    constructor() {
        this.changeStatus = this.changeStatus.bind(this);
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.initParams = this.initParams.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', eventSourceId: '', };
    @observable selectedRowKeys = [];

    @computed get getQuery() { return toJS(this.query) }
    @action.bound setQuery(value) { this.query = value; }

    @computed get getSelectedRowKeys() { return toJS(this.selectedRowKeys) }
    @action.bound setSelectedRowKeys(value) { this.selectedRowKeys = value; }

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

    initParams() {
        this.setQuery({ name: '', code: '', eventSourceId: '', });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(10);
    }

    getDataSourceForApi() {
        variableService.getEventVarList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }
    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        this.setSelectedRowKeys([]);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (res.data.pageList.resultList) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = element;
                data.index = i + 1;
                data.key = i;
                data.statusLabel = <Status status={element.status} />;
                data.action = <TableAction dataId={element.id} status={element.status} changeStatus={this.changeStatus} />;
                dataList.push(data);
            }
        }
        this.setPageNum(res.data.pageList.sum === 0 ? this.getPageNum : ++res.data.pageList.curPageNO);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        console.log("dataList", dataList);
        this.setDataSource(dataList);

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
                variableService.changeEventVarStatus([id], "online").then(res => {
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
                variableService.changeEventVarStatus([id], "offline").then(res => {
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
}

export default new store