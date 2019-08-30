/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:57:52
 * @Description: 
 */
import {observable, action, toJS, computed} from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import variableService from '@/api/business/variableService';
import commonService from '@/api/business/commonService';

class Store {
    constructor() {
        this.getEventSourceSelectListForApi = this.getEventSourceSelectListForApi.bind(this);
        this.getHomeDataForApi = this.getHomeDataForApi.bind(this);
    }

    @observable eventSourceList = []// {"eventSourceName": "", "eventSourceId": ""}

    @observable isLoading = true;

    @observable statistics = {
        "requestSum": '',
        "failSum": '',
        "hitSum": '',

        get getRequestSum() {
            return toJS(this.requestSum)
        },
        setReuquestSum(value) {
            this.requestSum = value
        },

        get getFailSum() {
            return toJS(this.failSum)
        },
        setFailSum(value) {
            this.failSum = value
        },

        get getHitSum() {
            return toJS(this.hitSum)
        },
        setHitSum(value) {
            this.hitSum = value
        },
    }

    @observable varData = {
        "eventVarSum": '',
        "batchVarSum": '',
        "rtqVarSum": '',
        "extVarSum": '',
        "parameterSum": '',

        get getEventVarSum() {
            return toJS(this.eventVarSum)
        },
        setEventVarSum(value) {
            this.eventVarSum = value
        },

        get getBatchVarSum() {
            return toJS(this.batchVarSum)
        },
        setBatchVarSum(value) {
            this.batchVarSum = value
        },

        get getRtqVarSum() {
            return toJS(this.rtqVarSum)
        },
        setRtqVarSum(value) {
            this.rtqVarSum = value
        },

        get getExtVarSum() {
            return toJS(this.extVarSum)
        },
        setExtVarSum(value) {
            this.extVarSum = value
        },

        get getParameterSum() {
            return toJS(this.parameterSum)
        },
        setParameterSum(value) {
            this.parameterSum = value
        },
    }

    @observable strategyData = {
        "ruleSum": '',
        "ruleSetSum": '',
        "decisionCardSum": '',
        "scoreCardSum": '',
        "strategySum": '',

        get getRuleSum() {
            return toJS(this.ruleSum)
        },
        setRuleSum(value) {
            this.ruleSum = value
        },

        get getRuleSetSum() {
            return toJS(this.ruleSetSum)
        },
        setRuleSetSum(value) {
            this.ruleSetSum = value
        },

        get getDecisionCardSum() {
            return toJS(this.decisionCardSum)
        },
        setDecisionCardSum(value) {
            this.decisionCardSum = value
        },

        get getScoreCardSum() {
            return toJS(this.scoreCardSum)
        },
        setScoreCardSum(value) {
            this.scoreCardSum = value
        },

        get getStrategySum() {
            return toJS(this.strategySum)
        },
        setStrategySum(value) {
            this.strategySum = value
        },
    }

    @observable strategyList = [];

    @computed get getEventSourceList() {
        return toJS(this.eventSourceList);
    }

    @action.bound setEventSourceList(value) {
        this.eventSourceList = value;
    }

    @computed get getIsLoading() {
        return toJS(this.isLoading);
    }

    @action.bound setIsLoading(value) {
        this.isLoading = value;
    }

    @computed get getStrategyList() {
        return toJS(this.strategyList);
    }

    @action.bound setStrategyList(value) {
        this.strategyList = value;
    }

    getEventSourceSelectListForApi() {
        variableService.getEventSourceSelectList(false).then(this.getEventSourceSelectListForApiCallback);
    }

    @action.bound getEventSourceSelectListForApiCallback(res) {
        if (!publicUtils.isOk(res)) return;
        this.setEventSourceList(res.data.result);
        this.setIsLoading(false);
        if (!common.isEmpty(res.data.result))
            this.getHomeDataForApi(res.data.result[0].eventSourceId);
        else {
            this.setIsLoading(false);
        }
    }

    getHomeDataForApi(eventSourceId) {
        commonService.getHomeData(eventSourceId).then(this.getHomeDataForApiCallback);
    }

    @action.bound getHomeDataForApiCallback(res) {
        this.setIsLoading(false);
        if (!publicUtils.isOk(res)) return
        let data = res.data.result;
        this.statistics.setReuquestSum(common.isEmpty(data.requestSum) ? '' : data.requestSum);
        this.statistics.setFailSum(common.isEmpty(data.failSum) ? '' : data.failSum);
        this.statistics.setHitSum(common.isEmpty(data.hitSum) ? '' : data.hitSum);
        this.varData.setEventVarSum(common.isEmpty(data.eventVarSum) ? '' : data.eventVarSum);
        this.varData.setExtVarSum(common.isEmpty(data.extVarSum) ? '' : data.extVarSum);
        this.varData.setRtqVarSum(common.isEmpty(data.rtqVarSum) ? '' : data.rtqVarSum);
        this.varData.setBatchVarSum(common.isEmpty(data.batchVarSum) ? '' : data.batchVarSum);
        this.varData.setParameterSum(common.isEmpty(data.parameterSum) ? '' : data.parameterSum);

        this.strategyData.setStrategySum(common.isEmpty(data.strategySum) ? '' : data.strategySum);
        this.strategyData.setRuleSum(common.isEmpty(data.ruleSum) ? '' : data.ruleSum);
        this.strategyData.setRuleSetSum(common.isEmpty(data.ruleSetSum) ? '' : data.ruleSetSum);
        this.strategyData.setDecisionCardSum(common.isEmpty(data.decisionCardSum) ? '' : data.decisionCardSum);
        this.strategyData.setScoreCardSum(common.isEmpty(data.scoreCardSum) ? '' : data.scoreCardSum);

        this.setStrategyList(common.isEmpty(data.strategyPackageInfoList) ? [] : data.strategyPackageInfoList);
    }
}

export default new Store