/*
 * @Author: zengzijian
 * @Date: 2018-11-13 11:26:07
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-03-21 15:33:31
 * @Description: 
 */

import { observable, action, computed, toJS, autorun } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import eventService from '@/api/analysis/eventService';
import React, { Component } from 'react';
import moment from 'moment';

class store {
    constructor() {
        this.getDimensionsListForApi = this.getDimensionsListForApi.bind(this);
        this.getStatisticsListForApi = this.getStatisticsListForApi.bind(this);
        this.getEventCols = this.getEventCols.bind(this);
        this.sessionStorageParamsToDetails = this.sessionStorageParamsToDetails.bind(this);
        this.getEventSourceListAndStrategyList = this.getEventSourceListAndStrategyList.bind(this);
        this.getChartDataForApi = this.getChartDataForApi.bind(this);
        this.initParams = this.initParams.bind(this);
        this.getRuleListByStrategyList = this.getRuleListByStrategyList.bind(this);
        autorun(() => {
            let tempArray = [];
            this.getSelectValueList1.forEach(element => {
                if (!common.isEmpty(element.eventSourceId))
                    tempArray.push(element.eventSourceId);
            })
            // if (!common.isEmpty(tempArray))
            this.getDimensionsListForApi(tempArray);
            this.setDimensions("");
        });
    }
    @observable strategyList = [];
    @observable ruleList = [];
    @observable selectValueList1 = [{ eventSourceCode: '', eventSourceId: '', strategyCode: '' }];//{eventSourceCode: '', eventSourceId: '', strategyCode: ''}
    @observable selectValueList2 = [];//ruleCode
    @observable isLoading = true;
    @observable dimensions = "";
    @observable dimensionsList = [];
    @observable timePickerData = {
        type: 'DAY',//HOUR, DAY, WEEK, date
        startTime: moment().subtract('days', 3).format('YYYY-MM-DD'),
        endTime: moment().format('YYYY-MM-DD'),
        get getType() { return toJS(this.type) },
        get getStartTime() { return toJS(this.startTime) },
        get getEndTime() { return toJS(this.endTime) },
        setType(value) { this.type = value },
        setStartTime(value) { this.startTime = value },
        setEndTime(value) { this.endTime = value }
    }
    @observable page = {
        num: 1,
        size: 40,
        total: 0,
        get getNum() { return toJS(this.num) },
        get getSize() { return toJS(this.size) },
        get getTotal() { return toJS(this.total) },
        setNum(value) { this.num = value },
        setSize(value) { this.size = value },
        setTotal(value) { this.total = value }
    }
    @observable table = {
        columns: [],
        dataSource: [],
        get getColumns() { return toJS(this.columns) },
        get getDataSource() { return toJS(this.dataSource) },
        setColumns(value) { this.columns = value },
        setDataSource(value) { this.dataSource = value }
    }
    @observable chart = {
        data: [],
        fields: [],
        get getData() { return toJS(this.data) },
        get getFields() { return toJS(this.fields) },
        setData(value) { this.data = value; },
        setFields(value) { this.fields = value; }
    }
    @observable pageType = 0;//0本页，1 /analysis/event/details

    tempParamsForDetailsPage = {}
    @computed get getPageType() { return toJS(this.pageType) }
    @action.bound setPageType(value) { this.pageType = value }
    @computed get getDimensionsList() { return toJS(this.dimensionsList) }
    @action.bound setDimensionsList(value) { this.dimensionsList = value }
    @computed get getDimensions() { return toJS(this.dimensions) }
    @action.bound setDimensions(value) { this.dimensions = value; }
    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value; }
    @computed get getTotal() { return toJS(this.total) }
    @action.bound setTotal(value) { this.total = value; }
    @computed get getPageNum() { return toJS(this.pageNum) }
    @action.bound setPageNum(value) { this.pageNum = value; }
    @computed get getPageSize() { return toJS(this.pageSize) }
    @action.bound setPageSize(value) { this.pageSize = value; }
    @computed get getRuleList() { return toJS(this.ruleList) }
    @action.bound setRuleList(value) { this.ruleList = value; }
    @computed get getStrategyList() { return toJS(this.strategyList) }
    @action.bound setStrategyList(value) { this.strategyList = value; }
    @computed get getSelectValueList1() { return toJS(this.selectValueList1) }
    @action.bound setSelectValueList1(value) { this.selectValueList1 = value; }
    @computed get getSelectValueList2() { return toJS(this.selectValueList2) }
    @action.bound setSelectValueList2(value) { this.selectValueList2 = value; }
    @observable _flatStrategyList = [];
    @computed get flatStrategyList() { return toJS(this._flatStrategyList) }
    @action.bound setFlatStrategyList(value) { this._flatStrategyList = value; }

    getEventSourceListAndStrategyList() { return eventService.getEventSourceListAndStrategyList().then(this.getEventSourceListAndStrategyListCallBack) }
    @action.bound getEventSourceListAndStrategyListCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        let flatList = [];
        res.data.result.forEach(element => {
            let temp = {
                title: element.name,
                value: `·-·${element.id}·-·${element.key}·-·undefined`,//strategyCode·-·eventSourceId·-·eventSourceCode
                key: element.id,
                children: [],
                eventSourceCode: element.key,
                strategyCode: null,
                eventSourceId: element.id,
                search: `${element.key}${element.name}`
            }
            if (!common.isEmpty(element.strategyList)) {
                flatList = [
                    ...flatList,
                    ...element.strategyList
                ];
                let tempArray2 = [];
                element.strategyList.forEach(element2 => {
                    tempArray2.push({
                        title: element2.name,
                        value: `${element2.key}·-·${element.id}·-·${element.key}·-·${element2.id}`,//strategyCode·-·eventSourceId·-·eventSourceCode
                        key: element2.id,
                        eventSourceCode: element.key,
                        strategyId: element2.id,
                        eventSourceId: element.id,
                        search: `${element2.key}${element2.name}`
                    })
                })
                temp.children = tempArray2;
            }
            tempArray.push(temp);
        })
        // console.log('扁平列表', flatList);
        this.setStrategyList(tempArray);
        this.setFlatStrategyList(flatList);
    }

    getRuleListByStrategyList(params) {
        let paramsForUrl = '';
        params.forEach(element => {
            if(element && element !== 'undefined')
                paramsForUrl += `strategyPackageIds=${element}&`;
        })
        paramsForUrl = paramsForUrl.substr(0, paramsForUrl.length - 1);
        if (common.isEmpty(paramsForUrl)) return
        eventService.getRuleListByStrategyList(paramsForUrl).then(this.getRuleListByStrategyListCallBack);
    }
    @action.bound getRuleListByStrategyListCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        res.data.result.forEach(element => {
            tempArray.push({ code: element.code, value: element.name })
        })
        this.setRuleList(tempArray);
    }

    getEventCols() {
        let tempArray = [];
        this.getSelectValueList1.forEach(element => {
            tempArray.push(element.eventSourceId)
        })
        eventService.getEventCols(tempArray).then(this.getEventColsCallBack);
    }

    getDimensionsListForApi(tempArray) {
        eventService.getDimensionsList(tempArray).then(this.getDimensionsListForApiCallBack);
    }
    @action.bound getDimensionsListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return;
        if (typeof res.data.result === 'object' && res.data.result.constructor === Array)
            this.setDimensionsList(res.data.result);
        else {
            this.setDimensionsList([]);
        }
    }

    getStatisticsListForApi() {
        this.setIsLoading(true);
        let eventSourceCodeArray = [];
        // let ruleCodeArray = [];
        let eventSourcesCodes = [];
        let strategyCodeArray = [];
        this.getSelectValueList1.forEach(element => {
            if (!common.isEmpty(element.eventSourceCode))
                eventSourcesCodes.push(element.eventSourceCode);
        })
        this.getSelectValueList1.forEach(element => {
            if (!common.isEmpty(element.strategyCode))
                strategyCodeArray.push(element.strategyCode);
        })
        let params = {
            "pageNum": this.page.getNum,
            "pageSize": this.page.getSize,
            "dsTypes": eventSourcesCodes,
            "procRules": this.getSelectValueList2,
            "strategies": strategyCodeArray,
            "dimension": this.getDimensions,
            "statisInterval": this.timePickerData.getType,
            "startTime": this.timePickerData.getType === 'MONTH' ? this.timePickerData.getStartTime + '-01' : this.timePickerData.getStartTime,
            "endTime": this.timePickerData.getType === 'MONTH' ? this.timePickerData.getEndTime + '-01' : this.timePickerData.getEndTime
        }
        this.tempParamsForDetailsPage = {
            "statisInterval": params.statisInterval,
            "startTime": params.startTime,
            "endTime": params.endTime
        }
        eventService.getStatisticsList(params).then(this.getStatisticsListForApiCallBack);
    }
    @action.bound getStatisticsListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return;
        let columns = [];
        let dataSource = [];
        for (let i = 0; i < res.data.result.headers.length; i++) {
            const element = res.data.result.headers[i];
            if (element === 'dsType' || element === 'procRule' || element === 'strategy') continue
            let col = {
                title: element === 'dsTypeName' ? '事件源' : element === 'strategyName' ? '策略' : element === 'procRuleName' ? '规则' : element,
                dataIndex: element,
                key: element,
            }
            if (!common.isEmpty(res.data.result.data)) {
                if (element === 'dsTypeName' && typeof res.data.result.data[0].dsType === 'string') {
                    col.fixed = 'left';
                    col.width = 100;
                }
                if (element === 'strategyName' && typeof res.data.result.data[0].strategy === 'string') {
                    col.fixed = 'left';
                    col.width = 100;
                }
                if (element === 'procRuleName' && typeof res.data.result.data[0].procRule === 'string') {
                    col.fixed = 'left';
                    col.width = 100;
                }
            }

            // if (i < 3) {
            //     col.fixed = 'left';
            //     col.width = 100;
            // }

            columns.push(col);
        }
        for (let i = 0; i < res.data.result.data.length; i++) {
            const element = res.data.result.data[i];
            // console.log(element);
            let row = { key: i }
            res.data.result.headers.forEach(element2 => {

                if (typeof element[element2] === 'number') {//判断如果是数据的话点击后可跳转到数据明细页面
                    // 这里的element是没有strategyId的，传了个undefined过去，所以只好通过列表找到对应的strategyId
                    row[element2] = <a onClick={() => { this.sessionStorageParamsToDetails(element.strategy, element.dsType, common.isEmpty(element.procRule) ? '' : element.procRule, element2, element.eventSourceId,element.strategyId); }}>{element[element2]}</a>;
                } else {
                    row[element2] = element[element2];
                }
            })
            dataSource.push(row)
        }
        this.table.setColumns(columns);
        this.table.setDataSource(dataSource);
        this.page.setNum(res.data.result.sum === 0 ? this.page.getNum : res.data.result.curPageNO);
        this.page.setTotal(res.data.result.sum);
        this.setIsLoading(false);
        // console.log(this.table.getDataSource);
    }

    getChartDataForApi() {
        let eventSourceCodeArray = [];
        let strategyCodeArray = [];
        this.getSelectValueList1.forEach(element => {
            if (!common.isEmpty(element.eventSourceCode))
                eventSourceCodeArray.push(element.eventSourceCode);
        })
        this.getSelectValueList1.forEach(element => {
            if (!common.isEmpty(element.strategyCode))
                strategyCodeArray.push(element.strategyCode);
        })
        let params = {
            "pageNum": this.page.getNum,
            "pageSize": this.page.getSize,
            "dsTypes": eventSourceCodeArray,
            "procRules": this.getSelectValueList2,
            "strategies": strategyCodeArray,
            "dimension": this.getDimensions,
            "statisInterval": this.timePickerData.getType,
            "startTime": this.timePickerData.getType === 'MONTH' ? this.timePickerData.getStartTime + '-01' : this.timePickerData.getStartTime,
            "endTime": this.timePickerData.getType === 'MONTH' ? this.timePickerData.getEndTime + '-01' : this.timePickerData.getEndTime
        }
        eventService.getChartData(params).then(this.getChartDataForApiCallBack)
    }
    @action.bound getChartDataForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return
        this.chart.setFields(res.data.result.indicators);
        let tempArray = [];
        res.data.result.xAxis.forEach(element => {
            let tempObj = { date: element }
            res.data.result.data.forEach(element2 => {
                if (element2.date == element) {
                    for (const key in element2) {
                        if (element2.hasOwnProperty(key)) {

                            if (key === 'date') continue

                            const element3 = element2[key];
                            tempObj[key] = element3;
                        }
                    }
                }
            })
            tempArray.push(tempObj)
        })
        this.chart.setData(tempArray);

        console.log(this.chart.getFields);
        console.log(this.chart.getData);
    }

    sessionStorageParamsToDetails(strategy, dsType, procRule, timeFromCol, eventSourceId, strategyId) {
        // 处理事件统计点击数字跳转，strategyId为undefined的问题
        if (strategy && common.isEmpty(strategyId)) {
            let temp = this.flatStrategyList.find(item => item.key === strategy);
            // 如果这都找不到就没办法了，选择事件源的选择框就会显示异常
            if (temp) strategyId = temp.id;
        }
        let params = {
            strategy: strategy,
            dsType: dsType,
            procRule: procRule,
            eventSourceId: eventSourceId,
            strategyId: strategyId
        }
        switch (this.tempParamsForDetailsPage.statisInterval) {
            case 'HOUR':
                params.startTime = `${this.tempParamsForDetailsPage.startTime} ${timeFromCol}:00:00`;
                params.endTime = `${this.tempParamsForDetailsPage.startTime} ${timeFromCol}:59:59`;
                break;
            case 'DAY':
                let yearStr = timeFromCol.split("年")[0];
                let monthStr = timeFromCol.split("年")[1].split("月")[0];
                let dayStr = timeFromCol.split("年")[1].split("月")[1].split("日")[0];
                params.startTime = `${yearStr}-${monthStr}-${dayStr} 00:00:00`;
                params.endTime = `${yearStr}-${monthStr}-${dayStr} 23:59:59`;
                break;
            case 'MONTH':
                let year = timeFromCol.split("年")[0];
                let month = timeFromCol.split("年")[1].split("月")[0];
                params.startTime = `${year}-${month}-01 00:00:00`;
                month = Number(month) + 1;

                if (month > 12) {
                    year = Number(year) + 1;
                    month = '01';
                } else {
                    if (month < 10) {
                        month = `0${month}`;
                    }
                }

                params.endTime = `${year}-${month}-01 00:00:00`;
                break;
            default:
                break;
        }
        console.log('params', params);
        sessionStorage.tempParamsForDetailsPage = JSON.stringify(params);
        this.setPageType(1);
    }

    initParams() {
        this.setSelectValueList1([{ eventSourceCode: '', eventSourceId: '', strategyCode: ''}]);
        this.setSelectValueList2([]);
        this.setRuleList([]);
        this.page.setNum(1);
        this.page.setSize(40);
        this.page.setTotal(0);
    }

}

export default new store