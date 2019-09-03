/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 10:38:29
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
        this.getGroupChartsForApi = this.getGroupChartsForApi.bind(this);
    }

    @observable helper = {
        data: {
            loading: true,
            loading2: true,
            query: { startTime: '2019-01-01 00:00:00', endTime: '2019-09-01 00:00:00' },
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

    reset() {
        this.helper.setData({
            loading: true,
            query: { startTime: '2019-01-01 00:00:00', endTime: '2019-09-01 00:00:00' },
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

    getGroupChartsForApi() {
        this.helper.updateData('loading2', true);
        let query = Object.assign({
            timeUnit: this.helper.getData.timeUnit
        }, this.helper.getData.query)
        payService.getGroupCharts(query).then(this.getGroupChartsForApiCallBack)
    }
    @action.bound getGroupChartsForApiCallBack(res) {
        this.helper.updateData('loading2', false);
        if (!publicUtils.isOk(res)) return
    }
}
export default new store

const dataDemo = [
    {
        "clusterName": "online",
        "tradeCount": 0,
        "avgCountTime": 0,
        "esbservices": null
    },
    {
        "clusterName": "front",
        "tradeCount": 0,
        "avgCountTime": 0,
        "esbservices": null
    },
    {
        "clusterName": "esb",
        "tradeCount": 0,
        "avgCountTime": 0,
        "esbservices": null
    }
]