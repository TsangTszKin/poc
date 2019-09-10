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
import payService from '@/api/business/payService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.getPayGroupDataForApi = this.getPayGroupDataForApi.bind(this);
        this.getESBServicesForApi = this.getESBServicesForApi.bind(this);
    }

    @observable helper = {
        data: {
            loading: true,
            loading2: true,
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime() },
            timeUnit: 60
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

    @observable esbServices = {
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
        this.helper.setData({
            loading: true,
            loading2: true,
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime() },
            timeUnit: 60
        })

        this.data.setData(common.deepClone(dataDemo))
    }

    getPayGroupDataForApi() {
        this.helper.updateData('loading', true);
        payService.getPayGroupData(this.helper.getData.query).then(this.getPayGroupDataForApiCallBack)
    }
    @action.bound getPayGroupDataForApiCallBack(res) {
        this.helper.updateData('loading', false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {
            this.data.setData(res.data.result);
        } else {
            this.data.setData(common.deepClone(dataDemo))
        }
    }

    getESBServicesForApi() {
        this.helper.updateData('loading', true);
        payService.getESBServices(this.helper.getData.query).then(this.getESBServicesForApiCallBack)
    }
    @action.bound getESBServicesForApiCallBack(res) {
        this.helper.updateData('loading', false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {
            this.esbServices.setData(res.data.result);
        } else {
            this.esbServices.setData([])
        }
    }
}

export default new store

const dataDemo = [
    {
        "clusterName": "online",
        "totalTrade": 0,
        "avgTime": 0,
        "esbservices": null
    },
    {
        "clusterName": "front",
        "totalTrade": 0,
        "avgTime": 0,
        "esbservices": null
    },
    {
        "clusterName": "esb",
        "totalTrade": 0,
        "avgTime": 0,
        "esbservices": null
    }
]