import { Modal } from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';
import common from '@/utils/common';

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

    save(params) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/team/save`, params).catch(errorHandler);
    },
    getDetail(id, name) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/team/rename?id=${id}&&name=${name}`).catch(errorHandler);
    },
    delete(ids) {
        return axios.get(`${http.gwApiPrefix}/api//`).catch(errorHandler);
    },
    getList() {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/team/listAll`).catch(errorHandler);
    },
    delete(id) {
        return axios.delete(`${http.gwApiPrefix}/api/system/admin/team/delete/${id}`).catch(errorHandler);
    },
    rename(id, name) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/team/rename?id=${id}&name=${name}`).catch(errorHandler)
    },
    dissolveTeam(teamId) {
        return axios.delete(`${http.gwApiPrefix}/api/system/admin/team/dissolveTeam/${teamId}`).catch(errorHandler)
    },
    getPowerByTeamId(teamId) {
        return axios.get(`${http.gwApiPrefix}/api/system/admin/team/getTeamResourceAuth/${teamId}`).catch(errorHandler)
    },
    powerAssignForTeam(params) {
        return axios.post(`${http.gwApiPrefix}/api/system/admin/team/assignAuthToTeam`, params).catch(errorHandler)
    },
    optionUserFromTeam(addUserIds, removeUserIds, teamId) {
        let adduserIdsStr = '';
        addUserIds.forEach(element => {
            adduserIdsStr += `addUserIds=${element}&`;
        });
        adduserIdsStr = adduserIdsStr.substr(0, adduserIdsStr.length - 1);

        let removeUserIdsStr = '';
        removeUserIds.forEach(element => {
            removeUserIdsStr += `removeUserIds=${element}&`;
        });
        removeUserIdsStr = removeUserIdsStr.substr(0, removeUserIdsStr.length - 1);

        if (!common.isEmpty(addUserIds) && !common.isEmpty(removeUserIds)) {
            adduserIdsStr = `?${adduserIdsStr}`;
            removeUserIdsStr = `&${removeUserIdsStr}`;
        } else {
            if (!common.isEmpty(addUserIds)) {
                adduserIdsStr = `?${adduserIdsStr}`;
            } else {
                removeUserIdsStr = `?${removeUserIdsStr}`;
            }

        }

        return axios.post(`${http.gwApiPrefix}/api/system/admin/team/addUserToTeam/${teamId}${adduserIdsStr}${removeUserIdsStr}`)
    }
}