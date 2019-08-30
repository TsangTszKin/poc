/*
 * @Author: zengzijian
 * @Date: 2019-06-14 17:55:56
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:33:44
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
                {/* 上线下移去到策略包维护 */}
                {/* {
                    this.props.status == 0 ? <b style={{ width: '24px' }}></b> :
                        this.props.status == 1 ?
                            publicUtils.isAuth("business:variable:rtq:deploy") ?
                                <Popconfirm title={"是否确定上线?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    <img src={on} style={style.icon} title='上线' />
                                </Popconfirm>
                                : ''

                            :

                            publicUtils.isAuth("business:variable:rtq:deploy") ?
                                <Popconfirm title={"是否确定下线?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    <img src={off} style={style.icon} title='下线' />
                                </Popconfirm>
                                : ''


                } */}
                
                {
                    publicUtils.isAuth("business:variable:rtq:edit") ?
                        <span className="iconfont iconbianji" title='编辑' style={style.icon} onClick={this.edit}></span>
                        : ''
                }

                {
                    publicUtils.isAuth("business:variable:rtq:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => {
                            this.props.deleteOne(this.props.dataId, this.props.status)
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
    dataId: PropTypes.string
}
TableAction.defaultProps = {
    editPath: false,
    status: 4,
    changeStatus: () => { },
    deleteOne: () => { },
    dataId: ''
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