/*
 * @Author: liuzhuolin
 * @Date: 2019-05-06 14:49:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-06-10 14:57:24
 * @Description: 系统管理-配置维度的api前端定义
 */

import {Modal} from 'antd';
import axios from '@/config/http.filter';
import http from '@/config/http';
import React from "react";

const errorHandler = error => {
    // message.error("出错了，请稍候再试");
    Modal.error({
        title: '系统提示',
        content: <pre>error</pre>,
    });
    console.log("出错信息如下");
    console.log(error);
}

export default {
    /**
     * 保存表结构
     * @param {*} params
     * @returns
     */
    saveTables(params) {
        return axios.post(`${http.gwApiPrefix}/api/tables/save`, params).catch(errorHandler)
    },
    /**
     * 表结构查询
     * @param {Number} page
     * @param {Number} size
     * @param {Object} query
     * @returns axios
     */
    getTablesList(params) {
        return axios.get(`${http.gwApiPrefix}/api/tables/findAll?query=${params.query}&page=${params.page}&size=${params.size}&dimensionId=${params.dimensionId}`).catch(errorHandler);
    },
    /**
     * 根据维度查询表
     *
     * @param {string} id
     * @returns
     */
    findByDimensionId(id) {
        return axios.get(`${http.gwApiPrefix}/api/service/tables/findByDimensionId/${id}`).catch(errorHandler)
    },
    /**
     * 根据id查询主键
     *
     * @param {string} id
     * @returns
     */
    findPKById(id) {
        return axios.get(`${http.gwApiPrefix}/api/service/tables/findPKById/${id}`).catch(errorHandler)
    },
    /**
     * 根据ID获取表详情
     * @param {*} id
     * @returns
     */
    getTablesById(id) {
        return axios.get(`${http.gwApiPrefix}/api/tables/findById/${id}`).catch(errorHandler);
    },
    /**
     * 删除表结构
     *
     * @param {string} id
     * @returns
     */
    deleteOneTables(ids) {
        return axios.delete(`${http.gwApiPrefix}/api/tables/delete?ids=${ids}`).catch(errorHandler)
    },
    /**
     *  推送表结构到RTD
     *
     * @param {string} id
     * @returns
     */
    tablesToRTD(ids, isToOnline) {
        return axios.post(`${http.gwApiPrefix}/api/tables/pushToRTD?ids=${ids}`).catch(errorHandler)
    },
    /**
     *  推送到Redis
     *
     * @returns
     */
    tablesToRedis() {
        return axios.post(`${http.gwApiPrefix}/api/tables/toRedis`).catch(errorHandler)
    },
    /**
     * 下载库表字段信息
     *
     * @returns
     */
    download(id) {
        return axios.get(`${http.gwApiPrefix}/api/service/tables/download/${id}`,{
            responseType: 'blob'
        }).catch(errorHandler);
    },
    /**
     * 导入库表字段信息
     *
     * @returns
     */
    upload(file,tableEntity) {
        file.append("tableEntity", tableEntity);
        return axios.post(`${http.gwApiPrefix}/api/service/tables/upload`,file).catch(errorHandler)
    },
}