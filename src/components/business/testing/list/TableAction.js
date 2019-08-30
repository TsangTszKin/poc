import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import {Icon, Popconfirm} from "antd";
import { withRouter } from "react-router-dom";
import strategyService from "@/api/business/strategyService";
import publicUtils from "@/utils/publicUtils";
import common from "@/utils/common";
import Iconfont from "@/components/common/Iconfont";

@withRouter
@inject('store')
@observer
class TableAction extends Component {
    constructor(props) {
        super(props);
        this.toTest = this.toTest.bind(this);
        this.toPlanList = this.toPlanList.bind(this);
    }

    toTest() {
        this.props.history.push(`/business/testing/list/test/${ this.props.data.id }`)
    }

    toPlanList() {
        this.props.history.push(`/business/testing/list/${ this.props.data.id }/plan`)
    }

    reDeploy = () => {
        common.loading.show();
        strategyService.submitTest([this.props.data.strategyId]).then(res => {
            common.loading.hide();
            publicUtils.isOk(res, true);
            this.props.store.getDataSourceForApi();
        })
    };

    render() {
        const { data } = this.props;
        // 201构建中 202待测试 203已测试  204构建失败
        const canTest = [202, 203].includes(data.status);
        return (
            <div className="table-actions">
                <Iconfont className="iconfont iconkaishi" title="重新构建" onClick={ this.reDeploy }
                          disabled={ data.status !== 204 }/>
                <Iconfont className="iconfont iconkuaisuceshi" title="快速测试" onClick={ this.toTest }
                          disabled={ !canTest }/>
                <Iconfont className="iconfont iconceshifangan" title="测试方案" onClick={ this.toPlanList }
                          disabled={ !canTest }/>
                <Popconfirm title="是否确定删除?" onConfirm={ () => {
                    this.props.deleteTest([data.id])
                } } onCancel={ () => {
                } } okText="确定" cancelText="取消">
                    <icon className="iconfont iconshanchu" title="删除"/>
                </Popconfirm>
            </div>
        )
    }
}

export default TableAction;