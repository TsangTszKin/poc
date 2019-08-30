/*
 * @Author: zengzijian
 * @Date: 2018-08-20 15:00:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-07-02 17:30:37
 * @Description: 变量管理的api前端定义
 */
import { Modal } from 'antd'
import axios from '@/config/http.filter';
import http from '@/config/http'

const errorHandler = error => {
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: error,
    });
    console.log("出错信息如下");
    console.log(error);
}
export default {
    /**
     * 获取事件变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getEventVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/eventVar/list?name=${query.name}&code=${query.code}&eventSourceId=${query.eventSourceId}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取批次变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns
     */
    getBatchVarList(page, size, query) {
        let url_params = [];
        for (const key in query) {
            if (query.hasOwnProperty(key)) {
                url_params.push(`${key}=${query[key]}`)
            }
        }
        //加工
        url_params.push(`page=${page}`)
        url_params.push(`size=${size}`)
        return axios.get(`${http.gwApiPrefix}/api/bachVar/list?${url_params.join('&')}`).catch(errorHandler);
    },
    /**
     * 增加批次变量
     * @returns
     */
    addBatchVar(params) {
        return axios.put(`${http.gwApiPrefix}/api/bachVar/add`, params).catch(errorHandler);
    },
    /**
     * 根据id获取批次变量
     * @returns
     */
    getBatchVarById(id) {
        return axios.get(`${http.gwApiPrefix}/api/bachVar/findById/${id}`).catch(errorHandler)
    },
    /**
     * 删除批次变量
     * @returns
     */
    deleteBatchVar(ids) {
        return axios.delete(`${http.gwApiPrefix}/api/bachVar/delete?ids=${ids}`).catch(errorHandler)
    },
    /**
     * 上下线
     * @returns
     */
    changeBatchVar(ids, onOff) {
        return axios.post(`${http.gwApiPrefix}/api/bachVar/onOff?ids=${ids}&onOff=${onOff}`).catch(errorHandler);
    },
    /**
     * 获取批次变量的类别
     * @returns
     */
    getBatchVarCategory() {
        return axios.get(`${http.gwApiPrefix}/api/dictionary?keyCode=category_batch `).catch(errorHandler)
    },
    /**
     * 获取实时变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns
     */
    getRTQVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/list?name=${query.name}&code=${query.code}&category=${query.category}&eventSourceId=${query.eventSourceId}&type=${query.type}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取衍生变量列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns
     */
    getExtVarList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/extVar/list?name=${query.name}&code=${query.code}&category=${query.category}&eventSourceId=${query.eventSourceId}&type=${query.type}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 事件源下拉列表
     * @param {Boolean} showDimension
     * @returns
     */
    getEventSourceSelectList(showDimension) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/selection?showDimension=${showDimension}`).catch(errorHandler);
    },

    /**
     * 保存实时查询变量（信息维护）
     * @param {*} params
     * @returns
     */
    saveRtqVar(params) {
        return axios.put(`${http.gwApiPrefix}/api/rtqVar/save`, params).catch(errorHandler);
    },

    /**
     * 保存控制节点信息
     * @param {*} params
     * @returns
     */
    saveControlNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/condition`, params).catch(errorHandler);
    },

    /**
     * 保存查询节点信息
     * @param {*} params
     * @returns
     */
    saveQueryNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/selectNode`, params).catch(errorHandler);
    },
    /**
    * 生成查询节点sql
    * @param {*} params
    * @returns
    */
    sqlQueryNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/selectNode/sql`, params).catch(errorHandler);
    },
    /**
    * 保存规则节点信息
    * @param {*} params
    * @returns
    */
    saveRuleNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/ruleNode`, params).catch(errorHandler);
    },
    /**
     * 保存规则集节点信息
     * @param {*} params
     * @returns
     */
    saveRuleSetNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/ruleSetNode`, params).catch(errorHandler);
    },
    /**
     * 保存策略（贪婪模式）规则集
     * @param {*} params
     * @returns
     */
    saveRuleSetNodeForGreedy(ruleSetId, strategyId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/save/ruleSet?ruleSetId=${ruleSetId}&strategyId=${strategyId}`).catch(errorHandler)
    },
    /**
     * 删除策略（贪婪模式）规则集
     * @param {*} params
     * @returns
     */
    deleteRuleSetNodeForGreedy(ruleSetId, strategyId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/delete/ruleSet?ruleSetId=${ruleSetId}&strategyId=${strategyId}`).catch(errorHandler)
    },
    /**
     * 获取所有变量列表（级联选择）
     * @returns
     */
    getAllVarList(id, type, isNumber) {
        if (isNumber) {
            isNumber = true;
        } else {
            isNumber = false;
        }
        sessionStorage.tempEventSourceId = sessionStorage.tempEventSourceId || '';
        sessionStorage.tempDimensionId = sessionStorage.tempDimensionId || '';
        switch (type) {
            case "rtq":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}&entityType=1&isNumber=${isNumber}`).catch(errorHandler);
            case "rule":
                // return axios.get(`${http.gwApiPrefix}/api/var/selection/var?ruleId=${id}`).catch(errorHandler);
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}&entityType=2&isNumber=${isNumber}`).catch(errorHandler);
            case "card":
                 return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}&entityType=5&isNumber=${isNumber}`).catch(errorHandler);
            case "strategy":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}&entityType=3&isNumber=${isNumber}`).catch(errorHandler);
            case "ext":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}&entityType=0&isNumber=${isNumber}`).catch(errorHandler);
            case "node":
                return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${sessionStorage.tempEventSourceId}&dimensionId=${sessionStorage.tempDimensionId}&entityType=3&isNumber=${isNumber}`).catch(errorHandler);
            default:
                errorHandler();
                break;
        }

    },
    getAllVarList2(eventSourceId, dimensionId, entityType, isNumber) {
        isNumber = !!isNumber;
        return axios.get(`${http.gwApiPrefix}/api/var/selection/var?eventSourceId=${eventSourceId}&dimensionId=${dimensionId}&entityType=${entityType}&isNumber=${isNumber}`).catch(errorHandler);
    },
    /**
     * 根据ID查询实时查询变量
     * @param {*} id
     * @returns
     */
    getRtqVarById(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/get/${id}`).catch(errorHandler)
    },
    /**
     * 根据节点ID和节点类型获取节点信息
     * @param {*} id
     * @param {*} type
     * @returns
     */
    getNodeByIdAndType(id, type) {
        return axios.get(`${http.gwApiPrefix}/api/`).catch(errorHandler);
    },
    /**
     * 选择表
     * @returns
     */
    getTableList() {
        return axios.get(`${http.gwApiPrefix}/api/tables/selection`).catch(errorHandler);
    },
    /**
     * 获取实时查询变量下的临时变量(下拉框调用)
     * @param {*} id
     * @returns
     */
    getTempVarListByRtqId(id) {
        return axios.get(`${http.gwApiPrefix}/api/tempVar/byRtq/${id}`).catch(errorHandler);
    },
    /**
     * 根据实时查询变量获取全部节点
     * @param {*} id
     * @returns
     */
    getParantNodeById(id) {
        return axios.put(`${http.gwApiPrefix}/api/node/findByRtqId/${id}`).catch(errorHandler);
    },
    /**
     * 根据ID获取节点详情
     * @param {*} id
     * @returns
     */
    getNodeDetailById(id) {
        return axios.get(`${http.gwApiPrefix}/api/node/get/${id}`).catch(errorHandler)
    },
    /**
     * 改变实时查询变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeRtqVarStatus(id, type) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/rtqVar/batchDelete?${ids}`).catch(errorHandler);
            case "offline":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/rtqVar/upStatus?${ids}&onOff=false`).catch(errorHandler);
            case "online":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/rtqVar/upStatus?${ids}&onOff=true`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变事件变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeEventVarStatus(id, type) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "offline":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/eventVar/service/eventVar/onOff?${ids}&onOff=false`).catch(errorHandler);
            case "online":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/eventVar/service/eventVar/onOff?${ids}&onOff=true`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变实时衍生变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeExtVarStatus(id, type) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/extVar/batchDelete?${ids}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变实时查询变量的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeRuleSetGreedyStatus(id, onOff) {
        if (onOff === 'online') {
            onOff = true;
        } else {
            onOff = false;
        }
        console.log(id);
        let ids = '';
        id.forEach(element => {
            ids += 'ids=' + element + '&';
        });
        ids = ids.substr(0, ids.length - 1);
        return axios.post(`${http.gwApiPrefix}/api/rule/upStatus?${ids}&onOff=${onOff}`).catch(errorHandler);
    },
    /**
     * 改变参数定义的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeParameterVarStatus(id, type) {
        console.log(id);
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/parameter/batchDelete?${ids}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 获取数据类型下拉列表的数据
     * @returns
     */
    getDataTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/statusType`).catch(errorHandler)
    },
    /**
     * 删除实时查询变量的节点
     * @param {*} id
     * @returns
     */
    deleteNode(id) {
        return axios.delete(`${http.gwApiPrefix}/api/node/delete/${id}`).catch(errorHandler);
    },
    /**
     * 枚举列表 type取值expressionVarType， expressionFunctionType, dateType
     * @returns
     */
    getEnumList(type) {
        return axios.get(`${http.gwApiPrefix}/api/var/${type}`).catch(errorHandler);
    },
    /**
     * 表达式值类型列表
     * @returns
     */
    getExpressionValueTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/expressionValueType`).catch(errorHandler)
    },
    /**
     * 获取函数列表
     * @returns
     */
    functionTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/functionType`).catch(errorHandler);
    },
    /**
     * 控制节点解析SQL
     * @param {*} params
     * @returns
     */
    controlNodeTranslateToSql(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/condition/sql`, params).catch(errorHandler);
    },
    /**
     * 获取条件树的条件操作符类型列表
     * @returns
     */
    getOptTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/optType`).catch(errorHandler);
    },
    /**
     * 保存衍生变量
     * @param {*} params
     * @returns
     */
    saveExtVar(params) {
        return axios.put(`${http.gwApiPrefix}/api/extVar/save`, params).catch(errorHandler);
    },
    /**
     * 根据ID查询衍生变量
     * @param {*} id
     * @returns
     */
    getExtVarById(id) {
        return axios.get(`${http.gwApiPrefix}/api/extVar/get/${id}`).catch(errorHandler)
    },
    /**
     * 测试衍生变量
     * @param {*} checkValue
     * @param {*} params
     * @returns
     */
    testExtVar(checkValue, params) {
        return axios.post(`${http.gwApiPrefix}/api/extVar/checkValue?varValue=${checkValue}`, params).catch(errorHandler)
    },
    /**
     * 获取实时查询变量的SQL预览
     * @param {String} id
     * @returns
     */
    getRtqSqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/sql/${id}`).catch(errorHandler)
    },
    /**
     * 实时查询变量提交
     * @param {*} id
     * @returns
     */
    submitRtq(id) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/submit`, { id: id }).catch(errorHandler);
    },
    /**
     * 获取实时查询变量的引用关树
     * @param {String} id
     * @returns
     */
    getRtqUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/quote/${id}`).catch(errorHandler)
    },
    /**
     * 获取衍生变量的引用关树
     * @param {String} id
     * @returns
     */
    getExtUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/extVar/quote/${id}`).catch(errorHandler)
    },
    rtqCopy(id) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/copy?id=${id}`).catch(errorHandler);
    },
    rtqSetDefaultVersion(id) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/setDefaultVersion?id=${id}`).catch(errorHandler);
    },
    rtqAllVersion(id) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/version?id=${id}`).catch(errorHandler)
    },
    /**
     * 删除单个实时查询变量
     *
     * @param {string} id
     * @returns
     */
    deleteOneRtqVar(id) {
        return axios.delete(`${http.gwApiPrefix}/api/rtqVar/delete/${id}`).catch(errorHandler)
    },

    // 实时查询变量2.0 start
    getRtqInfo_2_0(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/v2/get?id=${id}`).catch(errorHandler)
    },
    saveRtq_info_2_0(params) {
        return axios.put(`${http.gwApiPrefix}/api/rtqVar/v2/save`, params).catch(errorHandler)
    },
    getRtqList_2_0(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/v2/list?name=${query.name}&code=${query.code}&category=${query.category}&eventSourceId=${query.eventSourceId}&rtqVarType=${query.rtqVarType}&page=${page}&size=${size}`).catch(errorHandler);
    },
    getRtqConfig_2_0(rtqVarId) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/v2/findConfigByRtqVarId?rtqVarId=${rtqVarId}`).catch(errorHandler);
    },
    saveRtq_config_2_0(params, step) {
        return axios.put(`${http.gwApiPrefix}/api/rtqVar/v2/saveConfig?step=${step}`, params).catch(errorHandler)
    },
    saveRtq_config_2_0_newVersion(params) {
        return axios.put(`${http.gwApiPrefix}/api/rtqVar/v2/saveNewVersion?step=5`, params).catch(errorHandler)
    },
    rtqV2AllVersion(id) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/v2/version?id=${id}`).catch(errorHandler)
    },
    rtqV2AllVersionByCode(code) {
        return axios.post(`${http.gwApiPrefix}/api/rtqVar/v2/versionByCode?code=${code}`).catch(errorHandler)
    },
    /**
    * 改变实时查询变量的状态v2  
    * @param {*} id
    * @param {*} type
    * @returns
    */
    changeRtqVarV2Status(codes, type) {
        switch (type) {
            case "delete":
                let codeList = [];
                codes.forEach(element => {
                    codeList.push(`codeList=${element}`)
                });
                return axios.delete(`${http.gwApiPrefix}/api/rtqVar/v2/batchDeleteByCodes?${codeList.join('&')}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 获取实时查询变量的SQL预览
     * @param {String} id
     * @returns
     */
    getRtqV2SqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/v2/sql/${id}`).catch(errorHandler)
    },
    /**
    * 删除实时查询变量的一个版本
    * @param {*} id
    * @returns
    */
    deleteRTQVersion(id) {
        return axios.delete(`${http.gwApiPrefix}/api/rtqVar/v2/deleteVersionById/${id}`).catch(errorHandler);
    },
      /**
     * 获取实时查询变量的引用关树
     * @param {String} id
     * @returns
     */
    getRtqV2UseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/rtqVar/v2/quote/${id}`).catch(errorHandler)
    },
    // 实时查询变量2.0 end
}