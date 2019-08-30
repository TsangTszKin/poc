/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:51
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:33:26
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
        // console.log(this.props.dataId);
    }

    edit = () => {
        // console.log(this.props);
        this.props.history.push(this.props.editPath);
    }

    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:variable:rtq:edit") && this.props.quoteSum !== 0 ?
                        <span className="iconfont iconbanben" title='版本' onClick={this.props.versionFunc} style={style.icon}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:variable:rtq:edit") ?
                        <span className="iconfont iconbianji" title='编辑' style={style.icon} onClick={this.edit}></span>
                        : ''
                }

                {
                    publicUtils.isAuth("business:variable:rtq:share") ?
                        <span className="iconfont icongongxiang" title='共享' style={style.icon} onClick={this.props.templateFunc}></span>
                        : ''
                }

                {
                    publicUtils.isAuth("business:variable:rtq:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => {
                            this.props.deleteOne(this.props.code, this.props.status)
                        }} onCancel={() => {
                        }} okText="确定" cancelText="取消">
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
    status: PropTypes.number,
    changeStatus: PropTypes.func,
    deleteOne: PropTypes.func,
    dataId: PropTypes.string,
    code: PropTypes.string,
    quoteSum: PropTypes.number
}
TableAction.defaultProps = {
    editPath: false,
    status: 4,
    changeStatus: () => {
    },
    deleteOne: () => {
    },
    dataId: '',
    code: '',
    quoteSum: 0
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