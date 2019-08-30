import { action, computed, observable, toJS} from "mobx";
import moment from 'moment';

class Store {

    @observable panels = {
        _data: {},
        _isLoading: true,
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value; },
        get data() { return toJS(this._data) },
        setData(value) { this._data = value; },
    };

    @observable chart = {
        _currentTab: 'totalRequest',
        _type: '0',
        _timeStart: new Date(),
        _timeEnd:new Date(),
        dateFormat: 'YYYY/MM/DD',
        _totalHit: [],
        _totalRequest: [],
        _rank: [],
        get rank() { return toJS(this._rank) },
        setRank(value) { this._rank = value; },
        get totalRequest() { return toJS(this._totalRequest) },
        setTotalRequest(value) { this._totalRequest = value; },
        get totalHit() { return toJS(this._totalHit) },
        setTotalHit(value) { this._totalHit = value; },
        get currentTab() { return toJS(this._currentTab) },
        setCurrentTab(value) { this._currentTab = value },
        get type() { return toJS(this._type) },
        setType(value) { this._type = value },
        get timeStart() { return moment(toJS(this._timeStart), this.dateFormat) },
        setTimeStart(value) { this._timeStart = value },
        get timeEnd() { return moment(toJS(this._timeEnd), this.dateFormat) },
        setTimeEnd(value) { this._timeEnd = value },
    };

    @observable requestDetail = {
        _updateTime: 10,
        _dataSource: [],
        _isLoading: true,
        get isLoading() { return toJS(this._isLoading) },
        setIsLoading(value) { this._isLoading = value; },
        get dataSource() { return toJS(this._dataSource) },
        setDataSource(value) { this._dataSource = value; },
        get updateTime() { return toJS(this._updateTime) },
        setUpdateTime(value) { this._updateTime = value; },
    }

    @observable pagination = {
        _page: 1,
        _pageSize: 5,
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

    @observable eventChart = {
        _type: '',
        _data: {},
        _hitTotal: 0,
        _requestTotal: [],
        get requestTotal() { return toJS(this._requestTotal) },
        setRequestTotal(value) { this._requestTotal = value; },
        get hitTotal() { return toJS(this._hitTotal) },
        setHitTotal(value) { this._hitTotal = value; },
        get data() { return toJS(this._data) },
        setData(value) { this._data = value; },
        get type() { return toJS(this._type) },
        setType(value) { this._type = value },
    }

    updateChart = () => {
        console.log('updateChart');
    }
}

export default new Store;