import React, {Component} from 'react';
import {Popconfirm} from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import {inject, observer} from 'mobx-react';
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
        // this.props.history.push(this.props.editPath);
        this.props.store.getResultDetailForApi(this.props.dataId);
    }

    render() {
        return (
            <div className="table-action">
                {
                        publicUtils.isAuth("system:config:dimensionConfig:edit") ?
                            <icon  className="iconfont iconbianji" style={style.icon} title="编辑" onClick={() => this.edit()}/>
                            : <icon className="iconfont disabled iconbianji" style={style.icon} title="编辑" />
                }

                {
                    publicUtils.isAuth("system:config:dimensionConfig:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => {
                            this.props.deleteOne(this.props.dataId)
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
    editPath: PropTypes.bool
}
TableAction.defaultProps = {
    editPath: false
}
const style = {
    icon: {
        cursor: 'pointer',
        marginRight: '10px'
    }
}
export default TableAction