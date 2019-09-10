/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:21:43
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import alertService from '@/api/business/alertService'
import { message } from 'antd';

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.getAlertSettingForApi = this.getAlertSettingForApi.bind(this);
        this.saveAlertSettingForApi = this.saveAlertSettingForApi.bind(this);
    }

    @observable detail = {
        data: [],
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

    reset() {
        this.detail.setData([])
    }

    getAlertSettingForApi() {
        alertService.getAlertSetting().then(this.getAlertSettingForApiCallBack)
    }
    @action.bound getAlertSettingForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        this.detail.setData(res.data.result);

    }

    saveAlertSettingForApi() {
        common.loading.show();
        alertService.saveAlertSetting(this.detail.getData).then(this.saveAlertSettingForApiCallBack).catch(re => common.loading.hide())
    }
    @action.bound saveAlertSettingForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        message.success('修改成功');
        this.getAlertSettingForApi()

    }
}
export default new store

const dataDemo = [
    {
        indicator: 1,
        thresholdValue: null,
        indicatorName: '1分钟交易量'
    },
    {
        indicator: 2,
        thresholdValue: null,
        indicatorName: '1分钟平均耗时'
    },
    {
        indicator: 3,
        thresholdValue: null,
        indicatorName: '1分钟最大耗时'
    }
]