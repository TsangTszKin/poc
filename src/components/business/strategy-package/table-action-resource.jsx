/**
 * 查看资源内嵌套表格的操作, 对单个资源的操作
 */
import { inject } from "mobx-react";
import React, { Component } from "react";
import publicUtils from "@/utils/publicUtils";
import { withRouter } from "react-router-dom";
import '@/styles/business/release/release.less';
import strategyService from "@/api/business/strategyService";
import packageStatus from '@/utils/strategy-package-status';
import { Modal, Popconfirm } from 'antd';
import common from "@/utils/common";
import store from "@/store/business/release/package/Detail";

@inject('store')
@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
    }

    deploy = () => {
        common.loading.show();
        strategyService.updateStrategyPackageStatus([], 105, [this.props.data.id])
            .then(this.handleSuccess);
    };
    view = () => {
        let link;
        const dataId = this.props.data.id;
        switch (this.props.resourceType) {
            // 1实时 2衍生 3规则 4规则集 5决策流 6评分卡 7决策表
            case 1:
                strategyService.getResourceDetail(dataId).then(res => {
                    if (!publicUtils.isOk(res)) return;
                    console.log(res.data);
                    this.setState({ baseInfo: res.data.result });
                    this.props.history.push(`/business/release/rtqVar/detail/1/${ res.data.result.rtqVarType }/${ dataId }`);
                });
                break;
            case 2:
                // link = `/business/release/extVar/${ dataId }`;
                link = `/business/release/resource/2/detail/${ dataId }`;
                break;
            case 3:
                link = `/business/release/rule/details/${ dataId }`;
                break;
            case 4:
                link = `/business/release/rule-set/details/${ dataId }`;
                break;
            case 5:
                link = `/business/release/definition/3/${ dataId }`;
                break;
            case 6:
                link = `/business/release/score-card/detail/${ dataId }`;
                break;
            case 7: // 决策表
                link = `/business/release/strategy-table/detail/${ dataId }`;
                break;
        }
        console.log(link);
        if (link) this.props.history.push(link);
    };
    offline = () => {
        common.loading.show();
        strategyService.updateStrategyPackageStatus([], 106, [this.props.data.id])
            .then(this.handleSuccess);
    };
    update = () => {
        // strategyService.updateResource(this.props.data.id, this.props.dataId).then(this.handleSuccess);
        console.log(this.props.data);
        // return;
        const { resId, type, id } = this.props.data;
        // 衍生变量没有版本的概念，所以直接更新
        if (type === 2) {
            common.loading.show();
            strategyService.updateResource(id, '').then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res, true)) return;
                this.props.store.getDataSourceFromApi();
            });
        } else {
            // 分别获取版本列表
            common.loading.show();
            strategyService.getResourceVersions(resId, type).then(res => {
                common.loading.hide();
                if (!publicUtils.isOk(res)) return;
                this.props.store.resource.setCurrentId(this.props.data.id);
                this.props.store.resource.setList(res.data.result);
                this.props.store.resource.setIsShowResource(true);
            });
        }
    };
    handleSuccess = res => {
        common.loading.hide();
        if (publicUtils.isOk(res)) {
            Modal.success({ title: '系统提示', content: res.data.resultMessage });
            this.props.store.getDataSourceFromApi();
        }
    };

    render() {
        let firstAction;
        const { data, strategyPackage, resourceType } = this.props;
        if (packageStatus.canOffline(data.status)) firstAction = (
            <Popconfirm
                title="是否确定停止发布?" onConfirm={ () => this.offline() }
                onCancel={ () => {
                } } okText="确定" cancelText="取消">
                <icon className="iconfont iconzanting" title="下线"/>
            </Popconfirm>
        );
        // 策略包审核状态通过的资源才可以发布
        else if (packageStatus.canDeploy(data.status) && strategyPackage.auditStatus === 103) {
            firstAction = <icon className="iconfont iconkaishi" title="上线" onClick={ () => this.deploy() }/>;
        }
        // 占位防塌陷
        else firstAction = <icon className="iconfont iconkaishi disabled" title="上线"/>;
        return (
            <div className="table-actions">
                {
                    publicUtils.isAuth("business:release:package:deploy") ? firstAction
                        : <icon className="iconfont iconkaishi disabled" title="上线"/>
                }
                {
                    publicUtils.isAuth("business:release:package:view") && [1, 2, 3, 5, 4, 6, 7].includes(resourceType) ?
                        <icon className="iconfont iconxiangqing" title="详情" onClick={ () => this.view() }/>
                        : <icon className="iconfont iconxiangqing disabled" title="详情"/>
                }
                {
                    packageStatus.canUpdateResource({
                        status: data.status,
                        auditStatus: strategyPackage.auditStatus,
                        packageStatus: strategyPackage.status
                    }) ?
                        <icon className="iconfont icongengxin" title="更新" onClick={ () => this.update() }/>
                        : <icon className="iconfont icongengxin disabled" title="更新"/>
                }

            </div>
        );
    }
}

export default TableAction;