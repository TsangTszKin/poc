/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-16 16:54:16
 * @Description: 通用的api
 */

import {Modal} from 'antd'
import axios from '@/config/http.filter';
import http from '@/config/http'

const errorHandler = error => {
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: error,
    });
    console.log("出错信息如下");
    console.error(error);
}
export default {
    /**
     * 根据不同类型获取类别列表
     * @param {String} type
     * @returns
     */
    getCategoryListByType(type) {
        switch (type) {
            case "var":
                type = 'category_var';
                break;
            case "batch":
                type = 'category_batch';
                break;
            case "ext":
                type = 'category_ext';
                break;
            case "rule":
                type = 'category_rule';
                break;
            case "ruleSet":
                type = 'category_rule_set';
                break;
            case "strategy":
                type = 'category_strategy';
                break;
            case "parameter":
                type = 'category_parameter';
                break;
            case "template":
                type = 'category_template';
                break;
            case "systemVar":
                type = 'category_systemVar';
                break;
            case "decision":
                type = 'category_decision';
                break;
            case "scoreCard":
                type = 'category_scoreCard';
                break;
            case "calculation":
                type = 'calculation';
                break;
        }
        return axios.get(`${http.gwApiPrefix}/api/dictionary?keyCode=${type}`).catch(errorHandler)
    },
    /**
     * 首页信息统计
     * @param {*} eventSourceId
     * @returns
     */
    getHomeData(eventSourceId) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/info/${eventSourceId}`).catch(errorHandler)
    },
    /**
     *  返回检核参数（根据类型如rtqVar,rule,strategy返回输入的数据）
     * @param {string} type
     * @param {string} id
     * @returns
     */
    getTestInput(type, id) {
        return axios.get(`${http.gwApiPrefix}/api/inspectLog/inspectCode/${type}/${id}`).catch(errorHandler)
    },
    getTestOutput(params) {
        return axios.post(`${http.gwApiPrefix}/api/inspectLog/submit`, params).catch(errorHandler)
    },
    /**
     * 提交实时查询变量、衍生变量、规则、规则集、策略到审核日志（暂且只用于删除）
     *
     * @param {array} params
     * @returns
     */
    multiAppRovalSubmit(params) {
        params.remark = "删除";
        return axios.post(`${http.gwApiPrefix}/api/approval/submitList`, params).catch(errorHandler)
    },
    /**
     *规则的“那么”参数变量下拉选择数据
     *
     * @returns
     */
    getParamSelection() {
        return axios.get(`${http.gwApiPrefix}/api/parameter/selection`).catch(errorHandler)
    },
    /**
     *根据类型获取模板列表
     *
     * @param {*} type 0:实时查询变量 1:衍生变量 2:规则 3:规则集 4:策略
     * @returns
     */
    getTemplateList(page, size, query) {
        console.log("page, size, query", page, size, query)
        if (!page) page = 1;
        if (!size) size = 100;
        if (!query) query = {code: '', name: '', type: ''};
        return axios.get(`${http.gwApiPrefix}/api/template/list?code=${query.code}&name=${query.name}&page=${page}&size=${size}&type=${query.type}`).catch(errorHandler)
    },
    /**
     *根据类型获取模板详情
     *
     * @param {*} id
     * @returns
     */
    getTemplateDetails(id) {
        return axios.get(`${http.gwApiPrefix}/api/template/${id}`).catch(errorHandler)
    },
    /**
     * 删除模板
     * @returns
     */
    deleteTemplate(ids) {
        return axios.delete(`${http.gwApiPrefix}/api/template/delete?ids=${ids}`).catch(errorHandler)
    },
    /**
    *保存模板
    *
    * @param {*} params
    * @returns
    */
    saveTemplate(params) {
        return axios.put(`${http.gwApiPrefix}/api/template/saveTemplate`, params).catch(errorHandler)
    },
    /**
     * 获取条件组件的选择数据
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} entityType 组件类型，0衍生变量1实时查询变量2规则3策略4决策表5评分卡
     * @returns
     */
    getConditionData(dimensionId, eventSourceId, entityType, fieldList) {
        fieldList = fieldList || []
        return axios.post(`${http.gwApiPrefix}/api/common/getConditionData?dimensionId=${dimensionId}&entityType=${entityType}&eventSourceId=${eventSourceId}`, fieldList).catch(errorHandler)
    },
    /**
     * 获取having条件组件数据
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} entityType 组件类型，0衍生变量1实时查询变量2规则3策略4决策表5评分卡
     * @returns
     */
    getHavingConditionData(dimensionId, eventSourceId, fieldList) {
        fieldList = fieldList || []
        return axios.post(`${http.gwApiPrefix}/api/common/getHavingConditionData?dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`, fieldList).catch(errorHandler)
    },
    /**
     * 获取衍生字段（计算）组件数据
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} entityType 组件类型，0衍生变量1实时查询变量2规则3策略4决策表5评分卡
     * @returns
     */
    getComputeExpressionData(dimensionId, eventSourceId, fieldList) {
        fieldList = fieldList || []
        return axios.post(`${http.gwApiPrefix}/api/common/getComputeExpressionData?dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`, fieldList).catch(errorHandler)
    },
    /**
     * 变量的下拉列表
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} entityType 组件类型，0衍生变量1实时查询变量2规则3策略4决策表5评分卡
     * @returns
     */
    getAllVarSelection(dimensionId, eventSourceId, entityType) {
        return axios.get(`${http.gwApiPrefix}/api/var/selection/all?dimensionId=${dimensionId}&eventSourceId=${eventSourceId}&entityType=${entityType}`).catch(errorHandler)
    },
    /**
     * 参数变量-下拉框列表 (返回的根据类型来)
     *
     * @returns
     */
    getAllParamsSelection() {
        return axios.get(`${http.gwApiPrefix}/api/parameter/selection/all`).catch(errorHandler)
    },
    /**
     * 模板导入
     *
     * @returns
     */
    getImportZIP(file,moduleType) {
        return axios.post(`${http.gwApiPrefix}/api/transplant/import/${moduleType}`,file).catch(errorHandler)
    },
    /**
     * 模板导出
     *
     * @returns
     */
    getExportZIP(transplantVO) {
       /* return axios.request({
            url: `${ http.gwApiPrefix }/api/transplant/export`,
            method: 'put',
            headers: {
                "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
                "Access-Control-Allow-Origin": "*",
            },
            responseType: 'blob',
            responseEncoding: 'gzip, deflate',
            data : {
                // token : sessionStorage.getItem('token'),
                id: transplantVO.id,
                type: transplantVO.type
            },
        }).catch(errorHandler);*/
        return axios.put(`${http.gwApiPrefix}/api/transplant/export`, transplantVO ,{
            responseType: 'blob'
        }).catch(errorHandler);
    },
    /**
     * 获取衍生变量（计算）组件数据
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} entityType 组件类型，0衍生变量1实时查询变量2规则3策略4决策表5评分卡
     * @returns
     */
    getInitData(dimensionId, eventSourceId, entityType, fieldList = []) {
        return axios.post(`${http.gwApiPrefix}/api/common/init/data?entityType=${entityType}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`, fieldList).catch(errorHandler)
    },
}