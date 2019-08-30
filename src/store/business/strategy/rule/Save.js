/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:49:09
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import commonService from '@/api/business/commonService';
import strategyService from '@/api/business/strategyService';
import approvalService from '@/api/business/approvalService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';
import React from 'react';
import FixedValue from '@/components/condition-tree/FixedValue';

class store extends React.Component {
    constructor(props) {
        super(props)
        this.getSqlPreviewForAPI = this.getSqlPreviewForAPI.bind(this);
        this.getTestInput = this.getTestInput.bind(this);
        this.inputValueChange = this.inputValueChange.bind(this);
        this.getTestOutputForApi = this.getTestOutputForApi.bind(this);
        this.copyForApi = this.copyForApi.bind(this);
        this.setDefaultVersionForApi = this.setDefaultVersionForApi.bind(this);
        this.allVersionForApi = this.allVersionForApi.bind(this);
        this.approvalSubmitForApi = this.approvalSubmitForApi.bind(this);
        this.approvalSubmitForApi2 = this.approvalSubmitForApi2.bind(this);
        this.deleteVersionForApi = this.deleteVersionForApi.bind(this);
        this.formatDateValueForFixedValue = this.formatDateValueForFixedValue.bind(this);
    }
    @observable editType = 'info';
    @observable currentName = '';
    @observable nodeId = '';
    @observable processTreeData = {};
    @observable activeNodeKey = 0;
    @observable script = '';
    @observable isAlreadyAdjustHeight = false;
    @observable isLoading = true;
    @observable sqlMode = false;
    @observable id = '';

    @observable isHaveCommitBtn = true;
    @observable isCanCommit = false;
    @observable isShowDrawerForSql = false;
    @observable sqlPreview = "";

    @observable isShowDrawerForTest = false;
    @observable inputDataSource = [];
    @observable inputValueList = [];
    @observable outputDataSource = [];
    @observable isCanTest = false;
    @observable storeBus = 0;//store之间的桥梁通讯，解决非new情况下的store之间的通讯问题    0初始化不处理，1流程树获取一次基础信息的接口， 2info组件获取一次基础信息的接口，保证流程树和info组件的数据保持同步
    @observable e_and_d_Ready = false;

    @observable modal = {
        submit: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        }
    }

    @observable approvalSubmitParams = {
        actionType: 0,
        code: '',
        id: '',
        name: '',
        remark: '',
        type: 2,
        version: '',
        approvalStatus: '',//此字段只用于判断能否提交，只作为依据，不传到api
    }

    //版本
    @observable version = {
        list: [],
        value: '',
        get getList() { return toJS(this.list) },
        get getValue() { return toJS(this.value) },
        setList(value) { this.list = value },
        setValue(value) { this.value = value }
    }

    inputResponseData = [];

    //测试
    @computed get getE_and_d_Ready() { return toJS(this.e_and_d_Ready) }
    @action.bound setE_and_d_Ready(value) { this.e_and_d_Ready = value }
    @computed get getStoreBus() { return toJS(this.storeBus) }
    @action setStoreBus(value) { this.storeBus = value }
    @computed get getIsShowDrawerForTest() { return toJS(this.isShowDrawerForTest); }
    @action setIsShowDrawerForTest(value) { this.isShowDrawerForTest = value; }
    @computed get getInputDataSource() { return toJS(this.inputDataSource) }
    @action setInputDataSource(value) { this.inputDataSource = value }
    @computed get getInputValueList() { return toJS(this.inputValueList) }
    @action setInputValueList(value) { this.inputValueList = value }
    @computed get getOutputDataSource() { return toJS(this.outputDataSource) }
    @action setOutputDataSource(value) { this.outputDataSource = value }
    @computed get getIsCanTest() { return toJS(this.isCanTest) }
    @action setIsCanTest(value) { this.isCanTest = value }

    @computed get getId() { return toJS(this.id) }
    @action setId(value) { this.id = value }

    //sql预览
    @computed get getIsShowDrawerForSql() { return toJS(this.isShowDrawerForSql); }
    @action setIsShowDrawerForSql(value) { this.isShowDrawerForSql = value; }
    @computed get getSqlPreview() { return toJS(this.sqlPreview); }
    @action setSqlPreview(value) { this.sqlPreview = value; }

    //提交
    @computed get getIsCanCommit() { return toJS(this.isCanCommit); }
    @action setIsCanCommit(value) { this.isCanCommit = value; }
    @computed get getIsHaveCommitBtn() { return toJS(this.isHaveCommitBtn); }
    @action setIsHaveCommitBtn(value) { this.isHaveCommitBtn = value; }

    @computed get getIsLoading() { return toJS(this.isLoading); }
    @action setIsLoading(value) { this.isLoading = value; }

    getSqlPreviewForAPI(id) {
        strategyService.getRuleSqlPreview(id).then(this.getSqlPreviewCallback);
    }
    @action.bound getSqlPreviewCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setSqlPreview(res.data.result);
        this.setIsShowDrawerForSql(true);
    }

    getTestInput(id) {
        common.loading.show();
        this.setInputValueList([]);
        commonService.getTestInput('rule', id).then(this.getTestInputCallBack)
    }
    @action.bound getTestInputCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let tempArray = [];
        let tempArray2 = [];
        this.inputResponseData = res.data.result;
        for (let i = 0; i < res.data.result.length; i++) {
            const element = res.data.result[i];
            tempArray.push({
                key: i,
                name: element.name,
                code: element.code,
                value: <FixedValue type="defaultValue" style={{ width: '200px' }} value={this.formatDateValueForFixedValue(this.getInputValueList[i], element.dataType)} dataType={element.dataType} changeData={(name, value) => this.inputValueChange(i, value, element.dataType)} index={i} />
            })
            tempArray2.push("");
        }
        this.setInputDataSource(tempArray);
        this.setInputValueList(tempArray2);
        this.setIsShowDrawerForTest(true);
        this.setOutputDataSource([]);
    }
    inputValueChange(index, value, dataType) {
        console.log(index, value, dataType)
        /*if (dataType == 93) {
            value = value + ' 00:00:00';
        }*/
        let inputValueList = this.getInputValueList;
        inputValueList[index] = value;
        this.setInputValueList(inputValueList);
        this.setIsCanTest(true);
        for (let i = 0; i < this.inputValueList.length; i++) {
            const element = this.inputValueList[i];
            if (this.inputResponseData[i].dataType != 12) {
                if (common.isEmpty(element)) {
                    this.setIsCanTest(false);
                    // return;
                }
            }
        }


        let tempArray = [];
        for (let i = 0; i < this.inputResponseData.length; i++) {
            const element = this.inputResponseData[i];
            tempArray.push({
                key: i,
                name: element.name,
                code: element.code,
                // value: <Input placeholder="请输入值" onChange={(e) => this.inputValueChange(i, e.target.value)} />
                value: <FixedValue type="defaultValue" style={{ width: '200px' }} value={this.formatDateValueForFixedValue(this.getInputValueList[i], element.dataType)} dataType={element.dataType} changeData={(name, value) => {
                    console.log("name, value", name, value)
                    this.inputValueChange(i, value, element.dataType)
                }} index={i} />

            })
        }
        this.setInputDataSource(tempArray);


    }
    formatDateValueForFixedValue(value, dataType) {
        if (!common.isEmpty(value)) {
            if (dataType == 93) {
                value = value.split(' 00:00:00')[0];
            }
            return value
        } else {
            return value
        }

    }
    getTestOutputForApi() {
        let params = {
            ruleId: this.getId,
            inspectCodeMap: {}
        }
        for (let i = 0; i < this.getInputDataSource.length; i++) {
            const element = this.getInputDataSource[i];
            params.inspectCodeMap[element.code] = this.getInputValueList[i];
        }
        common.loading.show();
        commonService.getTestOutput(params).then(this.getTestOutputForApiCallBack);
    }
    @action.bound getTestOutputForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        res.data.result.forEach(element => {
            element.key = element.id;
        })
        this.setOutputDataSource(res.data.result);

    }

    //版本的方法
    copyForApi() {
        common.loading.show();
        strategyService.ruleCopy(this.getId).then(this.copyForApiCallBak).catch(() => common.loading.hide());
    }
    @action.bound copyForApiCallBak(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        let id = res.data.result.id;
        if (!common.isEmpty(id)) {
            sessionStorage.currentVersionId = id;
        }
    }
    setDefaultVersionForApi() {
        common.loading.show();
        strategyService.ruleSetDefaultVersion(this.getId).then(this.setDefaultVersionForApiCallBack).catch(() => common.loading.hide());
    }
    @action.bound setDefaultVersionForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("应用版本成功");
        this.allVersionForApi()
    }
    allVersionForApi() {
        strategyService.ruleAllVersion(this.getId).then(this.allVersionForApiCallBack);
    }
    @action.bound allVersionForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [
            // { version: '复制版本', clickable: true, type: 0 },
            // { version: '应用版本', clickable: true, type: 1 }
        ];
        res.data.result.forEach(element => {
            element.type = 2;
            tempArray.push(element)
            if (element.id === this.getId) {
                // alert(element.version)
                this.version.setValue(element.version);
            }
        })
        // tempArray.push({ version: '应用版本', clickable: true, type: 1 });
        // tempArray.push({ version: '复制版本', clickable: true, type: 0 });
        this.version.setList(tempArray);
    }

    approvalSubmitForApi() {
        common.loading.show();
        strategyService.ruleSubmitInspect(toJS(this.approvalSubmitParams).id).then(this.approvalSubmitForApiCallBack).catch(() => common.loading.hide());
    }
    @action.bound approvalSubmitForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.approvalSubmitForApi2();
    }

    approvalSubmitForApi2() {
        common.loading.show();
        let params = toJS(this.approvalSubmitParams);
        approvalService.submit(params.actionType, params.code, params.id, params.name, params.remark, params.type, params.version).then(this.approvalSubmitForApiCallBack2).catch(() => common.loading.hide());
    }
    @action.bound approvalSubmitForApiCallBack2(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("提交成功");
        this.approvalSubmitParams.approvalStatus = 0;
        this.approvalSubmitParams.remark = '';
        this.setIsCanCommit(false);
        this.modal.submit.setIsShow(false);
        this.setStoreBus(1);
        // setTimeout(() => {
        //     ProcessTreeStore.getDataForApi(self.getId)
        // }, 1000)
    }

    deleteVersionForApi(id) {
        common.loading.show();
        strategyService.deleteRule(id).then(this.deleteVersionForApiCallBack).catch(() => common.loading.hide());
    }
    @action.bound deleteVersionForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("删除成功，跳转到应用版本");

        for (let i = 0; i < this.version.getList.length; i++) {
            const element = this.version.getList[i];
            if (element.enable) {
                sessionStorage.currentVersionId = element.id;
            }
        }
    }
}

export default new store