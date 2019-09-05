/*
 * @Author: zengzijian
 * @Date: 2019-08-26 14:17:20
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:21:43
 * @Description: 
 */
import { observable, toJS, action } from 'mobx'
// import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils'
import alertService from '@/api/business/alertService'

class store {
    constructor() {
        this.reset = this.reset.bind(this);
        this.getAlertListForApi = this.getAlertListForApi.bind(this);
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
            query: { startTime: '2019-01-01', endTime: '2019-09-01', id: '', status: '', level: '' },
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
            query: { startTime: '2019-01-01', endTime: '2019-09-01', id: '', status: '', level: '' },
            timeUnit: 60
        })
    }

    getAlertListForApi() {
        this.list.updateData('loading', true);
        alertService.getAlertList(this.list.getData.pageNum, this.list.getData.pageSize, this.list.getData.query).then(this.getAlertListForApiCallBack)
    }
    @action.bound getAlertListForApiCallBack(res) {
        this.list.updateData('loading', false);
        if (!publicUtils.isOk(res)) return

        let pageNum = res.data.pageList.sum === 0 ? this.list.getData.sum : ++res.data.pageList.curPageNO;
        let total = res.data.pageList.sum;
        let dataSource = res.data.pageList.resultList;
        this.list.updateData('pageNum', pageNum);
        this.list.updateData('total', total);
        this.list.updateData('dataSource', dataSource);

    }
}
export default new store