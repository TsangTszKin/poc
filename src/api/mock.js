/*
 * @Author: zengzijian
 * @Date: 2019-08-26 15:24:54
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 11:54:34
 * @Description: 
 */
import http from '@/config/http'
var Mock = require('mockjs')


var logList = Mock.mock(`${http.gwApiPrefix}/api/log/list`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "pageList": {
        "curPageNO": 0,
        "offset": 10,
        "pageCount": 5,
        "sum": 100,
        "resultList|10": [{
            'id': '@natural',
            'name': '@name', //中文名称
            'module': '@cname', //中文名称
            'org': '@cname', //中文名称
            'type|1': [
                "转账",
                "对账",
                "查询"
            ],
            'category|1': [
                "正常",
                "错误",
                "警告",
                "成功",
                "失败"
            ],
            'account': '@natural', //中文名称
            'custNo': '@natural', //中文名称
            'cardNo': '@natural', //中文名称
            'time': '@date("yyyy-MM-dd")', //日期
            'log': '@paragraph(10)'
        }]
    }
});

var payChainList = Mock.mock(`${http.gwApiPrefix}/api/payChain/list`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "pageList": {
        "curPageNO": 0,
        "offset": 10,
        "pageCount": 5,
        "sum": 100,
        "resultList|10": [{
            'id': '@natural',
            'time': '@datetime', //日期
            'businessCode': '@string("lower", 5)',
            'account': '@natural', //中文名称
            'accountName': '@cname', //中文名称
            'channel|1': [
                "美团支付",
                "财付通",
                "支付宝"
            ],
            'money': '@float(60, 99999, 3, 2)'
        }]
    }
});

var smsChainList = Mock.mock(`${http.gwApiPrefix}/bpc/msg/call/chain`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "pageList": {
        "curPageNO": 0,
        "offset": 10,
        "pageCount": 5,
        "sum": 100,
        "resultList|10": [{
            'id': '@natural',
            'signAcct': '@natural',
            'timestamp': '@datetime', //日期
            'templateId': '@string("lower", 5)',
            'phone': '@natural',
            'msgBody': '@cparagraph'
        }]
    }
});

var alertList = Mock.mock(`${http.gwApiPrefix}/api/alert/list`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "pageList": {
        "curPageNO": 0,
        "offset": 10,
        "pageCount": 5,
        "sum": 100,
        "resultList|10": [{
            'id': '@natural',
            'time': '@datetime', //日期
            'level|1': [
                "紧急",
                "重要",
                "提示"
            ],
            'status|1': [
                "未处理",
                "已处理"
            ],
            'content': '@cparagraph'
        }]
    }
});


var alertSettingList = Mock.mock(`${http.gwApiPrefix}/api/alertSetting/list`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "pageList": {
        "curPageNO": 0,
        "offset": 10,
        "pageCount": 5,
        "sum": 100,
        "resultList|10": [{
            'id': '@natural',
            'index|1': [
                "1分钟交易量",
                "5分钟交易量",
                "1小时交易量",
                "1天交易量",
                "1分钟时延",
                "5分钟时延",
                "1小时时延",
                "1天时延",
            ],
            "target|1": [
                "前置集群",
                "前置节点1",
                "联机集群",
                "联机节点1",
            ],
            "threshold|1-100": 100,
            "level|1": [
                "紧急",
                "重要",
                "提示"
            ],
            'message': '@cparagraph'
        }]
    }
});

var login = Mock.mock(`${http.gwApiPrefix}/api/auth/login`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": {
        "jwtUser": {
            "accountNonExpired": true,
            "accountNonLocked": true,
            "appServerId": 1,
            "credentialsNonExpired": true,
            "domanType": "oa",
            "email": "zhaowd@shinetech-china.com",
            "enabled": true,
            "id": 1,
            "lastPasswordResetDate": 1548319921000,
            "mobile": "13570412412",
            "nickName": "超级管理员",
            "orgName": "运维部",
            "organization": "dev",
            "supperAdmin": true,
            "teamIds": [],
            "tokenExpTimeMs": 1800000,
            "username": "admin"
        },
        "expire": 1567003123183,
        "secretToken": "s1D0TB8fPpmmTLt6XZENF/6SpNRsX9Gy3UIfQuhqKNpUuACz8RWBd1McBsNYqqn6UhbO36gsj9FF3rs45H/xauBWOBh/dg0OxGWKrWgA0B/xddVzBVkwxUJztsVyi841WJobDbmycJ+CkGm2JNILTtUR5F9bBZ/VVD8zoere7lT9FFGDAFhBwThdo8z/zowl+I30rddMid9LhvMTwfRlG1HK5EB8HIhhr+l7X9rT+IGfWJrc64z8OtDLjQtMlgneIWwgUk9CaLiv8CNxr3qE5XGNkbbg1BUMcnCijn7FLXBeM8tRGzRejFqAWbxOeebo",
        "timestamp": 1567001323183,
        "token": "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImF1ZCI6IndlYiIsImlzcyI6IjEiLCJleHAiOjE1NjcwMDMxMjMsImlhdCI6MTU2NzAwMTMyM30.cAk1XD1PqFC0d_oySI5TN1dp-vJcQCQeMlqa22xg5-1KleiJbfl10NcwCeja8zS-ALI0mFfs_NieR5IAGBk3KQ"
    },
});

var getAuthAction = Mock.mock(`${http.gwApiPrefix}/api/auth/getOperAuthSet`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": []
});

var getTopMenu = Mock.mock(`${http.gwApiPrefix}/api/system/admin/resource/topmenu`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": [
        {
            "id": 3,
            "appId": 1,
            "parentId": 0,
            "actions": {},
            "child": [],
            "level": 0,
            "name": "首页",
            "description": "首页",
            "label": "home",
            "url": "/home/index",
            "icon": "",
            "method": "create",
            "orderNum": 4
        },
        {
            "id": 2,
            "appId": 1,
            "parentId": 0,
            "actions": {},
            "child": [],
            "level": 0,
            "name": "监控告警",
            "description": "监控告警",
            "label": "monitor",
            "url": "/monitor/pay/group",
            "icon": "",
            "method": "create",
            "orderNum": 4
        },
        {
            "id": 1,
            "appId": 1,
            "parentId": 0,
            "actions": {},
            "child": [],
            "level": 0,
            "name": "数据查询",
            "description": "数据查询",
            "label": "business",
            "url": "/business/pay/group",
            "icon": "home",
            "method": "get",
            "orderNum": 1
        },
    ]
});


var getLeftMenu = Mock.mock(`${http.gwApiPrefix}/api/system/admin/resource/leftmenu`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": {
        '1': [
            {
                "id": 2,
                "appId": 1,
                "parentId": 1,
                "actions": {
                },
                "child": [{
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "统一支付系统",
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
                "icon": "pay-circle",
                "method": "ALL"
            },
            {
                "id": 2,
                "appId": 1,
                "parentId": 1,
                "actions": {
                },
                "child": [{
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "短信系统",
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
                "icon": "message",
                "method": "ALL"
            },
            {
                "id": 54,
                "appId": 1,
                "parentId": 1,
                "actions": {},
                "child": [],
                "level": 1,
                "name": "日志查询检索",
                "label": "business-log-index",
                "url": "/business/log/index",
                "icon": "file-text",
                "method": ""
            }
        ],
        '2': [
            {
                "id": 2,
                "appId": 1,
                "parentId": 1,
                "actions": {
                },
                "child": [{
                    "id": 34,
                    "appId": 1,
                    "parentId": 37,
                    "actions": {},
                    "child": [],
                    "level": 1,
                    "name": "统一支付系统",
                    "label": "monitor-pay-group",
                    "url": "/monitor/pay/group",
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
                    "label": "monitor-pay-pre",
                    "url": "/monitor/pay/pre",
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
                    "label": "monitor-pay-unit",
                    "url": "/monitor/pay/unit",
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
                    "label": "monitor-pay-esb",
                    "url": "/monitor/pay/esb",
                    "icon": "tool",
                    "method": "",
                    "orderNum": 2
                },
                ],
                "level": 0,
                "name": "统一支付",
                "description": "统一支付",
                "label": "monitor-pay",
                "url": "/monitor/pay",
                "icon": "pay-circle",
                "method": "ALL"
            },
            // {
            //     "id": 2,
            //     "appId": 1,
            //     "parentId": 1,
            //     "actions": {
            //     },
            //     "child": [
            //         {
            //             "id": 34,
            //             "appId": 1,
            //             "parentId": 37,
            //             "actions": {},
            //             "child": [],
            //             "level": 1,
            //             "name": "短信系统",
            //             "label": "monitor-sms-index",
            //             "url": "/monitor/sms/index",
            //             "icon": "tool",
            //             "method": "",
            //             "orderNum": 2
            //         },
            //     ],
            //     "level": 0,
            //     "name": "短信",
            //     "description": "短信",
            //     "label": "monitor-sms",
            //     "url": "/monitor/sms",
            //     "icon": "message",
            //     "method": "ALL"
            // },
            {
                "id": 2,
                "appId": 1,
                "parentId": 1,
                "actions": {
                },
                "child": [
                    {
                        "id": 34,
                        "appId": 1,
                        "parentId": 37,
                        "actions": {},
                        "child": [],
                        "level": 1,
                        "name": "告警信息",
                        "label": "monitor-alert-index",
                        "url": "/monitor/alert/index",
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
                        "name": "阀值设定",
                        "label": "monitor-alert-setting",
                        "url": "/monitor/alert/setting",
                        "icon": "tool",
                        "method": "",
                        "orderNum": 2
                    },
                ],
                "level": 0,
                "name": "告警",
                "description": "告警",
                "label": "monitor-alert",
                "url": "/monitor/alert",
                "icon": "warning",
                "method": "ALL"
            }
        ],
        '3': [
            {
                "id": 2,
                "appId": 1,
                "parentId": 1,
                "actions": {
                },
                "child": [
                ],
                "level": 0,
                "name": "驾驶舱",
                "description": "驾驶舱",
                "label": "home-index",
                "url": "/home/index",
                "icon": "dashboard",
                "method": "ALL"
            },
        ],
    }
});

var payFindByTradeNoList = Mock.mock(`${http.gwApiPrefix}/api/callChain/findByTradeNo`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": {
        resource: {
            front: {
                "id": "1",
                "beginDate": "1",
                "endDate": "1",
                "takeTimes": 11,
                "finishFlag": 1,
                "hostIp": "192.169.0.1",
                "sourceIp": "1",
                "tradeNo": "1",
                "processId": "1",
                "logFile": "frontfrontfrontfrontfront",
                "content": "1",
                "clusterSign": "front",
                "uuid": "1",
                "snum": 1
            },
            service: {
                "id": "1",
                "beginDate": "1",
                "endDate": "1",
                "takeTimes": 11,
                "finishFlag": 1,
                "hostIp": "192.169.0.1",
                "sourceIp": "1",
                "tradeNo": "1",
                "processId": "1",
                "logFile": "qqq",
                "content": "1",
                "clusterSign": "front",
                "uuid": "1",
                "snum": 1
            }
        },
        mapping: [
            {
                logFile: 'qqq',
                serviceName: 'aaaa'
            },
            {
                logFile: 'asfda',
                serviceName: 'bbbb'
            },
        ],
        content: {
            '1': 'afdsafasssasfasf',
            '3': '的',
            '5': 'wwwww'
        }
    }
});


var getLog = Mock.mock(`${http.gwApiPrefix}/api/getLog`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": {
        'content': 'eyJzdWIiOiJhZG1pbiIsImF1ZCI6IndlYiIsImlzcyI6IjEiLCJleHAiOjE1NjcwMDMxMjMsImlhdCI6MTU2NzAwMTMyM30'
    }
});

var getPayGroupMonitorData = Mock.mock(`${http.gwApiPrefix}/api/streaming/loadClusters`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": [
        {
            clusterName: 'front',
            tradeCount: 100,
            totalTime: 200,
            avgTime: 300
        },
        {
            clusterName: 'td1',
            tradeCount: 100,
            totalTime: 200,
            avgTime: 300
        }
    ]
});

var getSmsAllData = Mock.mock(`${http.gwApiPrefix}/bpc/msg/index`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": [
        {
            name: 'MQ',
            sendCount: 100,
            totalTimes: 200
        }
    ]
});

var getPayGroupData_TD = Mock.mock(`${http.gwApiPrefix}/BPC/streaming/loadClusters`, {
    "resultCode": 1000,
    "resultMessage": "操作成功",
    "result": [
        {
            name: 'front',
            duration: 0,
            code: 1,
            type: '',
            trans_count: 0
        },
        {
            name: 'esb',
            duration: 0,
            code: 3,
            type: '',
            trans_count: 0
        }
    ]
});

export { logList, payChainList, smsChainList, login, getAuthAction, getTopMenu, getLeftMenu, alertList, alertSettingList, payFindByTradeNoList, getLog, getPayGroupMonitorData, getSmsAllData, getPayGroupData_TD }

