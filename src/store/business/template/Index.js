/*
 * @Author: liuzl
 * @Date: 2019-06-05 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-13 18:58:51
 * @Description: 
 */
import { observable, action, computed, toJS } from 'mobx';
import variableService from '@/api/business/variableService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import TableAction from '@/components/business/template/TableAction';
import React from 'react';
import commonService from "../../../api/business/commonService";
import { message } from "antd";

class store {

    constructor() {
        this.getDataSourceForApi = this.getDataSourceForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
    }

    @observable pageNum = 1;
    @observable pageSize = 10;
    @observable total = 0;
    @observable dataSource = [];
    @observable selectedRowKeys = [];
    @observable isLoading = true;
    @observable query = { name: '', code: '', type: '', };

    @computed get getQuery() {
        return toJS(this.query)
    }

    @action.bound setQuery(value) {
        this.query = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading)
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getDataSource() {
        return toJS(this.dataSource)
    }

    @action.bound setDataSource(value) {
        this.dataSource = value;
    }

    @computed get getTotal() {
        return toJS(this.total)
    }

    @action.bound setTotal(value) {
        this.total = value;
    }

    @computed get getPageNum() {
        return toJS(this.pageNum)
    }

    @action.bound setPageNum(value) {
        this.pageNum = value;
    }

    @computed get getPageSize() {
        return toJS(this.pageSize)
    }

    @action.bound setPageSize(value) {
        this.pageSize = value;
    }

    @computed get getSelectedRowKeys() {
        return toJS(this.selectedRowKeys)
    }

    @action.bound setSelectedRowKeys(value) {
        this.selectedRowKeys = value;
    }

    initParams() {
        this.setQuery({ name: '', code: '', type: '' });
        this.setPageNum(1);
        this.setPageSize(10);
        this.setTotal(10);
    }


    getDataSourceForApi() {
        commonService.getTemplateList(this.getPageNum, this.getPageSize, this.getQuery).then(this.getDataSourceForApiCallback)
    }

    @action.bound getDataSourceForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return;
        let dataList = [];
        this.resultDataList = common.deepClone(res.data.pageList.resultList);
        if (res.data.pageList.resultList) {
            for (let i = 0; i < res.data.pageList.resultList.length; i++) {
                const element = res.data.pageList.resultList[i];
                const entity = JSON.parse(element.entity)
                let path = '';
                if (element.typeName == "规则集") {
                    switch (entity.type) {
                        case 1:
                            path = "/business/strategy/rule-set/save/1/";
                            break;
                        case 0:
                            path = "/business/strategy/rule-set/save/0/";
                            break;
                    }
                } else if (element.typeName == "衍生变量") {
                    switch (entity.type) {
                        case 0:
                            path = "/business/variable/derivation/save-count/";
                            break;
                        case 1:
                            path = "/business/variable/derivation/save-regular/";
                            break;
                        case 2:
                            path = "/business/variable/derivation/save-func/";
                            break;
                    }
                } else {
                    switch (element.typeName) {
                        case "实时查询变量":
                            path = "/business/variable/real-time-query/save2.0/2/"+entity.rtqVarType+"/";
                            break;
                        case "规则":
                            path = "/business/strategy/rule/save/2/";
                            break;
                        case "决策流":
                            path = "/business/strategy/definition/save/2/";
                            break;
                        case "策略包":
                            path = "/business/release/package/save/";
                            break;
                        case "评分卡":
                            path = "/business/strategy/card/save/2/";
                            break;
                    }
                }
                let data = common.deepClone(element);
                data.index = i + 1;
                data.key = i;
                data.code = entity.code;
                data.authorizationType = <div>{data.authorizationType === 0 ? '私有' : '公有'}</div>
                data.action = <TableAction dataId={element.id} changeStatus={this.changeStatus}
                    deleteOne={this.deleteOne}
                    editPath={{ pathname: path + element.id }} />;
                dataList.push(data);
            }
        } else {
            this.resultDataList = [];
            if (this.page.getNum > 1) {
            }
        }
        this.setSelectedRowKeys([]);
        this.setPageNum(this.getPageNum);
        this.setTotal(res.data.pageList.sum);
        this.setIsLoading(false);
        this.setDataSource(dataList);

    }

    deleteOne(dataId) {
        common.loading.show();
        commonService.deleteTemplate(dataId).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return
            message.success("删除成功");
            this.getDataSourceForApi();
            this.setSelectedRowKeys([]);
        }).catch(() => {
            common.loading.hide();
        })
    }
}

export default new store