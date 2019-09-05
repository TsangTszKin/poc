/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:13:57
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.getPayDetailDataForApi = this.getPayDetailDataForApi.bind(this);
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

    reset() {
        this.helper.setData({
            loading: true,
            loading2: true,
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime() },
            timeUnit: 60
        })

        this.data.setData(common.deepClone(dataDemo))
    }

    getPayDetailDataForApi(type) {
        this.helper.updateData('loading', true);
        payService.getPayDetailData(this.helper.getData.query, type).then(this.getPayDetailDataForApiCallBack)
    }
    @action.bound getPayDetailDataForApiCallBack(res) {
        this.helper.updateData('loading', false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {
            this.data.setData(res.data.result);
        } else {
            this.data.setData(common.deepClone(dataDemo))
        }
    }
}
export default new store

const dataDemo = [
    // {
    //     "id": "12",
    //     "ddate": "2019-08-29 10:33:15",
    //     "takeTimes": 14,
    //     "tradeCount": 23,
    //     "hostIp": "96.0.124.98",
    //     "logFile": "98.log",
    //     "avg_time": 14,
    //     "totalCount": null
    // }
]