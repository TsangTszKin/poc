/*
 * @Author: zengzijian
 * @Date: 2018-08-20 14:25:34
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-01-24 16:21:11
 * @Description: 
 */
export default {

    /**
     * '变量管理'中变量的状态
     *
     * @param {*} status
     * @returns
     */
    variableStatus(status) {
        let resultStr;
        if (isNaN(status)) {
            return status
        } else {
            switch (status) {
                case 0:
                    resultStr = '未就绪';
                    break;
                case 1:
                    resultStr = '已就绪';
                    break;
                case 2:
                    resultStr = '上线中';
                    break;
                case 3:
                    resultStr = '下线中';
                    break;
                case 4:
                    resultStr = '已上线';
                    break;
                case 5:
                    resultStr = '删除中';
                    break;
                case 6:
                    resultStr = '已出错';
                    break;
                case 7:
                    resultStr = '发布中';
                    break;
                case 8:
                    resultStr = '就绪中';
                    break;
                default:
                    resultStr = '未知状态';
                    break;
            }
            return resultStr;
        }

    },
    /**
     *输入选择：dataSourceType  数据源接入类型配置
     *
     * @param {*} dataSourceType
     * @returns
     */
    dataSourceType(dataSourceType) {
        switch (dataSourceType) {
            case 0:
                return 'HTTP'
            case 1:
                return 'KAFKA'
            case 2:

                return 'RTMQ'
            default:
                return ''
        }
    },
    /**
     *输出选择 ：dataSinkType 数据源输出类型配置（支持组合）
     *
     * @param {*} dataSinkType
     * @returns
     */
    dataSinkType(dataSinkType) {
        switch (dataSinkType) {
            case 0:
                return 'NONE'
            case 1:
                return 'KAFKA'
            case 2:
                return 'RTMQ'
            default:
                return ''
        }
    },
    /**
     *模式选择：decisionFlowType 决策流类型配置
     *
     * @param {*} decisionFlowType
     * @returns
     */
    decisionFlowType(decisionFlowType) {
        switch (decisionFlowType) {
            case 0:
                return '准实时规则判决决策流（默认、信用卡）'
            case 1:
                return '实时规则判决决策流'
            case 2:
                return '准实时规则评分决策流'
            case 3:
                return '实时规则评分决策流(零售)'
            case 4:
                return '准实时数据批量导入决策流'
            case 5:
                return '实时模型规则融合决策流'
            case 6:
                return '准实时模型规则融合决策流'
            case 128:
                return '用户扩展决策流'
            default:
                return ''
        }
    },
    systemVarStatus(status) {
        switch (status) {
            case 1:
                return '正常';
            case 2:
                return '禁用';
            default:
                return '未知';
        }
    },
    systemVarDataType(dataType) {
        switch (dataType) {
            case 12:
                return '字符';
            case 2003:
                return '字典';
            case 4:
                return '整型';
            case 6:
                return '浮点型';
            case 16:
                return '布尔类型';
            case 93:
                return '日期类型';
            default:
                return '未知';
        }
    }
}