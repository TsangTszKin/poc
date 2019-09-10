/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:21:33
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import smsService from '@/api/business/smsService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.retDetail = this.retDetail.bind(this);
        this.getChainListForApi = this.getChainListForApi.bind(this);
        this.getChainDetailForApi = this.getChainDetailForApi.bind(this);
    }

    /**
     *列表公共参数
     */
    @observable list = {
        data: {
            dataSource: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            loading: true,
            selectedRowKeys: [],
            query: { beginTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), phone: '' },
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

    @observable detail = {
        data: {
            data: common.deepClone(detailNodeDemo),
            visible: false,
            step: ''
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

    reset() {
        this.list.setData({
            dataSource: [],
            pageNum: 1,
            pageSize: 10,
            total: 0,
            loading: true,
            selectedRowKeys: [],
            query: { beginTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), phone: '' },
            timeUnit: 60
        })
    }

    retDetail() {
        this.detail.updateData('data', common.deepClone(detailNodeDemo))
        this.detail.updateData('step', '')
    }

    getChainListForApi() {
        this.list.updateData('loading', true);
        smsService.getChainList(this.list.getData.pageNum, this.list.getData.pageSize, this.list.getData.query).then(this.getChainListForApiCallBack)
    }
    @action.bound getChainListForApiCallBack(res) {
        this.list.updateData('loading', false);
        if (!publicUtils.isOk(res)) return

        let pageNum = res.data.pageList.sum === 0 ? 1 : res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.pageList.resultList;
        this.list.updateData('pageNum', pageNum);
        this.list.updateData('total', total);
        this.list.updateData('dataSource', dataSource);
    }

    getChainDetailForApi(signAcct) {
        this.retDetail();
        common.loading.show();
        smsService.getChainDetail(signAcct).then(this.getChainDetailForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getChainDetailForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return

        let detail = {}

        if (!common.isEmpty(res.data.result)) {

            let MQ = res.data.result.find(el => el.name === 'MQ')
            let Front = res.data.result.find(el => el.name === 'Front')
            let Realtime = res.data.result.find(el => el.name === 'Realtime')

            if (!Front) {
                Front = common.deepClone(detailNodeDemo.Front)
            }
            detail.Front = Front

            if (!MQ) {
                MQ = common.deepClone(detailNodeDemo.MQ)
            }
            detail.MQ = MQ

            if (!Realtime) {
                Realtime = common.deepClone(detailNodeDemo.Realtime)
            }
            detail.Realtime = Realtime

        } else {
            detail = common.deepClone(detailNodeDemo)
        }

        this.detail.updateData('data', detail)
    }
}
export default new store

const detailNodeDemo = {
    MQ: {
        "name": "MQ",
        "info": "",
        "sendCount": 0,
        "takeTimes": 0,
    },
    Front: {
        "name": "Front",
        "info": "",
        "sendCount": 0,
        "takeTimes": 0,
    },
    Realtime: {
        "name": "Realtime",
        "info": "",
        "sendCount": 0,
        "takeTimes": 0,
    },
    service: null,
    services: []
}