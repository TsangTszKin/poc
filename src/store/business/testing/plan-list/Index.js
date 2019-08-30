import {action, computed, observable, toJS} from "mobx";
import publicUtils from "@/utils/publicUtils";
import common from "@/utils/common";
import TableAction from "@/components/business/testing/plan-list/TableAction";
import React from "react";
import Status from "@/components/business/testing/list/Status";
import strategyService from "@/api/business/strategyService";
import moment from 'moment';


const testData = [{
    id: '000813',
    name: '必须为活动卡且交易金必须为活动卡且交易金必须为活动卡且交易金必须为活动卡且交易金',
    version: 'V1',
    description: '变量测试',
    createdTime: '2018-07--8 17:39:03',
    status: 1
}, {
    id: '000814',
    name: '距发卡日日期小于30天',
    version: 'V2',
    description: '',
    createdTime: '2018-07--8 17:39:03',
    status: 1
}, {
    id: '000815',
    name: '撒旦画看书看书看书',
    version: 'V3',
    description: '',
    createdTime: '2018-07--8 17:39:03',
    status: 1
}, {
    id: '000816',
    name: '撒旦画看书看书看书',
    version: 'V2',
    description: '',
    createdTime: '2018-07--8 17:39:03',
    status: 0
}, {
    id: '000999',
    name: '撒旦画看书看书看书撒旦画看书看书看书撒旦画看书看书看书撒旦画看书看书看书',
    version: 'V2',
    description: '策略包测试',
    createdTime: '2018-07--8 17:39:03',
    status: 2
}];

class Store {
    @observable pagination = {
        _page: 1,
        _pageSize: 10,
        _total: 0,
        get total() { return toJS(this._total) },
        setTotal(value) { this._total = value; },
        get pageSize() { return toJS(this._pageSize) },
        setPageSize(value) { this._pageSize = value; },
        get page() { return toJS(this._page) },
        setPage(value) { this._page = value; },
        init() {
            this.setPage(1);
            this.setPageSize(10);
            this.setTotal(0);
        }
    };

    @observable _query = '';
    @computed get query() { return toJS(this._query) }
    @action.bound setQuery(value) { this._query = value; }
    @observable _dataSource = [];
    @computed get dataSource() { return toJS(this._dataSource) }
    @action.bound setDataSource(value) { this._dataSource = value; }
    @observable _isLoading = [];
    @computed get isLoading() { return toJS(this._isLoading) }
    @action.bound setIsLoading(value) { this._isLoading = value; }

    @action reset() {
        this.pagination.init();
        this.setQuery('');
    }
}

export default new Store;