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
        this.getPayGroupDataForApi_td = this.getPayGroupDataForApi_td.bind(this);
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
        payService.getPayGroupMonitorData(this.helper.getData.query).then(this.getPayGroupDataForApiCallBack)
    }
    @action.bound getPayGroupDataForApiCallBack(res) {
        this.helper.updateData('loading', false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {
            let data = [];

            let online = res.data.result.find(el => el.clusterName === 'online')
            if (online) data.push(online)
            else data.push({
                "clusterName": "online",
                "tradeCount": 0,
                "avgTime": 0
            })

            let front = res.data.result.find(el => el.clusterName === 'front')
            if (front) data.push(front)
            else data.push({
                "clusterName": "front",
                "tradeCount": 0,
                "avgTime": 0
            })

            let esb = res.data.result.find(el => el.clusterName === 'esb')
            if (esb) data.push(esb)
            else data.push({
                "clusterName": "esb",
                "tradeCount": 0,
                "avgTime": 0
            })

            data.push({
                "clusterName": "td1",
                "tradeCount": 0,
                "avgTime": 0
            })
            data.push({
                "clusterName": "td2",
                "tradeCount": 0,
                "avgTime": 0
            })

            this.data.setData(data);
        } else {
            this.data.setData(common.deepClone(dataDemo))
        }

        this.getPayGroupDataForApi_td()
    }

    getPayGroupDataForApi_td() {
        let data = this.helper.getData.query
        data.beginTime = data.startTime;
        delete data.startTime
        this.helper.updateData('loading', true);
        payService.getPayGroupData_TD(data).then(this.getPayGroupDataForApiCallBack_td)
    }
    @action.bound getPayGroupDataForApiCallBack_td(res) {
        this.helper.updateData('loading', false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {

            let data = common.deepClone(this.data.getData.filter(el => el.clusterName !== 'td1' && el.clusterName !== 'td2'))

            let td1 = res.data.result.find(el => el.name === 'front')
            if (td1) data.push({
                "clusterName": "td1",
                "tradeCount": td1.trans_count,
                "avgTime": td1.duration
            })
            else data.push({
                "clusterName": "td1",
                "tradeCount": 0,
                "avgTime": 0
            })

            let td2 = res.data.result.find(el => el.name === 'esb')
            if (td2) data.push({
                "clusterName": "td2",
                "tradeCount": td2.trans_count,
                "avgTime": td2.duration
            })
            else data.push({
                "clusterName": "td2",
                "tradeCount": 0,
                "avgTime": 0
            })

            this.data.setData(data);
        }
    }
}

export default new store

const dataDemo = [
    {
        "clusterName": "online",
        "tradeCount": 0,
        "avgTime": 0
    },
    {
        "clusterName": "front",
        "tradeCount": 0,
        "avgTime": 0
    },
    {
        "clusterName": "esb",
        "tradeCount": 0,
        "avgTime": 0
    },
    {
        "clusterName": "td1",
        "tradeCount": 0,
        "avgTime": 0
    },
    {
        "clusterName": "td2",
        "tradeCount": 0,
        "avgTime": 0
    }
]