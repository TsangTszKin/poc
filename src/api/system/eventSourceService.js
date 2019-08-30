import { Modal } from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';

const errorHandler = error => {
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: <pre>{error}</pre>,
    });
    console.log("出错信息如下");
    console.log(error);
}
export default {

    getList(params) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/findAll?query=${params.query}&page=${params.page}&size=${params.size}&status=${params.status}`).catch(errorHandler)
    },
    getDimensionList() {
        return axios.get(`${http.gwApiPrefix}/api/dimensions/select`).catch(errorHandler)
    },
    getDetails(id) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/findById/${id}`).catch(errorHandler)
    },
    changeStatus(id, isToOnline) {
        return axios.post(`${http.gwApiPrefix}/api/eventSources/upStatus?eventSourceId=${id}&onOff=${isToOnline}`)
    },
    save(params) {
        return axios.post(`${http.gwApiPrefix}/api/eventSources/save`, params).catch(errorHandler)
    },
    saveMapping(id,params) {
        return axios.post(`${http.gwApiPrefix}/api/eventSourceMappings/save/${id}`, params).catch(errorHandler)
    },
    getDimensionMappingList(eventSourceId) {
        return axios.get(`${http.gwApiPrefix}/api/eventSourceMappings/findAll?eventSourceId=${eventSourceId}&page=1&size=100`).catch(errorHandler)
    },
    changeDimensionMappingStatus(id, isToOnline) {
        return axios.post(`${http.gwApiPrefix}/api/eventSourceMappings/upStatus?ids=${id}&onOff=${isToOnline}`).catch(errorHandler)
    },
    changeDimensionMappingSyncStatus2(id, isToOnline) {
        return axios.post(`${http.gwApiPrefix}/api/eventSourceMappings/syncRtd?ids=${id}&onOff=${isToOnline}`).catch(errorHandler)
    },
    deleteDimensionMapping(id) {
        return axios.delete(`${http.gwApiPrefix}/api/eventSourceMappings/delete/${id}`).catch(errorHandler)
    },
    getDimensionsList(params) {
        return axios.get(`${http.gwApiPrefix}/api/dimensions/findAll?page=${params.page}&size=${params.size}`)
    },
    getAuthedEventSourceList(params){
        return axios.get(`${http.gwApiPrefix}/api/eventSources/listForAuthorize?query=${params.query}&page=${params.page}&size=${params.size}`).catch(errorHandler)
    },
    deleteOneEventSource(ids) {
        return axios.delete(`${http.gwApiPrefix}/api/eventSources/delete?ids=${ids}`).catch(errorHandler)
    },
    /**
     * 获取时分秒	保留时间、清理周期下拉列表的数据
     * @returns
     */
    getTimeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/calendarType`).catch(errorHandler)
    },
    /**
     * 模式选择
     * @returns
     */
    getDecisionFlowTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/eventSourceDecision`).catch(errorHandler)
    },
    /**
     * 输出选择
     * @returns
     */
    getDataSinkTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/eventSourceSink`).catch(errorHandler)
    },
    /**
     * 输入选择
     * @returns
     */
    getDataSourceTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/eventSourceSource`).catch(errorHandler)
    },
    /**
     * 调试配置项
     * @returns
     */
    getTraceFlagList() {
        return axios.get(`${http.gwApiPrefix}/api/var/eventSourceTrace`).catch(errorHandler)
    },
    /**
     * 同步RTD
     * @returns
     */
    pushToRTD(id, isToOnline) {
        return axios.put(`${http.gwApiPrefix}/api/eventSources/pushToRTD/${id}`).catch(errorHandler)
    },
    /**
     * 获取数据类型下拉列表的数据
     * @returns
     */
    getSourceStatusTypeList() {
        return axios.get(`${http.gwApiPrefix}/api/var/sourceStatusType`).catch(errorHandler)
    },
    /**
     * 获上传事件源插件
     */
    getUploadPlugin(file) {
        return axios.put(`${http.gwApiPrefix}/api/eventSources/uploadPlugin`, file).catch(errorHandler)
    },
    /**
     * 下载事件源报文字段
     *
     * @returns
     */
    download(id) {
        return axios.get(`${http.gwApiPrefix}/api/eventSources/download/${id}`,{
            responseType: 'blob'
        }).catch(errorHandler);
    },
    /**
     * 导入事件源报文字段
     *
     * @returns
     */
    upload(file,eventSourceVO) {
        file.append("eventSourceVO", eventSourceVO);
        return axios.post(`${http.gwApiPrefix}/api/eventSources/upload`,file).catch(errorHandler)
    },

}