import { Modal } from 'antd';
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
export default {
    /**
     * 提交审核
     *
     * 去除@param {*} actionType 0提交，1上线，2下线，3删除
     * 新的@param {*} actionType 0新增（status=0未就绪），1上线，2下线，3删除，4修改（status!=0非未就绪）
     * @param {*} code 基础信息实体类的code
     * @param {*} id 基础信息实体类的id
     * @param {*} name 基础信息实体类的name
     * @param {*} remark 提交备注
     * @param {*} type 0rtq，1ext，2rule，3规则集，4策略
     * @param {*} version 基础信息实体类的version
     * @returns
     */
    submit(actionType, code, id, name, remark, type, version) {
        if (common.isEmpty(version)) version = 1;
        return axios.post(`${http.gwApiPrefix}/api/approval/submit?actionType=${actionType}&code=${code}&id=${id}&name=${name}&remark=${remark}&type=${type}&version=${version}`).catch(errorHandler)
    },
    /**
     * 获取审核列表
     *
     * @param {*} params = {code, name, page, size, status(0审核中,1审核通过,2审核拒绝), type(0rtq,1ext,2rule,3ruleSet,4strategy)}
     * @returns
     */
    getList(params) {
        return axios.get(`${http.gwApiPrefix}/api/approval/findAll?code=${params.code}&name=${params.name}&page=${params.page}&size=${params.size}&status=${params.status}&type=${params.type}`).catch(errorHandler)
    },
    pass(objId, type, approvalLogVO) {
        // approvalLogVO.remark = "通过";
        return axios.post(`${http.gwApiPrefix}/api/approval/pass?objId=${objId}&type=${type}`, approvalLogVO).catch(errorHandler)
    },
    reject(objId, type, approvalLogVO) {
        // approvalLogVO.remark = "拒绝";
        return axios.post(`${http.gwApiPrefix}/api/approval/reject?objId=${objId}&type=${type}`, approvalLogVO).catch(errorHandler)
    },
    /**
     * 批量通过审核
     *
     * @param {array} params
     * @returns
     */
    multiPass(params) {
        params.forEach(element => {
            // element.remark = "通过";
        })
        return axios.post(`${http.gwApiPrefix}/api/approval/passList`, params).catch(errorHandler)
    },
    /**
     * 批量拒绝审核
     *
     * @param {array} params
     * @returns
     */
    multiReject(params) {
        params.forEach(element => {
            // element.remark = "拒绝";
        })
        return axios.post(`${http.gwApiPrefix}/api/approval/rejectList`, params).catch(errorHandler)
    }
}