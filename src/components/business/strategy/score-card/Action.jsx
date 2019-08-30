import React, {Component} from 'react';
import publicUtils from '@/utils/publicUtils';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";
import {Popconfirm} from "antd";

@withRouter
class MyComponent extends Component {
    constructor(props) {
        super(props);

    }

    edit = () => this.props.history.push(`/business/strategy/card/save/1/${this.props.dataId}`);

    // edit = () => this.props.history.push('/business/strategy/table/save/402880fb6bea1fa4016bea233e900001');

    render() {
        return (
            <div className="table-action">
                {
                    publicUtils.isAuth("business:strategy:scoreCard:view") ?
                        <span class="iconfont icongailan" title={'概览 已引用个数' + this.props.quoteSum} style={style.icon}
                              onClick={() => {
                                  this.props.quoteSumFunc('scoreCard', this.props.dataId, this.props.quoteSum)
                              }}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:scoreCard:edit") ?
                        <span class="iconfont iconbanben" title='版本' style={style.icon}
                              onClick={this.props.versionFunc}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:scoreCard:edit") ?
                        <span className="iconfont iconbianji" title='编辑' onClick={this.edit} style={style.icon}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:strategy:edit") ?
                        <span class="iconfont icongongxiang" title='共享' style={style.icon}
                              onClick={this.props.templateFunc}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:scoreCard:edit") ?
                        <span className="iconfont iconxiangqing" title="详情" onClick={this.props.toDetail}
                              style={style.icon}></span>
                        : ''
                }
                {
                    publicUtils.isAuth("business:strategy:scoreCard:delete") ?
                        <Popconfirm title="是否确定删除?" onConfirm={() => {
                            this.props.deleteOne(this.props.code)
                        }} onCancel={() => {
                        }} okText="确定" cancelText="取消">
                            <p><span className="iconfont iconshanchu" title='删除' style={style.icon}></span></p>
                        </Popconfirm>
                        : ''
                }
            </div>
        );
    }
}

MyComponent.propTypes = {};
const style = {
    icon: {
        width: '14px',
        height: '14px',
        cursor: 'pointer',
        marginRight: '10px'
    }
}

export default MyComponent;
