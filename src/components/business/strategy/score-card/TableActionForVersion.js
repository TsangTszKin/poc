import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
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
                    publicUtils.isAuth("business:strategy:ruleSet:edit") ?
                        <span class="iconfont iconbianji" title='编辑' onClick={this.edit} style={style.icon}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:ruleSet:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteVersion(this.props.dataId) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <p><span class="iconfont iconshanchu" title='删除' style={style.icon}></span></p>
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