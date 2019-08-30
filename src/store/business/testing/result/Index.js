/*
 * @Author: zengzijian
 * @Date: 2019-05-10 09:34:39
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-16 14:13:10
 * @Description: 
 */
import { observable, action, computed, toJS, autorun } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import eventService from '@/api/analysis/eventService';
import React from 'react';
import moment from 'moment';
import AddAndSub from '@/components/AddAndSub';
import { Select, message } from 'antd';
import GlobalStore from '@/store/GlobalStore';

const tableFiledsColumns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: '50px'
}, {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: '200px'
}, {
    title: '标识',
    dataIndex: 'code',
    key: 'code',
    width: '200px'
}, {
    title: '类型',
    dataIndex: 'type',
    key: 'type',
    width: '100px'
}, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
}];

let allCols = [];

class store {
    constructor() {
        this.getEventDetailsList = this.getEventDetailsList.bind(this);
        this.getEventDetails = this.getEventDetails.bind(this);
        this.filterOptTypeList = this.filterOptTypeList.bind(this);
        this.getConfigListForApi = this.getConfigListForApi.bind(this);
        this.saveConfigListForApi = this.saveConfigListForApi.bind(this);
        this.getEventCols = this.getEventCols.bind(this);
        this.getRuleListByStrategyList = this.getRuleListByStrategyList.bind(this);
        this.getAllColsFoeEventDetailsForApi = this.getAllColsFoeEventDetailsForApi.bind(this);
        this.getEventSourceListAndStrategyList = this.getEventSourceListAndStrategyList.bind(this);
        this.initParams = this.initParams.bind(this);
        autorun(() => {
        });
    }

    @observable strategyList = [];
    @observable ruleList = [];
    @observable cols = [];
    @observable selectValueList1 = [{ eventSourceCode: '', eventSourceId: '', strategyCode: '' }];//{eventSourceCode: '', eventSourceId: '', strategyCode: ''}
    @observable selectValueList2 = [];//ruleCode
    @observable selectValueList3 = [{ optType: '', value: '', col: '', type: '', optTypeList: [] }];//{ optType: '', value: '', col: '', type: ''}
    @observable colsValue = [];
    @observable pageNum = 1;
    @observable pageSize = 20;
    @observable total = 0;
    @observable dataSource = [];
    @observable columns = [];
    @observable isLoading = true;
    @observable showDrawer = false;
    @observable drawerData = { eventVarList: [], batchVarList: [], rtqVarList: [], extVarList: [], ruleResultOut: [], headerInfo: {}, hitNodeTree: [] };
    @observable timeParams = {
        start: '',
        end: '',
        get getStart() { return toJS(this.start) },
        get getEnd() { return toJS(this.end) },
        setStart(value) { this.start = value },
        setEnd(value) { this.end = value }
    }
    @observable drawerDataList = [];
    @observable optTypeList = [{ "code": "EQ", "value": "等于" }, { "code": "NEQ", "value": "不等于" }];
    @observable configList = {
        data: [],
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value }
    }
    @observable modal = {
        tableFields: {
            isShow: false,
            get getIsShow() { return toJS(this.isShow) },
            setIsShow(value) { this.isShow = value }
        }
    }
    @observable tableFields = {
        data: [],
        columns: tableFiledsColumns,
        dataSource: [],
        allSelectData: [],
        get getColumns() { return toJS(this.columns) },
        get getDataSource() { return toJS(this.dataSource) },
        get getData() { return toJS(this.data) },
        get getAllSelectData() { return toJS(this.allSelectData) },
        setColumns(value) { this.columns = value },
        setDataSource(value) { this.dataSource = value },
        setData(value) { this.data = value },
        setAllSelectData(value) { this.allSelectData = value },
        tableDataChange(i, name, value) {
            console.log(`${i}  ${name}  ${value}`);
            let data = common.deepClone(this.getData);
            data[i][name] = value;
            this.setData(data)
            this.setDataSource(this.renderTable(this.getData));
        },
        addTempVar() {
            let tempArray = common.deepClone(this.getData);
            tempArray.push({
                "code": "",
                "name": "",
                "type": 1,
                "createdUser": '111'// 新增字段，判断是否显示下拉
            });
            this.setData(tempArray);
            this.setDataSource(this.renderTable(tempArray));
        },
        subTempVars(key) {
            let tempArray = [];
            let arrayIndex;
            for (let i = 0; i < this.getDataSource.length; i++) {
                const element = this.getDataSource[i];
                if (element.key === key) {
                    arrayIndex = i;
                    continue
                }
                tempArray.push(element);
            }
            let newData = common.deepClone(this.getData);
            newData.splice(arrayIndex, 1);
            this.setData(newData);
            this.setDataSource(this.renderTable(newData));
        },
        verify() {
            for (let i = 0; i < this.getData.length; i++) {
                const element = this.getData[i];
                if (common.isEmpty(element.name) || common.isEmpty(element.name)) {
                    message.warn("请选择字段名称");
                    return false
                }
            }
            return true
        },
        renderTable(list) {//{name: '', code: '', type: '', id: ''}
            let tempArray = [];
            if (common.isEmpty(list)) return tempArray
            for (let i = 0; i < list.length; i++) {
                const element = list[i];
                let uuid = common.getGuid();
                tempArray.push({
                    key: uuid,
                    index: (i + 1),
                    name: element.type === 1 && !common.isEmpty(element.createdUser) ?
                        <Select
                            defaultValue={element.name}
                            style={{ width: '150px' }}

                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}

                            onChange={(value, option) => {
                                this.tableDataChange(i, 'code', value);
                                this.tableDataChange(i, 'name', option.props.children);
                            }}>
                            {allCols.map((item, i) =>
                                <Select.Option key={i} value={item.code} id={item.id}>{item.name}</Select.Option>
                            )}
                        </Select>
                        : element.name,
                    code: element.code,
                    type: element.type === 1 ? '报文字段' : '系统字段',
                    action: element.type === 1 && !common.isEmpty(element.createdUser) ? <AddAndSub type="sub" sub={() => { this.subTempVars(uuid) }} /> : ''
                })
            }
            return tempArray
        },
        dragSortCallBackFunc(dragIndex, hoverIndex) {
            console.log(dragIndex, hoverIndex);
            let data = common.deepClone(this.getData);
            let dataSource = common.deepClone(this.getDataSource);
            data[dragIndex] = this.getData[hoverIndex];
            data[hoverIndex] = this.getData[dragIndex];
            dataSource[dragIndex] = this.getDataSource[hoverIndex];
            dataSource[hoverIndex] = this.getDataSource[dragIndex];
            console.log("data", data);
            this.setData(data);
            this.setDataSource(dataSource);
            this.setDataSource(this.renderTable(data));
        }
    }

    colsMap = [];
    data = [];

    @computed get getOptTypeList() { return toJS(this.optTypeList) }
    @action.bound setOptTypeList(value) { this.optTypelist = value }
    @computed get getDrawerDataList() { return toJS(this.drawerDataList) }
    @action.bound setDrawerDataList(value) { this.drawerDataList = value; }
    @computed get getDrawerData() { return toJS(this.drawerData) }
    @action.bound setDrawerData(value) { this.drawerData = value; }
    @computed get getColsValue() { return toJS(this.colsValue) }
    @action.bound setColsValue(value) { this.colsValue = value; }
    @computed get getShowDrawer() { return toJS(this.showDrawer) }
    @action.bound setShowDrawer(value) { this.showDrawer = value; }
    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value; }
    @computed get getColumns() { return toJS(this.columns) }
    @action.bound setColumns(value) { this.columns = value; }
    @computed get getDataSource() { return toJS(this.dataSource) }
    @action.bound setDataSource(value) { this.dataSource = value; }
    @computed get getTotal() { return toJS(this.total) }
    @action.bound setTotal(value) { this.total = value; }
    @computed get getPageNum() { return toJS(this.pageNum) }
    @action.bound setPageNum(value) { this.pageNum = value; }
    @computed get getPageSize() { return toJS(this.pageSize) }
    @action.bound setPageSize(value) { this.pageSize = value; }
    @computed get getRuleList() { return toJS(this.ruleList) }
    @action.bound setRuleList(value) { this.ruleList = value; }
    @computed get getCols() { return toJS(this.cols) }
    @action.bound setCols(value) { this.cols = value; }
    @computed get getStrategyList() { return toJS(this.strategyList) }
    @action.bound setStrategyList(value) { this.strategyList = value; }
    @computed get getSelectValueList1() { return toJS(this.selectValueList1) }
    @action.bound setSelectValueList1(value) { this.selectValueList1 = value; }
    @computed get getSelectValueList2() { return toJS(this.selectValueList2) }
    @action.bound setSelectValueList2(value) { this.selectValueList2 = value; }
    @computed get getSelectValueList3() { return toJS(this.selectValueList3) }
    @action.bound setSelectValueList3(value) { this.selectValueList3 = value; }

    getEventSourceListAndStrategyList() {
        eventService.getEventSourceListAndStrategyList().then(this.getEventSourceListAndStrategyListCallBack)
    }
    @action.bound getEventSourceListAndStrategyListCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        res.data.result.forEach(element => {
            let temp = {
                title: element.name,
                value: `·-·${element.id}·-·${element.key}`,//strategyCode·-·eventSourceId·-·eventSourceCode
                key: element.id,
                children: [],
                eventSourceCode: element.key,
                strategyCode: null,
                eventSourceId: element.id
            }
            if (!common.isEmpty(element.strategyList)) {
                let tempArray2 = [];
                element.strategyList.forEach(element2 => {
                    tempArray2.push({
                        title: element2.name,
                        value: `${element2.key}·-·${element.id}·-·${element.key}`,//strategyCode·-·eventSourceId·-·eventSourceCode
                        key: element2.id,
                        eventSourceCode: element.key,
                        strategyCode: element2.key,
                        eventSourceId: element.id
                    })
                })
                temp.children = tempArray2;
            }
            tempArray.push(temp);
        })
        this.setStrategyList(tempArray);
        this.getAllColsFoeEventDetailsForApi();
    }

    /**
     *
     * @param Array params
     * @memberof store
     */
    getRuleListByStrategyList(params) {
        eventService.getRuleListByStrategyList(params).then(this.getRuleListByStrategyListCallBack);
    }
    @action.bound getRuleListByStrategyListCallBack(res) {
        if (!publicUtils.isOk(res)) return
        let tempArray = [];
        res.data.result.forEach(element => {
            tempArray.push({ code: element.code, value: element.name })
        });
        this.setRuleList(tempArray);
    }

    getEventCols() {
        let tempArray = [];
        this.getSelectValueList1.forEach(element => {
            tempArray.push(element.eventSourceId)
        })
        eventService.getEventCols(tempArray).then(this.getEventColsCallBack);
    }
    @action.bound getEventColsCallBack(res) {
        if (!publicUtils.isOk(res)) return ;
        let tempArray = [];
        let tempTableFieldsAllSelectData = [];
        if (!common.isEmpty(res.data.result)) {
            res.data.result.forEach(element => {
                tempArray.push({
                    title: element.name,
                    value: element.code,
                    type: element.type,
                    key: common.getGuid(),
                    children: [],
                });
                tempTableFieldsAllSelectData.push(element);
            })
        }
        this.setCols(tempArray);
        this.tableFields.setAllSelectData(tempTableFieldsAllSelectData);
        this.tableFields.setDataSource(this.tableFields.renderTable(this.configList.getData))
    }

    getEventDetailsList() {
        let selectValueList3 = this.getSelectValueList3;
        let conditions = [];
        this.data = [];
        this.setDrawerDataList([]);
        if (!common.isEmpty(sessionStorage.tempParamsForDetailsPage)) {//是从事件统计页面点击跳转
            let tempParamsForDetailsPage = JSON.parse(sessionStorage.tempParamsForDetailsPage);
            console.log("tempParamsForDetailsPage", tempParamsForDetailsPage);
            let params = {
                pageNum: this.getPageNum,
                pageSize: this.getPageSize,
                dsTypes: [tempParamsForDetailsPage.dsType],
                fields: this.getColsValue,
                procRules: common.isEmpty(tempParamsForDetailsPage.procRule) ? [] : [tempParamsForDetailsPage.procRule],
                conditions: [{ attribute: "statusCode", dataType: 16, operator: "TRUE", value: "" }],
                strategies: [tempParamsForDetailsPage.strategy],
                startTime: tempParamsForDetailsPage.startTime,
                endTime: tempParamsForDetailsPage.endTime,
                test: true
            }
            this.getRuleListByStrategyList([tempParamsForDetailsPage.strategy]);
            eventService.getEventDetailsList(params).then(this.getEventDetailsListCallBack);
            this.setSelectValueList1([{ eventSourceCode: tempParamsForDetailsPage.dsType, eventSourceId: tempParamsForDetailsPage.eventSourceId, strategyCode: common.isEmpty(tempParamsForDetailsPage.strategy) ? '' : tempParamsForDetailsPage.strategy }]);
            this.setSelectValueList2(common.isEmpty(tempParamsForDetailsPage.procRule) ? [] : [tempParamsForDetailsPage.procRule]);
            this.setSelectValueList3([{ optType: 'TRUE', value: '', col: 'statusCode', type: 16, optTypeList: [] }]);
            //时事件统计的列表的策略不能为空，前后端已经约定好，否则此处循环逻辑得检查重写
            this.getStrategyList.forEach(element => {
                if (!common.isEmpty(element.children)) {
                    element.children.forEach(element2 => {
                        if (!common.isEmpty(element2.strategyCode)) {
                            if (element2.strategyCode === tempParamsForDetailsPage.strategy) {//绦填充setSelectValueList1的eventSourceId
                                this.setSelectValueList1([{ eventSourceCode: tempParamsForDetailsPage.dsType, eventSourceId: element2.eventSourceId, strategyCode: common.isEmpty(tempParamsForDetailsPage.strategy) ? '' : tempParamsForDetailsPage.strategy }]);
                            }
                        }
                    })
                }
            })
            this.filterOptTypeList();

            this.timeParams.setStart(tempParamsForDetailsPage.startTime);
            this.timeParams.setEnd(tempParamsForDetailsPage.endTime);
            window.document.querySelector("#analysis-event-details #startTime").value = tempParamsForDetailsPage.startTime;
            window.document.querySelector("#analysis-event-details #endTime").value = tempParamsForDetailsPage.endTime;
            sessionStorage.removeItem("tempParamsForDetailsPage");
            console.log("GlobalStore.menu.getLeft", GlobalStore.menu.getLeft);
            GlobalStore.menu.setLeft(GlobalStore.menu.getLeft);
        } else {//不是从事件统计页面点击跳转
            for (let i = 0; i < selectValueList3.length; i++) {
                const element = selectValueList3[i];
                if (element.type === 16 || element.optType === 'NOT_NULL' || element.optType === 'IS_NULL') {
                    if (!common.isEmpty(element.col) && !common.isEmpty(element.optType))
                        conditions.push({
                            "attribute": element.col,
                            "dataType": element.type,
                            "operator": element.optType,
                            "value": ""
                        });
                } else {
                    if (!common.isEmpty(element.col) && !common.isEmpty(element.optType) && !common.isEmpty(element.value))
                        conditions.push({
                            "attribute": element.col,
                            "dataType": element.type,
                            "operator": element.optType,
                            "value": element.value
                        });
                }

            }

            let eventSourcesCodes = [];
            this.getSelectValueList1.forEach(element => {
                if (!common.isEmpty(element.eventSourceCode))
                    eventSourcesCodes.push(element.eventSourceCode);
            })
            let strategyCodeArray = [];
            this.getSelectValueList1.forEach(element => {
                if (!common.isEmpty(element.strategyCode))
                    strategyCodeArray.push(element.strategyCode);
            })

            let params = {
                pageNum: this.getPageNum,
                pageSize: this.getPageSize,
                dsTypes: eventSourcesCodes,
                fields: this.getColsValue,
                procRules: this.getSelectValueList2,
                strategies: strategyCodeArray,
                conditions: conditions,
                startTime: this.timeParams.getStart,
                endTime: this.timeParams.getEnd,
                test: true
            };
            eventService.getEventDetailsList(params).then(this.getEventDetailsListCallBack);
        }



    }
    @action.bound getEventDetailsListCallBack(res) {
        if (!publicUtils.isOk(res)) return;
        let pageList = res.data.pageList;
        this.data = common.deepClone(pageList.resultList);
        let data = common.deepClone(pageList.resultList);
        let dataSource = [];
        let drawerDataList = [];
        if (!common.isEmpty(data)) {
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                let dataRow = { key: i }
                this.configList.getData.forEach(column => {//遍历列头从api回调拿到数据
                    if (column.type === 0) {//外层数据
                        dataRow[column.code] = element[column.code];
                    } else if (column.type === 1) {//报文数据（data里面）
                        dataRow[column.code] = element.data[column.code];
                    }
                })
                dataSource.push(dataRow);
            }


        }

        this.drawerDataList = drawerDataList;
        this.setPageNum(pageList.sum === 0 ? this.getPageNum : pageList.curPageNO);
        this.setTotal(pageList.sum);
        this.setIsLoading(false);
        this.setDataSource(dataSource);
    }

    getEventDetails(params) {
        common.loading.show();
        eventService.getEventDetails(params).then(this.getEventDetailsCallBack);
    }
    @action.bound getEventDetailsCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return;
        let temp = {
            eventVarList: res.data.result.eventVarList,
            batchVarList: res.data.result.batchVarList,
            rtqVarList: res.data.result.rtqVarList,
            extVarList: res.data.result.extVarList,
            ruleResultOut: !common.isEmpty(res.data.result.ruleResultOut) ? res.data.result.ruleResultOut : [],
            hitNodeTree: res.data.result.hitNodeTree,
            headerInfo: {
                seqNo: res.data.result.seqNo,
                name: res.data.result.dsTypeName,
                eventCode: res.data.result.dsType,
                bingoStrategy: !common.isEmpty(res.data.result.finalResultOut) && !common.isEmpty(res.data.result.finalResultOut.packageName) ? res.data.result.finalResultOut.packageName : '无',
                bingoRule: !common.isEmpty(res.data.result.finalResultOut) && !common.isEmpty(res.data.result.finalResultOut.name) ? res.data.result.finalResultOut.name : '无',
                status: res.data.result.statusName,
                ddApdate: moment(Number(res.data.result.ddApdate)).format("YYYY-MM-DD HH:mm:ss"),
                timeConsuming: res.data.result.decisionCostTime + '毫秒',
            }
        }
        this.setDrawerData(temp);
        this.setShowDrawer(true);
        console.log("res.data", res.data)
    }

    filterOptTypeList() {
        let tempArray = [];
        console.log("this.getSelectValueList3", this.getSelectValueList3)
        this.getSelectValueList3.forEach(element => {
            let tempObj = {};
            switch (element.type) {
                case 12://字符串
                case '12'://字符串
                    tempObj.optTypeList = [{ "code": "EQ", "value": "等于" }, { "code": "NEQ", "value": "不等于" }, { "code": "INCLUDE", "value": "包含" }, { "code": "EXCLUDE", "value": "不包含" }, { "code": "START_WITH", "value": "开头是" }, { "code": "END_WITH", "value": "结尾是" }, { "code": "NOT_STARTS_WITH", "value": "开头不是" }, { "code": "NOT_ENDS_WITH", "value": "结尾不是" }, { "code": "IS_NULL", "value": "是空值" }, { "code": "NOT_NULL", "value": "不是空值" }];
                    break;
                case -5://长整型
                case 4://整型
                case 93://时间类型
                case 3://双精度浮点型
                case '-5'://长整型
                case '4'://整型
                case '93'://时间类型
                case '3'://双精度浮点型
                    tempObj.optTypeList = [{ "code": "EQ", "value": "等于" }, { "code": "NEQ", "value": "不等于" }, { "code": "GT", "value": "大于" }, { "code": "LT", "value": "小于" }, { "code": "GTE", "value": "大于或等于" }, { "code": "LTE", "value": "小于或等于" }];
                    break;
                case 16://布尔类型
                case '16'://布尔类型
                    tempObj.optTypeList = [{ "code": "TRUE", "value": "是" }, { "code": "FALSE", "value": "不是" }];
                    break;
                default:
                    tempObj.optTypeList = [];
                    break;
            }
            tempObj.optType = element.optType;
            tempObj.value = element.value;
            tempObj.col = element.col;
            tempObj.type = element.type;
            tempArray.push(tempObj);
        })
        console.log("tempArray", tempArray);
        this.setSelectValueList3(tempArray);
    }

    getConfigListForApi() {
        eventService.getConfigList().then(this.getConfigListForApiCallBack);
    }
    @action.bound getConfigListForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return ;

        let tempColumns = [];
        if (!common.isEmpty(res.data.result)) {
            this.tableFields.setDataSource(this.tableFields.renderTable(res.data.result));
            this.tableFields.setData(res.data.result);
            this.configList.setData(res.data.result);
            res.data.result.forEach(element => {
                tempColumns.push({
                    title: element.name,
                    dataIndex: element.code,
                    key: element.code,
                    render: text => element.code === 'ddApdate' ? moment(Number(text)).format("YYYY-MM-DD HH:mm:ss") : element.code === 'decisionCostTime' ? `${text}毫秒` : text
                })
            })
        } else {
            this.tableFields.setDataSource([]);
            this.tableFields.setData([]);
        }
        this.setColumns(tempColumns);
        this.getEventDetailsList();
    }

    saveConfigListForApi() {
        common.loading.show();
        eventService.saveConfigList(this.tableFields.getData).then(this.saveConfigListForApiCallBack).catch(() => { common.loading.hide() })
    }
    @action.bound saveConfigListForApiCallBack(res) {
        common.loading.hide();
        if (!publicUtils.isOk(res)) return ;
        this.getConfigListForApi();
    }

    getAllColsFoeEventDetailsForApi() {
        eventService.getAllColsFoeEventDetails().then(this.getAllColsForEventDetailsForApiCallBack);
    }
    @action.bound getAllColsForEventDetailsForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return ;
        allCols = res.data.result;
        this.getConfigListForApi();
    }

    initParams() {
        this.setRuleList([]);
        this.setSelectValueList1([{ eventSourceCode: '', eventSourceId: '', strategyCode: '' }]);
        this.setSelectValueList2([]);
        this.setSelectValueList3([{ optType: '', value: '', col: '', type: '', optTypeList: [] }]);

    }

}

export default new store