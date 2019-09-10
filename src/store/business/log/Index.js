/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-27 09:46:15
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import logService from '@/api/business/logService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.getLogListForApi = this.getLogListForApi.bind(this);
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
            query: {
                startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), logGrade: '', takeTimes: '', tradeNo: '', clusterSign: '', hostIp: '', content: ''
            }
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
            log: '',
            visible: false
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
            query: {
                startTime: common.getCurrentMonthStartTime(), endTime: common.getCurrentMonthEndTime(), logGrade: '', takeTimes: '', tradeNo: '', clusterSign: '', hostIp: '', content: ''
            }
        })
    }

    getLogListForApi() {
        this.list.updateData('loading', true);
        logService.getLogList(this.list.getData.pageNum, this.list.getData.pageSize, this.list.getData.query).then(this.getLogListForApiCallBack)
    }
    @action.bound getLogListForApiCallBack(res) {
        console.log("res", res)
        this.list.updateData('loading', false);
        if (!publicUtils.isOk(res)) return

        let pageNum = res.data.pageList.sum === 0 ? 1 : ++res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.pageList.resultList;
        this.list.updateData('pageNum', pageNum);
        this.list.updateData('total', total);
        this.list.updateData('dataSource', dataSource);
    }
}
export default new store