import React, {Component} from 'react';
import {Popconfirm} from 'antd';
import '@/styles/tableAction.less';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router-dom';
import variable from '@/filters/variable';
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
            <div className="table-action">{/*6：出错，2：上线中，3：下线中，1：下线，4：上线*/}
                {
                    this.props.status == 6 ? "" :
                        this.props.status == 1 ?
                            publicUtils.isAuth("system:eventSource:deploy") ?
                                <Popconfirm title={"是否确定上线?"} onConfirm={() => {
                                    this.props.changeStatus(this.props.dataId, true)
                                }} onCancel={() => {
                                }} okText="确定" cancelText="取消">
                                    <icon className="iconfont iconkaishi" style={style.icon} title='上线'/>
                                </Popconfirm>
                                : <icon className="iconfont disabled iconkaishi" style={style.icon} title='上线'/>
                            : this.props.status == 2 ?
                            <icon className="iconfont disabled iconkaishi" style={style.icon} title='上线'/>
                            : this.props.status == 4 ?
                                publicUtils.isAuth("system:eventSource:deploy") ?
                                    <Popconfirm title={"是否确定下线?"} onConfirm={() => {
                                        this.props.changeStatus(this.props.dataId, false)
                                    }} onCancel={() => {
                                    }} okText="确定" cancelText="取消">
                                        <icon className="iconfont iconzanting" style={style.icon} title='下线'/>
                                    </Popconfirm>
                                    : <icon className="iconfont disabled iconzanting" style={style.icon} title='下线'/>
                                : this.props.status == 3 ?
                                    <icon className="iconfont disabled iconzanting" style={style.icon} title='下线'/>
                                    : <icon className="iconfont disabled iconzanting" style={style.icon} title='下线'/>


                }
                {
                    publicUtils.isAuth("system:eventSource:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => {
                            this.props.deleteOne(this.props.dataId)
                        }} onCancel={() => {
                        }} okText="确定" cancelText="取消">
                            <icon className="iconfont iconshanchu" style={style.icon} title="删除"/>
                        </Popconfirm>
                        : <icon className="iconfont disabled iconshanchu" style={style.icon} title="删除"/>
                }

                {/* {
                    publicUtils.isAuth("business:variable:rtq:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.dataId, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
                            <icon type="delete" title="删除" />
                        </Popconfirm>
                        : ''
                } */}
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
    changeStatus: () => {
    },
    deleteOne: () => {
    },
    dataId: ''
}
const style = {
    icon: {
        cursor: 'pointer',
        marginRight: '10px'
    }
}
export default TableAction