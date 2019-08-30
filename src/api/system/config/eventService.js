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
    getDetailsList(organizationCode) {
        return axios.get(`${http.gwApiPrefix}/api/system/conf/dataAnalysis/sys/col/list?organization=${organizationCode}`).catch(errorHandler)
    },
    getDimensionList(organizationCode) {
        return axios.get(`${http.gwApiPrefix}/api/system/conf/dataAnalysis/eventstatisdim/list?organization=${organizationCode}`).catch(errorHandler)
    },
    /**
     *
     *
     * @param {Array} params
     * @returns
     */
    saveDetailsList(params, organization) {
        return axios.post(`${http.gwApiPrefix}/api/system/conf/dataAnalysis/sys/col/save?organization=${organization}`, params).catch(errorHandler)
    },
    /**
     *
     *
     * @param {Array} params
     * @returns
     */
    saveDimensionList(params, organization) {
        return axios.post(`${http.gwApiPrefix}/api/system/conf/dataAnalysis/eventstatisdim/save?organization=${organization}`, params).catch(errorHandler)
    }
}