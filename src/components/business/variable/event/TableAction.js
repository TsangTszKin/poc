/*
 * @Author: zengzijian
 * @Date: 2019-04-28 17:39:18
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:25:51
 * @Description: 
 */
import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import publicUtils from '@/utils/publicUtils';

@withRouter
class TableAction extends Component {
    constructor(props) {
        super(props);
        // console.log(this.props.dataId);
    }

    render() {
        return (
            <div className="table-action">
                {
                    this.props.status == 0 ? <b style={{ width: '24px' }}></b> :
                        this.props.status == 1 ?
                            publicUtils.isAuth("business:variable:event:deploy") ?
                                <Popconfirm title={"是否确定上线?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    <p><span className="iconfont iconkaishi" title='上线' style={style.icon}></span></p>
                                </Popconfirm>
                                : ''

                            :

                            publicUtils.isAuth("business:variable:event:deploy") ?
                                <Popconfirm title={"是否确定下线?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    <p><span className="iconfont iconzanting" title='下线' style={style.icon}></span></p>
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
const style = {
    icon: {
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        marginRight: '10px'
    }
}
export default TableAction