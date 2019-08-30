/*
 * @Author: liuzhuolin
 * @Date: 2019-04-26 14:49:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-10 14:57:13
 * @Description: 系统管理-配置维度的api前端定义
 */

import {Modal} from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';

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
     * 保存维度
     * @param {*} params
     * @returns
     */
    saveDimensionConfig(params) {
        return axios.post(`${http.gwApiPrefix}/api/dimensions/save`, params).catch(errorHandler)
    },
    /**
     * 获取维度列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getDimensionConfigList(page, size, query) {
        return axios.get(`${http.gwApiPrefix}/api/dimensions/findAll?name=${query.name}&code=${query.code}&page=${page}&size=${size}`).catch(errorHandler);
    },
    /**
     * 根据ID获取维度详情
     * @param {*} id
     * @returns
     */
    getDimensionConfigById(id) {
        return axios.get(`${http.gwApiPrefix}/api/dimensions/findById/${id}`).catch(errorHandler);
    },
    /**
     * 维度下拉框
     * @returns axios
     */
    getDimensionNameList() {
        return axios.get(`${http.gwApiPrefix}/api/dimensions/select`).catch(errorHandler);
    },
    /**
     * 删除单个维度
     *
     * @param {string} id
     * @returns
     */
    deleteOneDimensionConfig(ids) {
        return axios.delete(`${http.gwApiPrefix}/api/dimensions/delete?ids=${ids}`).catch(errorHandler)
    }

}