/* eslint-disable no-undef */
/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:51:37
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 18:39:07
 * @Description: 页面顶部导航栏
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import authService from '@/api/authService';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';
/**
 * 页面顶部导航栏
 * 
 * @class TopNav
 * @extends {Component}
 */
@withRouter
@inject('GlobalStore')
@observer
class TopNav extends Component {
    constructor(props) {
        super(props);
        this.goTo = this.goTo.bind(this);
        this.isActive = this.isActive.bind(this);
        this.getLeftMenuForApi = this.getLeftMenuForApi.bind(this);
        this.state = {
            index: 0,
            nav: []
        }
    }
    componentDidMount() {

        if (localStorage.topMenu) {
            this.setState({ nav: JSON.parse(localStorage.topMenu) })
        }


        setTimeout(function () {


            var timer = setInterval(function () {
                if (window.layui) {
                    layui.use(['layer', 'laydate', 'jquery'], function () {
                        window.layer = layui.layer;
                        window.$ = layui.$;
                        window.laydate = layui.laydate;
                        $("ul.nav li.nav-item").click(function () {
                            $(this).addClass("nav-item-selected").siblings().removeClass("nav-item-selected");
                        })
                    });
                    stop();
                }
            }, 100);
            function stop() {
                window.clearInterval(timer);
            }



        }, 500)
    }
    goTo(id) {
        this.getLeftMenuForApi(id, true);
        // this.props.history.push(url);
        // this.setState({
        //     index: this.state.index++
        // })
    }
    // eslint-disable-next-line no-unused-vars
    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.location.pathname !== this.props.location.pathname) {
            return true
        }
        return true
    }
    isActive(label, id) {
        if (this.props.location.pathname.includes(label)) {
            this.getLeftMenuForApi(id, false);
            return true
        } else {
            return false
        }
    }
    getLeftMenuForApi(topMenuId, isGoToFirst) {
        authService.getLeftMenu(topMenuId).then((res) => {
            if (!publicUtils.isOk(res)) return;
            if (!common.isEmpty(res.data.result)) {
                res.data.result = common.deepClone(leftMenu[topMenuId])
                this.props.GlobalStore.menu.setLeft(res.data.result);
                localStorage.leftMenu = JSON.stringify(res.data.result);
                let firstMenu = res.data.result[0];
                let url = '';
                if (!common.isEmpty(firstMenu.child)) {
                    url = res.data.result[0].child[0].url;
                } else {
                    url = res.data.result[0].url;
                }
                if (isGoToFirst) {
                    this.props.history.push(url)
                    this.props.GlobalStore.menu.setLeft(res.data.result);
                }
            } else {
                this.props.GlobalStore.menu.setLeft([]);
            }
        });
    }
    render() {
        // console.log("this.props.GlobalStore.menu.getLeft", this.props.GlobalStore.menu.getLeft);
        return (
            <ul className="nav">
                {
                    this.state.nav.map((item) =>
                        <li key={item.url} className={`nav-item ${this.isActive(item.label, item.id) ? "nav-item-selected" : null}`} onClick={() => this.goTo(item.id)}>{item.name}</li>
                    )
                }
            </ul>
        )
    }
}

export default TopNav


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
        }],
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