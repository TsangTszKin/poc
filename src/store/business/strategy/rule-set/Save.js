/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:50:01
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import approvalService from '@/api/business/approvalService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';

class store {
    constructor() {
        this.submitSaveData = this.submitSaveData.bind(this);
        this.approvalSubmitForApi = this.approvalSubmitForApi.bind(this);
        this.allVersionForApi = this.allVersionForApi.bind(this);
    }

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
        type: 3,
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


    @observable isHaveCommitBtn = true;
    @observable isCanCommit = false;
    @observable commitId = '';
    @observable storeBus = 0;//store之间的桥梁通讯，解决非new情况下的store之间的通讯问题    0初始化不处理，1流程树获取一次基础信息的接口， 2info组件获取一次基础信息的接口，保证流程树和info组件的数据保持同步
    @observable id = '';
    @observable _sqlPreview = '';
    @observable _isShowDrawerForSql = false;
    @computed get isShowDrawerForSql() { return toJS(this._isShowDrawerForSql) }
    @action.bound setIsShowDrawerForSql(value) { this._isShowDrawerForSql = value; }
    @computed get sqlPreview() { return toJS(this._sqlPreview) }
    @action.bound setSqlPreview(value) { this._sqlPreview = value; }
    @computed get getStoreBus() { return toJS(this.storeBus) }
    @action setStoreBus(value) { this.storeBus = value }
    @computed get getCommitId() {return toJS(this.commitId);}
    @action.bound setCommitId(value) {this.commitId = value;}
    @computed get getIsCanCommit() {return toJS(this.isCanCommit);}
    @action.bound setIsCanCommit(value) { this.isCanCommit = value;}
    @computed get getIsHaveCommitBtn() {return toJS(this.isHaveCommitBtn);}
    @action.bound setIsHaveCommitBtn(value) {this.isHaveCommitBtn = value; }
    @computed get getId() { return toJS(this.id) }
    @action setId(value) { this.id = value }
    @observable _selectedRule = [];
    @computed get selectedRule() { return toJS(this._selectedRule) }
    @action.bound setSelectedRule(value) { this._selectedRule = value; }

    submitSaveData() {
        common.loading.show();
        strategyService.submitRuleSet(this.getCommitId).then(this.submitSaveDataCallback);
    }
    @action.bound submitSaveDataCallback(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        message.success("提交成功");
    }

    approvalSubmitForApi() {
        common.loading.show();
        let params = toJS(this.approvalSubmitParams);
        approvalService.submit(params.actionType, params.code, params.id, params.name, params.remark, params.type, params.version).then(this.approvalSubmitForApiCallBack).catch(() => common.loading.hide());
    }
    @action.bound approvalSubmitForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success("提交成功");
        this.approvalSubmitParams.approvalStatus = 0;
        this.approvalSubmitParams.remark = '';
        this.setIsCanCommit(false);
        this.modal.submit.setIsShow(false);
        this.setStoreBus(1);
       
    }

    allVersionForApi() {
        strategyService.ruleSetAllVersion(this.getId).then(this.allVersionForApiCallBack);
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

    getSqlPreviewForAPI() {
        // if(common.isEmpty(this.selectedRule)) return ;
        // strategyService.getRuleSqlPreview(this.selectedRule.id).then(this.getSqlPreviewCallback);
        this.setIsShowDrawerForSql(true);
    }
    // @action.bound getSqlPreviewCallback(res) {
    //     if (!publicUtils.isOk(res)) return;
    //     this.setSqlPreview(res.data.result);
    //     this.setIsShowDrawerForSql(true);
    // }

}

export default new store