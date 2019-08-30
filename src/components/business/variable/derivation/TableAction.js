/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:25:43
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
                    publicUtils.isAuth("business:variable:ext:edit") ?
                        <span className="iconfont iconbianji" title='编辑' style={style.icon} onClick={this.edit}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:variable:ext:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon} ></span></p>
                        </Popconfirm>
                        : ''
                }

            </div>
        )
    }
}
TableAction.propTypes = {
    editPath: PropTypes.bool,
    shareCallBack: PropTypes.func
}
TableAction.defaultProps = {
    editPath: false,
    shareCallBack: () => { }
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