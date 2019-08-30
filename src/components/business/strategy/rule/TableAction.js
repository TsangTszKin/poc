/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:21:59
 * @Description: 
 */
import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';

@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
    }
    edit = () => {
        this.props.history.push(this.props.editPath);
    }
    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:strategy:rule:edit") ?
                        <span className="iconfont iconbanben" title='版本' onClick={this.props.versionFunc} style={style.icon}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:rule:edit") ?
                        <span className="iconfont iconbianji" title='编辑' onClick={this.edit} style={style.icon}></span>
                        : ''
                }
                <span className="iconfont iconxiangqing" title='详情' onClick={() => {
                    this.props.history.push(this.props.detailPath);
                }} style={style.icon}></span>
                {
                    publicUtils.isAuth("business:strategy:rule:edit") ?
                        <span className="iconfont icongongxiang" title='共享' onClick={this.props.templateFunc} style={style.icon}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:rule:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon}></span></p>
                        </Popconfirm>
                        : ''
                }
            </div>
        )
    }
}
TableAction.propTypes = {
    editPath: PropTypes.bool,
    versionFunc: PropTypes.func,
    templateFunc: PropTypes.func
}
TableAction.defaultProps = {
    editPath: false,
    versionFunc: () => { },
    templateFunc: () => { }
}
export default TableAction

const style = {
    icon: {
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        marginRight: '10px'
    }
}