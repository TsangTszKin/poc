/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 11:47:37
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
        return axios.get(`${http.gwApiPrefix}/api/payChain/list`).catch(errorHandler)
        // return axios.get(`${http.gwApiPrefix}/api/chain/list?${params}`).catch(errorHandler)
    },
}