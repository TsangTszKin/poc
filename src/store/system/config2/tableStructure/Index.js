/*
 * @Author: liuzhuolin
 * @Date: 2019-05-07 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-13 10:53:04
 * @Description:
 */

import {observable, action, computed, toJS, autorun} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import Status from '@/components/system/config2/tableStructure/tableStructureStatus';
import TableAction from '@/components/system/config2/tableStructure/TableAction';
import React from 'react';
import tablesService from '@/api/system/config2/tablesService';
import {message, Divider, Modal} from 'antd';

const confirm = Modal.confirm;
const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    }, {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    }, {
        title: '标识',
        dataIndex: 'code',
        key: 'code',
        sorter: (a, b) => {
            return String(a.code).localeCompare(String(b.code))
        }
    }, {
        title: '维度',
        dataIndex: 'dimensionCode',
        key: 'dimensionCode',
    }, /*{
        title: '类型',
        dataIndex: 'dateBaseType',
        key: 'dateBaseType'
    }, */{
        title: '更新时间',
        dataIndex: 'modifiedTime',
        key: 'modifiedTime',
        sorter: (a, b) => {
            return String(a.modifiedTime).localeCompare(String(b.modifiedTime))
        }
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        filters: [{
            text: '未同步',
            value: 0,
        }, {
            text: '已同步',
            value: 1,
        }],
        onFilter: (value, record) => record.status.props.children.props.status == value
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 50
    },
]

class store {
    constructor() {
        this.getListForApi = this.getListForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.changeForApi = this.changeForApi.bind(this);
        this.showConfirm = this.showConfirm.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
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
        status: 0,
        dimensionId: '',
        get getQuery() {
            return toJS(this.query)
        },
        get getStatus() {
            return toJS(this.status)
        },
        get getDimensionId() {
            return toJS(this.dimensionId)
        },
        setQuery(value) {
            this.query = value
        },
        setStatus(value) {
            this.status = value
        },
        setDimensionId(value) {
            this.dimensionId = value
        }
    }
    @observable table = {
        columns: columns,
        dataSource: [],
        get getColumns() {
            return toJS(this.columns)
        },
        get getData() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
        setColumns(value) {
            this.colums = value
        },
        setData(value) {
            this.colums = value
        },
        setDataSource(value) {
            this.dataSource = value
        },
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }
    @computed get getSelectedRowKeys() { return toJS(this.selectedRowKeys) }
    @action.bound setSelectedRowKeys(value) { this.selectedRowKeys = value; }

    getListForApi() {
        this.setIsLoading(true);
        let params = {
            status: this.params.getStatus,
            query: this.params.getQuery,
            page: this.page.getNum,
            size: this.page.getSize,
            dimensionId: this.params.getDimensionId,
        }
        console.log("paramsparamsparams",params)
        tablesService.getTablesList(params).then(this.getListForApiCallBack);
    }

    @action.bound getListForApiCallBack(res) {
        console.log("getListForApiCallBack.res", res)
        // if (!publicUtils.isOk(res)) return
        let tempArray = [];
        this.resultDataList = common.deepClone(res.data.pageList.resultList);
        if (!common.isEmpty(res.data.pageList.resultList)) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = common.deepClone(element);
                /*if (!common.isEmpty(data.dimensionVOS)) {
                    console.log("data.dimensionVOS???",data.dimensionVOS)
                }*/
                tempArray.push({
                    key: i,
                    index: i + 1,
                    name: data.name,
                    code: data.code,
                    dimensionCode: data.dimensionCode,
                    dateBaseType: data.dateBaseType === 1 ? 'RTD' : 'My SQL',
                    modifiedTime: data.modifiedTime,
                    status: <div style={{width: '170px'}}>
                        <Status status={data.status} style={{float: 'left'}}/>
                    </div>,
                    action: <TableAction status={data.status} editPath={`/system/config2/tableStructure/save/${data.id}`}
                                         detailPath={`/system/config2/tableStructure/view/${data.id}`}
                                         changeModal={this.showConfirm} /*changeStatus={this.changeStatusForApi}*/
                                         deleteOne={this.deleteOne} dataId={data.id}/>
                });
            }
        } else {
            this.resultDataList = [];
            if (this.page.getNum > 1) {
            }
        }
        this.page.setNum(res.data.pageList.sum === 0 ? this.page.getNum : ++res.data.pageList.curPageNO);
        this.page.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setSelectedRowKeys([]);
        this.table.setDataSource(tempArray);
    }

    tablesToRedis() {
        common.loading.show();
        tablesService.tablesToRedis().then(this.tablesToRedisCallBack);
    }

    @action.bound tablesToRedisCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("推送成功")
        this.getListForApi();
    }

    showConfirm(value, id, isToOnline) {
        let self = this;
        if (value === true) {
            confirm({
                title: '是否同步到RTD？',
                onOk() {
                    self.changeForApi(id, isToOnline);
                    /*return new Promise((resolve, reject) => {
                        setTimeout(Math.random() > 0.5 ? resolve : reject, 1000);
                    }).catch(() => console.log('Oops errors!'));*/
                },
                onCancel() {
                },
            });
        }
    }

    changeForApi(id, isToOnline) {
        common.loading.show();
        tablesService.tablesToRTD(id, isToOnline).then(this.changeStatusForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound changeStatusForApiCallBack(res) {
        this.getListForApi();
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("同步成功");
        this.getListForApi();
    }

    deleteOne(ids) {
        common.loading.show();
        tablesService.deleteOneTables(ids).then(res => {
            common.loading.hide();
            this.getListForApi();
            this.setSelectedRowKeys([]);
            if (!publicUtils.isOk(res)) return
            message.success("删除成功")
            this.getListForApi();
            this.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })
    }

    initParams() {
        this.page.setNum(1);
        this.page.setSize(10);
        this.page.setTotal(0);
        this.params.setQuery('');
    }

}

export default new store