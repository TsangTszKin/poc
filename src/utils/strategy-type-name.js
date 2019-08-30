const typeNames = {
    'rtqVar': '实时查询变量',
    'extVar': '衍生变量',
    'rule': '规则',
    'ruleSet': '规则集',
    'strategy': '决策流',
    'strategyPackage': '策略包',
    'decisionTable': '决策表',
};

const getStrategyTypeName = type => typeNames[type] || type;

export default getStrategyTypeName;