/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:50
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:19:59
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
        this.state = {
            isIng: false
        }
    }
    componentDidMount() {
        this.setState({
            isIng: false
        })
    }
    componentWillUpdate(nextProps) {
        if (nextProps.status != this.props.status) {
            this.setState({ isIng: false })
        }
    }
    edit = () => {
        console.log(this.props);
        this.props.history.push(this.props.editPath);
    }
    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:strategy:strategy:view") ?
                        <span className="iconfont icongailan" title={'概览 已引用个数' + this.props.quoteSum} style={style.icon} onClick={() => { this.props.quoteSumFunc('strategy', this.props.dataId, this.props.quoteSum) }}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:strategy:edit") ?
                        <span className="iconfont iconbanben" title='版本' style={style.icon} onClick={this.props.versionFunc}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:strategy:edit") ?
                        <span className="iconfont iconbianji" title='编辑' style={style.icon} onClick={this.edit}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:strategy:edit") ?
                        <span className="iconfont icongongxiang" title='共享' style={style.icon} onClick={this.props.templateFunc}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:strategy:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => { this.props.deleteOne(this.props.code, this.props.status) }} onCancel={() => { }} okText="确定" cancelText="取消">
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
    eventSourceId: PropTypes.string,
    quoteSumFunc: PropTypes.func,
    quoteSum: PropTypes.number
}
TableAction.defaultProps = {
    editPath: false,
    status: 4,
    changeStatus: () => { },
    deleteOne: () => { },
    dataId: '',
    code: '',
    eventSourceId: '',
    quoteSumFunc: () => { },
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