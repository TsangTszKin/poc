/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:13:57
 * @Description: 
 */
import { observable, toJS, action, computed } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.getPayDetailDataForApi = this.getPayDetailDataForApi.bind(this);
        this.getLogForApi = this.getLogForApi.bind(this);
        this.resetLogList = this.resetLogList.bind(this);
    }

    @observable logList = {
        data: {
            visible: false,
            title: '',
            dataSource: '',
            pageNum: 1,
            pageSize: 40,
            total: 0,
            loading: true,
            query: { hostIp: '', logFile: '' },
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

    @observable helper = {
        data: {
            loading: true,
            loading2: true,
            loading3: true,
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
            loading3: true,
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime() },
            timeUnit: 60
        })
        this.data.setData(common.deepClone(dataDemo))
    }

    resetLogList() {
        this.logList.setData({
            visible: false,
            title: '',
            dataSource: '',
            pageNum: 1,
            pageSize: 40,
            total: 0,
            loading: true,
            query: { hostIp: '', logFile: '' },
        })
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

    getLogForApi(clusterSign) {
        common.loading.show();
        let params = Object.assign(this.logList.getData.query, { clusterSign: clusterSign })
        payService.getLog(this.logList.getData.pageNum, this.logList.getData.pageSize, Object.assign(params, this.helper.getData.query)).then(this.getLogForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getLogForApiCallBack(res) {
        common.loading.hide()
        if (!publicUtils.isOk(res)) return
        this.logList.updateData('visible', true);

        let pageNum = res.data.pageList.sum === 0 ? 1 : ++res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.result;
        this.logList.updateData('pageNum', pageNum);
        this.logList.updateData('total', total);
        this.logList.updateData('dataSource', dataSource);
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