/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:48:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 16:22:49
 * @Description: 路由配置文件
 */
import Loadable from 'react-loadable'
import DelayLoading from '@/components/delay-loading/Index'

// 农信应用监控poc
// 数据查询
// 数据查询 > 统一支付
const Home = Loadable({ loader: () => import('@/routers/business/home/Index'), loading: DelayLoading, delay: 3000 });
const PayGroup = Loadable({ loader: () => import('@/routers/business/pay/Group'), loading: DelayLoading, delay: 3000 });
const PayDetail = Loadable({ loader: () => import('@/routers/business/pay/Detail'), loading: DelayLoading, delay: 3000 });
const PayDetailESB = Loadable({ loader: () => import('@/routers/business/pay/ESB'), loading: DelayLoading, delay: 3000 });
const PayChain = Loadable({ loader: () => import('@/routers/business/pay/Chain'), loading: DelayLoading, delay: 3000 });
// 数据查询 > 短信
const SmsIndex = Loadable({ loader: () => import('@/routers/business/sms/Index'), loading: DelayLoading, delay: 3000 });
const SmsChain = Loadable({ loader: () => import('@/routers/business/sms/Chain'), loading: DelayLoading, delay: 3000 });
// 数据查询 > 日志查询检索
const Log = Loadable({ loader: () => import('@/routers/business/log/Index'), loading: DelayLoading, delay: 0 });
// 数据查询 > 指标统计与展示
// 监控告警
// 监控告警 > 统一支付
const PayGroup_monitor = Loadable({ loader: () => import('@/routers/monitor/pay/Group'), loading: DelayLoading, delay: 3000 });
const PayDetail_monitor = Loadable({ loader: () => import('@/routers/monitor/pay/Detail'), loading: DelayLoading, delay: 3000 });
const PayDetailESB_monitor = Loadable({ loader: () => import('@/routers/monitor/pay/ESB'), loading: DelayLoading, delay: 3000 });
// 监控告警 > 短信
const SmsIndex_monitor = Loadable({ loader: () => import('@/routers/monitor/sms/Index'), loading: DelayLoading, delay: 3000 });
// 监控告警 > 告警
const AlertIndex = Loadable({ loader: () => import('@/routers/monitor/alert/Index'), loading: DelayLoading, delay: 3000 });
const AlertSetting = Loadable({ loader: () => import('@/routers/monitor/alert/Setting'), loading: DelayLoading, delay: 3000 });

export default [
    {
        'path': '/home/index',
        'component': Home,
        'meta': {
            'title': '监控告警',
            'descript': '这里是监控告警',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '监控告警', 'path': null }]
        }
    },
    {
        'path': '/business/log/index',
        'component': Log,
        'meta': {
            'title': '日志查询检索',
            'descript': '这里是日志查询检索',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '日志查询检索', 'path': null }]
        }
    },
    // 监控告警 start
    {
        'path': '/monitor/sms/index',
        'component': SmsIndex_monitor,
        'meta': {
            'title': '统一支付系统',
            'descript': '这里是统一支付系统',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': '统一支付系统', 'path': null }]
        }
    }, 
    {
        'path': '/monitor/pay/pre',
        'component': PayDetail_monitor,
        'meta': {
            'title': '前置',
            'descript': '这里是前置',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': '前置', 'path': null }]
        }
    }, 
    {
        'path': '/monitor/pay/unit',
        'component': PayDetail_monitor,
        'meta': {
            'title': '联机',
            'descript': '这里是联机',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': '联机', 'path': null }]
        }
    }, 
    {
        'path': '/monitor/pay/esb',
        'component': PayDetailESB_monitor,
        'meta': {
            'title': 'ESB',
            'descript': '这里是ESB',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': 'ESB', 'path': null }]
        }
    }, 
    {
        'path': '/monitor/pay/group',
        'component': PayGroup_monitor,
        'meta': {
            'title': '集群',
            'descript': '这里是集群',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': '集群', 'path': null }]
        }
    }, 
    {
        'path': '/monitor/alert/index',
        'component': AlertIndex,
        'meta': {
            'title': '告警信息',
            'descript': '这里是告警信息',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': '集群', 'path': null }]
        }
    }, 
    {
        'path': '/monitor/alert/setting',
        'component': AlertSetting,
        'meta': {
            'title': '告警信息',
            'descript': '这里是告警信息',
            'nav': [{ 'name': '监控告警', 'path': '/monitor/pay/group' }, { 'name': '集群', 'path': null }]
        }
    }, 
    // 监控告警 end
    // 数据查询 start
    {
        'path': '/business/sms/index',
        'component': SmsIndex,
        'meta': {
            'title': '统一支付系统',
            'descript': '这里是统一支付系统',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '统一支付系统', 'path': null }]
        }
    }, 
    {
        'path': '/business/sms/chain',
        'component': SmsChain,
        'meta': {
            'title': '调用链查询',
            'descript': '这里是调用链查询',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '调用链查询', 'path': null }]
        }
    }, 
    {
        'path': '/business/pay/chain',
        'component': PayChain,
        'meta': {
            'title': '调用链查询',
            'descript': '这里是调用链查询',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '调用链查询', 'path': null }]
        }
    }, 
    {
        'path': '/business/pay/pre',
        'component': PayDetail,
        'meta': {
            'title': '前置',
            'descript': '这里是前置',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '前置', 'path': null }]
        }
    }, 
    {
        'path': '/business/pay/unit',
        'component': PayDetail,
        'meta': {
            'title': '联机',
            'descript': '这里是联机',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '联机', 'path': null }]
        }
    }, 
    {
        'path': '/business/pay/esb',
        'component': PayDetailESB,
        'meta': {
            'title': 'ESB',
            'descript': '这里是ESB',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': 'ESB', 'path': null }]
        }
    }, 
    {
        'path': '/business/pay/group',
        'component': PayGroup,
        'meta': {
            'title': '集群',
            'descript': '这里是集群',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '集群', 'path': null }]
        }
    }, 
    // 数据查询 end
];