/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-05 15:40:10
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
    getChainList(page, size, query = {}) {
        let params = [];
        params.push(`page=${page}`)
        params.push(`size=${size}`)
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        // return axios.get(`${http.gwApiPrefix}/api/payChain/list`).catch(errorHandler)
        return axios.post(`${http.gwApiPrefix}/api/callChain/findAll?${params}`).catch(errorHandler)
    },
    getChainDetail(tradeNo) {
        return axios.post(`${http.gwApiPrefix}/api/callChain/findByTradeNo?tradeNo=${tradeNo}`).catch(errorHandler)
    },
    getPayGroupData(query = {}) {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        // return axios.get(`${http.gwApiPrefix}/api/payChain/list`).catch(errorHandler)
        return axios.post(`${http.gwApiPrefix}/api/cluster/loadClusters?${params}`).catch(errorHandler)
    },
    getPayDetailData(query = {}, type = 'front') {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        let url = ''
        switch (type) {
            case 'front':
                url = '/api/front/loadFronts'
                break;
            case 'online':
                url = '/api/online/loadOnlines'
                break;
            case 'esb':
                url = '/api/ESB/loadESBs'
                break;
            default:
                break;
        }
        return axios.post(`${http.gwApiPrefix}${url}?${params}`).catch(errorHandler)
    },
    getGroupCharts(query = {}) {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        return axios.get(`${http.gwApiPrefix}/api/cluster/loadCharts?${params}`).catch(errorHandler)
    },
    getDetailCharts(query = {},  type = 'front') {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        let url = ''
        switch (type) {
            case 'front':
                url = '/api/front/loadCharts'
                break;
            case 'online':
                url = '/api/online/loadCharts'
                break;
            case 'esb':
                url = '/api/ESB/loadCharts'
                break;
            default:
                break;
        }
        return axios.get(`${http.gwApiPrefix}${url}?${params}`).catch(errorHandler)
    },
    getESBServices(query = {}) {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        return axios.get(`${http.gwApiPrefix}/api/ESB/findAllServices?${params}`).catch(errorHandler)
    },
    getPayFindByTradeNoList(query = {}) {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        return axios.get(`${http.gwApiPrefix}/api/callChain/findByTradeNo`).catch(errorHandler)
        // return axios.get(`${http.gwApiPrefix}/api/callChain/findByTradeNo?${params}`).catch(errorHandler)
    },
}