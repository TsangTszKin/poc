/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-10-12 16:59:50
 * @Description: 
 */
import React, { Component } from 'react';
import { Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import publicUtils from '@/utils/publicUtils';

@withRouter
@inject('store')
@observer
class TableAction extends Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
    }
    edit = () => {
        console.log(this.props);
        this.props.store.getResultDetailForApi(this.props.dataId);
        // this.props.store.getResultDetailForApi(this.props.dataId);
    }
    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:strategy:output:edit") ?
                        <span className="iconfont iconbianji" title='编辑' style={style.icon} onClick={this.edit}></span>
                        : ''
                }

                {
                    publicUtils.isAuth("business:strategy:output:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon} ></span></p>
                        </Popconfirm>

                        : ''
                }
            </div>
        )
    }
}
TableAction.propTypes = {
    editPath: PropTypes.bool
}
TableAction.defaultProps = {
    editPath: false
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