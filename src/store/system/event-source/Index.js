/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:04:15
 * @Description: 
 */

import {observable, action, computed, toJS, autorun} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
// import { message, Modal, Icon } from 'antd';
import TableAction from '@/components/system/event-source/TableAction';
import DimensionMappingTableAction from '@/components/system/event-source/dimension-mapping/TableAction';
import React from 'react';
import eventSourceService from '@/api/system/eventSourceService';
import {message} from 'antd';
import filter from '@/filters/variable';
import ReleaseStatus2 from '@/components/ReleaseStatus2';
import WebSocketStore from '@/store/system/event-source/WebSocketStore2';

const modalColumns = [
    {
        title: '维度名称',
        dataIndex: 'dimensionName',
        key: 'dimensionName',
        width: 120
    }, {
        title: '是否入库',
        dataIndex: 'mode',
        key: 'mode',
        width: 120
    }, {
        title: '维度主键',
        dataIndex: 'eventPartitionKey',
        key: 'eventPartitionKey',
        width: 120
    }, {
        title: '维度时间',
        dataIndex: 'eventTimeKey',
        key: 'eventTimeKey',
        width: 120
    }, {
        title: '维度入库表',
        dataIndex: 'tableName',
        key: 'tableName',
        width: 120
    }, {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        width: 120
    }, {
        title: '操作',
        dataIndex: 'action',
        key: 'action'
    },
]

class store {
    constructor() {
        this.getListForApi = this.getListForApi.bind(this);
        this.getDimensionMappingForApi = this.getDimensionMappingForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.changeStatusForApi = this.changeStatusForApi.bind(this);
        this.pushToRTD = this.pushToRTD.bind(this);
        this.changeDimensionMappingStatusForApi = this.changeDimensionMappingStatusForApi.bind(this);
        this.deleteDimensionMappingForApi = this.deleteDimensionMappingForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.getSourceStatusTypeList = this.getSourceStatusTypeList.bind(this);
        autorun(() => {
            // this.getListForApi();
        })
    }

    resultDataList = [];
    @observable activeDimensionId = '';

    @observable selectedRowKeys = [];
    @observable isLoading = true;
    @observable StatusTypeList = [];
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
        status: '',
        get getQuery() {
            return toJS(this.query)
        },
        get getStatus() {
            return toJS(this.status)
        },
        setQuery(value) {
            this.query = value
        },
        setStatus(value) {
            this.status = value
        }
    }
    @observable table = {
        dataSource: [],
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
        setColumns(value) {
            this.columns = value
        },
        setDataSource(value) {
            this.dataSource = value
        },
    }
    @observable modal = {
        isShow: false,
        columns: modalColumns,
        dataSource: [],
        share: {
            isShow: false,
            get getIsShow() {
                return toJS(this.isShow)
            },
            setIsShow(value) {
                this.isShow = value
            }
        },
        get getIsShow() {
            return toJS(this.isShow)
        },
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
        setIsShow(value) {
            this.isShow = value
        },
        setColumns(value) {
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

    @computed get getStatusTypeList() {
        return toJS(this.statusTypeList)
    }

    @action setStatusTypeList(value) {
        this.statusTypeList = value
    }

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

    @computed get getActiveDimensionId() {
        return toJS(this.activeDimensionId)
    }

    @action.bound setActiveDimensionId(value) {
        this.activeDimensionId = value;
    }

    getListForApi() {
        this.setIsLoading(true);
        let params = {
            status: this.params.getStatus,
            query: this.params.getQuery,
            page: this.page.getNum,
            size: this.page.getSize,
        }
        eventSourceService.getList(params).then(this.getListForApiCallBack);
    }

    @action.bound getListForApiCallBack(res) {
        console.log("res", res)
        // if (!publicUtils.isOk(res)) return
        let tempArray = [];
        this.resultDataList = common.deepClone(res.data.pageList.resultList);
        if (!common.isEmpty(res.data.pageList.resultList)) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                let data = common.deepClone(element);
                let dimensionNameArry = [];
                if (!common.isEmpty(data.dimensionVOS)) {
                    data.dimensionVOS.forEach(element2 => {
                        // console.log("element2", element2)
                        dimensionNameArry.push(element2.name)
                    })
                }
                tempArray.push({
                    key: i,
                    index: i + 1,
                    eventSourceName: data.eventSourceName,
                    eventSourceType: data.eventSourceType,
                    dataSourceType: filter.dataSourceType(data.dataSourceType),
                    dataSinkType: filter.dataSinkType(data.dataSinkType),
                    decisionFlowType: filter.decisionFlowType(data.decisionFlowType),
                    statusNumber: data.status,
                    status:
                        <ReleaseStatus2 statusList={this.getStatusTypeList} status={element.status}
                                        style={{float: 'left'}} data={data}/>
                        ,
                    dimensionVOS: <a onClick={() => {
                        this.getDimensionMappingForApi(data.eventSourceId);
                    }}>{common.arrayToString(dimensionNameArry)}</a>,
                    action: <TableAction status={data.status} syncStatus={data.syncStatus}
                                         editPath={`/system/config2/eventSource/eventSourceDetails/${data.id}`}
                                         detailsMappingPath={`/system/config2/eventSource/eventSourceDetailsMapping/${data.id}`}
                                         changeStatus={this.changeStatusForApi} changeStatus2={this.pushToRTD}
                                         deleteOneIndex={this.deleteOne} dataId={data.id}/>
                });
            }
        } else {
            this.resultDataList = [];
        }
        this.page.setNum(res.data.pageList.sum === 0 ? this.page.getNum : ++res.data.pageList.curPageNO);
        this.page.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setSelectedRowKeys([]);
        this.table.setDataSource(tempArray);
    }

    getDimensionMappingForApi(eventSourceId) {
        this.setActiveDimensionId(eventSourceId);
        // let ticket = hex_md5(String(Math.random()));
        // sessionStorage.ticket = ticket;
        WebSocketStore.init("onOffMapping",eventSourceId);
        common.loading.show();
        eventSourceService.getDimensionMappingList(this.getActiveDimensionId).then(this.getDimensionMappingForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound getDimensionMappingForApiCallBack(res) {
        common.loading.hide();
        this.modal.setIsShow(true);
        if (!publicUtils.isOk(res)) return

        if (!common.isEmpty(res.data.pageList.resultList)) {
            res.data.pageList.resultList.forEach(element => {
                let data = common.deepClone(element);
                let status = element.status;
                element.status = <ReleaseStatus2 status={data.status} data = {data}/>;
                element.action = <DimensionMappingTableAction status={status} changeStatus={this.changeDimensionMappingStatusForApi}
                                                 deleteOne={this.deleteDimensionMappingForApi} dataId={element.id}/>;
                element.key = common.getGuid();
                element.width = 150;
                element.mode = element.mode === 0 ? '是' : '否';
            })
            this.modal.setDataSource(res.data.pageList.resultList);
        } else {
            this.modal.setDataSource([]);
        }
    }

    getSourceStatusTypeList() {
        eventSourceService.getSourceStatusTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val,
                    value: element.label,
                    format: element.format
                });
                this.setStatusTypeList(tempArray);
                console.log("tempArray", tempArray)
            })
        })
    }

    changeStatusForApi(id, isToOnline) {
        common.loading.show();
        eventSourceService.changeDimensionMappingStatus(id, isToOnline).then(this.changeStatusForApiCallBack).catch(() => common.loading.hide())
    }

    pushToRTD(id, isToOnline) {//推送事件源到RTD(同步)
        common.loading.show();
        eventSourceService.pushToRTD(id, isToOnline).then(this.pushToRTDCallBack).catch(() => common.loading.hide())
    }

    @action.bound changeStatusForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('操作成功');
        this.getListForApi();
    }

    @action.bound pushToRTDCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('操作成功');
        this.getListForApi();
    }

    changeDimensionMappingStatusForApi(id, isToOnline) {
        common.loading.show();
        eventSourceService.changeDimensionMappingStatus(id, isToOnline).then(this.changeDimensionMappingStatusForApiCallaBack).catch(() => common.loading.hide())
    }

    @action.bound changeDimensionMappingStatusForApiCallaBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.getDimensionMappingForApi(this.activeDimensionId);
    }

    deleteDimensionMappingForApi(id) {
        common.loading.show();
        eventSourceService.deleteDimensionMapping(id).then(this.deleteDimensionMappingForApiCallBack).catch(() => common.loading.hide())
    }

    @action.bound deleteDimensionMappingForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("删除成功");
        this.getDimensionMappingForApi(this.activeDimensionId);
    }

    deleteOne(ids) {
        common.loading.show();
        eventSourceService.deleteOneEventSource(ids).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            this.getListForApi();
            message.success("删除成功");
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