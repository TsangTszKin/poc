import { Modal } from 'antd';
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
    getList() {
        return axios.get(`${http.gwApiPrefix}/api/system/conf/schedule/list`).catch(errorHandler)
    },
    save(params) {
        return axios.post(`${http.gwApiPrefix}/api/system/conf/schedule/save`, params).catch(errorHandler)
    },
    syncExtVarToRTD(eventSourceId) {
        return axios.post(`${http.gwApiPrefix}/api/system/conf/syncExtVarToRtd?eventSourceId=${eventSourceId}`).catch(errorHandler)
    },
    syncRTD() {
        return axios.post(`${http.gwApiPrefix}/api/system/conf/syncRtd`).catch(errorHandler)
    }
}