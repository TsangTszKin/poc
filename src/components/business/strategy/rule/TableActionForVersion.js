/*
 * @Author: zengzijian
 * @Date: 2019-05-18 15:52:01
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:22:13
 * @Description: 
 */
import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';
import { inject } from 'mobx-react';

@withRouter
@inject('store')
class TableActionForVersion extends Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
    }
    edit = () => {
        this.props.store.modal.version.hide();
        this.props.history.push(this.props.editPath);
    }
    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:strategy:rule:edit") ?
                        <span className="iconfont iconbianji" title='编辑' onClick={this.edit} style={style.icon}></span>
                        : ''
                }
                <span className="iconfont iconxiangqing" title='详情' onClick={() => {
                    this.props.history.push(this.props.detailPath);
                }} style={style.icon}></span>
                {
                    publicUtils.isAuth("business:strategy:rule:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteRuleVersion(this.props.dataId) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon}></span></p>
                        </Popconfirm>
                        : ''
                }
            </div>
        )
    }
}
TableActionForVersion.propTypes = {
    editPath: PropTypes.bool,
    versionFunc: PropTypes.func
}
TableActionForVersion.defaultProps = {
    editPath: false,
    versionFunc: () => { }
}
export default TableActionForVersion

const style = {
    icon: {
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        marginRight: '10px'
    }
}