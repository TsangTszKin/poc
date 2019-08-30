/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:51:31
 * @Description: 
 */
import {observable, action, computed, toJS} from 'mobx';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, Modal} from 'antd';
import TableAction from '@/components/business/variable/batch/TableAction';
import Status from '@/components/Status';
import React from 'react';

class store {

    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable selectedRowKeys = [];
    @observable showToolBarType = 1;
    @observable isLoading = true;
    @observable query = {name: '', code: '', category: '',dimensionId:''};

    @computed get getQuery() {
        return toJS(this.query)
    }

    @action.bound setQuery(value) {
        this.query = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getDataSource() {
        return toJS(this.dataSource)
    }

    @action.bound setDataSource(value) {
        this.dataSource = value;
    }

    @computed get getTotal() {
        return toJS(this.total)
    }

    @action.bound setTotal(value) {
        this.total = value;
    }

    @computed get getPageNum() {
        return toJS(this.pageNum)
    }

    @action.bound setPageNum(value) {
        this.pageNum = value;
    }

    @computed get getPageSize() {
        return toJS(this.pageSize)
    }

    @action.bound setPageSize(value) {
        this.pageSize = value;
    }

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

    @computed get getShowToolBarType() {
        return toJS(this.showToolBarType)
    }

    @action.bound setShowToolBarType(value) {
        this.showToolBarType = value;
    }

    initParams() {
        this.setQuery({name: '', code: '', category: '',dimensionId:''});
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(10);
    }


    getDataSourceForApi() {
        variableService.getBatchVarList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }

    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return;
        let dataList = [];
        this.resultDataList = common.deepClone(res.data.pageList.resultList);
        if (res.data.pageList.resultList) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = common.deepClone(element);
                data.index = i + 1;
                data.key = i;
                data.status = <Status status={element.status}/>;
                data.action = <TableAction dataId={element.id} status={element.status} changeStatus={this.changeStatus}
                                           deleteOne={this.deleteOne}
                                           editPath={{pathname: '/business/variable/batch/save/' + element.id}}/>;
                dataList.push(data);
            }
        } else {
            this.resultDataList = [];
        }
        this.setSelectedRowKeys([]);
        this.setPageNum(res.data.pageList.sum === 0 ? this.getPageNum : ++res.data.pageList.curPageNO);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);
    }

    deleteOne(dataId) {
        common.loading.show();
        variableService.deleteBatchVar(dataId).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
            this.getDataSourceForApi();
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
                        element.status = <Status status={2}/>;
                    }
                })
                this.setDataSource(dataList);
                common.loading.show();
                variableService.changeBatchVar([id], true).then(res => {
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
                        element.status = <Status status={3}/>;
                    }
                })
                this.setDataSource(dataList);
                common.loading.show();
                variableService.changeBatchVar([id], false).then(res => {
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
                    onOk() {
                    },
                });
                break;
        }
    }

}

export default new store