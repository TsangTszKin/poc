/*
 * @Author: zengzijian
 * @Date: 2018-08-21 10:13:05
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-10 14:54:06
 * @Description: 策略管理的api前端定义
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
     * 获取规则列表
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getEventSourceList(page, size, query) {
        if (!page) page = 1;
        if (!size) size = 10;
        if (!query) query = { eventSourceType: '' };
        return axios.get(`${http.gwApiPrefix}/api/rule/list?eventSourceType=${query.eventSourceType}&page=${page}&size=${size}`).catch(errorHandler);
    },
    save(params) {
        return axios.post(`${http.gwApiPrefix}/api/eventSources/save`, params).catch(errorHandler);
    }

}