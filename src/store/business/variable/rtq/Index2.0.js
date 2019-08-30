/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-22 11:28:40
 * @Description: 
 */

import {observable, action, computed, toJS} from 'mobx';
import variableService from '@/api/business/variableService';
import strategyService from '@/api/business/strategyService';
import commonService from '@/api/business/commonService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import {message, Modal} from 'antd';
import TableAction from '@/components/business/variable/real-time-query/TableAction';
import TableActionForVersion from '@/components/business/variable/real-time-query/TableActionForVersion';
import Status from '@/components/Status';
import ApprovalStatus from '@/components/ApprovalStatus';
import React from 'react';

class store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.getUseTimesTreeForApi = this.getUseTimesTreeForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.initParams = this.initParams.bind(this);
        this.getTemplateListForApi = this.getTemplateListForApi.bind(this);
        this.saveTemplateForApi = this.saveTemplateForApi.bind(this);
        this.getVersionListForApi = this.getVersionListForApi.bind(this);
        this.deleteRTQVersionForApi = this.deleteRTQVersionForApi.bind(this);
        this.downloadTemplate = this.downloadTemplate.bind(this);
    }

    @observable isShowDrawerForSql = false;
    @observable sqlPreview = "";
    @observable isCanSubmit = false;
    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = {name: '', code: '', category: '', eventSourceId: '', rtqVarType: ''};
    @observable selectedRowKeys = [];
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

    @observable versionList = [];
    @observable templateList = [];
    @observable showToolBarType = 1;
    @observable templateType = 1;//1自定义，2用模板
    @observable templateVO = {
        data: {
            "authorizationType": 0,//模板所有权 0:私有 1:公有
            "description": "",
            "id": "",
            "name": "",
            "type": 0//模板类型 0:实时查询变量 1:衍生变量 2:规则 3:规则集 4:策略
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
    @observable modal = {
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


    @observable helper = {
        data: {
            categoryList: [],
            eventSourceList: [],
            rtqVarTypeList: []
        },
        get getData() {
            return this.data
        },
        setData(value) {
            this.data = value
        },
        updateData(key, value) {
            this.data[key] = value
        }
    }

    responseData = [];

    @computed get getTemplateType() {
        return toJS(this.templateType)
    }

    @action setTemplateType(value) {
        this.templateType = value
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

    @computed get getIsShowDrawerForSql() {
        return toJS(this.isShowDrawerForSql);
    }

    @action.bound setIsShowDrawerForSql(value) {
        this.isShowDrawerForSql = value;
    }

    @computed get getSqlPreview() {
        return toJS(this.sqlPreview);
    }

    @action.bound setSqlPreview(value) {
        this.sqlPreview = value;
    }

    @computed get getTemplateList() {
        return toJS(this.templateList)
    }

    @action setTemplateList(value) {
        this.templateList = value
    }

    @computed get getVersionList() {
        return toJS(this.versionList)
    }

    @action.bound setVersionList(value) {
        this.versionList = value
    }

    @action.bound getSqlPreviewForAPI(id) {
        variableService.getRtqSqlPreview(id).then(this.getSqlPreviewCallback);
    }

    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
    }

    @action.bound submit(id) {
        common.loading.show();
        variableService.submitRtq(id).then(this.submitRtqCallback).catch(() => {
            common.loading.hide();
        })
    }

    @action.bound submitRtqCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    getDataSourceForApi() {
        variableService.getRtqList_2_0(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }

    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        this.setSelectedRowKeys([]);
        if (!publicUtils.isOk(res)) return
        let dataList = [];
        if (!common.isEmpty(res.data.result.pageList.resultList)) {
            this.responseData = common.deepClone(res.data.result.pageList.resultList);
            for (let i = 0; i < res.data.result.pageList.resultList.length; i++) {
                const element = res.data.result.pageList.resultList[i];
                const status = element.status;
                let data = element;
                data.index = i + 1;
                data.key = i;
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
                let quoteSum = common.deepClone(data.quoteSum);
                data.quoteSum = <a href="javascript:;" onClick={() => {
                    this.getUseTimesTreeForApi('rtq', this.getDataSource[i].id);
                    this.useTimesTree.setTimes(quoteSum);
                }}>{data.quoteSum}</a>;
                data.statusNumber = status;
                data.dataTypeName = (() => {
                    for (let i = 0; i < res.data.result.dataTypeList.length; i++) {
                        const element = res.data.result.dataTypeList[i];
                        if (element.val === data.dataType) {
                            return element.label
                        }
                    }
                })();
                data.version = `V${data.version}`
                data.rtqVarTypeName = (() => {
                    for (let i = 0; i < res.data.result.rtqVarTypeList.length; i++) {
                        const element = res.data.result.rtqVarTypeList[i];
                        if (element.val === data.rtqVarType) {
                            return element.label
                        }
                    }
                })();
                data.status = <div style={{width: '170px'}}>
                    <Status status={status} style={{float: 'left'}}/>
                    <ApprovalStatus status={data.approvalStatus} style={{float: 'left', marginLeft: '15px'}}/>
                </div>;
                data.action = <TableAction
                    code={element.code}
                    quoteSum={element.quoteSum}
                    dataId={element.id} status={status} changeStatus={this.changeStatus}
                    deleteOne={this.deleteOne}
                    versionFunc={() => {
                        this.modal.version.show();
                        this.getVersionListForApi(element.code);
                    }}
                    shareCallBack={() => {
                        this.setState({isShowShareModal: true})
                    }}
                    templateFunc={() => {
                        this.templateVO.updateData('id', element.id);
                        this.modal.shareTemplate.show();
                    }}
                    editPath={{pathname: `/business/variable/real-time-query/save2.0/1/${element.rtqVarType}/${element.id}`}}/>;
                dataList.push(data);
            }
        } else {
            this.responseData = [];
        }

        this.setPageNum(res.data.result.pageList.sum === 0 ? this.getPageNum : ++res.data.result.pageList.curPageNO);
        this.setTotal(res.data.result.pageList.sum);
        this.setIsLoading(false);
        // console.table(dataList);
        this.setDataSource(dataList);

        let eventSourceList = [{code: '', value: '所有'}];
        if (res.data.result.eventSourceList && res.data.result.eventSourceList instanceof Array) {
            res.data.result.eventSourceList.forEach(element => {
                eventSourceList.push({
                    code: element.eventSourceId,
                    value: element.eventSourceName
                })
            })
        }
        this.helper.updateData('eventSourceList', eventSourceList);

    }

    downloadTemplate() {
        // console.log(666);
        let transplantVO = {
            id: this.templateVO.getData.id,
            type: 1
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

    getTemplateListForApi(type) {
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
        let tempArray = [];
        res.data.pageList.resultList.forEach(element => {
            let rtqType = JSON.parse(element.entity).rtqVarType
            tempArray.push({
                code: element.name,
                name: element.name,
                rtqType: rtqType,
                id: element.id,
            })
        })
        this.setTemplateList(tempArray);
        console.log("this.getTemplateList", tempArray)
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

    deleteOne(code) {

        let dataList = this.getDataSource;
        dataList.forEach(element => {
            if (element.code === code) {
                element.status = <Status status={5}/>;
            }
        })
        this.setDataSource(dataList);

        let rowsData = [];
        this.responseData.forEach(element => {
            if (element.code === code) {
                let row = common.deepClone(element);
                rowsData = [row.code]
            }
        })
        common.loading.show();
        variableService.changeRtqVarV2Status(rowsData, 'delete').then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            // 测试要求删除都统一为“删除成功”
            message.success("删除成功");
            this.getDataSourceForApi()
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
                variableService.changeRtqVarV2Status([id], "online").then(res => {
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
                variableService.changeRtqVarV2Status([id], "offline").then(res => {
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

    getUseTimesTreeForApi(type, id) {
        this.useTimesTree.setData({});
        common.loading.show();
        switch (type) {
            case 'rtq':
                variableService.getRtqV2UseTimes(id).then(this.getUseTimesTreeForApiCallBack)
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
            default:
                break;
        }
        return typeStr
    }

    initParams() {
        this.setQuery({name: '', code: '', category: '', eventSourceId: '', rtqVarType: ''});
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(10);
    }

    getVersionListForApi(code) {
        variableService.rtqV2AllVersionByCode(code).then(this.getVersionListForApiCallBack);
    }

    @action.bound getVersionListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        for (let i = 0; i < res.data.result.length; i++) {
            const element = res.data.result[i];
            element.key = i;
            element.index = i + 1;
            element.version = `V${element.version}`;
            element.action = <TableActionForVersion dataId={element.id} code={element.code} deleteRTQVersion={() => {
                this.deleteRTQVersionForApi(element.id, element.code);
            }}
                                                    editPath={`/business/variable/real-time-query/save2.0/1/${element.rtqVarType}/${element.id}`}/>
            tempArray.push(element)
        }
        this.setVersionList(tempArray);
    }

    deleteRTQVersionForApi(id, code) {
        variableService.deleteRTQVersion(id).then((res) => {
            this.deleteRTQVersionForApiCallBack(res, code)
        });
    }

    @action.bound deleteRTQVersionForApiCallBack(res, code) {
        if (!publicUtils.isOk(res)) return
        // this.getVersionListForApi(ruleId);
        message.success(res.data.resultMessage);
        this.getVersionListForApi(code);
    }
}

export default new store