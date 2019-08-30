/*
 * @Author: zengzijian
 * @Date: 2019-05-28 17:25:57
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:23:42
 * @Description: 
 */
import React, { Component } from 'react';
import {  Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';

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
            <div className="table-action">
                {
                    this.props.status == 0 ? <b style={{ width: '24px' }}></b> :
                        this.props.status == 1 ?
                            publicUtils.isAuth("business:variable:batch:deploy") ?
                                <Popconfirm title={"是否确定上线?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    {/* <img src={on} style={style.icon} title='上线' /> */}
                                    <p><span className="iconfont iconkaishi" title='上线' style={style.icon}></span></p>
                                    {/* <ActionIcon title='上线' code="iconkaishi" style={style.icon} havePopup={true} /> */}
                                </Popconfirm>
                                : ''

                            :

                            publicUtils.isAuth("business:variable:batch:deploy") ?
                                <Popconfirm title={"是否确定下线?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    {/* <img src={off} style={style.icon} title='下线' /> */}
                                    <p><span className="iconfont iconzanting" title='下线' style={style.icon}></span></p>
                                </Popconfirm>
                                : ''

                }
               {/* {
                    publicUtils.isAuth("business:variable:batch:edit") ?
                        <img src={edit} style={style.icon} title='编辑' onClick={this.edit} />
                        : ''
                }*/}

                {
                    publicUtils.isAuth("business:variable:batch:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            {/* <img src={del} style={style.icon} title='删除' /> */}
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon}></span></p>
                        </Popconfirm>
                        : ''
                }
            </div>
        )
    }
}
TableAction.propTypes = {
    status: PropTypes.number,
    changeStatus: PropTypes.func,
    dataId: PropTypes.string
}
TableAction.defaultProps = {
    status: 4,
    changeStatus: () => { },
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