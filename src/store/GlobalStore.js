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
}

export default new GlobalStore


const topMenu = [
    {
        "id": 1,
        "appId": 1,
        "parentId": 0,
        "actions": {},
        "child": [],
        "level": 0,
        "name": "数据监控",
        "description": "数据监控",
        "label": "business",
        "url": "/business/home/group",
        "icon": "home",
        "method": "get",
        "orderNum": 1
    },
    {
        "id": 10,
        "appId": 1,
        "parentId": 0,
        "actions": {},
        "child": [],
        "level": 0,
        "name": "运维中心",
        "description": "运维中心",
        "label": "system",
        "url": "/system/eventSource",
        "icon": "",
        "method": "create",
        "orderNum": 4
    }
]

const leftMenu = {
    '1': [
        {
            "id": 54,
            "appId": 1,
            "parentId": 1,
            "actions": {},
            "child": [
            ],
            "level": 1,
            "name": "监控告警",
            "label": "business-home",
            "url": "/business/home",
            "icon": "dashboard",
            "method": ""
        },
        {
            "id": 2,
            "appId": 1,
            "parentId": 1,
            "actions": {
                "business:home:view": {
                    "level": 1,
                    "name": "查看",
                    "label": "business:home:view",
                    "url": "",
                    "method": ""
                },
                "business:home:edit": {
                    "level": 1,
                    "name": "编缉",
                    "label": "business:home:edit",
                    "url": "",
                    "method": ""
                }
            },
            "child": [
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "集群",
                    "label": "business-pay-group",
                    "url": "/business/pay/group",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "前置",
                    "label": "business-pay-pre",
                    "url": "/business/pay/pre",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "联机",
                    "label": "business-pay-unit",
                    "url": "/business/pay/unit",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "ESB",
                    "label": "business-pay-esb",
                    "url": "/business/pay/esb",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "调用链查询",
                    "label": "business-pay-chain",
                    "url": "/business/pay/chain",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
            ],
            "level": 0,
            "name": "统一支付",
            "description": "统一支付",
            "label": "business-pay",
            "url": "/business/pay",
            "icon": "home",
            "method": "ALL"
        },
        {
            "id": 2,
            "appId": 1,
            "parentId": 1,
            "actions": {
                "business:home:view": {
                    "level": 1,
                    "name": "查看",
                    "label": "business:home:view",
                    "url": "",
                    "method": ""
                },
                "business:home:edit": {
                    "level": 1,
                    "name": "编缉",
                    "label": "business:home:edit",
                    "url": "",
                    "method": ""
                }
            },
            "child": [
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "数据分析",
                    "label": "business-sms-index",
                    "url": "/business/sms/index",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "调用链查询",
                    "label": "business-sms-chain",
                    "url": "/business/sms/chain",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
            ],
            "level": 0,
            "name": "短信",
            "description": "短信",
            "label": "business-sms",
            "url": "/business/sms",
            "icon": "home",
            "method": "ALL"
        },
        {
            "id": 54,
            "appId": 1,
            "parentId": 1,
            "actions": {},
            "child": [
            ],
            "level": 1,
            "name": "日志查询检索",
            "label": "business-log-index",
            "url": "/business/log/index",
            "icon": "file-text",
            "method": ""
        },
        {
            "id": 54,
            "appId": 1,
            "parentId": 1,
            "actions": {},
            "child": [
            ],
            "level": 1,
            "name": "指标统计与展示",
            "label": "business-charts-index",
            "url": "/business/charts/index",
            "icon": "bar-chart",
            "method": ""
        }
    ],
    '10': [
        {
            "id": 37,
            "appId": 1,
            "parentId": 10,
            "actions": {},
            "child": [
                {
                    "id": 32,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {
                        "system:member:resetPassword": {
                            "level": 1,
                            "name": "重置密码",
                            "label": "system:member:resetPassword",
                            "url": "",
                            "method": ""
                        },
                        "system:member:edit": {
                            "level": 1,
                            "name": "编缉",
                            "label": "system:member:edit",
                            "url": "",
                            "method": ""
                        },
                        "system:member:delete": {
                            "level": 1,
                            "name": "删除",
                            "label": "system:member:delete",
                            "url": "",
                            "method": ""
                        },
                        "system:member:view": {
                            "level": 1,
                            "name": "查看",
                            "label": "system:member:view",
                            "url": "",
                            "method": ""
                        }
                    },
                    "child": [],
                    "level": 1,
                    "name": "用户管理",
                    "label": "system-auth-member",
                    "url": "/system/auth/member",
                    "icon": "user",
                    "method": "",
                    "orderNum": 1
                },
                {
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {
                        "system:power:view": {
                            "level": 1,
                            "name": "查看",
                            "label": "system:power:view",
                            "url": "",
                            "method": ""
                        },
                        "system:power:edit": {
                            "level": 1,
                            "name": "编缉",
                            "label": "system:power:edit",
                            "url": "",
                            "method": ""
                        },
                        "system:power:delete": {
                            "level": 1,
                            "name": "删除",
                            "label": "system:power:delete",
                            "url": "",
                            "method": ""
                        }
                    },
                    "child": [],
                    "level": 1,
                    "name": "菜单目录",
                    "label": "system-auth-power",
                    "url": "/system/auth/power",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                {
                    "id": 33,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {
                        "system:group:view": {
                            "level": 1,
                            "name": "查看",
                            "label": "system:group:view",
                            "url": "",
                            "method": ""
                        },
                        "system:group:edit": {
                            "level": 1,
                            "name": "编辑",
                            "label": "system:group:edit",
                            "url": "",
                            "method": ""
                        }
                    },
                    "child": [],
                    "level": 1,
                    "name": "角色管理",
                    "label": "system-auth-group",
                    "url": "/system/auth/group",
                    "icon": "team",
                    "method": "",
                    "orderNum": 3
                },
                {
                    "id": 35,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {
                        "system:organization:view": {
                            "level": 1,
                            "name": "查看",
                            "label": "system:organization:view",
                            "url": "",
                            "method": ""
                        },
                        "system:organization:delete": {
                            "level": 1,
                            "name": "删除",
                            "label": "system:organization:delete",
                            "url": "",
                            "method": ""
                        },
                        "system:organization:edit": {
                            "level": 1,
                            "name": "编缉",
                            "label": "system:organization:edit",
                            "url": "",
                            "method": ""
                        }
                    },
                    "child": [],
                    "level": 1,
                    "name": "机构管理",
                    "label": "system-auth-organization",
                    "url": "/system/auth/organization",
                    "icon": "reconciliation",
                    "method": "",
                    "orderNum": 4
                }
            ],
            "level": 1,
            "name": "权限管理",
            "label": "system-auth",
            "url": "/system/auth",
            "icon": "eye",
            "method": "",
            "orderNum": 2
        },
    ]
}