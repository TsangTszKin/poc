/**
 * User: duxinzhong/duxz@shine-china.com
 * Date: 2019/5/9 14:54
 * Description: 新建测试方案，控制表单
 */
import {action, computed, observable, toJS} from "mobx";
import React from "react";

class Store {
    @observable _canSelectTime = false;
    @observable _startTime = '';
    @observable _testName = '';
    @observable _executeCount = '';
    @observable _filterTags = [];
    @computed get canSelectTime() { return toJS(this._canSelectTime) }
    @action.bound setCanSelectTime(value) { this._canSelectTime = value }
    @action.bound changeSelectTime() { this._canSelectTime = !this._canSelectTime }
    @computed get startTime() { return this._startTime }
    @action.bound setStartTime(value) { this._startTime = value }
    @computed get testName() { return toJS(this._testName) }
    @action.bound setTestName(value) { this._testName = value }
    @computed get executeCount() { return toJS(this._executeCount) }
    @action.bound setExecuteCount(value) { this._executeCount = value }
    @computed get filterTags() { return toJS(this._filterTags) }
    @action.bound setFilterTags(value) { this._filterTags = value }

    initStore() {
        this.setCanSelectTime(false);
        this.setStartTime('');
        this.setTestName('');
        this.setExecuteCount('');
        this.setFilterTags([]);
    }

    @observable testTable = {
        _columns: [],
        _dataSource: [],
        get columns() { return toJS(this._columns) },
        setColumns(value) { this._columns = value; },
        get dataSource() { return toJS(this._dataSource) },
        setDataSource(value) { this._dataSource = value; },
    }

    @observable historyTable = {
        _columns: [],
        _dataSource: [],
        get dataSource() { return toJS(this._dataSource) },
        setDataSource(value) { this._dataSource = value; },
        get columns() { return toJS(this._columns) },
        setColumns(value) { this._columns = value; },
    }
}

export default new Store;