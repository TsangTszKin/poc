import React, {Component} from 'react';
import {Icon, Popconfirm} from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import publicUtils from '@/utils/publicUtils';

@withRouter
@inject('store')
@observer
class TableAction extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("system:group:edit") ?
                        <Popconfirm title="是否确定从小组中移除?" onConfirm={() => {
                            this.props.deleteOne(this.props.dataId, this.props.status)
                        }} onCancel={() => {
                        }} okText="确定" cancelText="取消">
                            <icon className="iconfont iconshanchu" style={style.icon} title="删除"/>
                        </Popconfirm>
                        : <icon className="iconfont disabled iconshanchu" style={style.icon} title="删除"/>
                }

            </div>
        )
    }
}

TableAction.propTypes = {
    shareCallBack: PropTypes.func
}
TableAction.defaultProps = {
    shareCallBack: () => {
    }
}
const style = {
    icon: {
        cursor: 'pointer',
        marginRight: '10px'
    }
}
export default TableAction