import { action, computed, flow, observable, toJS } from "mobx";
import strategyService from "@/api/business/strategyService";
import publicUtils from "@/utils/publicUtils";


class Store {
    @observable detail = {
        _id: [],
        get id() { return toJS(this._id) },
        setId(value) { this._id = value; },
        // 1 rtq, 2 extVar, 3 rule, 4 ruleSet, 5 decisionFlow
        _type: null,
        get type() { return toJS(this._type) },
        setType(value) { this._type = value; },
    };

    @observable _rtq = {};
    @computed get rtq() { return toJS(this._rtq) }
    @action.bound setRtq(value) { this._rtq = value; }

    @observable _extVar = {};
    @computed get extVar() { return toJS(this._extVar) }
    @action.bound setExtVar(value) { this._extVar = value; }

    @observable _rule = {};
    @computed get rule() { return toJS(this._rule) }
    @action.bound setRule(value) { this._rule = value; }

    @observable _ruleSet = {};
    @computed get ruleSet() { return toJS(this._ruleSet) }
    @action.bound setRuleSet(value) { this._ruleSet = value; }

    @observable _decisionFlow = {};
    @computed get decisionFlow() { return toJS(this._decisionFlow) }
    @action.bound setDecisionFlow(value) { this._decisionFlow = value; }

    getDataSource = () => {
        strategyService.getResourceDetail(this.detail.id)
            .then(this.getDataSourceSuccess);
    };

    @action.bound
    getDataSourceSuccess(res) {
        if (!publicUtils.isOk(res)) return ;
        const { result } = res.data;
        console.log(result);
        this.detail.setType(result.type);
        switch (result.type) {
            case 1:
                this.setRtq(result);
                break;
            case 2:
                this.setExtVar(result);
                break;
            case 3:
                this.setRule(result);
                break;
            case 4:
                this.setRuleSet(result);
                break;
            case 5:
                this.setDecisionFlow(result);
                break;
        }
    }
}

export default new Store;