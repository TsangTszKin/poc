/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:50:43
 * @Description: 
 */

import {observable, action, computed, toJS} from 'mobx';
import strategyService from '@/api/business/strategyService';
import variableService from '@/api/business/variableService';
import commonService from '@/api/business/commonService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, Modal} from 'antd';
import TableAction from '@/components/business/strategy/definition/TableAction';
import TableActionForVersion from '@/components/business/strategy/definition/TableActionForVersion';
import Status from '@/components/Status';
import ApprovalStatus from '@/components/ApprovalStatus';
import React from 'react';

const tableFiledsColumns = [{
    title: '优先级',
    dataIndex: 'priority',
    key: 'priority'
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name'
}, {
    title: '标识',
    dataIndex: 'code',
    key: 'code'
}, {
    title: '当前版本',
    dataIndex: 'version',
    key: 'version'
}, {
    title: '策略模式',
    dataIndex: 'type',
    key: 'type'
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status'
}]


class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.multiChangeStatusForApi = this.multiChangeStatusForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.getVersionListForApi = this.getVersionListForApi.bind(this);
        this.deleteStrategyVersionForApi = this.deleteStrategyVersionForApi.bind(this);
        this.getTemplateListForApi = this.getTemplateListForApi.bind(this);
        this.saveTemplateForApi = this.saveTemplateForApi.bind(this);
    }

    @observable isCanSubmit = false;
    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = {name: '', code: '', category: '', eventSourceId: '', status: '', approvalStatus: ''};
    @observable selectedRowKeys = [];
    @observable templateType = 2;//1自定义，2用模板
    @observable templateVO = {
        data: {
            "authorizationType": 0,//模板所有权 0:私有 1:公有
            "description": "",
            "id": "",
            "name": "",
            "type": 4//模板类型 0:实时查询变量 1:衍生变量 2:规则 3:规则集 4:决策流 5:策略
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        }
    }
    @observable useTimesTree = {
        times: '',
        data: {},
        show: false,
        get getTimes() {
            return toJS(this.times)
        },
        setTimes(value) {
            this.times = value
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value;
        },
        get getShow() {
            return toJS(this.show)
        },
        setShow(value) {
            this.show = value;
        }
    }

    @observable modal = {
        tableFields: {
            isShow: false,
            title: '',
            get getIsShow() {
                return toJS(this.isShow)
            },
            get getTitle() {
                return toJS(this.title)
            },
            setIsShow(value) {
                this.isShow = value
            },
            setTitle(value) {
                this.title = value
            }
        },
        version: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false
            },
        },
        shareTemplate: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false
            },
        },
        useTemplate: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false;
            },
        },
        importZIP: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false;
            },
        }
    }
    @observable tableFields = {
        columns: tableFiledsColumns,
        dataSource: [],
        selectedRowKeys: [],
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
        get getSelectedRowKeys() {
            return toJS(this.selectedRowKeys)
        },
        setSelectedRowKeys(value) {
            this.selectedRowKeys = value
        },
        setColumns(value) {
            this.columns = value
        },
        setDataSource(value) {
            this.dataSource = value
        },
        renderTable(list) {//{name: '', code: '', type: '', id: ''}
            let tempArray = [];
            if (common.isEmpty(list)) return tempArray
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                let type = '';
                switch (element.type) {
                    case 0:
                        type = '流程模式';
                        break;
                    case 1:
                        type = '贪婪模式';
                        break;
                    case 2:
                        type = 'SQL模式';
                        break;

                    default:
                        break;
                }
                tempArray.push({
                    key: i,
                    id: element.id,//提交要用到
                    eventSourceId: element.eventSourceId,//提交要用到
                    priority: (i + 1),
                    name: element.name,
                    code: element.code,
                    version: element.version,
                    type: type,
                    status: element.status
                })
            }
            return tempArray
        },
        dragSortCallBackFunc(dragIndex, hoverIndex) {
            let dataSource = common.deepClone(this.getDataSource);
            dataSource[dragIndex] = this.getDataSource[hoverIndex];
            dataSource[hoverIndex] = this.getDataSource[dragIndex];
            this.setDataSource(dataSource);
        }
    }
    @observable showToolBarType = 1;
    @observable versionList = [];

    responseData = [];
    @observable templateList = [];

    @computed get getTemplateType() {
        return toJS(this.templateType)
    }

    @action setTemplateType(value) {
        this.templateType = value
    }

    @computed get getTemplateList() {
        return toJS(this.templateList)
    }

    @action setTemplateList(value) {
        this.templateList = value
    }

    @computed get getShowToolBarType() {
        return toJS(this.showToolBarType)
    }

    @action.bound setShowToolBarType(value) {
        this.showToolBarType = value;
    }

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

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

    @computed get getIsCanSubmit() {
        return toJS(this.isCanSubmit);
    }

    @action.bound setIsCanSubmit(value) {
        this.isCanSubmit = value;
    }

    @computed get getSqlPreview() {
        return toJS(this.sqlPreview);
    }

    @action.bound setSqlPreview(value) {
        this.sqlPreview = value;
    }

    @computed get getVersionList() {
        return toJS(this.versionList)
    }

    @action.bound setVersionList(value) {
        this.versionList = value
    }

    initParams() {
        this.setQuery({name: '', code: '', category: '', eventSourceId: '', status: '', approvalStatus: ''});
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(0);
    }

    @action.bound submit(id) {
        common.loading.show();
        strategyService.submitRtq(id).then(this.submitRtqCallback).catch(() => {
            common.loading.hide();
        })
    }

    @action.bound submitRtqCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }


    getTemplateListForApi(type) {
        this.setTemplateType(2);
        common.loading.show();
        commonService.getTemplateList('', '', {code: '', name: '', type: type})
            .then(this.getTemplateListForApiCallBack).catch(() => {
            common.loading.hide();
        })
    }

    @action.bound getTemplateListForApiCallBack(res) {
        common.loading.hide();
        this.modal.useTemplate.show();
        if (!publicUtils.isOk(res)) return
        this.setTemplateList(res.data.pageList.resultList);
    }

    downloadTemplate() {
        // console.log(666);
        let transplantVO = {
            id: this.templateVO.getData.id,
            type: 5
        }
        commonService.getExportZIP(transplantVO).then(this.exportCallBack)
    }

    @action.bound exportCallBack(res) {
        common.loading.hide();
        // if (!publicUtils.isOk(res)) return
        const type = 'application/zip'
        const blob = new Blob([res.data], {type: type})
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        // let filename = this.templateVO.getData.name + '.zip';//设置文件名称
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', this.templateVO.getData.name);
        document.body.appendChild(link);
        link.click();
        message.success('下载成功');
    }

    saveTemplateForApi() {
        common.loading.show();
        if (this.templateVO.getData.authorizationType == "2") {
            this.downloadTemplate();
        } else {
            commonService.saveTemplate(this.templateVO.getData).then(this.saveTemplateForApiCallBack)
        }
    }

    @action.bound saveTemplateForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('保存成功');
        this.modal.shareTemplate.hide();
    }

    getVersionListForApi(code) {
        strategyService.strategyAllVersionByCode(code).then((res) => {
            this.getVersionListForApiCallBack(res, code);
        });
    }

    @action.bound getVersionListForApiCallBack(res, code) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        for (let i = 0; i < res.data.result.length; i++) {
            const element = res.data.result[i];
            element.key = i;
            element.index = i + 1;
            element.action = <TableActionForVersion dataId={element.id} deleteStrategyVersion={() => {
                this.deleteStrategyVersionForApi(element.id, code);
            }}
                                                    editPath={`/business/strategy/definition/save/1/${element.id}`}
            />
            tempArray.push(element)
        }
        this.setVersionList(tempArray);
    }

    deleteStrategyVersionForApi(versionId, code) {
        strategyService.deleteRStrategyVersion(versionId).then((res) => {
            this.deleteStrategyVersionForApiCallBack(res, code);
        });
    }

    @action.bound deleteStrategyVersionForApiCallBack(res, code) {
        if (!publicUtils.isOk(res)) return
        // this.getVersionListForApi(ruleId);
        message.success("删除成功");
        this.getVersionListForApi(code);
    }


    getDataSourceForApi() {
        strategyService.getStrategyList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }

    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.pageList.resultList)) {
            this.responseData = common.deepClone(res.data.pageList.resultList);
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                const status = element.status;
                let data = element;
                data.index = i + 1;
                data.key = i;
                data.status = <Status status={element.status}/>;
                switch (data.type) {
                    case 0:
                        data.typeLabel = '流程模式';
                        break;
                    case 1:
                        data.typeLabel = '贪婪模式';
                        break;
                    case 2:
                        data.typeLabel = 'SQL模式';
                        break;

                    default:
                        break;
                }
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
                data.statusNumber = status;
                data.status = <div style={{width: '170px'}}>
                    <Status status={status} style={{float: 'left'}}/>
                    <ApprovalStatus status={data.approvalStatus} style={{float: 'left', marginLeft: '15px'}}/>
                </div>;
                switch (data.type) {
                    case 0:
                        break;
                    case 1:
                        break;
                    case 2:
                        break;
                    default:
                        break;
                }
                // alert(data.script)
                // let quoteSum = common.deepClone(data.quoteSum);

                // data.quoteSum = <Icon type="eye" style={{ cursor: 'pointer' }} title="概览" onClick={() => { this.getUseTimesTreeForApi('strategy', this.getDataSource[i].id); this.useTimesTree.setTimes(quoteSum); }} />;
                // data.quoteSum = <a href="javascript:;" onClick={() => { this.getUseTimesTreeForApi('strategy', this.getDataSource[i].id); this.useTimesTree.setTimes(quoteSum); }}>{data.quoteSum}</a>;

                data.action = <TableAction
                    dataId={element.id}
                    code={element.code}
                    eventSourceId={element.eventSourceId}
                    status={status}
                    changeStatus={this.changeStatus}
                    deleteOne={this.deleteOne}
                    versionFunc={() => {
                        this.modal.version.show();
                        this.getVersionListForApi(element.code);
                    }}
                    templateFunc={() => {
                        this.templateVO.updateData('id', element.id);
                        this.modal.shareTemplate.show();
                    }}
                    editPath={`/business/strategy/definition/save/1/${data.id}`}
                    quoteSumFunc={this.getUseTimesTreeForApi}
                    quoteSum={data.quoteSum}
                    key={Math.random()}
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

    deleteOne(code) {
        let dataList = this.getDataSource;
        dataList.forEach(element => {
            if (element.code === code) {
                element.status = <Status status={5}/>;
            }
        })
        this.setDataSource(dataList);
        common.loading.show();
        strategyService.changeStrategyStatus([code], 'delete').then(res => {
            common.loading.hide();
            this.getDataSourceForApi();
            if (!publicUtils.isOk(res)) return
            message.success(res.data.resultMessage);
        }).catch(() => {
            common.loading.hide();
        })
    }

    changeStatus(id, status, eventSourceId, ticket) {
        let dataList = this.getDataSource;
        switch (status) {
            case 1:
                dataList.forEach(element => {
                    if (element.id === id) {
                        element.status = <Status status={2}/>;
                    }
                })
                this.setDataSource(dataList);
                // common.loading.show();
                strategyService.changeStrategyStatus([id], "online", eventSourceId, ticket).then(res => {
                    // common.loading.hide();
                    if (!publicUtils.isOk(res)) {
                        this.getDataSourceForApi();
                        return
                    }
                }).catch(() => {
                    // common.loading.hide();
                })
                break;
            case 4:
                dataList.forEach(element => {
                    if (element.id === id) {
                        element.status = <Status status={3}/>;
                    }
                })
                this.setDataSource(dataList);
                // common.loading.show();
                strategyService.changeStrategyStatus([id], "offline").then(() => {
                    // common.loading.hide();
                    this.getDataSourceForApi();
                }).catch(() => {
                    // common.loading.hide();
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

    getUseTimesTreeForApi(type, id, quoteSum) {
        this.useTimesTree.setData({});
        this.useTimesTree.setTimes(quoteSum);
        common.loading.show();
        switch (type) {
            case 'rtq':
                variableService.getRtqUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
                break;
            case 'rule':
                strategyService.getRuleUseTimes(id).then(this.getUseTimesTreeForApiCallBack)
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
            case 'scoreCard':
                typeStr = '（评分卡）';
                break;
            case 'decisionTable':
                typeStr = '（决策表）';
                break;
            default:
                break;
        }
        return typeStr
    }

    multiChangeStatusForApi(type) {//type(online||offline)

        let ids = [];
        let eventSourceId;
        for (let i = 0; i < this.tableFields.getDataSource.length; i++) {
            if (i == 0)
                eventSourceId = this.tableFields.getDataSource[0].eventSourceId;
            for (let j = 0; j < this.tableFields.getSelectedRowKeys.length; j++) {
                const element = this.tableFields.getSelectedRowKeys[j];

                if (element === i) {
                    ids.push(this.tableFields.getDataSource[i].id);
                }
            }
        }

        common.loading.show();
        let typeStr = type == 'online' ? '上线' : '下线';
        message.loading('正在后台' + typeStr);
        console.log("ids", ids);
        strategyService.changeStrategyStatus(ids, type, eventSourceId).then(this.multiChangeStatusForApiCallBack).catch(() => {
            common.loading.hide();
        });

    }

    @action.bound multiChangeStatusForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.getDataSourceForApi();
    }
}

export default new store