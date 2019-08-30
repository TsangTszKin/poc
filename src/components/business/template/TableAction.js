import React, {Component} from 'react';
import {Icon, Popconfirm} from 'antd';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';
import Iconfont from "@/components/common/Iconfont";
import MyComponent from "../strategy/score-card/Action";


@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
    }

    edit = () => {
        this.props.history.push(this.props.editPath);
    }

    render() {
        return (
            <div className="table-actions" >
                {
                    publicUtils.isAuth("business:variable:template:edit") ?
                        <Iconfont className="iconyongmobanchuangjian" title="用模板创建"
                                  onClick={() => this.edit()}/>
                        :
                        <Iconfont disabled={true} className="iconyongmobanchuangjian" title="用模板创建"/>
                }
                {
                    publicUtils.isAuth("business:variable:template:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => {
                            this.props.deleteOne(this.props.dataId)
                        }} onCancel={() => {
                        }} okText="确定" cancelText="取消">
                            <Iconfont className="iconshanchu"/>
                        </Popconfirm>
                        : <Iconfont disabled={true} className="iconshanchu"/>
                }
            </div>
        )
    }
}

MyComponent.propTypes = {};
export default TableAction
