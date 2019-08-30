/*
 * @Author: zengzijian
 * @Date: 2018-08-20 15:00:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-07-24 10:45:19
 * @Description: 策略管理的api前端定义
 */
import {Modal} from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';
import common from '@/utils/common';

const errorHandler = error => {
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: error,
    });
    console.log("出错信息如下");
    console.log(error);
}
const connectIds = (idArray, queryProp) => {
    if (common.isEmpty(idArray) || !common.isArray(idArray)) return '';
    else return idArray.map(item => `${queryProp}=${item}`).join('&');
}
export default {
    /**
     * 获取规则列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getRuleList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/rule/list?name=${query.name}&code=${query.code}&category=${query.category}&eventSourceId=${query.eventSourceId}&approvalStatus=${query.approvalStatus}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取规则集列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getRuleSetList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/list?name=${query.name}&code=${query.code}&category=${query.category}&eventSourceId=${query.eventSourceId}&type=${query.type}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 获取策略列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getStrategyList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/list?name=${query.name}&code=${query.code}&category=${query.category}&eventSourceId=${query.eventSourceId}&approvalStatus=${query.approvalStatus}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 保存规则接口
     * @param {*} params
     * @returns
     */
    saveRule(params) {
        return axios.put(`${http.gwApiPrefix}/api/rule/save`, params).catch(errorHandler)
    },
    /**
     * 根据ID的获取规则详情
     * @param {*} id
     * @returns
     */
    getRuleById(id) {
        return axios.get(`${http.gwApiPrefix}/api/rule/${id}`).catch(errorHandler)
    },
    /**
     * 保存规则集接口
     * @param {*} params
     * @returns
     */
    saveRuleSet(params) {
        return axios.put(`${http.gwApiPrefix}/api/ruleSet/save`, params).catch(errorHandler)
    },
    /**
     * 根据ID的获取规则集详情
     * @param {*} id
     * @returns
     */
    getRuleSetById(id) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/${id}`).catch(errorHandler)
    },
    /**
     * 保存出输出节点信息
     * @param {*} params
     * @returns
     */
    saveOutPutNode(params) {
        return axios.put(`${http.gwApiPrefix}/api/node/save/outPut`, params).catch(errorHandler)
    },
    /**
     * 输出节点的输出结果下拉列表
     * @returns
     */
    getOutPutSelectList() {
        return axios.get(`${http.gwApiPrefix}/api/result/selection`).catch(errorHandler);
    },
    /**
     * 保存输出结果
     * @param {*} params
     * @returns
     */
    saveResult(params) {
        return axios.put(`${http.gwApiPrefix}/api/parameter/save`, params).catch(errorHandler)
    },
    /**
     * 根据ID获取输出结果详情
     * @param {*} id
     * @returns
     */
    getResultById(id) {
        return axios.get(`${http.gwApiPrefix}/api/parameter/get/${id}`).catch(errorHandler);
    },
    /**
     * 删除输出结果
     * @param {*} id
     * @returns
     */
    deleteResultById(id) {
        return axios.delete(`${http.gwApiPrefix}/api/parameter/delete/${id}`).catch(errorHandler);
    },
    /**
     * 获取输出结果列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getResultList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/parameter/list?name=${query.name}&code=${query.code}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 删除规则
     * @param {*} id
     * @returns
     */
    deleteRule(id) {
        return axios.delete(`${http.gwApiPrefix}/api/rule/${id}`).catch(errorHandler);
    },
    /**
     * 删除策略
     * @param {*} id
     * @returns
     */
    deleteStrategy(id) {
        return axios.delete(`${http.gwApiPrefix}/api/strategy/delete/${id}`).catch(errorHandler);
    },
    /**
     * 删除规则集
     * @param {*} id
     * @returns
     */
    deleteRuleSetById(id) {
        return axios.delete(`${http.gwApiPrefix}/api/ruleSet/delete/${id}`).catch(errorHandler);
    },
    /**
     * 保存策略接口
     * @param {*} params
     * @returns
     */
    saveStrategy(params) {
        return axios.put(`${http.gwApiPrefix}/api/strategy/save`, params).catch(errorHandler);
    },
    /**
     * 保存策略接口
     * @param {*} params
     * @returns
     */
    saveStrategyV2(strategyVO, deleteIds) {
        let query = [];
        query = deleteIds.map((element) => {
            return `deleteIds=${element}`
        })
        query = query.join('&')
        return axios.put(`${http.gwApiPrefix}/api/strategy/v2/save?${query}`, strategyVO).catch(errorHandler);
    },
    /**
     * 根据ID获取策略详情
     * @param {*} id
     * @returns
     */
    getStrategyById(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/${id}`).catch(errorHandler);
    },
    /**
     * 根据ID获取策略详情
     * @param {*} id
     * @returns
     */
    getStrategyByIdV2(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/v2/${id}`).catch(errorHandler);
    },
    /**
     * 改变策略的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeStrategyStatus(id, type, eventSourceId, ticket) {
        let ids = '';
        switch (type) {
            case "delete":
                let query = [];
                query = id.map((element) => {
                    return `codes=${element}`
                })
                query = query.join('&')
                return axios.delete(`${http.gwApiPrefix}/api/strategy/v2/batchDelete?${query}`).catch(errorHandler);
            case "offline":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.post(`${http.gwApiPrefix}/api/strategy/offline?${ids}`).catch(errorHandler);
            case "online":
                id.forEach(element => {
                    ids += 'readyOnLineStrategyIdList=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                if (common.isEmpty(ticket))
                    ticket = sessionStorage.ticket;
                return axios.post(`${http.gwApiPrefix}/api/strategy/online?${ids}&eventSourceId=${eventSourceId}&ticket=${ticket}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变规则的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeRuleStatus(id, type) {
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/rule/batchDelete?${ids}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     * 改变规则集的状态
     * @param {*} id
     * @param {*} type
     * @returns
     */
    changeRuleSetStatus(id, type) {
        let ids = '';
        switch (type) {
            case "delete":
                id.forEach(element => {
                    ids += 'ids=' + element + '&';
                });
                ids = ids.substr(0, ids.length - 1);
                return axios.delete(`${http.gwApiPrefix}/api/ruleSet/batchDelete?${ids}`).catch(errorHandler);
            default:
                break;
        }
    },
    /**
     *根据类别，事件源，维度获取规则列表
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} category
     * @param {*} ruleSetType
     * @returns
     */
    getRuleListByDimensionForRuleNode(dimensionId, eventSourceId, category, ruleSetType) {
        if (common.isEmpty(ruleSetType)) {
            return axios.get(`${http.gwApiPrefix}/api/rule/allBy?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`)
        } else {
            return axios.get(`${http.gwApiPrefix}/api/rule/allBy?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}&ruleSetType=${ruleSetType}`)
        }
    },

    /**
     *根据类别，事件源，维度获取规则列表(用于决策流)
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} category
     * @returns
     */
    getRuleListByC_E_D(dimensionId, eventSourceId, category, ruleSetType) {
        console.log("dimensionId, eventSourceId, category, ruleSetType", dimensionId, eventSourceId, category, ruleSetType)
        return axios.post(`${http.gwApiPrefix}/api/rule/selection?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}${ruleSetType === undefined ? '' : '&ruleSetType=' + ruleSetType}`)
    },
    /**
     *据类别，事件源，维度获取规则集列表(用于决策流)
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} category
     * @returns
     */
    getRuleSetListByC_E_D(dimensionId, eventSourceId, category) {
        return axios.post(`${http.gwApiPrefix}/api/ruleSet/selection?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`).catch(errorHandler);
    },
    /**
     *根据类别，事件源，维度获取评分卡列表(用于决策流)
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} category
     * @returns
     */
    getScoreCardListByC_E_D(dimensionId, eventSourceId, category) {
        return axios.post(`${http.gwApiPrefix}/api/scoreCard/selection?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`)
    },
    /**
     *根据类别，事件源，维度获取决策表列表(用于决策流)
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @param {*} category
     * @returns
     */
    getDecisionCardListByC_E_D(dimensionId, eventSourceId, category) {
        return axios.post(`${http.gwApiPrefix}/api/dicisiontable/selection?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`)
    },
    /**
     * 根据维度获取规则节点的规则集列表
     * @param {*} id
     * @returns
     */
    getRuleSetListByDimensionForRuleNode(dimensionId, eventSourceId, category) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/allBy?category=${category}&dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`).catch(errorHandler);
    },
    /**
     * 获取挑战者冠军列表
     * @param {*} eventSourceId
     * @returns
     */
    getChampionList(eventSourceId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/champion?eventSourceId=${eventSourceId}`).catch(errorHandler)
    },
    /**
     * 根据多个事件源ID获取策略列表
     * @param {array} eventSourceIds
     * @returns
     */
    getStrategyListByEventSourceIds(eventSourceIds) {
        return axios.post(`${http.gwApiPrefix}/api/data/event/strategyList`, eventSourceIds).catch(errorHandler)
    },
    /**
     * 获取策略的SQL预览
     * @param {String} id
     * @returns
     */
    getStrategySqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/v2/sql/${id}`).catch(errorHandler)
    },
    /**
     * 获取规则的SQL预览
     * @param {String} id
     * @returns
     */
    getRuleSqlPreview(id) {
        return axios.get(`${http.gwApiPrefix}/api/rule/sqlOverview/${id}`).catch(errorHandler)
    },
    /**
     * 规则提交
     * @param {*} id
     * @returns
     */
    submitRule(id) {
        return axios.post(`${http.gwApiPrefix}/api/rule/submit`, {id: id}).catch(errorHandler);
    },
    /**
     * 规则集提交
     * @param {*} id
     * @returns
     */
    submitRuleSet(id) {
        return axios.post(`${http.gwApiPrefix}/api/ruleSet/submit`, {id: id}).catch(errorHandler);
    },
    /**
     * 策略提交
     * @param {*} id
     * @returns
     */
    submitStrategy(id) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/submit`, {id: id}).catch(errorHandler);
    },
    /**
     * 获取规则的引用关树
     * @param {String} id
     * @returns
     */
    getRuleUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/rule/quote/${id}`).catch(errorHandler)
    },
    /**
     * 获取规则集的引用关树
     * @param {String} id
     * @returns
     */
    getRuleSetUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/quote/${id}`).catch(errorHandler)
    },
    /**
     * 获取策略的引用关树
     * @param {String} id
     * @returns
     */
    getStrategyUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/quote/${id}`).catch(errorHandler)
    },
    /**
     * 获取输出结果的引用关树
     * @param {String} id
     * @returns
     */
    getResultUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/parameter/quote/${id}`).catch(errorHandler)
    },


    ruleCopy(id) {
        return axios.post(`${http.gwApiPrefix}/api/rule/copy?id=${id}`).catch(errorHandler);
    },
    ruleSetDefaultVersion(id) {
        return axios.post(`${http.gwApiPrefix}/api/rule/setDefaultVersion?id=${id}`).catch(errorHandler);
    },
    ruleAllVersion(id) {
        return axios.get(`${http.gwApiPrefix}/api/rule/showVersion?id=${id}`).catch(errorHandler)
    },
    ruleSetAllVersion(id) {
        return axios.get(`${http.gwApiPrefix}/api/ruleSet/showVersion?id=${id}`).catch(errorHandler)
    },
    strategyCopy(id) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/copy?id=${id}`).catch(errorHandler);
    },
    strategySetDefaultVersion(id) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/setDefaultVersion?id=${id}`).catch(errorHandler);
    },
    strategyAllVersion(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/v2/showVersion?id=${id}`).catch(errorHandler)
    },
    strategyAllVersionByCode(code) {
        return axios.get(`${http.gwApiPrefix}/api/strategy/v2/showVersionByCode?code=${code}`).catch(errorHandler)
    },
    strategySubmitInspect(strategyId) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/submitInspect`, {id: strategyId}).catch(errorHandler)
    },
    ruleSubmitInspect(ruleId) {
        return axios.post(`${http.gwApiPrefix}/api/rule/submitInspect`, {id: ruleId}).catch(errorHandler)
    },
    getFlowNodeDetail(assemblyId, strategyId) {//画布ID，决策流的ID
        return axios.get(`${http.gwApiPrefix}/api/node/get/${strategyId}/${assemblyId}`).catch(errorHandler)
    },
    /**
     * 获取策略包资源
     * @param {*} eventSourceId
     * @returns
     */
    getStrategyPackageResources(eventSourceId) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/resources?eventSourceId=${eventSourceId}`).catch(errorHandler);
    },
    getStrategyPackageList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/query?page=${page}&size=${size}&q=${query.name}&status=${String(query.status) === '0' ? '' : query.status}`).catch(errorHandler);
    },
    saveStrategyPackage(data, isNewVersion) {
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/save?isNewVersion=${isNewVersion}`, data).catch(errorHandler);
    },
    getStrategyPackage(packageId) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/view?id=${packageId}`).catch(errorHandler);
    },
    getStrategyPackageToEdit(packageId) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/get?id=${packageId}`).catch(errorHandler);
    },
    deleteStrategyPackage(packageIdArray, versionIdArray) {
        let query = [
            connectIds(packageIdArray, 'ids'),
            connectIds(versionIdArray, 'versionIds')
        ].join('&');
        return axios.delete(`${http.gwApiPrefix}/api/strategypackage/delete?${query}`).catch(errorHandler);
    },
    // status只能为105（发布）或106（停止）, 发布资源的id写在params里
    // versionIdArray 版本Id,列表中的lastEditVersion中的Id
    // resIds 资源Id,如果resIds 不为空则发布资源，如果resIds为空，versionIds不为空则发布策略包ID
    updateStrategyPackageStatus(versionIdArray, status, resIds) {
        let query = [
            `action=${status}`,
            common.isEmpty(resIds) ? connectIds(versionIdArray, 'versionIds') : connectIds(resIds, 'resIds')
        ].join('&');
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/action?${query}`).catch(errorHandler);
    },
    /**
     * 提交审核
     * @param {array} packageIdArray
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    submitAudit(packageIdArray) {
        let querystring = packageIdArray.map(item => 'id=' + item).join('&');
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/audit/submitAudit?${querystring}`).catch(errorHandler);
    },
    /**
     * 提交测试
     * @param {array} packageIdArray
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    submitTest(packageIdArray) {
        let querystring = packageIdArray.map(item => 'id=' + item).join('&');
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/test/submit?${querystring}`).catch(errorHandler);
    },
    /**
     * 获取资源版本列表
     */
    getResourceVersions(resIdOrCode, type, isResCode) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/resourceVersions?${ isResCode ? 'resCode=' + resIdOrCode: 'resId=' + resIdOrCode }&type=${type}`).catch(errorHandler);
    },
    getResourceDetail(id) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/resource/detail?id=${id}`).catch(errorHandler);
    },
    /**
     * 单个资源更新
     * @param resourceId
     */
    updateResource(resourceId, versionId) {
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/updateResource?resId=${versionId}&id=${resourceId}`).catch(errorHandler);
    },
    // 测试相关接口
    getTestList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/publish/findAll?page=${page}&size=${size}&name=${query}&code=${query}`).catch(errorHandler);
    },
    deleteTest(idArray) {
        const ids = idArray.map(item => 'ids=' + item).join('&');
        return axios.delete(`${http.gwApiPrefix}/api/publish/delete?${ids}`).catch(errorHandler);
    },
    getTest(testId) {
        return axios.get(`${http.gwApiPrefix}/api/publish/findById/${testId}`).catch(errorHandler);
    },
    // 快速测试获取报文
    getQuickTestField(testId) {
        return axios.post(`${http.gwApiPrefix}/api/fast/loadFields/${testId}`).catch(errorHandler);
    },
    getFastDetail(seqNo) {
        return axios.post(`${http.gwApiPrefix}/api/fast/detail/${ seqNo }`).catch(errorHandler);
    },
    // 开始测试，发送报文
    sendFastTestField(fields) {
        return axios.post(`${http.gwApiPrefix}/api/fast/startTest`, fields).catch(errorHandler);
    },
    // 获取测试结果列表
    getTestRsult(page, size) {
        return axios.get(`${http.gwApiPrefix}/api/publish/findAll?page=${page}&size=${size}`).catch(errorHandler);
    },
    // 测试方案相关接口
    getTestPlanAll(testId, page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/plan/findAll?testId=${testId}&page=${page}&size=${size}&name=${query}`).catch(errorHandler);
    },
    runTestPlan(params) {
        return axios.post(`${http.gwApiPrefix}/api/runTestNow`, params).catch(errorHandler);
    },
    getTestPlanById(id) {
        return axios.get(`${http.gwApiPrefix}/api/plan/findById/${id}`).catch(errorHandler);
    },
    deleteTestPlanByIdArr(idArr) {
        let query = connectIds(idArr, 'ids');
        return axios.delete(`${http.gwApiPrefix}/api/plan/delete?${query}`).catch(errorHandler);
    },
    downloadTestPlanTemplate(testId, expFields) {
        // return axios.request({
        //     'url': `${ http.gwApiPrefix }/api/plan/download/${ testId }?expFields=${ expFields }`,
        //     'method': 'post',
        //     'headers': {
        //         'Accept-Language': 'zh-CN,zh;q=0.9',
        //         'Accept': '*/*',
        //     },
        //     'responseType': 'blob',
        //     'responseEncoding': 'gzip, deflate',
        // }).catch(errorHandler);
        return axios.post(`${http.gwApiPrefix}/api/plan/download/${testId}?expFields=${expFields}`, null, {
            responseType: 'blob'
        }).catch(errorHandler);
    },
    uploadTestPlan(file, testId) {
        return axios.post(`${http.gwApiPrefix}/api/plan/upload?testId=${ testId }`, file).catch(errorHandler);
    },
    saveTestPlan(params) {
        return axios.post(`${http.gwApiPrefix}/api/plan/save`, params).catch(errorHandler);
    },
    /**
     * 策略包审核
     * @param {*} eventSourceId
     * @returns
     */
    getList(params) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/audit/logs?queryStr=${params.name}&page=${params.page}&size=${params.size}&status=${params.status}&type=${params.type}`).catch(errorHandler)
    },
    getAction(id, action) {
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/audit/action?id=${id}&action=${action}`).catch(errorHandler)
    },
    /**
     *仅查询实时查询变量
     *
     * @param {*} dimensionId
     * @param {*} eventSourceId
     * @returns
     */
    getRtqvarList(eventSourceId, dimensionId) {
        return axios.get(`${http.gwApiPrefix}/api/var/rtqVar?dimensionId=${dimensionId}&eventSourceId=${eventSourceId}`).catch(errorHandler)
    },
    /**
     * 保存为新版本
     * @param {*} params
     * @returns
     */
    saveRuleForNewVersion(params) {
        return axios.post(`${http.gwApiPrefix}/api/rule/saveNewVersion`, params).catch(errorHandler);
    },
    /**
     * 保存为新版本
     * @param {*} params
     * @returns
     */
    saveRuleSetForNewVersion(params) {
        return axios.put(`${http.gwApiPrefix}/api/ruleSet/saveNewVersion`, params).catch(errorHandler);
    },
    /**
     * 删除规则的一个版本
     * @param {*} id
     * @returns
     */
    deleteRuleVersion(id) {
        return axios.delete(`${http.gwApiPrefix}/api/rule/deleteVersion/${id}`).catch(errorHandler);
    },
    /**
     * 删除规则的一个版本
     * @param {*} id
     * @returns
     */
    deleteRuleSetVersion(id) {
        return axios.delete(`${http.gwApiPrefix}/api/ruleSet/deleteVersion/${id}`).catch(errorHandler);
    },
    /**
     *分支节点获取表达式翻译
     *
     * @param {*} params 分支节点的branchMap
     * @returns
     */
    getBranchNodeExpression(params) {
        return axios.post(`${http.gwApiPrefix}/api/node/expression/branch`, params).catch(errorHandler);
    },
    /**
     * 保存为新版本
     * @param {*} params
     * @returns
     */
    saveStrategyForNewVersion(params) {
        return axios.post(`${http.gwApiPrefix}/api/strategy/saveNewVersion`, params).catch(errorHandler);
    },
    /**
     * 保存为新版本
     * @param {*} params
     * @returns
     */
    saveStrategyForNewVersionV2(strategyVO, deleteIds) {
        let query = [];
        query = deleteIds.map((element) => {
            return `deleteIds=${element}`
        })
        query = query.join('&')
        return axios.post(`${http.gwApiPrefix}/api/strategy/v2/saveNewVersion?${query}`, strategyVO).catch(errorHandler);
    },
    /**
     * 删除策略的一个版本
     * @param {*} id
     * @returns
     */
    deleteRStrategyVersion(id) {
        return axios.delete(`${http.gwApiPrefix}/api/strategy/deleteVersion/${id}`).catch(errorHandler);
    },
    /**
     * 根据conditionVO获取sql脚本
     *
     * @param {*} conditionVO
     * @returns
     */
    getSqlCodeByCondition(conditionVO) {
        return axios.post(`${http.gwApiPrefix}/api/node/expression/condition`, conditionVO).catch(errorHandler);
    },
    /**
     * 决策表列表
     * @param page
     * @param size
     * @param type 决策表类型（0:简单决策表，1:交叉决策表）
     * @param name
     * @param code
     * @param eventSourceId
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getStrategyTableList({page = 1, size = 10, type = '', name = '', code = '', eventSourceId = '', category = ''}) {
        let query = `page=${page}&size=${size}&type=${type}&name=${name}&code=${code}&eventSourceId=${eventSourceId}&category=${category}`;
        return axios.get(`${http.gwApiPrefix}/api/dicisiontable/list?${query}`).catch(errorHandler);
    },
    getStrategyTableById(id) {
        return axios.get(`${http.gwApiPrefix}/api/dicisiontable/${id}`).catch(errorHandler);
    },
    saveStrategyTable(params) {
        return axios.put(`${http.gwApiPrefix}/api/dicisiontable/save`, params).catch(errorHandler);
    },
    saveStrategyTableNewVersion(params) {
        return axios.post(`${http.gwApiPrefix}/api/dicisiontable/saveNewVersion`, params).catch(errorHandler);
    },
    getStrategyTableVersions(code) {
        return axios.get(`${http.gwApiPrefix}/api/dicisiontable/showVersionByCode?code=${code}`).catch(errorHandler);
    },
    deleteStrategyTableByCode(code) {
        return axios.delete(`${http.gwApiPrefix}/api/dicisiontable/${code}`).catch(errorHandler);
    },
    multiDeleteStrategyTable(codeArr) {
        return axios.delete(`${http.gwApiPrefix}/api/dicisiontable/batchDelete?${connectIds(codeArr, 'codes')}`, codeArr).catch(errorHandler);
    },
    deleteStrategyTableVersionById(id) {
        return axios.delete(`${http.gwApiPrefix}/api/dicisiontable/deleteVersion/${id}`).catch(errorHandler);
    },
    getStrategyTableQuiteById(id) {
        return axios.get(`${http.gwApiPrefix}/api/dicisiontable/quote/${id}`).catch(errorHandler);
    },
    // 交叉决策表测试数据
    getCrossStrategyTableById() {
        return axios.get(`${http.gwApiPrefix}/api/dicisiontable/test`).catch(errorHandler);
    },
    /**
     * 评分卡
     * @param page
     * @param size
     * @param name
     * @param code
     * @param eventSourceId
     * @returns {Promise<AxiosResponse<any> | never>}
     */
    getStrategyCardList({page = 1, size = 10, name = '', code = '', eventSourceId = '', category = '', sort = '', sortType = ''}) {
        let query = `page=${page}&size=${size}&name=${name}&code=${code}&eventSourceId=${eventSourceId}&category=${category}&sort=${sort}&sortType=${sortType}`;
        return axios.get(`${http.gwApiPrefix}/api/scoreCard/list?${query}`).catch(errorHandler);
    },
    getStrategyCardById(id) {
        return axios.get(`${http.gwApiPrefix}/api/scoreCard/${id}`).catch(errorHandler);
    },
    showStrategyCardVersion(code) {
        return axios.get(`${http.gwApiPrefix}/api/scoreCard/showVersion?code=${code}`).catch(errorHandler);
    },
    saveStrategyCard(params) {
        return axios.put(`${http.gwApiPrefix}/api/scoreCard/save`, params).catch(errorHandler);
    },
    saveStrategyCardNewVersion(params) {
        return axios.post(`${http.gwApiPrefix}/api/scoreCard/saveNewVersion`, params).catch(errorHandler);
    },
    deleteStrategyCard(codes) {
        return axios.delete(`${http.gwApiPrefix}/api/scoreCard/delete?codes=${codes}`).catch(errorHandler)
    },
    deleteStrategyCardVersion(id) {
        return axios.delete(`${http.gwApiPrefix}/api/scoreCard/deleteVersion/${id}`).catch(errorHandler)
    },
    getScoreCardUseTimes(id) {
        return axios.get(`${http.gwApiPrefix}/api/scoreCard/quote/${id}`).catch(errorHandler)
    },
    getScoreSQL(id) {
        return axios.get(`${http.gwApiPrefix}/api/scoreCard/sql/${id}`).catch(errorHandler)
    },

    /**
     *策略包权重 树结构
     *
     * @returns
     */
    getStrategypackageWeightTree() {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/weight/tree`).catch(errorHandler)
    },
    /**
     *策略包权重详情页面
     * @param {*} versionId
     * @returns
     */
    getStrategypackageWeightDetail(versionId) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/weight/detail?versionId=${versionId}`).catch(errorHandler)
    },
    /**
     *策略包版本列表
     * @param {*} summaryId
     * @returns
     */
    getStrategypackageVersionList(summaryId) {
        return axios.get(`${http.gwApiPrefix}/api/strategypackage/versions?summaryId=${summaryId}`).catch(errorHandler)
    },
    savStrategypackage(vo) {
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/weight/save`, vo).catch(errorHandler)
    },
    /**
     * 策略包权重-开启/关闭事件源权重模式
     *
     * @param {*} enabled
     * @param {*} eventSourceId
     * @returns
     */
    strategypackageWeightSwitch(enabled, eventSourceId) {
        return axios.post(`${http.gwApiPrefix}/api/strategypackage/weight/action?enabled=${enabled}&eventSourceId=${eventSourceId}`).catch(errorHandler)
    }
}