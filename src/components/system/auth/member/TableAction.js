import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
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
        this.props.store.getOrgListForApi();
        this.props.store.modal.save.setIsShow(true);
        this.props.store.getDetailForApi(this.props.dataId);
        // this.props.history.push(this.props.editPath);
    }
    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("system:member:resetPassword") ?
                        <icon className="iconfont icongengxin" style={style.icon} title="重置密码" onClick={() => { this.props.store.modal.resetPassword.setIsShow(true); this.props.store.reset.setUserId(this.props.dataId); }} />
                        : <icon className="iconfont icongengxin" style={style.icon} title="重置密码"/>
                }
                {
                    publicUtils.isAuth("system:member:edit") ?
                        <icon  className="iconfont iconbianji" style={style.icon} title="编辑" onClick={() => this.edit()}/>
                        : <icon className="iconfont disabled iconbianji" style={style.icon} title="编辑" />
                }
                {
                    publicUtils.isAuth("system:member:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <icon className="iconfont iconshanchu" style={style.icon} title="删除"/>
                        </Popconfirm>
                        : <icon className="iconfont disabled iconshanchu" style={style.icon} title="删除"/>
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
const style = {
    icon: {
        cursor: 'pointer',
        marginRight: '10px'
    }
}
export default TableAction