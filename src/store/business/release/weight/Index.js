/* eslint-disable no-prototype-builtins */
/*
 * @Author: zengzijian
 * @Date: 2019-07-18 16:47:17
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:47:09
 * @Description: 策略权重 store
 */
import { observable, action, toJS } from 'mobx';
import strategyService from '@/api/business/strategyService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { message } from 'antd';

class store {

    constructor() {
        this.getStrategypackageWeightTreeForApi = this.getStrategypackageWeightTreeForApi.bind(this);
        this.getStrategypackageWeightDetailForApi = this.getStrategypackageWeightDetailForApi.bind(this);
        this.savStrategypackageForApi = this.savStrategypackageForApi.bind(this);
        this.verify = this.verify.bind(this);
        this.strategypackageWeightSwitchForApi = this.strategypackageWeightSwitchForApi.bind(this);
    }

    @observable loading = {
        data: {
            left: true,
            right: true
        },
        get get_data() { return toJS(this.data) },
        set_data(value) { this.data = value },
        update_data(key, value) { this.data[key] = value }
    }

    @observable tree = {
        data: [
            // {
            //     "eventSourceId": "ff8080816b88150f016b883a410e0000",
            //     "eventSourceName": "lmx事件源",
            //     "eventSourceCode": "lmx_event",
            //     "packages": [
            //       {
            //         "id": "402880f76b875a29016b88967aa60000",
            //         "code": "package222",
            //         "name": "策略包222",
            //         "summaryId": "402880f76b875a29016b88967aa90001",
            //         "resources": []
            //       }
            //     ]
            //   }
        ],
        get get_data() { return toJS(this.data) },
        set_data(value) { this.data = value }
    }

    @observable detail = {
        data: {
            "code": "",
            "name": "",
            "versionName": "",
            "version": '',
            "summaryId": "",
            "weight": "",
            "resources": [
                // {
                //     "code": "string",
                //     "id": "string",
                //     "name": "string",
                //     "type": "0",
                //     "typeName": "string",
                //     "version": 0,
                //     "versionName": "string",
                //     "weight": "string"
                // }
            ],
            "versions": [
                // {
                //     "auditStatus": "101",
                //     "code": "string",
                //     "id": "string",
                //     "lastErrorMessage": "string",
                //     "modifiedTime": "2019-07-23T01:41:13.043Z",
                //     "name": "string",
                //     "operUser": "string",
                //     "status": "105",
                //     "version": "string"
                // }
            ]
        },
        get get_data() { return toJS(this.data) },
        set_data(value) { this.data = value },
        update_data(key, value) { this.data[key] = value }
    }

    getStrategypackageWeightTreeForApi(isGetFirstDetail) {
        this.loading.update_data('left', true);
        strategyService.getStrategypackageWeightTree().then(res => this.getStrategypackageWeightTreeForApiCallBack(res, isGetFirstDetail))
    }
    @action.bound getStrategypackageWeightTreeForApiCallBack(res, isGetFirstDetail) {
        this.loading.update_data('left', 'empty');
        if (!publicUtils.isOk(res)) return
        let tree = [];
        if (common.isArray(res.data.result)) {
            console.log(999);
            tree = res.data.result
            if (res.data.result.length > 0) {
                this.loading.update_data('left', false);
                if (isGetFirstDetail) {
                    if (common.isArray(res.data.result[0].packages) && res.data.result[0].packages.length > 0) {
                        this.getStrategypackageWeightDetailForApi(res.data.result[0].packages[0].id);
                    } else {
                        this.loading.update_data('right', 'empty');
                    }
                }
            } else {
                this.loading.update_data('right', 'empty');
            }

        }
        this.tree.set_data(tree);
    }

    getStrategypackageWeightDetailForApi(versionId) {
        this.loading.update_data('right', true);
        strategyService.getStrategypackageWeightDetail(versionId).then(this.getStrategypackageWeightDetailForApiCallBack)
    }
    @action.bound getStrategypackageWeightDetailForApiCallBack(res) {
        this.loading.update_data('right', 'empty');
        if (!publicUtils.isOk(res)) return;
        if (!res.data.result.hasOwnProperty('weight')) {
            res.data.result.weight = ''
        }
        this.detail.set_data(res.data.result);
        this.loading.update_data('right', false);
    }

    savStrategypackageForApi(vo) {
        common.loading.show();
        strategyService.savStrategypackage(vo).then(this.savStrategypackageForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound savStrategypackageForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('保存成功');
        this.getStrategypackageWeightTreeForApi(false);
    }

    strategypackageWeightSwitchForApi(enabled, eventSourceId) {
        common.loading.show();
        strategyService.strategypackageWeightSwitch(enabled, eventSourceId).then(this.strategypackageWeightSwitchForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound strategypackageWeightSwitchForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('更改成功');
        this.getStrategypackageWeightTreeForApi(false);
    }

    verify() {
        if (common.isEmpty(this.detail.get_data.weight)) {
            message.warning('策略包权重值不能为空');
            return false
        }
        for (let i = 0; i < this.detail.get_data.resources.length; i++) {
            const element = this.detail.get_data.resources[i];
            if (common.isEmpty(element.weight)) {
                message.warning('策略权重值不能为空');
                return false
            }
        }

        return true
    }

}

export default new store