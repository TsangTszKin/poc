import { Modal } from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';
import mockData from '@/api/mock'

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
    test() {
        console.log(http);
    },
    login(params) {
        return axios.post(`${http.gwApiPrefix}/api/auth/login`, params).catch(errorHandler);
    },
    logout() {
        return axios.get(`${http.gwApiPrefix}/api/auth/logout`).catch(errorHandler)
    },
    getTopMenu() {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/resource/topmenu`).catch(errorHandler)
    },
    getLeftMenu(topMenuId) {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/resource/leftmenu`).catch(errorHandler)
        // return axios.get(`${http.gwApiPrefix}/api/system/admin/resource/leftmenu/${topMenuId}`).catch(errorHandler)
    },
    getAuthAction() {
        return axios.get(`${http.gwApiPrefix}/api/auth/getOperAuthSet`).catch(errorHandler)
    }
}