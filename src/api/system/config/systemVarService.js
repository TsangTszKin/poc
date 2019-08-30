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
    getList(params) {
        return axios.get(`${http.gwApiPrefix}/api/dictionary/key/list?query=${params.query.keyword}&dataType=${params.query.dataType}&&page=${params.page}&size=${params.size}`).catch(errorHandler)
    },
    delete(id) {
        return axios.delete(`${http.gwApiPrefix}/api/dictionary/key/${id}`).catch(errorHandler)
    },
    /**
     * 保存字典子项排序
     *
     * @param {string} ids
     * @returns
     */
    orderTables(ids) {
        return axios.post(`${http.gwApiPrefix}/api/dictionary/order?ids=${ids}`).catch(errorHandler)
    },
    changeStatus(id, isToOnline) {
        return axios.post(`${http.gwApiPrefix}/api/dictionary/key/upStatus?ids=${id}&onOff=${isToOnline}`).catch(errorHandler)
    },
    save(params) {
        return axios.post(`${http.gwApiPrefix}/api/dictionary/key`, params).catch(errorHandler)
    },
    getDetails(id) {
        return axios.get(`${http.gwApiPrefix}/api/dictionary/key/${id}`).catch(errorHandler)
    },
    getDetailsList(keyCode, status) {
        status = status || 0;
        return axios.get(`${http.gwApiPrefix}/api/dictionary/data/list?keyCode=${keyCode}&status=${status}`).catch(errorHandler)
    },
    saveDetailsListDetails(params) {
        return axios.post(`${http.gwApiPrefix}/api/dictionary/data`, params).catch(errorHandler)
    },
    getDetailsListDetails(id) {
        return axios.get(`${http.gwApiPrefix}/api/dictionary/data/${id}`)
    },
    deleteDetailsListDetails(id) {
        return axios.delete(`${http.gwApiPrefix}/api/dictionary/data/${id}`).catch(errorHandler)
    }
}