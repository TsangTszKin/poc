import { Modal } from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';

const errorHandler = error => {
    Modal.error({
        title: '系统提示',
        content: error,
    });
    console.log("出错信息如下");
    console.log(error);
}
export default {
    getTree() {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/org/listTree`).catch(errorHandler);
    },
    getDetailsById(id) {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/org/get/${id}`).catch(errorHandler)
    },
    saveDetails(params) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/org/save`, params).catch(errorHandler)
    },
    deleteOne(id) {
        return axios.delete(`${http.gwApiPrefix}/api/system/admin/org/delete/${id}`).catch(errorHandler)
    },
    getList() {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/org/list?page=1&size=100`).catch(errorHandler)
    },
    moveNode(id, parentId, ids) {
        let idsStr = '';
        ids.forEach(element => {
            idsStr += `&ids=${element}`;
        })
        return axios.post(`${http.gwApiPrefix}/api/system/admin/org/move?id=${id}&parentId=${parentId}${idsStr}`).catch(errorHandler)
    }
}