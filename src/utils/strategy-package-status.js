/**
 * User: duxinzhong/duxz@shine-china.com
 * Date: 2019/5/22 12:04
 * Description: 限于策略包部分的状态显示及判断
 */
import common from "@/utils/common";

export default {
    '-1': { className: 'ing', text: '未知' },
    // auditStatus 审核状态
    101: { className: 'ing', text: '待审核' },
    102: { className: 'online', text: '审核中' },
    103: { className: 'ready', text: '通过' },
    104: { className: 'error', text: '未通过' },
    // status 策略包状态
    105: { className: 'online', text: '已发布' },
    106: { className: 'ready', text: '已停止' },
    107: { className: 'ready', text: '发布中' },
    108: { className: 'ready', text: '上线中' },
    109: { className: 'ready', text: '已上线' },
    110: { className: 'ready', text: '删除中' },
    111: { className: 'error', text: '已删除' },
    112: { className: 'ready', text: '停止中' },
    113: { className: 'ing', text: '未发布' },
    114: { className: 'error', text: '发布失败' },
    115: { className: 'error', text: '停止失败' },
    201: { className: 'ready', text: '构建中' },
    202: { className: 'ready', text: '待测试' },
    203: { className: 'ready', text: '已通过' },
    204: { className: 'error', text: '未通过' },
    999: { className: 'error', text: '已出错' },
    // 允许上线
    canDeploy: status => [103, 106, 113, 114].includes(status),
    // 允许下线
    canOffline: status => [105, 115].includes(status),
    // 允许提交审核
    canAudit: auditStatus => [101, 104].includes(auditStatus),
    /**
     * 允许上线资源
     * @param status 资源状态
     * @param auditStatus 策略包审核状态
     * @returns {*|boolean}
     */
    canDeployResource: ({ status, auditStatus }) => this.canDeploy(status) && auditStatus === 103,
    /**
     * 允许更新资源,
     * 只有未发布或停止状态的策略包可以显示更新按钮
     * 策略包的auditStatus审核中,
     * 资源状态已发布、停止中、已停止、删除中、上线中,
     * 把更新资源按钮置为不可用状态
     * @param status 资源状态
     * @param auditStatus 策略包审核状态
     * @returns {boolean}
     */
    canUpdateResource: ({ packageStatus, status, auditStatus }) => [106, 113, 114].includes(packageStatus) && ![105, 107, 108, 110, 112,].includes(status) && auditStatus !== 102,
    isShowErrorMsg: status => [ 114, 115, 999 ].includes(status)
}

