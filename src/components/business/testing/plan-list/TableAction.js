import {inject, observer} from "mobx-react";
import React, {Component} from "react";
import {Icon, Popconfirm} from "antd";
import { withRouter } from "react-router-dom";
import Iconfont from "@/components/common/Iconfont";

@withRouter
@inject('store')
@observer
class TableAction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        // 201构建中 202待测试 203已测试  204构建失败
        const { status } = this.props;
        const canTest = [202, 203].includes(status);

        return (
            <div className="table-actions">
                <Iconfont className='iconkaishi' title="执行" onClick={ this.props.execute } disabled={ !canTest } />
                {/*<icon className="iconfont iconkaishi" title="执行" onClick={ this.props.execute } />*/}
                <icon className="iconfont iconbianji" title="测试方案" onClick={ this.props.edit } />
                <Popconfirm title="是否确定删除?" onConfirm={ this.props.delete }
                            onCancel={() => { }} okText="确定" cancelText="取消">
                    <icon className="iconfont iconshanchu" title="删除" />
                </Popconfirm>
            </div>
        )
    }
}

export default TableAction;