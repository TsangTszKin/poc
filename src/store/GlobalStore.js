/*
 * @Author: zengzijian
 * @Date: 2018-07-24 17:13:32
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 18:38:51
 * @Description: ** 全局Store数据仓库 **

    直接实例化，在 ./index.js 通过 Provider 渗透。
    在模块内用 @inject('Store')，将 Store 注入到 props 上。
    哪里用，哪里 @inject('Store')。

    注意：无论是全局 Store，还是局部 store，必须 @inject('xxx')注入到 props 上才能获取，保证结构的一致性。
 */
import { observable, action, computed, toJS } from 'mobx';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import authService from '@/api/authService';
import { Modal } from 'antd';

class GlobalStore {

    constructor() {
        this.getTopMenuForApi = this.getTopMenuForApi.bind(this);
        this.getLeftMenuForApi = this.getLeftMenuForApi.bind(this);
        this.getAuthActionForApi = this.getAuthActionForApi.bind(this);
    }
    isGoToFirst = false;
    @observable isLoading = false;
    @observable isTokenExpTimeMs = false;
    @observable tokenExpTimeMsValue = 99999999;
    @observable userInfo = {
        name: '',
        orgName: '',
        account: "",
        get getAccount() { return toJS(this.account) },
        get getName() { return toJS(this.name); },
        get getOrgName() { return toJS(this.orgName) },
        setName(value) { this.name = value; },
        setOrgName(value) { this.orgName = value },
        setAccount(value) { this.account = value }
    }
    @observable menu = {
        top: [],
        left: [],
        activeKey: [],
        get getTop() { return toJS(this.top) },
        get getLeft() { return toJS(this.left) },
        get getActiveKey() { return toJS(this.activeKey) },
        setTop(value) { this.top = value },
        setLeft(value) { this.left = value },
        setActivekey(value) { this.activeKey = value }
    }
    @observable authAction = {
        data: [],
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value }
    }

    @computed get getIsLoading() { return toJS(this.isLoading) }
    @action.bound setIsLoading(value) { this.isLoading = value }

    @computed get getIsTokenExpTimeMs() { return toJS(this.isTokenExpTimeMs) }
    @action setIsTokenExpTimeMs(value) { return this.isTokenExpTimeMs = value }

    @computed get getTokenExpTimeMsValue() { return toJS(this.tokenExpTimeMsValue) }
    @action.bound setTokenExpTimeMsValue(value) { this.tokenExpTimeMsValue = value }

    getTopMenuForApi() {
        // this.menu.setTop([{label: '111', url: '11/11', id: '1111', name: '3333'}]);
        authService.getTopMenu().then(this.getTopMenuForApiCallBack);
    }
    @action.bound getTopMenuForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return;

        if (!common.isEmpty(res.data.result)) {
            // res.data.result = common.deepClone(topMenu)
            this.menu.setTop(res.data.result);
            localStorage.topMenu = JSON.stringify(res.data.result);
            this.getLeftMenuForApi(res.data.result[0].id, true);
        } else {
            this.menu.setTop([]);
            Modal.warning({
                title: '系统提示',
                content: '该用户权限不足，请联系管理员',
            });
        }

    }

    getLeftMenuForApi(topMenuId, isGoToFirst) {
        this.isGoToFirst = isGoToFirst || false;
        authService.getLeftMenu(topMenuId).then((res) => this.getLeftMenuForApiCallBack(res, topMenuId));
    }
    @action.bound getLeftMenuForApiCallBack(res, topMenuId) {
        if (!publicUtils.isOk(res)) return;
        if (!common.isEmpty(res.data.result)) {
            res.data.result = common.deepClone(res.data.result[topMenuId])
            this.menu.setLeft(res.data.result);
            localStorage.leftMenu = JSON.stringify(res.data.result);
            let firstMenu = res.data.result[0];
            let url = '';
            if (!common.isEmpty(firstMenu.child)) {
                url = res.data.result[0].child[0].url;
            } else {
                url = res.data.result[0].url;
            }
            if (this.isGoToFirst) {
                window.location.href = `/#${url}`;
            }
        } else {
            this.menu.setLeft([]);
        }
    }

    getAuthActionForApi() {
        authService.getAuthAction().then(this.getAuthActionForApiCallBack);
    }
    @action.bound getAuthActionForApiCallBack(res) {
        if (!publicUtils.isOk(res)) return;
        this.authAction.setData(res.data.result);
        localStorage.authAction = res.data.result
    }

    @observable time = {
        data: [],
        get getData() { return toJS(this.data) },
        setData(value) { this.data = value }
    }
}

export default new GlobalStore