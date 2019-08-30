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
    "resultList|10": [
      {
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
      }
    ]
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
    "resultList|10": [
      {
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
      }
    ]
  }
});

var smsChainList = Mock.mock(`${http.gwApiPrefix}/api/smsChain/list`, {
  "resultCode": 1000,
  "resultMessage": "操作成功",
  "pageList": {
    "curPageNO": 0,
    "offset": 10,
    "pageCount": 5,
    "sum": 100,
    "resultList|10": [
      {
        'id': '@natural',
        'time': '@datetime', //日期
        'templateId': '@string("lower", 5)',
        'mobile': '@natural',
        'smsContent': '@cparagraph'
      }
    ]
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
      "orgName": "开发部",
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
});


var getLeftMenu = Mock.mock(`${http.gwApiPrefix}/api/system/admin/resource/leftmenu`, {
  "resultCode": 1000,
  "resultMessage": "操作成功",
  "result": {
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
});

export { logList, payChainList, smsChainList, login, getAuthAction, getTopMenu, getLeftMenu }
