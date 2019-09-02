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
            query: { startTime: '2019-01-01 00:00:00', endTime: '2019-09-01 00:00:00', userAccount: '', userName: '' },
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
            data: [],
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
            query: { startTime: '2019-01-01 00:00:00', endTime: '2019-09-01 00:00:00', userAccount: '', userName: '' },
            timeUnit: 60
        })
    }

    getChainListForApi() {
        this.list.updateData('loading', true);
        payService.getChainList(this.list.getData.pageNum, this.list.getData.pageSize, this.list.getData.query).then(this.getChainListForApiCallBack)
    }
    @action.bound getChainListForApiCallBack(res) {
        console.log("res", res)
        this.list.updateData('loading', false);
        if (!publicUtils.isOk(res)) return

        let pageNum = res.data.pageList.sum === 0 ? this.list.getData.sum : ++res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.pageList.resultList;
        this.list.updateData('pageNum', pageNum);
        this.list.updateData('total', total);
        this.list.updateData('dataSource', dataSource);

    }

    getChainDetailForApi(tradeNo) {
        common.loading.show();
        payService.getChainDetail(tradeNo).then(this.getChainDetailForApiCallBack)
    }
    @action.bound getChainDetailForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.detail.updateData('data', res.data.result)
    }
}
export default new store