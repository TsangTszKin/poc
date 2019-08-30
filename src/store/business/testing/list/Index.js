import {action, computed, flow, observable, toJS} from "mobx";
import publicUtils from "@/utils/publicUtils";
import common from "@/utils/common";
import TableAction from "@/components/business/testing/list/TableAction";
import React from "react";
import strategyService from "@/api/business/strategyService";
import variableService from "@/api/business/variableService";
import Status from "@/components/business/testing/list/Status";
import moment from 'moment';


class Store {
    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.initParams = this.initParams.bind(this);
    }

    @observable dataSource = [];
    @observable isLoading = true;
    @observable _varTypeList = [];
    @computed get varTypeList() { return toJS(this._varTypeList) }
    @action.bound setVarTypeList(value) { this._varTypeList = value; }
    @computed get getDataSource() { return toJS(this.dataSource) }
    @action.bound setDataSource(value) { this.dataSource = value }
    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value }
    @observable _query = [];
    @computed get query() { return toJS(this._query) }
    @action.bound setQuery(value) { this._query = value; }

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

    initParams() {
        this.pagination.init();
    }

    deleteTest = (idArray) => {
        this.setIsLoading(true);
        strategyService.deleteTest(idArray)
            .then(res => {
                if (publicUtils.isOk(res, true)) this.getDataSourceForApi();
                else this.setIsLoading(false);
            })
            .catch(() => {this.setIsLoading(false);})
    }

    getDataSourceForApi = flow(function* () {
        const res = yield strategyService.getTestList(this.pagination.page, this.pagination.pageSize, this.query);
        if (!publicUtils.isOk(res)) return;
        let dataList = [];
        let resultList = res.data.pageList.resultList;
        if(!common.isEmpty(resultList)) {
            for(let i=0; i < resultList.length; i++) {
                const data = common.deepClone(resultList[i]);
                let element = common.deepClone(data);
                element.index = i + 1;
                element.key = i;
                element.name = common.cutString(data.name, 10);
                element.createdTime = moment(data.passTime).format("YYYY-MM-DD HH:mm:ss");
                element.action = <TableAction data={data} deleteTest={this.deleteTest} />;
                element.status = <Status data={data} status={data.status} statusTypes={ this.varTypeList } />;
                dataList.push(element);
            }
        }
        this.pagination.setTotal(res.data.pageList.sum);
        this.setDataSource(dataList);
        this.setIsLoading(false);
    })
}

export default new Store;