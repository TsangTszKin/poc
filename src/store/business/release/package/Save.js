/*
 * @Author: zengzijian
 * @LastEditors: zengzijian
 * @Description: 
 * @Date: 2019-05-06 12:00:13
 * @LastEditTime: 2019-05-10 10:19:11
 */
import {observable, action, computed, toJS} from 'mobx';
import strategyService from '@/api/business/strategyService';
import publicUtils from '@/utils/publicUtils';
import React from 'react';

class Store {
    constructor() {
        this.getStrategyPackageResourcesForApi = this.getStrategyPackageResourcesForApi.bind(this);
        // 获取策略包详细返回资源的字段需要跟getStrategyPackageResourcesForApi返回的字段（tKey）一致
        this.textOfType = {
            'rtqVars': '实时查询变量',
            'extVars': '衍生变量',
            // 'rules': '规则', /* 现在策略包不可以直接选择规则资源 */
            'ruleSets': '规则集',
            'scoreCards': '评分卡',
            'decisionTables': '决策表',
            'decisionFlows': '决策流',
        };
        this.transferKeys = Object.keys(this.textOfType);
        // 根据上面配置生成穿梭框对应的observable对象
        this.transferKeys.forEach(tKey => {
            this[tKey] = observable({
                all: [], //所有的完整数据
                select: [], //被中的数据
                selectBackup: [], //所有的完整数据（预留做二次开发对比）
                get getAll() { return toJS(this.all) },
                get getSelect() { return toJS(this.select) },
                get getSelectBackup() { return toJS(this.selectBackup) },
                setAll(value) { this.all = value },
                setSelect(value) { this.select = value },
                setSelectBackup(value) { this.selectBackup = value }
            });
        }, {
            setAll: action,
            setSelect: action,
            setSelectBackup: action,
        });
        // console.log(this);
    }

    @observable baseInfo = {
        name: '',
        code: '',
        eventSourceId: '',
        eventSourceName: '',
        eventSourceType: "",
        get getName() { return toJS(this.name) },
        get getCode() { return toJS(this.code) },
        get getEventSourceId() { return toJS(this.eventSourceId) },
        get getEventSourceName() { return toJS(this.eventSourceName) },
        get getEventSourceType() { return toJS(this.eventSourceType) },
        setName(value) { this.name = value },
        setCode(value) { this.code = value },
        setEventSourceId(value) { this.eventSourceId = value },
        setEventSourceName(value) { this.eventSourceName = value },
        setEventSourceType(value) { this.eventSourceType = value },
    }

    @observable isLoading = false;
    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value; }

    // 换了新的写法待稳定后可删除
    // // 实时查询变量
    // @observable rtq = {
    //     all: [],//所有的完整数据
    //     select: [],//被中的数据
    //     selectBackup: [],//所有的完整数据（预留做二次开发对比）
    //     get getAll() { return toJS(this.all) },
    //     get getSelect() { return toJS(this.select) },
    //     get getSelectBackup() { return toJS(this.selectBackup) },
    //     setAll(value) { this.all = value },
    //     setSelect(value) { this.select = value },
    //     setSelectBackup(value) { this.selectBackup = value }
    // }
    //
    // // 衍生变量
    // @observable ext = {
    //     all: [],//所有的完整数据
    //     select: [],//被中的数据
    //     selectBackup: [],//所有的完整数据（预留做二次开发对比）
    //     get getAll() { return toJS(this.all) },
    //     get getSelect() { return toJS(this.select) },
    //     get getSelectBackup() { return toJS(this.selectBackup) },
    //     setAll(value) { this.all = value },
    //     setSelect(value) { this.select = value },
    //     setSelectBackup(value) { this.selectBackup = value }
    // }
    //
    // // 规则
    // @observable rule = {
    //     all: [],//所有的完整数据
    //     select: [],//被中的数据
    //     selectBackup: [],//所有的完整数据（预留做二次开发对比）
    //     get getAll() { return toJS(this.all) },
    //     get getSelect() { return toJS(this.select) },
    //     get getSelectBackup() { return toJS(this.selectBackup) },
    //     setAll(value) { this.all = value },
    //     setSelect(value) { this.select = value },
    //     setSelectBackup(value) { this.selectBackup = value }
    // }
    //
    // //规则集
    // @observable ruleSet = {
    //     all: [],//所有的完整数据
    //     select: [],//被中的数据
    //     selectBackup: [],//所有的完整数据（预留做二次开发对比）
    //     get getAll() { return toJS(this.all) },
    //     get getSelect() { return toJS(this.select) },
    //     get getSelectBackup() { return toJS(this.selectBackup) },
    //     setAll(value) { this.all = value },
    //     setSelect(value) { this.select = value },
    //     setSelectBackup(value) { this.selectBackup = value }
    // }
    //
    // // 决策流
    // @observable strategy = {
    //     all: [],//所有的完整数据
    //     select: [],//被中的数据
    //     selectBackup: [],//所有的完整数据（预留做二次开发对比）
    //     get getAll() { return toJS(this.all) },
    //     get getSelect() { return toJS(this.select) },
    //     get getSelectBackup() { return toJS(this.selectBackup) },
    //     setAll(value) { this.all = value },
    //     setSelect(value) { this.select = value },
    //     setSelectBackup(value) { this.selectBackup = value }
    // }

    @observable version = {
        list: [],
        currentVersion: '',
        get getList() { return toJS(this.list) },
        setList(value) { this.list = value },
        get getCurrentVersion() { return toJS(this.currentVersion) },
        setCurrentVersion(value) { this.currentVersion = value }
    }

    getStrategyPackageResourcesForApi() {
        this.setIsLoading(true);
        if(!this.baseInfo.getEventSourceId) {
            this.setIsLoading(false);
            return;
        }
        return strategyService.getStrategyPackageResources(this.baseInfo.getEventSourceId)
            .then(this.getStrategyPackageResourcesCallBack)
    }
    @action.bound getStrategyPackageResourcesCallBack(res) {
        if (!publicUtils.isOk(res)) {
            this.setIsLoading(false);
            return;
        }
        const { data } = res;
        // console.log(data);
        const { result } = data;
        // Transfer要求数据源必须有key属性
        for(let arrKey in result) {
            if(result.hasOwnProperty(arrKey)) {
                result[arrKey].forEach(item => {
                    item.key = item.code;
                })
            }
        }
        // const { decisionFlows, extVars, rtqVars, ruleSets, rules, decisionTables=[], scoreCards=[] } = result;
        // this.strategy.setAll(decisionFlows);
        // this.ext.setAll(extVars);
        // this.rtq.setAll(rtqVars);
        // this.ruleSet.setAll(ruleSets);
        // this.rule.setAll(rules);
        // this.decisionTable.setAll(rules);
        // this.scoreCard.setAll(rules);
        this.transferKeys.forEach(tKey => {
            this[tKey].setAll(result[tKey])
        });
        this.setIsLoading(false);
        // console.log(data);
    }
    @action.bound restBaseInfo() {
        this.baseInfo.setName('');
        this.baseInfo.setCode('');
        this.baseInfo.setEventSourceId('');
        this.baseInfo.setEventSourceName('');
        this.baseInfo.setEventSourceType('');
    }
    @action.bound resetAllTransfer() {
        // this.strategy.setAll([]);
        // this.strategy.setSelect([]);
        // this.ext.setAll([]);
        // this.ext.setSelect([]);
        // this.rtq.setAll([]);
        // this.rtq.setSelect([]);
        // this.ruleSet.setAll([]);
        // this.ruleSet.setSelect([]);
        // this.rule.setAll([]);
        // this.rule.setSelect([]);
        this.transferKeys.forEach(tKey => {
            this[tKey].setAll([]);
            this[tKey].setSelect([]);
        });
    }

    @observable versionList = {
        _list: [],
        _selectedKey: [],
        _isShow: false,
        _selectedRows: [],
        _prevResId: '',
        _prevType: '',
        get prevType() { return toJS(this._prevType) },
        setPrevType(value) { this._prevType = value; },
        get prevResId() { return toJS(this._prevResId) },
        setPrevResId(value) { this._prevResId = value; },
        get selectedRows() { return toJS(this._selectedRows) },
        setSelectedRows(value) { this._selectedRows = value; },
        get isShow() { return toJS(this._isShow) },
        setIsShow(value) { this._isShow = value; },
        get selectedKey() { return toJS(this._selectedKey) },
        setSelectedKey(value) { this._selectedKey = value; },
        get list() { return toJS(this._list) },
        setList(value) { this._list = value; },
        reset() {
            this._list = [];
            this._selectedKey = [];
            this._selectedRows = [];
            this._prevResId = '';
            this._prevType = '';
        }
    }
}

export default new Store;