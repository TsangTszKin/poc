/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:13:05
 * @Description: 通用的api
 */

import { Modal } from 'antd'
import axios from '@/config/http.filter';
import http from '@/config/http'
import mockData from '@/api/mock'

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
    getAlertList(page, size, query = {}) {
        let params = [];
        params.push(`page=${page}`)
        params.push(`size=${size}`)
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        console.log('params', params)
        // return axios.get(`${http.gwApiPrefix}/alarm/info/page`).catch(errorHandler)
        return axios.get(`${http.gwApiPrefix}/alarm/info/page?${params}`).catch(errorHandler)
    },
    getAlertSetting() {
        return axios.get(`${http.gwApiPrefix}/alarm/threshold/setting`).catch(errorHandler)
        // return axios.post(`${http.gwApiPrefix}/api/callChain/findAll?${params}`).catch(errorHandler)
    },
    saveAlertSetting(params) {
        return axios.put(`${http.gwApiPrefix}/alarm/threshold/setting`, params).catch(errorHandler)
    },
    handleAlert(id) {
        return axios.put(`${http.gwApiPrefix}/alarm/info/page/${id}`).catch(errorHandler)
        // return axios.post(`${http.gwApiPrefix}/api/callChain/findAll?${params}`).catch(errorHandler)
    },
    getAlertSelection() {
        return axios.get(`${http.gwApiPrefix}/alarm/info/select`).catch(errorHandler)
        // return axios.post(`${http.gwApiPrefix}/api/callChain/findAll?${params}`).catch(errorHandler)
    },
}