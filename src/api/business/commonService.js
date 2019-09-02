/*
 * @Author: zengzijian
 * @Date: 2018-09-29 11:57:27
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:28:57
 * @Description: 通用的api
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
    console.error(error);
}
export default {
    getDict(enumCode) {
        return axios.get(`${http.gwApiPrefix}/api/common/${enumCode}`).catch(errorHandler)
    },
}