import { action, computed, flow, observable, toJS } from "mobx";
import common from "@/utils/common";

class Store {
    @observable _dataSource = [];
    @computed get dataSource() { return toJS(this._dataSource) }
    @action.bound setDataSource(value) { this._dataSource = value; }
    
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

    @observable _templateVO = {
        authorizationType: 0, //模板所有权 0:私有 1:公有
        description: '',
        id: '',
        name: '',
        type: 6 //模板类型 6决策表
    };
    @computed get templateVO() { return toJS(this._templateVO) }
    @action.bound setTemplateVO(value) { this._templateVO = value; }
    @action.bound updateTemplateVO(key, value) { this._templateVO[key] = value; }
    @action.bound resetTemplateVO() {
        this._templateVO = {
            authorizationType: 0,
            description: '',
            id: '',
            name: '',
            type: 6
        }
    }

    // 复用UseTimes所需要的
    @observable useTimesTree = {
        times: '',
        data: {},
        show: false,
        get getTimes() { return toJS(this.times) },
        setTimes(value) { this.times = value },
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value; },
        get getShow() { return toJS(this.show) },
        setShow(value) { this.show = value; }
    }

}

export default new Store;