/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:39:32
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import smsService from '@/api/business/smsService'

class store {
    constructor() {
        this.getHomeDataForApi = this.getHomeDataForApi.bind(this);
    }
    @observable data = {
        data: common.deepClone(dataDemo),
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


    getHomeDataForApi() {
        common.loading.show();
        smsService.getHomeData().then(this.getHomeDataForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getHomeDataForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
    }
}

export default new store

const dataDemo = [
    {
        "name": "MQ",
        "sendCount": 0,
        "takeTimes": 0
    },
    {
        "name": "Front",
        "sendCount": 0,
        "takeTimes": 0
    },
    {
        "name": "Realtime",
        "sendCount": 0,
        "takeTimes": 0
    }
]