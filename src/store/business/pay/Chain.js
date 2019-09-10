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
import payService from '@/api/business/payService'

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
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), userAccount: '', userName: '', tradeNo: '' },
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
            log: {
                '1': '',
                '2': '',
                '3': '',
                '4': '',
                '5': '',
            },
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
            query: { startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), userAccount: '', userName: '', tradeNo: '' },
            timeUnit: 60
        })
    }

    retDetail() {
        this.detail.updateData('data', common.deepClone(detailNodeDemo))
        this.detail.updateData('log', {
            '1': '',
            '2': '',
            '3': '',
            '4': '',
            '5': '',
        })
        this.detail.updateData('step', '')
    }

    getChainListForApi() {
        this.list.updateData('loading', true);
        payService.getChainList(this.list.getData.pageNum, this.list.getData.pageSize, this.list.getData.query).then(this.getChainListForApiCallBack)
    }
    @action.bound getChainListForApiCallBack(res) {
        this.list.updateData('loading', false);
        if (!publicUtils.isOk(res)) return

        let pageNum = res.data.pageList.sum === 0 ? 1 : ++res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.pageList.resultList;
        this.list.updateData('pageNum', pageNum);
        this.list.updateData('total', total);
        this.list.updateData('dataSource', dataSource);
    }

    getChainDetailForApi(tradeNo) {
        this.retDetail();
        common.loading.show();
        payService.getPayFindByTradeNoList({ 'tradeNo': tradeNo }).then(this.getChainDetailForApiCallBack).catch(() => common.loading.hide())
    }
    @action.bound getChainDetailForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return

        let detail = {}

        if (!common.isEmpty(res.data.result)) {

            let { front, online, esb, service } = res.data.result.resource;
            let { mapping } = res.data.result;
            const { content } = res.data.result;

            if (content) {
                this.detail.updateData('log', content)
            }

            if (!front) {
                front = common.deepClone(detailNodeDemo.front)
            }
            detail.front = front

            if (!online) {
                online = common.deepClone(detailNodeDemo.online)
            }
            detail.online = online

            if (!service) {
                service = common.deepClone(detailNodeDemo.service)
            }
            detail.service = service

            if (!esb) {
                esb = common.deepClone(detailNodeDemo.esb)
            }
            detail.esb = esb

            let service_rs = [];
            if (common.isEmpty(mapping)) {
                mapping = common.deepClone(detailNodeDemo.services)
            } else {
                if (service) {
                    mapping.forEach(el => {
                        if (el.logFile === service.logFile) {
                            service_rs.push({
                                title: el.serviceName,
                                time: service.takeTimes
                            })
                        } else {
                            service_rs.push({
                                title: el.serviceName,
                                time: ''
                            })
                        }
                    })
                } else {
                    mapping.forEach(el => {
                        service_rs.push({
                            title: el.serviceName,
                            time: ''
                        })
                    })
                }
            }
            detail.services = service_rs

        } else {
            detail = common.deepClone(detailNodeDemo)
        }

        this.detail.updateData('data', detail)
    }
}
export default new store

const detailNodeDemo = {
    front: {
        "id": "1",
        "beginDate": "",
        "endDate": "",
        "takeTimes": 0,
        "finishFlag": 0,
        "hostIp": "",
        "sourceIp": "",
        "tradeNo": "",
        "processId": "",
        "logFile": "",
        "content": "",
        "clusterSign": "front",
        "uuid": "",
        "snum": 0
    },
    online: {
        "id": "1",
        "beginDate": "",
        "endDate": "",
        "takeTimes": 0,
        "finishFlag": 0,
        "hostIp": "",
        "sourceIp": "",
        "tradeNo": "",
        "processId": "",
        "logFile": "",
        "content": "",
        "clusterSign": "online",
        "uuid": "",
        "snum": 0
    },
    esb: {
        "id": "1",
        "beginDate": "",
        "endDate": "",
        "takeTimes": 0,
        "finishFlag": 0,
        "hostIp": "",
        "sourceIp": "",
        "tradeNo": "",
        "processId": "",
        "logFile": "",
        "content": "",
        "clusterSign": "ESB",
        "uuid": "",
        "snum": 0,
        "service": []
    },
    service: null,
    services: []
}