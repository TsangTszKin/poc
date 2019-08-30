/*
 * @Author: zengzijian
 * @Date: 2018-11-05 11:48:08
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-10 14:52:28
 * @Description: 数据分析接口
 */
import { Modal } from 'antd'
import axios from '@/config/http.filter';
import http from '@/config/http';
import common from '@/utils/common';

const errorHandler = error => {
    console.log("出错信息如下");
    console.log(error);
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: error,
    });

}
export default {
    /**
     * 事件分析-事件明细列表
     * @param {*} params
     * @returns
     */
    getEventDetailsList(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/list`, params).catch(errorHandler)
    },
    /**
     * 事件分析-事件明细列表
     * @param {*} params
     * @returns
     */
    getEventDetails(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/detail`, params).catch(errorHandler)
    },
    /**
     * 获取指定事件源下的字段列表
     * @param {*} params
     * @returns
     */
    getEventCols(values) {
        let paramsForUrl = '';
        values.forEach(element => {
            paramsForUrl += `eventSourceIds=${element}&`;
        })
        paramsForUrl = paramsForUrl.substr(0, paramsForUrl.length - 1);
        return axios.post(`${http.gwApiPrefix}/api/data/event/cols?${paramsForUrl}`).catch(errorHandler)
    },
    /**
     * 获取事件源列表及其每个事件源下的策略列表
     * @returns
     */
    getEventSourceListAndStrategyList() {
        return axios.get(`${http.gwApiPrefix}/api/data/event/strategy`).catch(errorHandler)
    },
    getRuleListByStrategyList(paramsForUrl) {
        return axios.post(`${http.gwApiPrefix}/api/data/strategyPackage/strategy?${paramsForUrl}`).catch(errorHandler)
    },
    /**
     * 事件统计页面-根据事件源（或者多个事件源）获取事件统计的维度列表
     * @param {*} eventSourcesArray
     * @returns
     */
    getDimensionsList(eventSourcesArray) {
        console.log("eventSourcesArray", eventSourcesArray)
        let eventSourcesArrayTemp = [];
        eventSourcesArray.forEach(element => {
            eventSourcesArrayTemp += 'eventSourceIds=' + element + '&';
        });
        if (common.isEmpty(eventSourcesArrayTemp)) {
            eventSourcesArrayTemp = 'eventSourceIds=';
        } else {
            eventSourcesArrayTemp = eventSourcesArrayTemp.substr(0, eventSourcesArrayTemp.length - 1);
        }

        return axios.post(`${http.gwApiPrefix}/api/data/event/statis/dimensions?${eventSourcesArrayTemp}`).catch(errorHandler);
    },
    /**
     * 事件分析-事件统计
     * @param {*} params
     * @returns
     */
    getStatisticsList(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/statis/list`, params).catch(errorHandler)
    },
    /**
     * 事件分析-事件统计-折线图
     * @param {*} params
     * @returns
     */
    getChartData(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/statis/histagram`, params).catch(errorHandler)
    },
    /**
     * 获取用户报文字段列表
     *
     * @returns
     */
    getConfigList() {
        return axios.get(`${http.gwApiPrefix}/api/system/conf/dataAnalysis/list`).catch(errorHandler)
    },
    /**
     * 保存报文字段列表
     * @param {*} params
     */
    saveConfigList(params) {
        return axios.post(`${http.gwApiPrefix}/api/system/conf/dataAnalysis/save/user`, params).catch(errorHandler);
    },
    getAllColsFoeEventDetails() {
        return axios.post(`${http.gwApiPrefix}/api/data/event/cols/all`).catch(errorHandler)
    },
    /**
     * 获取总请求数、命中请求数、平均耗时、异常请求数
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getTotal() {
        return axios.get(`${http.gwApiPrefix}/api/data/screen/total`).catch(errorHandler)
    },
    /**
     * 获取不同事件源的总请求数，命中数
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getEventStatistics() {
        return axios.get(`${http.gwApiPrefix}/api/data/screen/eventStatistics`).catch(errorHandler)
    },
    /**
     * 以天、周、月、年或者自定义时间区间的趋势图
     * @param params
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getTendency(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/screen/tendency`, params).catch(errorHandler)
    },
    getHitRank(params) {
        return axios.post(`${http.gwApiPrefix}/api/data/screen/hitRateRank`, params).catch(errorHandler)
    },
    getEventsAndPackages() {
        return axios.get(`${http.gwApiPrefix}/api/data/strategyAnalysis/getStrategyPackage`).catch(errorHandler)
    },
    getPackageStrategy(id) {
        return axios.get(`${http.gwApiPrefix}/api/data/strategyAnalysis/getStrategyResource?id=${id}`).catch(errorHandler)
    },
    getAnalysisDimensions() {
        return axios.post(`${http.gwApiPrefix}/api/data/strategyAnalysis/dimesions`).catch(errorHandler)
        // return axios.post(`${http.gwApiPrefix}/api/data/strategyAnalysis/dimensions`).catch(errorHandler)
    },
    getStrategyAnalysisResult(param) {
        return axios.post(`${http.gwApiPrefix}/api/data/strategyAnalysis/resourceAnalysisIndicator`, param).catch(errorHandler)
    },
    getStrategyAnalysisChart(strategyAnalysisVO) {
        return axios.post(`${http.gwApiPrefix}/api/data/strategyAnalysis/resourceAnalysisHistogram`, strategyAnalysisVO).catch(errorHandler)
    },
    getResourceCountOfStrategy(strategyId) {
        return axios.get(`${http.gwApiPrefix}/api/data/strategyAnalysis/getResourceOfStrategy?strategyId=${strategyId}`).catch(errorHandler)
    },
    // 决策表，评分卡接口
    getEasyStrategyLayout(id) {
        return axios.get(`${http.gwApiPrefix}/api/dicisiontable/test`).catch(errorHandler)
    },
    getPlanFieldByTestId(testId, expFields) {
        return axios.get(`${http.gwApiPrefix}/api/plan/findEventVarsByTestId/${ testId }?expFields=${ expFields }`).catch(errorHandler)
    }
}