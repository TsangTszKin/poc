/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 11:54:56
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
        // return axios.get(`${http.gwApiPrefix}/bpc/msg/call/chain`).catch(errorHandler)
        return axios.get(`${http.gwApiPrefix}/bpc/msg/call/chain?${params}`).catch(errorHandler)
    },
    getSmsAllData(query = {}) {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        // return axios.get(`${http.gwApiPrefix}/bpc/msg/index`).catch(errorHandler)
        return axios.get(`${http.gwApiPrefix}/bpc/msg/index?${params}`).catch(errorHandler)
    },
    getAllCharts(query = {}) {
        let params = [];
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        return axios.get(`${http.gwApiPrefix}/bpc/msg/statisrtical/chart?${params}`).catch(errorHandler)
    },
    getChainDetail(signAcct) {
        return axios.get(`${http.gwApiPrefix}/bpc/msg/call/chain/detail?signAcct=${signAcct}`).catch(errorHandler)
    },
    getLog(page, size, query = {}) {
        let params = [];
        params.push(`page=${page}`)
        params.push(`size=${size}`)
        for (const key in query) {
            params.push(`${key}=${query[key]}`)
        }
        params = params.join('&')
        return axios.get(`${http.gwApiPrefix}/bpc/msg/index/type/log?${params}`).catch(errorHandler)
        // return axios.get(`${http.gwApiPrefix}/api/getLog`).catch(errorHandler)
    }
}