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
        return axios.get(`${http.gwApiPrefix}/api/system/admin/user/list?page=${params.page}&size=${params.size}&nickName=${params.nickName}&userName=${params.userName}`).catch(errorHandler);
    },
    save(params) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/user/save`, params).catch(errorHandler);
    },
    getDetail(id) {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/user/get/${id}`).catch(errorHandler);
    },
    delete(ids) {
        return axios.post(`${http.gwApiPrefix}/api/auth/ogin`, params).catch(errorHandler);
    },
    getUserListByTeamId(params) {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/team/admin/team/getAllUser/${params.teamId}?nickName=${params.nickName}&page=${params.page}&size=${params.size}&type=${params.type}`).catch(errorHandler)
    },
    resetPassword(userId, newPasword) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/user/modPassword/${userId}?newPassword=${newPasword}`).catch(errorHandler)
    }
}