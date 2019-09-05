/*
 * @Author: zengzijian
 * @Date: 2018-07-24 15:48:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 16:22:49
 * @Description: 路由配置文件
 */
import Loadable from 'react-loadable'
import DelayLoading from '@/components/delay-loading/Index'

// 业务管理
// 业务管理-变量管理
const Event = Loadable({ loader: () => import('@/routers/business/variable/event/Index'), loading: DelayLoading, delay: 3000 });
const Batch = Loadable({ loader: () => import('@/routers/business/variable/batch/Index'), loading: DelayLoading, delay: 3000 });
const BatchSave = Loadable({ loader: () => import('@/routers/business/variable/batch/Save'), loading: DelayLoading, delay: 3000 });
const RealTimeQuery2_0 = Loadable({ loader: () => import('@/routers/business/variable/real-time-query/Index2.0'), loading: DelayLoading, delay: 0 });
const RealTimeQuerySave2_0 = Loadable({ loader: () => import('@/routers/business/variable/real-time-query/Save2.0'), loading: DelayLoading, delay: 3000 });
const Derivation = Loadable({ loader: () => import('@/routers/business/variable/derivation/Index'), loading: DelayLoading, delay: 3000 });
const DerivationSaveFunc = Loadable({ loader: () => import('@/routers/business/variable/derivation/SaveFunc'), loading: DelayLoading, delay: 3000 });
const DerivationSaveCount = Loadable({ loader: () => import('@/routers/business/variable/derivation/SaveCount'), loading: DelayLoading, delay: 3000 });
const DerivationSaveRegular = Loadable({ loader: () => import('@/routers/business/variable/derivation/SaveRegular'), loading: DelayLoading, delay: 3000 });

// 业务管理
// 业务管理-策略定义
const Definition = Loadable({ loader: () => import('@/routers/business/strategy/definition/Index'), loading: DelayLoading, delay: 3000 });
const DefinitionSave2_0 = Loadable({ loader: () => import('@/routers/business/strategy/definition/Save2.0'), loading: DelayLoading, delay: 3000 });
const Rule = Loadable({ loader: () => import('@/routers/business/strategy/rule/Index'), loading: DelayLoading, delay: 3000 });
const RuleSave2_0 = Loadable({ loader: () => import('@/routers/business/strategy/rule/Save2.0'), loading: DelayLoading, delay: 3000 });
const RuleDetails = Loadable({ loader: () => import('@/routers/business/strategy/rule/Details'), loading: DelayLoading, delay: 3000 });
const RuleSet = Loadable({ loader: () => import('@/routers/business/strategy/rule-set/Index'), loading: DelayLoading, delay: 3000 });
const RuleSetSave = Loadable({ loader: () => import('@/routers/business/strategy/rule-set/Save'), loading: DelayLoading, delay: 3000 });
const RuleSetDetails = Loadable({ loader: () => import('@/routers/business/strategy/rule-set/Details'), loading: DelayLoading, delay: 3000 });
const OutPut = Loadable({ loader: () => import('@/routers/business/strategy/output/Index'), loading: DelayLoading, delay: 3000 });
const OutPutSave = Loadable({ loader: () => import('@/routers/business/strategy/output/Save'), loading: DelayLoading, delay: 3000 });
const StrategyTableIndex = Loadable({ loader: () => import('@/routers/business/strategy/table/Index'), loading: DelayLoading, delay: 3000 });
const SaveStrategyTable = Loadable({ loader: () => import('@/routers/business/strategy/table/Save'), loading: DelayLoading, delay: 3000 });
const StrategyTableDetail = Loadable({ loader: () => import('@/routers/business/strategy/table/Detail'), loading: DelayLoading, delay: 3000 });
const StrategyScoreCardIndex = Loadable({ loader: () => import('@/routers/business/strategy/score-card/Index'), loading: DelayLoading, delay: 3000 });
const SaveStrategyScoreCard = Loadable({ loader: () => import('@/routers/business/strategy/score-card/Save'), loading: DelayLoading, delay: 3000 });
const StrategyCardDetail = Loadable({ loader: () => import('@/routers/business/strategy/score-card/Detail'), loading: DelayLoading, delay: 3000 });

// 业务管理-策略发布
// 业务管理-策略发布-策略包
const StrategyPackage = Loadable({ loader: () => import('@/routers/business/release/package/Index'), loading: DelayLoading, delay: 3000 });
const StrategyPackageSave = Loadable({ loader: () => import('@/routers/business/release/package/Save'), loading: DelayLoading, delay: 3000 });
const StrategyPackageDetail = Loadable({ loader: () => import('@/routers/business/release/package/Detail'), loading: DelayLoading, delay: 3000 });
const StrategyResourceDetail = Loadable({ loader: () => import('@/routers/business/release/package/ResourceDetail'), loading: DelayLoading, delay: 3000 });

// 业务管理-策略发布-策略包审核
const StrategyPackageAudit = Loadable({ loader: () => import('@/routers/business/release/audit/Strategy'), loading: DelayLoading, delay: 3000 });
// 业务管理-策略发布-策略包权重
const StrategyPackageWeight = Loadable({ loader: () => import('@/routers/business/release/weight/Index'), loading: DelayLoading, delay: 3000 });

// 业务管理-模版管理
const Template = Loadable({ loader: () => import('@/routers/business/template/Index'), loading: DelayLoading, delay: 3000 });
// 业务管理-审核管理
const ApprovalRtq = Loadable({ loader: () => import('@/routers/business/approval/Rtq'), loading: DelayLoading, delay: 3000 });
const ApprovalExt = Loadable({ loader: () => import('@/routers/business/approval/Ext'), loading: DelayLoading, delay: 3000 });
const ApprovalRule = Loadable({ loader: () => import('@/routers/business/approval/Rule'), loading: DelayLoading, delay: 3000 });
const ApprovalRuleSet = Loadable({ loader: () => import('@/routers/business/approval/RuleSet'), loading: DelayLoading, delay: 3000 });
const ApprovalStrategy = Loadable({ loader: () => import('@/routers/business/approval/Strategy'), loading: DelayLoading, delay: 3000 });
// 业务管理-测试管理
const TestingList = Loadable({ loader: () => import('@/routers/business/testing/list/Index'), loading: DelayLoading, delay: 3000 });
const TestingResult = Loadable({ loader: () => import('@/routers/business/testing/result/Index'), loading: DelayLoading, delay: 3000 });
const QuickTesting = Loadable({ loader: () => import('@/routers/business/testing/quick-testing/Index'), loading: DelayLoading, delay: 3000 });
const TestPlanList = Loadable({ loader: () => import('@/routers/business/testing/plan-list/Index'), loading: DelayLoading, delay: 3000 });
const TestPlanSave = Loadable({ loader: () => import('@/routers/business/testing/plan-save/Index'), loading: DelayLoading, delay: 3000 });

// 数据分析
// 数据大盘
const DataGraphics = Loadable({ loader: () => import('@/routers/analysis/data-graphics/Index'), loading: DelayLoading, delay: 3000 });
// 数据分析-事件分析
const EventAnalysis = Loadable({ loader: () => import('@/routers/analysis/event/analysis/Index'), loading: DelayLoading, delay: 3000 });
const EventDetails = Loadable({ loader: () => import('@/routers/analysis/event/details/Index'), loading: DelayLoading, delay: 3000 });
const StrategyMonior = Loadable({ loader: () => import('@/routers/analysis/monitor/Index'), loading: DelayLoading, delay: 3000 });
const StrategySimulation = Loadable({ loader: () => import('@/routers/analysis/simulation/Index'), loading: DelayLoading, delay: 3000 });
// 策略分析
const StrategyAnalysis = Loadable({ loader: () => import('@/routers/analysis/strategy-analysis/Index'), loading: DelayLoading, delay: 3000 });
//系统管理
//系统管理-权限管理-通讯录
const MemberIndex = Loadable({ loader: () => import('@/routers/system/auth/member/Index'), loading: DelayLoading, delay: 3000 });
//系统管理-权限管理-分组管理
const GroupIndex = Loadable({ loader: () => import('@/routers/system/auth/group/Index'), loading: DelayLoading, delay: 3000 });
//系统管理-权限管理-菜单目录
const PowerIndex = Loadable({ loader: () => import('@/routers/system/auth/power/Index'), loading: DelayLoading, delay: 3000 });
//系统管理-权限管理-机构管理
const OrganizationIndex = Loadable({ loader: () => import('@/routers/system/auth/organization/Index'), loading: DelayLoading, delay: 3000 });
//元数据管理
//系统管理-元数据管理-维度定义
const DimensionConfigIndex = Loadable({ loader: () => import('@/routers/system/config2/dimensionConfig/Index'), loading: DelayLoading, delay: 3000 });
//系统管理-元数据管理-维度定义
// const DimensionConfigIndexSave = Loadable({ loader: () => import('@/routers/system/config2/dimensionConfig/Save'), loading: DelayLoading, delay: 3000 });
//系统管理-事件源定义
const SystemEventSource = Loadable({ loader: () => import('@/routers/system/event-source/Index'), loading: DelayLoading, delay: 3000 });
const SystemEventSourceDetails = Loadable({ loader: () => import('@/routers/system/event-source/Details'), loading: DelayLoading, delay: 3000 });
const SystemEventSourceDetailsMapping = Loadable({ loader: () => import('@/routers/system/event-source/DetailsMapping'), loading: DelayLoading, delay: 3000 });
//系统管理-源数据管理-表结构(库表定义)
const SystemTableStructure = Loadable({ loader: () => import('@/routers/system/config2/tableStructure/Index'), loading: DelayLoading, delay: 3000 });
const SystemTableStructureSave = Loadable({ loader: () => import('@/routers/system/config2/tableStructure/Save'), loading: DelayLoading, delay: 3000 });
const SystemTableDetail = Loadable({ loader: () => import('@/routers/system/config2/tableStructure/Detail'), loading: DelayLoading, delay: 3000 });

//系统管理-元数据管理
//系统管理-元数据管理-系统变量
const SystemConfigSystemVar = Loadable({ loader: () => import('@/routers/system/config/system-var/Index'), loading: DelayLoading, delay: 3000 });
//系统管理-元数据管理-系统变量
const SystemConfigEvent = Loadable({ loader: () => import('@/routers/system/config/event/Index'), loading: DelayLoading, delay: 3000 });
//系统管理-配置管理-任务配置
const SystemConfigTask = Loadable({ loader: () => import('@/routers/system/config/task/Index'), loading: DelayLoading, delay: 3000 });

// 农信应用监控poc
// 数据查询
// 数据查询 > 统一支付
const Home = Loadable({ loader: () => import('@/routers/business/home/Index'), loading: DelayLoading, delay: 3000 });
const PayGroup = Loadable({ loader: () => import('@/routers/business/pay/Group'), loading: DelayLoading, delay: 3000 });
const PayDetail = Loadable({ loader: () => import('@/routers/business/pay/Detail'), loading: DelayLoading, delay: 3000 });
const PayChain = Loadable({ loader: () => import('@/routers/business/pay/Chain'), loading: DelayLoading, delay: 3000 });
// 数据查询 > 短信
const SmsIndex = Loadable({ loader: () => import('@/routers/business/sms/Index'), loading: DelayLoading, delay: 3000 });
const SmsChain = Loadable({ loader: () => import('@/routers/business/sms/Chain'), loading: DelayLoading, delay: 3000 });
// 数据查询 > 日志查询检索
const Log = Loadable({ loader: () => import('@/routers/business/log/Index'), loading: DelayLoading, delay: 0 });
// 数据查询 > 指标统计与展示
const Charts = Loadable({ loader: () => import('@/routers/business/charts/Index'), loading: DelayLoading, delay: 0 });
// 监控告警
// 监控告警 > 统一支付
const PayGroup_monitor = Loadable({ loader: () => import('@/routers/monitor/pay/Group'), loading: DelayLoading, delay: 3000 });
const PayDetail_monitor = Loadable({ loader: () => import('@/routers/monitor/pay/Detail'), loading: DelayLoading, delay: 3000 });
// 监控告警 > 短信
const SmsIndex_monitor = Loadable({ loader: () => import('@/routers/monitor/sms/Index'), loading: DelayLoading, delay: 3000 });
// 监控告警 > 告警
const AlertIndex = Loadable({ loader: () => import('@/routers/monitor/alert/Index'), loading: DelayLoading, delay: 3000 });
const AlertSetting = Loadable({ loader: () => import('@/routers/monitor/alert/Setting'), loading: DelayLoading, delay: 3000 });

export default [
    {
        'path': '/business/home',
        'component': Home,
        'meta': {
            'title': '监控告警',
            'descript': '这里是监控告警',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '监控告警', 'path': null }]
        }
    },
    {
        'path': '/business/charts/index',
        'component': Charts,
        'meta': {
            'title': '指标统计与展示',
            'descript': '这里是指标统计与展示',
            'nav': [{ 'name': '数据查询', 'path': '/business/home' }, { 'name': '指标统计与展示', 'path': null }]
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
        'component': PayDetail_monitor,
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
        'component': PayDetail,
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
    {
        'path': '/business/variable/event',
        'component': Event,
        'meta': {
            'title': '事件变量',
            'descript': '展示了事件源报文协议字段和变量的关联关系，为系统自动自动生成',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '事件变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/batch',
        'component': Batch,
        'meta': {
            'title': '批次变量',
            'descript': '批次变量是由外部离线平台导入的变量，在业务的变量和规则的定义中会使用到',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '批次变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/derivation',
        'component': Derivation,
        'meta': {
            'title': '衍生变量',
            'descript': '根据已有变量制作新变量',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/batch/save',//和下面加参数区别是生命周期的完全访问
        'component': BatchSave,
        'meta': {
            'title': '批次变量',
            'descript': '新增批次变量',
            'saveType': 'batch',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '批次变量', 'path': '/business/variable/batch' }, { 'name': '新增', 'path': null }],
        }
    },
    {
        'path': '/business/variable/batch/save/:id',
        'component': BatchSave,
        'meta': {
            'title': '批次变量',
            'descript': '编辑批次变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '批次变量', 'path': '/business/variable/batch' }, { 'name': '编辑', 'path': null }],
        }
    },
    {
        'path': '/business/variable/real-time-query',
        'component': RealTimeQuery2_0,
        'meta': {
            'title': '实时查询变量',
            'descript': '可引用事件变量和批次变量，也可查询内存数据库中保存的热数据',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': null }]
        }
    },
    {
        'path': '/business/variable/real-time-query/save2.0/:rtqVarType',
        'component': RealTimeQuerySave2_0,
        'meta': {
            'title': '实时查询变量',
            'descript': '正在编辑实时查询变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': '/business/variable/real-time-query' }, { 'name': '新增', 'path': null }],
        }
    },
    {
        'path': '/business/variable/real-time-query/save2.0/:type/:rtqVarType/:id',
        'component': RealTimeQuerySave2_0,
        'meta': {
            'title': '实时查询变量',
            'descript': '正在编辑实时查询变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': '/business/variable/real-time-query' }, { 'name': '编辑', 'path': null }],
            'btns': [{ name: '测试' }, { name: '总览' }, { name: '版本' }],
        }
    },
    {
        'path': '/business/release/rtqVar/detail/:type/:rtqVarType/:id',
        'component': RealTimeQuerySave2_0,
        'meta': {
            'title': '实时查询变量',
            'descript': '正在编辑实时查询变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': null }, { 'name': '查看资源', 'path': null }, { 'name': '实时查询变量', 'path': null }],
        }
    },
    {
        'path': '/business/variable/real-time-query/save2.0/:type/:rtqVarType/:id',
        'component': RealTimeQuerySave2_0,
        'meta': {
            'title': '实时查询变量',
            'descript': '正在编辑实时查询变量',
            'saveType': 'real-time-query',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '实时查询变量', 'path': '/business/variable/real-time-query' }, { 'name': '编辑', 'path': null }],
            'btns': [{ name: '测试' }, { name: '总览' }, { name: '版本' }],
        }
    },
    {
        'path': '/business/strategy/rule/save',//和下面加参数区别是生命周期的完全访问
        // 'component': RuleSave,
        
        'component': RuleSave2_0,
        'meta': {
            'title': '规则',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'rule',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则', 'path': '/business/strategy/rule' }, { 'name': '新增', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule/save/:type/:id',//type:1自定义，2使用模板
        // 'component': RuleSave,
        'component': RuleSave2_0,
        'meta': {
            'title': '规则',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'rule',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则', 'path': '/business/strategy/rule' }, { 'name': '编辑', 'path': null }],
            'btns': [{ name: '测试' }, { name: '总览' }, { name: '版本' }]
        }
    },
    {
        'path': '/business/strategy/rule/details/:id',
        // 'component': RuleSave,
        'component': RuleDetails,
        'meta': {
            'title': '规则',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'rule-view',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则', 'path': '/business/strategy/rule' }, { 'name': '详情', 'path': null }],
            'btns': [{ name: '测试' }, { name: '总览' }, { name: '版本' }]
        }
    },
    {
        'path': '/business/release/rule/details/:id',
        'component': RuleDetails,
        'meta': {
            'title': '规则',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'rule-view',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '查看资源', 'path': null }],
        }
    },
    {
        'path': '/business/variable/derivation/save-func/:id?',
        'component': DerivationSaveFunc,
        'meta': {
            'title': '衍生变量',
            'descript': '正在编辑函数变量',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': '/business/variable/derivation' }, { 'name': '函数变量编辑', 'path': null }]
        }
    },
    {
        'path': '/business/variable/derivation/save-count/:id?',
        'component': DerivationSaveCount,
        'meta': {
            'title': '衍生变量',
            'descript': '正在编辑计算变量',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': '/business/variable/derivation' }, { 'name': '计算变量编辑', 'path': null }]
        }
    },
    {
        'path': '/business/release/extVar/:id',
        'component': DerivationSaveCount,
        'meta': {
            'title': '衍生变量',
            'descript': '正在查看计算变量',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '查看资源', 'path': null }]
        }
    },
    {
        'path': '/business/variable/derivation/save-regular/:id?',
        'component': DerivationSaveRegular,
        'meta': {
            'title': '衍生变量',
            'descript': '正在编辑正则变量',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '变量管理', 'path': null }, { 'name': '衍生变量', 'path': '/business/variable/derivation' }, { 'name': '正则变量编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/definition',
        'component': Definition,
        'meta': {
            'title': '决策流',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '决策流', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/definition/save',
        'component': DefinitionSave2_0,
        'meta': {
            'title': '决策流',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'saveType': 'definition',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '决策流', 'path': '/business/strategy/definition/' }, { 'name': '新增', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/definition/save/:type/:id',
        'component': DefinitionSave2_0,
        'meta': {
            'title': '决策流',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'saveType': 'definition',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '决策流', 'path': '/business/strategy/definition/' }, { 'name': '编辑', 'path': null }],
            'btns': [{ name: '测试' }, { name: '总览' }, { name: '版本' }]
        }
    },
    {
        'path': '/business/release/definition/:type/:id',
        'component': DefinitionSave2_0,
        'meta': {
            'title': '决策流',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'saveType': 'definition',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': null }, { 'name': '查看资源', 'path': null }, { 'name': '决策流', 'path': null }],
        }
    },
    {
        'path': '/business/testing/list',
        'component': TestingList,
        'meta': {
            'title': '测试列表',
            'descript': '',
            'nav': [
                { 'name': '策略中心', 'path': '/business/home' },
                { 'name': '策略测试', 'path': null },
                { 'name': '测试列表', 'path': null }]
        }
    },
    {
        'path': '/business/testing/result',
        'component': TestingResult,
        'meta': {
            'title': '测试结果',
            'descript': '',
            'nav': [
                { 'name': '策略中心', 'path': '/business/home' },
                { 'name': '策略测试', 'path': null },
                { 'name': '测试结果', 'path': null }]
        }
    },
    {
        'path': '/business/testing/list/test/:id',
        'component': QuickTesting,
        'meta': {
            'title': '测试列表',
            'descript': '快速测试',
            'nav': [
                { 'name': '业务管理', 'path': '/business/home' },
                { 'name': '策略测试', 'path': null },
                { 'name': '测试列表', 'path': '/business/testing/list' },
                { 'name': '快速测试', 'path': null }]
        }
    },
    {
        'path': '/business/testing/list/:testId/plan',
        'component': TestPlanList,
        'meta': {
            'title': '测试列表',
            'descript': '测试方案列表',
            'nav': [
                { 'name': '业务管理', 'path': '/business/home' },
                { 'name': '策略测试', 'path': null },
                { 'name': '测试列表', 'path': '/business/testing/list' }]
        }
    },
    {
        'path': '/business/testing/list/:testId/plan/save/:id?',
        'component': TestPlanSave,
        'meta': {
            'title': '测试列表',
            'descript': '正在编辑测试方案',
            'nav': [
                { 'name': '业务管理', 'path': '/business/home' },
                { 'name': '策略测试', 'path': null },
                { 'name': '测试列表', 'path': '/business/testing/list/' },
                { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule',
        'component': Rule,
        'meta': {
            'title': '规则',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule-set',
        'component': RuleSet,
        'meta': {
            'title': '规则集',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则集', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/rule-set/save/:type/:id?',
        'component': RuleSetSave,
        'meta': {
            'title': '规则集',
            'descript': '通过定义存储过程规则，使实时消息数据经规则计算处理后生成实时决策',
            'saveType': 'ruleSet',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则集', 'path': '/business/strategy/rule-set' }, { 'name': '编辑', 'path': null }],
            'btns': [{ name: '版本' }]
        }
    },
    {
        'path': '/business/strategy/rule-set/details/:id',
        'component': RuleSetDetails,
        'meta': {
            'title': '规则集',
            'descript': '正在查看',
            'saveType': 'ruleSet-view',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '规则集', 'path': '/business/strategy/rule-set' }, { 'name': '查看', 'path': null }],
            'btns': [{ name: '版本' },{ name: '总览' }]
        }
    },
    {
        'path': '/business/release/rule-set/details/:id',
        'component': RuleSetDetails,
        'meta': {
            'title': '规则集',
            'descript': '正在查看',
            'saveType': 'ruleSet-view',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '查看资源', 'path': null }],
            'btns': [{ name: '总览' }]
        }
    },
    {
        'path': '/business/variable/output',
        'component': OutPut,
        'meta': {
            'title': '参数定义',
            'descript': '参数列表',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '参数定义', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/output/save/:id?',
        'component': OutPutSave,
        'meta': {
            'title': '输出结果',
            'descript': '新建输出结果',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略定义', 'path': null }, { 'name': '输出结果', 'path': '/business/strategy/output' }]
        }
    },
    {
        'path': '/business/template',
        'component': Template,
        'meta': {
            'title': '模版管理',
            'descript': '',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '模版管理', 'path': null }]
        }
    },
    {
        'path': '/business/approval/rtq',
        'component': ApprovalRtq,
        'meta': {
            'title': '实时查询变量',
            'descript': '可编辑审核状态',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '审核管理', 'path': null }, { 'name': '实时查询变量', 'path': null }]
        }
    },
    {
        'path': '/business/approval/ext',
        'component': ApprovalExt,
        'meta': {
            'title': '衍生变量',
            'descript': '可编辑审核状态',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '审核管理', 'path': null }, { 'name': '衍生变量', 'path': null }]
        }
    },
    {
        'path': '/business/approval/rule',
        'component': ApprovalRule,
        'meta': {
            'title': '规则',
            'descript': '可编辑审核状态',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '审核管理', 'path': null }, { 'name': '规则', 'path': null }]
        }
    },
    {
        'path': '/business/approval/rule-set',
        'component': ApprovalRuleSet,
        'meta': {
            'title': '规则集',
            'descript': '可编辑审核状态',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '审核管理', 'path': null }, { 'name': '规则集', 'path': null }]
        }
    },
    {
        'path': '/business/approval/strategy',
        'component': ApprovalStrategy,
        'meta': {
            'title': '策略',
            'descript': '可编辑审核状态',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '审核管理', 'path': null }, { 'name': '策略', 'path': null }]
        }
    },
    {
        'path': '/analysis/event/home',
        'component': EventAnalysis,
        'meta': {
            'title': '',
            'descript': '',
            'nav': []
        }
    },
    {
        'path': '/analysis/event/home/:eventSourceType',
        'component': EventAnalysis,
        'meta': {
            'title': '',
            'descript': '',
            'nav': []
        }
    },
    {
        'path': '/analysis/event/details',
        'component': EventDetails,
        'meta': {
            'title': '',
            'descript': '',
            'nav': []
        }
    },
    {
        'path': '/analysis/monitor',
        'component': StrategyMonior,
        'meta': {
            'title': '策略监控',
            'descript': '',
            'nav': [{ 'name': '数据中心', 'path': null }, { 'name': '策略监控', 'path': null }, { 'name': '详情', 'path': null }]
        }
    },
    {
        'path': '/analysis/simulation',
        'component': StrategySimulation,
        'meta': {
            'title': '策略模拟',
            'descript': '数据分析策略模拟',
            'nav': [{ 'name': '数据中心', 'path': null }, { 'name': '策略模拟', 'path': null }]
        }
    },
    {
        'path': '/analysis/data-graphics',
        'component': DataGraphics,
        'meta': {
            'title': '数据大盘',
            'descript': '',
            'nav': [{ 'name': '数据中心', 'path': null }, { 'name': '数据大盘', 'path': '/analysis/data-graphics' }]
        }
    },
    {
        'path': '/analysis/strategy-analysis',
        'component': StrategyAnalysis,
        'meta': {
            'title': '策略分析',
            'descript': '',
            'nav': [{ 'name': '数据中心', 'path': null }, { 'name': '策略分析', 'path': '/analysis/strategy-analysis' }]
        }
    },
    {
        'path': '/system/auth/member',
        'component': MemberIndex,
        'meta': {
            'title': '用户管理',
            'descript': '可查看成员的权限明细',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '权限管理', 'path': null }, { 'name': '用户管理', 'path': null }]
        }
    },
    {
        'path': '/system/auth/group',
        'component': GroupIndex,
        'meta': {
            'title': '角色管理',
            'descript': '可分组、配人、赋权，对应到综管中心里',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '权限管理', 'path': null }, { 'name': '角色管理', 'path': null }]
        }
    }, {
        'path': '/system/auth/power',
        'component': PowerIndex,
        'meta': {
            'title': '菜单目录',
            'descript': '按菜单目录查看权限拥有者',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '权限管理', 'path': null }, { 'name': '菜单目录', 'path': null }]
        }
    },
    {
        'path': '/system/auth/organization',
        'component': OrganizationIndex,
        'meta': {
            'title': '机构管理',
            'descript': '按菜单目录查看权限拥有者',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '权限管理', 'path': null }, { 'name': '机构管理', 'path': null }]
        }
    },
    {
        'path': '/system/config2/DimensionConfig',
        'component': DimensionConfigIndex,
        'meta': {
            'title': '维度定义',
            'descript': '',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, { 'name': '维度定义', 'path': null }]
        }
    },
    /*{
        'path': '/system/config2/DimensionConfig/save/:id?',
        'component': DimensionConfigIndexSave,
        'meta': {
            'title': '维度定义',
            'descript': '保存维度',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, { 'name': '维度定义', 'path': '/system/config2/DimensionConfig' }]
        }
    },*/
    {
        'path': '/system/config2/eventSource',
        'component': SystemEventSource,
        'meta': {
            'title': '事件源定义',
            'descript': '',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, { 'name': '事件源定义', 'path': null }]
        }
    },
    {
        'path': '/system/config2/eventSource/eventSourceDetails/:id',
        'component': SystemEventSourceDetails,
        'meta': {
            'title': '事件源定义',
            'descript': '正在编辑事件源管理',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, {
                'name': '事件源定义',
                'path': '/system/config2/eventSource'
            }, { 'name': '编辑事件源', 'path': null }]
        }
    },
    {
        'path': '/system/config2/eventSource/eventSourceDetails',
        'component': SystemEventSourceDetails,
        'meta': {
            'title': '事件源定义',
            'descript': '正在编辑事件源管理',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, {
                'name': '事件源定义',
                'path': '/system/config2/eventSource'
            }, { 'name': '新建事件源', 'path': null }]
        }
    },
    {
        'path': '/system/config2/eventSource/eventSourceDetailsMapping/:id',
        'component': SystemEventSourceDetailsMapping,
        'meta': {
            'title': '事件源定义',
            'descript': '正在编辑事件源管理',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, {
                'name': '事件源定义',
                'path': '/system/config2/eventSource'
            }, { 'name': '维度映射', 'path': null }]
        }
    },
    {
        'path': '/system/config2/tableStructure',
        'component': SystemTableStructure,
        'meta': {
            'title': '库表定义',
            'descript': '',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, { 'name': '库表定义', 'path': null }]
        }
    },
    {
        'path': '/system/config2/tableStructure/save',
        'component': SystemTableStructureSave,
        'meta': {
            'title': '库表定义',
            'descript': '正在编辑库表定义',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, {
                'name': '库表定义',
                'path': '/system/config2/tableStructure'
            }, { 'name': '新建库表', 'path': null }]
        }
    },
    {
        'path': '/system/config2/tableStructure/save/:id?',
        'component': SystemTableStructureSave,
        'meta': {
            'title': '库表定义',
            'descript': '正在编辑库表定义',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, {
                'name': '库表定义',
                'path': '/system/config2/tableStructure'
            }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/system/config2/tableStructure/view/:id?',
        'component': SystemTableDetail,
        'meta': {
            'title': '库表定义查看资源',
            'descript': '正在查看库表',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, { 'name': '库表定义', 'path': '/system/config2/tableStructure' }, { 'name': '查看资源', 'path': null }]
        }
    },
    {
        'path': '/system/config2/systemVar',
        'component': SystemConfigSystemVar,
        'meta': {
            'title': '系统变量',
            'descript': '系统变量列表',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '元数据管理', 'path': null }, { 'name': '系统变量', 'path': null }]
        }
    },
    {
        'path': '/system/config/event',
        'component': SystemConfigEvent,
        'meta': {
            'title': '事件分析配置',
            'descript': '事件分析配置',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '配置管理', 'path': null }, { 'name': '事件分析配置', 'path': null }]
        }
    },
    {
        'path': '/system/config/task',
        'component': SystemConfigTask,
        'meta': {
            'title': '任务配置',
            'descript': '任务配置列表',
            'nav': [{ 'name': '运维中心', 'path': null }, { 'name': '配置管理', 'path': null }, { 'name': '任务配置', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/table',
        'component': StrategyTableIndex,
        'meta': {
            'title': '决策表',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'nav': [
                { 'name': '策略中心', 'path': '/business/home' },
                { 'name': '策略定义', 'path': null },
                { 'name': '决策表', 'path': null }
            ],
        }
    },
    {
        'path': '/business/strategy/table/save/:id?',
        'component': SaveStrategyTable,
        'meta': {
            'title': '决策表',
            'descript': '正在编辑',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略定义', 'path': null }, { 'name': '决策表', 'path': '/business/strategy/table' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/table/save/:type/:id',
        'component': SaveStrategyTable,
        'meta': {
            'title': '决策表',
            'descript': '正在编辑',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略定义', 'path': null }, { 'name': '决策表', 'path': '/business/strategy/table' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/table/detail/:id',
        'component': StrategyTableDetail,
        'meta': {
            'title': '决策表',
            'descript': '正在查看详情',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略定义', 'path': null }, { 'name': '决策表', 'path': '/business/strategy/table' }, { 'name': '详情', 'path': null }]
        }
    },
    {
        'path': '/business/release/strategy-table/detail/:id',
        'component': StrategyTableDetail,
        'meta': {
            'title': '决策表',
            'descript': '正在查看详情',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '资源详情', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/card/detail/:id',
        'component': StrategyCardDetail,
        'meta': {
            'title': '评分卡',
            'descript': '正在查看详情',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略定义', 'path': null }, { 'name': '评分卡', 'path': '/business/strategy/card' }, { 'name': '详情', 'path': null }]
        }
    },
    {
        'path': '/business/release/score-card/detail/:id',
        'component': StrategyCardDetail,
        'meta': {
            'title': '评分卡',
            'descript': '正在查看详情',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略包定义', 'path': null }, { 'name': '策略包详情', 'path': null }, { 'name': '评分卡详情', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/card',
        'component': StrategyScoreCardIndex,
        'meta': {
            'title': '评分卡',
            'descript': '通过规则组合形成策略，最终输出决策结果',
            'nav': [
                { 'name': '策略中心', 'path': '/business/home' },
                { 'name': '策略定义', 'path': null },
                { 'name': '评分卡', 'path': null }
            ],
        }
    },
    {
        'path': '/business/strategy/card/save/:id?',
        'component': SaveStrategyScoreCard,
        'meta': {
            'title': '评分卡',
            'descript': '正在编辑',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略定义', 'path': null }, { 'name': '评分卡', 'path': '/business/strategy/card' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/strategy/card/save/:type/:id',
        'component': SaveStrategyScoreCard,
        'meta': {
            'title': '评分卡',
            'descript': '正在编辑',
            'nav': [{ 'name': '策略中心', 'path': null }, { 'name': '策略定义', 'path': null }, { 'name': '评分卡', 'path': '/business/strategy/card' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/release/package',
        'component': StrategyPackage,
        'meta': {
            'title': '策略包定义',
            'descript': '',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': null }]
        }
    },
    {
        'path': '/business/release/package/save',
        'component': StrategyPackageSave,
        'meta': {
            'title': '策略包定义',
            'descript': '正在编辑策略包',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/release/package/save/:id',
        'component': StrategyPackageSave,
        'meta': {
            'title': '策略包定义',
            'descript': '正在编辑策略包',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '编辑', 'path': null }]
        }
    },
    {
        'path': '/business/release/package/detail/:id',
        'component': StrategyPackageDetail,
        'meta': {
            'title': '策略包定义',
            'descript': '正在查看策略包',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '查看资源', 'path': null }]
        }
    },
    {
        // 1实时 2衍生 3规则 4规则集 5决策流 6评分卡 7决策表
        'path': '/business/release/resource/:resourceType/detail/:id',
        'component': StrategyResourceDetail,
        'meta': {
            'title': '策略包资源详情',
            'descript': '',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, { 'name': '策略包定义', 'path': '/business/release/package' }, { 'name': '查看资源', 'path': null }]
        }
    },
    {
        'path': '/business/release/strategy',
        'component': StrategyPackageAudit,
        'meta': {
            'title': '策略包审核',
            'descript': '可编辑审核状态',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, {
                'name': '策略包审核',
                'path': null
            }]
        }
    },
    {
        'path': '/business/release/strategy-weight',
        'component': StrategyPackageWeight,
        'meta': {
            'title': '策略权重',
            'descript': '',
            'nav': [{ 'name': '策略中心', 'path': '/business/home' }, { 'name': '策略发布', 'path': null }, {
                'name': '策略权重',
                'path': null
            }]
        }
    },
];