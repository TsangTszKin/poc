import React, { Component } from 'react';
import { Icon, Popconfirm } from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import variable from '@/filters/variable';
import publicUtils from '@/utils/publicUtils';
import { inject, observer } from 'mobx-react';

@withRouter
@inject('store')
@observer
class TableAction extends Component {
    constructor(props) {
        super(props);
        this.edit = this.edit.bind(this);
        // console.log(this.props.dataId);
    }
    edit = () => {
        // console.log(this.props);
        this.props.store.getDetailsForApi(this.props.dataId);
    }
    render() {
        return (
            <div className="table-action">
               {/* {
                    (this.props.status != 2 && this.props.status != 1) ? <b style={{ width: '24px' }}></b> :
                        this.props.status == 2 ?
                            publicUtils.isAuth("system:config:systemVar:deploy") ?
                                <Popconfirm title={"是否确定启用?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, true) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    <Icon type="caret-right" title='启用' />
                                </Popconfirm>
                                : ''

                            :

                            publicUtils.isAuth("system:config:systemVar:deploy") ?
                                <Popconfirm title={"是否确定禁用?"} onConfirm={() => { this.props.changeStatus(this.props.dataId, false) }} onCancel={() => { }} okText="确定" cancelText="取消">
                                    <Icon type="pause" title='禁用' />
                                </Popconfirm>
                                : ''


                }*/}
                {
                    publicUtils.isAuth("system:config:systemVar:edit") ?
                        <span className="iconfont iconbianji" title='编辑' onClick={this.edit} style={style.icon}></span>
                        : ''
                }

                {
                    publicUtils.isAuth("system:config:systemVar:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon}></span></p>
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

const style = {
    icon: {
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        marginRight: '10px'
    }
}

export default TableAction