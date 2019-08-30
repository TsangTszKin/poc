/**
 * 策略列表的操作
 */
import {inject} from "mobx-react";
import React, {Component} from "react";
import publicUtils from "@/utils/publicUtils";
import {Divider, Icon, Modal, Popconfirm} from "antd";
import {withRouter} from "react-router-dom";
import '@/styles/business/release/release.less'
import strategyService from "@/api/business/strategyService";
import packageStatus from '@/utils/strategy-package-status';
import common from "@/utils/common";
import Status from "@/components/business/strategy-package/status";

@inject('store')
@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
    }

    deploy = () => {
        this.props.store.setIsShowRelease(true);
        this.props.store.setReleaseList(this.props.versionList);
    };
    test = () => {
        this.props.store.setIsShowTest(true);
        this.props.store.setTestList(this.props.versionList);
    };
    audit = () => {
        this.props.store.setIsShowAudit(true);
        // 只显示待审核状态（101）的版本
        let versionList = this.props.versionList.filter(version => packageStatus.canAudit(version.auditStatus));
        // console.log(versionList);
        this.props.store.setAuditList(versionList);
    };
    edit = () => { this.props.history.push(`/business/release/package/save/${this.props.lastEditVersion.id}`); };
    delete = () => { this.props.deleteOne(this.props.lastEditVersion.id); };
    view = () => { this.props.history.push('/business/release/package/detail/' + this.props.lastEditVersion.id); };
    offline = () => {
        strategyService.updateStrategyPackageStatus([this.props.deployedVersion.id], 106)
            .then(res => {
                Modal.success({ title: '系统提示', content: res.data.resultMessage });
                this.props.store.getDataSourceForApi();
            });
    };
    showVersionList = () => {
        this.props.store.setIsShowVersionList(true);
        this.getVersionList();
    };
    deleteVersion = versionId => {
        strategyService.deleteStrategyPackage(null, [versionId]).then(res => {
            common.loading.hide();
            if (!publicUtils.isOk(res)) return ;
            this.props.store.updateDataSource().then(() => {
                this.getVersionList();
            })
        });
    };
    getVersionList = () => {
        let versionList = [];
        this.props.versionList.forEach((item, index) => {
            const element = common.deepClone(item);
            element.index = index + 1;
            element.status = (
                <React.Fragment>
                    <Status statusCode={item.status} isShowMsg={ packageStatus.isShowErrorMsg(item.status) } errorMsg={ item.lastErrorMessage } />
                    <Divider type="vertical" />
                    <Status statusCode={item.auditStatus} />
                </React.Fragment>
            );
            element.action = (
                <div className="table-actions">
                    <icon className="iconfont iconbianji" title="编辑" onClick={() => this.leaveVersionTo(`/business/release/package/save/${item.id}`)} />
                    <icon className="iconfont iconxiangqing" title="查看资源" onClick={() => this.leaveVersionTo(`/business/release/package/detail/${item.id}`)} />
                    {
                        publicUtils.isAuth("business:release:package:delete") ?
                            <Popconfirm
                                title="是否确定删除?" onConfirm={() => { this.deleteVersion(item.id) }}
                                onCancel={() => { }} okText="确定" cancelText="取消">
                                <icon className="iconfont iconshanchu" />
                            </Popconfirm>
                            : <icon className="iconfont iconshanchu disabled" />
                    }
                </div>
            );
            versionList.push(element);
        });
        this.props.store.setVersionList(versionList);
        this.props.store.rowSelection.setSelectedRowKeys([]);
    };
    // 版本列表操作，离开页面时关闭当前弹窗
    leaveVersionTo = url => {
        this.props.history.push(url);
        this.props.store.setIsShowVersionList(false);
    };


    render() {
        let firstAction;
        const { statusCode, auditStatus } = this.props;
        if (packageStatus.canOffline(statusCode)) firstAction = (
            <Popconfirm
                title="是否确定停止发布?" onConfirm={ () => this.offline() }
                onCancel={ () => {} } okText="确定" cancelText="取消">
                <icon className="iconfont iconzanting" title="下线"/>
            </Popconfirm>
        );
        else if (packageStatus.canDeploy(statusCode)) {
            firstAction = <icon className="iconfont iconkaishi" title="上线" onClick={() => this.deploy()} />;
        }
        // 占位防塌陷
        else firstAction = <icon className="iconfont iconkaishi disabled" title="上线" />;
        return (
            <div className="table-actions">
                {
                    publicUtils.isAuth("business:release:package:deploy") ? firstAction
                        : <icon className="iconfont iconkaishi disabled" title="上线" />
                }
                <icon className="iconfont iconshenhe" title="提交审核" onClick={() => this.audit()} />
                {
                    publicUtils.isAuth("business:release:package:view") ?
                        <icon className="iconfont iconcelveceshi" title="测试" onClick={() => this.test()} />
                        : <icon className="iconfont disabled iconcelveceshi" title="测试" />
                }
                <icon className="iconfont iconbanben" title="版本" onClick={() => this.showVersionList()} />
                {
                    publicUtils.isAuth("business:release:package:edit") ?
                        <icon className="iconfont iconbianji" title="编辑" onClick={() => this.edit()} />
                        : <icon className="iconfont disabled " title="编辑" />
                }
                {
                    publicUtils.isAuth("business:strategy:strategy:edit") ?
                        <span class="iconfont icongongxiang" title='共享'
                              onClick={this.props.templateFunc}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:release:package:view") ?
                        <icon className="iconfont iconxiangqing" title="查看资源" onClick={() => this.view()} />
                        : <icon className="iconfont disabled iconxiangqing" title="查看资源" />
                }
                {
                    publicUtils.isAuth("business:release:package:delete") ?
                        <Popconfirm
                            title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId) }}
                            onCancel={() => { }} okText="确定" cancelText="取消">
                            <icon className="iconfont iconshanchu" />
                        </Popconfirm>
                        : <icon className="iconfont disabled iconshanchu" />
                }
            </div>
        )
    }
}

export default TableAction;