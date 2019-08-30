/*
 * @Author: zengzijian
 * @LastEditors: zengzijian
 * @Description: 
 * @Date: 2019-05-06 12:00:13
 * @LastEditTime: 2019-05-06 17:46:37
 */
import { observable, action, computed, toJS, flow } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import TableAction from '@/components/business/strategy-package/table-action-resource';
import React from 'react';
import Status from "@/components/business/strategy-package/status";
import { Modal, Popconfirm } from "antd";
import packageStatus from '@/utils/strategy-package-status'

const columns = [
    { title: '资源类型', dataIndex: 'name', key: 'name', width: 320 },
    { title: '数量', dataIndex: 'count', key: 'count' },
    { title: '更新时间', dataIndex: 'modifiedTime', key: 'modifiedTime' },
    {
        title: '状态', dataIndex: 'status', key: 'status'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        width: 100
    }
];

class store {
    constructor() {
        setTimeout(() => {
            this.setIsLoading(false);
        }, 1000);
    }

    @observable _strategyPackageId = '';
    get strategyPackageId() {
        return toJS(this._strategyPackageId)
    };

    setStrategyPackageId(value) {
        this._strategyPackageId = value
    }

    @observable baseInfo = {
        name: '',
        code: '',
        eventSourceId: '',
        eventSourceName: '',
        get getName() {
            return toJS(this.name)
        },
        get getCode() {
            return toJS(this.code)
        },
        get getEventSourceId() {
            return toJS(this.eventSourceId)
        },
        get getEventSourceName() {
            return toJS(this.eventSourceName)
        },
        setName(value) {
            this.name = value
        },
        setCode(value) {
            this.code = value
        },
        setEventSourceId(value) {
            this.eventSourceId = value
        },
        setEventSourceName(value) {
            this.eventSourceName = value
        },
    }

    @observable isLoading = true;

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @observable table = {
        _columns: columns,
        _dataSource: [],
        get columns() {
            return toJS(this._columns)
        },
        setColumns(value) {
            this._columns = value
        },
        get dataSource() {
            return toJS(this._dataSource)
        },
        setDataSource(value) {
            this._dataSource = value
        },
    }

    @observable version = {
        list: [],
        currentVersion: '',
        get getList() {
            return toJS(this.list)
        },
        setList(value) {
            this.list = value
        },
        get getCurrentVersion() {
            return toJS(this.currentVersion)
        },
        setCurrentVersion(value) {
            this.currentVersion = value
        }
    }

    @observable resource = {
        _list: [],
        get list() {
            return toJS(this._list)
        },
        setList(value) {
            this._list = value;
        },
        _isShowResource: false,
        get isShowResource() {
            return toJS(this._isShowResource)
        },
        setIsShowResource(value) {
            this._isShowResource = value;
        },
        _currentId: '',
        get currentId() {
            return toJS(this._currentId)
        },
        setCurrentId(value) {
            this._currentId = value;
        },
        reset() {
            this._isShowResource = false;
            this._list = [];
            this._currentId = '';
        }
    }

    @observable _selectedRowKeys = [];
    @computed get selectedRowKeys() {
        return toJS(this._selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this._selectedRowKeys = value;
    }

    @observable _selectedRows = [];
    @computed get selectedRows() {
        return toJS(this._selectedRows)
    }

    @action.bound setSelectedRows(value) {
        this._selectedRows = value;
    }

    @observable _detail = {};
    @computed get detail() { return toJS(this._detail) }
    @action.bound setDetail(value) { this._detail = value; }

    getDataSourceFromApi = flow(function* (onFail) {
        const Action = this.Action;
        const res = yield strategyService.getStrategyPackage(this.strategyPackageId);
        // console.log(res);
        if (publicUtils.isOk(res)) {
            const result = res.data.result;
            this.setDetail(result);
            this.baseInfo.setEventSourceId(result.eventSource.eventSourceId);
            this.baseInfo.setEventSourceName(result.eventSource.eventSourceName);
            this.baseInfo.setCode(result.code);
            this.baseInfo.setName(result.name);
            // console.log(result);
            this.version.setList(result.versions.versionList);
            if (res.data.result.resources) {
                const resources = res.data.result.resources;
                // 外部表格数据处理
                // 通过策略包中版本的resId获取资源列表
                let dataList = [];
                resources.forEach(data => {
                    let element = common.deepClone(data);
                    element.status = <Status statusCode={ data.status }/>;
                    element.action = <Action data={ data } releaseStatus={ result.auditStatus } />;
                    element.expandRows = [];
                    // 内部表格数据处理
                    data.items.forEach((item, index) => {
                        let childRow = common.deepClone(item);
                        childRow.index = index + 1;
                        childRow.name = common.cutString(item.name, 10);
                        childRow.status = <Status isShowMsg={ packageStatus.isShowErrorMsg(item.status) } errorMsg={ item.lastErrorMessage } statusCode={ item.status }/>;
                        childRow.action = (
                            <TableAction
                                data={ item }
                                strategyPackage={ result }
                                resourceType={ data.type }
                            />
                        );
                        // 规则集再次内嵌表格
                        if(data.type === 4 && !common.isEmpty(item.childItems)) {
                            // console.log(item);
                            childRow.children = item.childItems.map((rule, rule_index) => {
                                return {
                                    index: rule_index + 1,
                                    name: rule.name,
                                    code: rule.code,
                                    modifiedTime: rule.modifiedTime,
                                    version: rule.version,
                                    status: <Status statusCode={ rule.status }/>,
                                    action: <TableAction
                                        data={ rule }
                                        strategyPackage={ result }
                                        resourceType={ 3 }
                                    />
                                }
                            });
                        }
                        element.expandRows.push(childRow);
                    });
                    dataList.push(element);
                });
                // console.log(dataList);
                this.table.setDataSource(dataList);
            }
        } else {
            onFail('获取策略包失败');
        }
    });

    Action = props => {
        const { data, releaseStatus } = props;
        // console.log(data);
        let firstAction;
        const statusCode = data.status;
        if (packageStatus.canOffline(statusCode)) firstAction = (
                <Popconfirm
                    title="是否确定停止发布?" onConfirm={ () => this.offline(data.items) }
                    onCancel={() => { }} okText="确定" cancelText="取消">
                    <icon className="iconfont iconzanting" title="下线"/>
                </Popconfirm>
            );
        else if (packageStatus.canDeploy(statusCode) && releaseStatus === 103) {
            firstAction = <icon className="iconfont iconkaishi" title="上线" onClick={ () => this.deploy(data.items) }/>;
        }
        // 占位防塌陷
        else firstAction = <icon className="iconfont iconkaishi disabled" title="上线"/>;
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:release:package:deploy") ? firstAction : ''
                }
            </div>
        )
    };

    // 发布所有资源
    deploy = (resources) => {
        common.loading.show();
        console.log('deploy', resources);
        const ids = resources.map(item => item.id);
        strategyService.updateStrategyPackageStatus([], 105, ids).then(this.handleSuccess);
    };
    // 停止所有资源
    offline = (resources) => {
        common.loading.show();
        console.log('offline', resources);
        const ids = resources.map(item => item.id);
        strategyService.updateStrategyPackageStatus([], 106, ids).then(this.handleSuccess);
    };

    handleSuccess = res => {
        common.loading.hide();
        if (publicUtils.isOk(res)) {
            Modal.success({ title: '系统提示', content: res.data.resultMessage });
            this.getDataSourceFromApi();
        }
    };
}

export default new store

