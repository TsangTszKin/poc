import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import publicUtils from "@/utils/publicUtils";
import { Popconfirm, message } from "antd";
import strategyService from "@/api/business/strategyService";
import common from "@/utils/common";
import Iconfont from "@/components/common/Iconfont";

@withRouter
class MyComponent extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { dataId, code } = this.props;
        return (
            <div className="table-actions">
                <Iconfont className="iconfont icongailan" title="概览" onClick={ this.props.showOverview } disabled={ !publicUtils.isAuth('business:strategy:decisionTable:view')} />
                <Iconfont className="iconbanben" title="版本" onClick={ this.props.showVersionList } disabled={ !publicUtils.isAuth('business:strategy:decisionTable:view')} />
                <Iconfont className="iconbianji" title="编辑" onClick={ this.props.edit } disabled={ !publicUtils.isAuth('business:strategy:decisionTable:edit')} />
                <Iconfont className="icongongxiang" title="共享" onClick={ this.props.showShareTemplate } disabled={ !publicUtils.isAuth('business:strategy:decisionTable:edit')} />
                <Iconfont className="iconxiangqing" title="详情" onClick={ this.props.toDetail } disabled={ !publicUtils.isAuth('business:strategy:decisionTable:view')} />
                <Iconfont showConfirm className="iconshanchu" title="删除" onClick={ this.props.delete } disabled={ !publicUtils.isAuth('business:strategy:decisionTable:delete')} />
            </div>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
