/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:52:39
 * @Description: 
 */

import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';
import approvalService from '@/api/business/approvalService';

class store {

    constructor() {
        this.approvalSubmitForApi = this.approvalSubmitForApi.bind(this);
    }

    @observable isHaveCommitBtn = false;
    @observable isCanCommit = false;
    @observable canDel = false;
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
        type: 1,
        version: 1,
        approvalStatus: '',//此字段只用于判断能否提交，只作为依据，不传到api
    }
    @observable storeBus = 0;//store之间的桥梁通讯，解决非new情况下的store之间的通讯问题    0初始化不处理，1流程树获取一次基础信息的接口， 2info组件获取一次基础信息的接口，保证流程树和info组件的数据保持同步


    @computed get getStoreBus() { return toJS(this.storeBus) }
    @action setStoreBus(value) { this.storeBus = value }
    @computed get getCanDel() { return toJS(this.canDel) }
    @action.bound setCanDel(value) { this.canDel = value }
    @computed get getIsHaveCommitBtn() { return toJS(this.isHaveCommitBtn); }
    @action.bound setIsHaveCommitBtn(value) { this.isHaveCommitBtn = value; }
    //提交
    @computed get getIsCanCommit() { return toJS(this.isCanCommit); }
    @action setIsCanCommit(value) { this.isCanCommit = value; }

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
}

export default new store