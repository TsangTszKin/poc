/*
 * @Author: liuzhuolin
 * @Date: 2019-05-16 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:51:47
 * @Description:
 */

import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import variableService from '@/api/business/variableService';



class store {
    constructor() {
        this.getDetailsForApi = this.getDetailsForApi.bind(this);
        this.initTable = this.initTable.bind(this);
    }

    resultData = '';
    @observable id = '';
    @observable isHaveCommitBtn = false;
    @observable isCanCommit = false;
    @observable modal = {
        submit: {
            isShow: false,
            get getIsShow() {
                return toJS(this.isShow)
            },
            setIsShow(value) {
                this.isShow = value
            }
        },
        get getColumns() {
            return toJS(this.columns)
        },
        get getDataSource() {
            return toJS(this.dataSource)
        },
    }

    @observable details = {
        data: {
            status: 0,
            typeLabel: '',
            category: 0,
            type: 0
        },
        get getData() {
            return toJS(this.data)
        },
        setData(value) {
            this.data = value
        }
    }


    //提交
    @computed get getIsCanCommit() {
        return toJS(this.isCanCommit);
    }

    @action setIsCanCommit(value) {
        this.isCanCommit = value;
    }

    @computed get getIsHaveCommitBtn() {
        return toJS(this.isHaveCommitBtn);
    }

    @action setIsHaveCommitBtn(value) {
        this.isHaveCommitBtn = value;
    }

    @computed get getId() {
        return toJS(this.id)
    }

    @action setId(value) {
        this.id = value
    }


    getDetailsForApi() {
        // common.loading.show();
        variableService.getBatchVarById(this.id).then(this.getDetailsForApiCallBack).catch(() => { /*common.loading.hide()*/
        })
    }

    @action.bound getDetailsForApiCallBack(res) {
        // common.loading.hide();
        if (!publicUtils.isOk(res)) return
        this.resultData = res.data.result;
        this.details.setData(res.data.result);
        if (!common.isEmpty(res.data.result.rtdTableColumnEntities)) {
            let rtdTableColumnCopy = common.deepClone(res.data.result.rtdTableColumnEntities);
            rtdTableColumnCopy.forEach(element => {
                element.key = common.getGuid();
            });
            this.table.rtdTable.setData(res.data.result.rtdTableColumnEntities);
            this.getIsPartition();
            this.table.rtdTable.setDataSource(this.renderTable(this.table.rtdTable.getData));
        } else {
            this.table.rtdTable.setData([]);
            this.table.rtdTable.setDataSource([]);
        }
    }

    initTable() {
        this.details.setData({
            name: '',
            code: '',
            dimensionName: '',
            type: '',
            defaultValue: '',
            categoryName: '',
            description: '',
            status: 0,
            statusLabel: '',
            typeLabel: ''
        });
    }

}

export default new store