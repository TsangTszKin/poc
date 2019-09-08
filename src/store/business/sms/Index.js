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
        this.reset = this.reset.bind(this);
        this.getSmsAllDataForApi = this.getSmsAllDataForApi.bind(this);
        this.getLogForApi = this.getLogForApi.bind(this);
        this.resetLogList = this.resetLogList.bind(this);
    }

    @observable helper = {
        data: {
            loading: true,
            loading2: true,
            query: { beginTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime() },
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

    reset() {
        this.helper.setData({
            loading: true,
            loading2: true,
            query: { beginTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime() },
            timeUnit: 60
        })

        this.data.setData(common.deepClone(dataDemo))
    }

    getSmsAllDataForApi() {
        this.helper.updateData('loading', true);
        smsService.getSmsAllData(this.helper.getData.query).then(this.getSmsAllDataForApiCallBack)
    }
    @action.bound getSmsAllDataForApiCallBack(res) {
        this.helper.updateData('loading', false);
        if (!publicUtils.isOk(res)) return
        if (!common.isEmpty(res.data.result)) {
            let data = [];

            const MQ = res.data.result.find(el => el.name === 'MQ')
            if (MQ) data.push(MQ)
            else data.push({
                "name": "MQ",
                "sendCount": 0,
                "takeTimes": 0
            })


            const Realtime = res.data.result.find(el => el.name === 'Realtime')
            if (Realtime) data.push(Realtime)
            else data.push({
                "name": "Realtime",
                "sendCount": 0,
                "takeTimes": 0
            })

            const Front = res.data.result.find(el => el.name === 'Front')
            if (Front) data.push(Front)
            else data.push({
                "name": "Front",
                "sendCount": 0,
                "takeTimes": 0
            })


            this.data.setData(data);
        } else {
            this.data.setData(common.deepClone(dataDemo))
        }
    }

    getLogForApi(type) {
        console.log('this.logList.getData.pageNum getLogForApi', this.logList.getData.pageNum)
        common.loading.show();
        smsService.getLog(this.logList.getData.pageNum, this.logList.getData.pageSize, Object.assign({ type: type }, this.helper.getData.query)).then(this.getLogForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getLogForApiCallBack(res) {
        common.loading.hide()
        if (!publicUtils.isOk(res)) return
        this.logList.updateData('visible', true);

        let pageNum = res.data.pageList.sum === 0 ? 1 : res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.result;
        this.logList.updateData('pageNum', pageNum);
        this.logList.updateData('total', total);
        this.logList.updateData('dataSource', dataSource);
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