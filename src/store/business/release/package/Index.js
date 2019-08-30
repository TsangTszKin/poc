/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-04-30 15:50:44
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import TableAction from '@/components/business/strategy-package/table-action';
import Status from '@/components/business/strategy-package/status';
import React from 'react';
import {Divider, message} from 'antd';
import packageStatus from "@/utils/strategy-package-status";
import commonService from '@/api/business/commonService';

class store {

    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.getResultDetailForApi = this.getResultDetailForApi.bind(this);
        this.formatUseTimesTree = this.formatUseTimesTree.bind(this);
        this.initParams = this.initParams.bind(this);
        this.downloadTemplate = this.downloadTemplate.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', status: 0 };
    @observable _isShowRelease = false;
    @observable _isShowTest = false;
    @observable _isShowAudit = false;
    @observable _isShowVersionList = false;
    @observable _releaseList = [];
    @observable _testList = [];
    @observable _auditList = [];
    @observable _versionList = [];
    @computed get getQuery() { return toJS(this.query) }
    @action.bound setQuery(value) { this.query = value; }
    @action.bound updateQuery(valueOjb) {
        for(let key in valueOjb)
            if(valueOjb.hasOwnProperty(key))
                this.query[key] = valueOjb[key];
    }
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
    @computed get isShowRelease() { return toJS(this._isShowRelease) }
    @action.bound setIsShowRelease(value) { this._isShowRelease = value; }
    @computed get isShowAudit() { return toJS(this._isShowAudit) }
    @action.bound setIsShowAudit(value) { this._isShowAudit = value; }
    @computed get isShowTest() { return toJS(this._isShowTest) }
    @action.bound setIsShowTest(value) { this._isShowTest = value; }
    @computed get isShowVersionList() { return toJS(this._isShowVersionList) }
    @action.bound setIsShowVersionList(value) { this._isShowVersionList = value; }
    @computed get releaseList() { return toJS(this._releaseList) }
    @action.bound setReleaseList(value) { this._releaseList = value; }
    @computed get testList() { return toJS(this._testList) }
    @action.bound setTestList(value) { this._testList = value; }
    @computed get auditList() { return toJS(this._auditList) }
    @action.bound setAuditList(value) { this._auditList = value; }
    @computed get versionList() { return toJS(this._versionList) }
    @action.bound setVersionList(value) { this._versionList = value; }

    @observable templateVO = {
        data: {
            "authorizationType": 0,//模板所有权 0:私有 1:公有 2:导出为文件
            "description": "",
            "id": "",
            "name": "",
            "type": 7//模板类型 0:实时查询变量 1:衍生变量 2:规则 3:规则集 4:策略
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
        shareTemplate: {
            value: false,
            show() {
                this.value = true
            },
            hide() {
                this.value = false
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

    @observable saveData = {
        id: null,
        name: "",
        code: "",
        type: "",
        typeLabel: "",
        value: null,
        defaultValue: '',
        get getId() { return toJS(this.id) },
        setId(value) { this.id = value },
        get getName() { return toJS(this.name) },
        setName(value) { this.name = value },
        get getCode() { return toJS(this.code) },
        setCode(value) { this.code = value },
        get getType() { return toJS(this.type) },
        setType(value) { this.type = value },
        get getTypeLabel() { return toJS(this.typeLabel) },
        setTypeLabel(value) { this.typeLabel = value },
        get getValue() { return toJS(this.value) },
        setValue(value) { this.value = value },
        get getDefaultValue() { return toJS(this.defaultValue) },
        setDefaultValue(value) { this.defaultValue = value },
    }

    @observable useTimesTree = {
        times: '',
        data: {},
        show: false,
        get getTimes() { return toJS(this.times) },
        setTimes(value) { this.times = value },
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value; },
        get getShow() { return toJS(this.show) },
        setShow(value) { this.show = value; }
    }

    @observable
    rowSelection = {
        _selectedRowKeys: [],
        _selectedIndex: '',
        get selectedRowKeys() { return toJS(this._selectedRowKeys) },
        setSelectedRowKeys(value) { this._selectedRowKeys = value },
        get selectedIndex() { return toJS(this._selectedIndex) },
        setSelectedIndex(value) { this._selectedIndex = value },
    };

    initParams() {
        this.setQuery({ name: '', code: '', status: 0 });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(0);
    }

    @action.bound getUseTimesTreeForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let data = res.data.result;
        this.formatUseTimesTree(data);
        this.useTimesTree.setData(data);
        this.useTimesTree.setShow(true);
        console.log("data = ", data);
    }

    updateDataSource() {
        return strategyService.getStrategyPackageList(this.getPageNum, this.getPageSize, this.getQuery)
            .then(this.getDataSourceForApiCallback)
    }

    saveTemplateForApi() {
        common.loading.show();
        console.log("authorizationType", this.templateVO.getData.authorizationType)
            this.downloadTemplate();
    }

    downloadTemplate() {
        let transplantVO = {
            id: this.templateVO.getData.id,
            type: 8
        }
        commonService.getExportZIP(transplantVO).then(this.exportCallBack)
    };

    @action.bound exportCallBack(res) {
        if (common.isEmpty(res)){
            message.error("下载失败！");
            return;
        };
        common.loading.hide();
        const type = 'application/zip'
        const blob = new Blob([res.data], {type: type});
        let url = window.URL.createObjectURL(blob);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', this.templateVO.getData.name);
        document.body.appendChild(link);
        link.click();
        message.success('下载成功');
    }

    getDataSourceForApi() {
        strategyService.getStrategyPackageList(this.getPageNum, this.getPageSize, this.getQuery)
            .then(this.getDataSourceForApiCallback)
    }

    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return;
        let dataList = [];
        const result = res.data.pageList;
        if (!common.isEmpty(result.resultList)) {
            for (let i = 0; i < result.resultList.length; i++) {
                const element = result.resultList[i];
                let data = common.deepClone(element);
                data.index = i + 1;
                data.key = i;
                data.deployedVersion = element.versions.deployedVersion ? element.versions.deployedVersion.version : '';
                data.name = <span title={ data.name }>{ common.cutString(data.name, 20) }</span>;
                data.modifiedTime = data.modifiedTime.split('.')[0];
                data.status = (
                    <React.Fragment>
                        <Status statusCode={ element.status } isShowMsg={ packageStatus.isShowErrorMsg(element.status) } errorMsg={ element.lastErrorMessage }/>
                        <Divider type="vertical"/>
                        <Status statusCode={ element.auditStatus }/>
                    </React.Fragment>
                );
                // 策略包的id和 发布、编辑、查看资源的id不是一个id，
                // 发布是版本列表的id
                // 编辑和查看资源是lastEditVersion的id
                // 下线用deployedVersion的id
                data.action = (
                    <TableAction
                        dataId={ element.id }
                        deleteOne={ this.deleteOne }
                        statusCode={ element.status }
                        auditStatus={ element.auditStatus }
                        versionList={ element.versions.versionList }
                        lastEditVersion={ element.versions.lastEditVersion }
                        deployedVersion={ element.versions.deployedVersion }
                        templateFunc={() => {
                            this.templateVO.updateData('id', element.versions.lastEditVersion.id);
                            this.modal.shareTemplate.show();
                        }}
                    />
                );
                dataList.push(data);
            }
        }
        this.setPageNum(result.sum === 0 ? this.getPageNum : ++result.curPageNO);
        this.setTotal(result.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);
    }

    deleteOne(id) {

        common.loading.show();
        strategyService.deleteStrategyPackage([id]).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res, true)) return;
            this.getDataSourceForApi();
        }).catch(() => {
            common.loading.hide();
        })
    }

    getResultDetailForApi(id) {
        common.loading.show();
        strategyService.getResultById(id).then(this.getResultDetailForApiCallback)
    }
    @action.bound getResultDetailForApiCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let data = res.data.result;
        this.saveData.setId(data.id);
        this.saveData.setName(data.name);
        this.saveData.setCode(data.code);
        this.saveData.setType(data.type);
        this.saveData.setDefaultValue(data.defaultValue);
        this.saveData.setTypeLabel(data.typeLabel);
        if (data.value) {
            this.saveData.setValue(data.value);
        }
        this.setIsShowModal(true);
    }

    @action.bound saveResult() {
        let params = {
            id: this.saveData.getId,
            name: this.saveData.getName,
            code: this.saveData.getCode,
            type: this.saveData.getType,
            typeLabel: this.saveData.getTypeLabel,
            defaultValue: this.saveData.getDefaultValue,
        };
        common.loading.show();
        strategyService.saveResult(params).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return;
            message.success("保存成功");
            this.getDataSourceForApi();
            this.setIsShowModal(false);
        }).catch(res => { common.loading.hide(); })
    }

    formatUseTimesTree(obj) {
        obj.collapsed = false;
        delete obj.id;
        delete obj.type;
        if (!common.isEmpty(obj.nodes)) {
            obj.children = obj.nodes;
            delete obj.nodes;
            obj.children.forEach(element => {
                this.formatUseTimesTree(element);
            })
        }
    }
}

export default new store