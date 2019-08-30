/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:33:22
 * @Description: 
 */
import React, { Component } from 'react'
import { inject, observer } from 'mobx-react'
import Left from './Left'
import Right from './Right'
import '@/styles/layouts.less';
import { withRouter } from 'react-router-dom';
import authService from '@/api/authService';
import { Modal, Input, Icon, Row, Col, message } from 'antd';
import publicUtils from '@/utils/publicUtils';
import common from '@/utils/common';

var timer_verify = null;

@withRouter
@inject('GlobalStore')
@observer
class Layouts extends Component {
    constructor() {
        super();
        this.state = {
            collapsed: false,
            winHeight: 0
        }
        this.password = '';
        this.changeCollapsed = this.changeCollapsed.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    changeCollapsed() {
        this.setState({
            collapsed: !this.state.collapsed
        })
    }
    getWinHeight() {
        let winHeight = 0;
        if (window.innerHeight) winHeight = window.innerHeight;
        else if (document.body && document.body.clientHeight)     //IE 
            winHeight = document.body.clientHeight;
        return winHeight;
    }
    componentWillMount() {
        this.setState({
            winHeight: this.getWinHeight()
        })
    }
    handleSubmit() {
        // this.props.GlobalStore.setIsLoading(true);
        let self = this;
        if (common.isEmpty(self.password)) {
            message.warn("请输入密码");
            return
        }
        authService.login({ "username": localStorage.account, "password": self.password }).then(res => {
            // self.props.GlobalStore.setIsLoading(false)
            // debugger
            if (!publicUtils.isOk(res)) return
            localStorage.token = res.data.result.token;
            if (res.data.result.jwtUser.tokenExpTimeMs) {
                self.props.GlobalStore.setTokenExpTimeMsValue(res.data.result.jwtUser.tokenExpTimeMs);
                self.props.GlobalStore.setIsTokenExpTimeMs(false);
                // self.props.GlobalStore.setIsLoading(false);
                window.location.reload()
            }

        }).catch(() => self.props.GlobalStore.setIsLoading(false));
    }

    componentWillUnmount() {
        // console.log("t111111   componentWillUnmount 111111li1111");
        clearTimeout(timer_verify);
    }

    componentDidMount() {
    }
    render() {

        // console.log("this.props.GlobalStore.getTokenExpTimeMsValue = ", this.props.GlobalStore.getTokenExpTimeMsValue);
        // console.log("this.props.GlobalStore.menu.getLeft layout index", this.props.GlobalStore.menu.getLeft);
        clearTimeout(timer_verify);
        var self = this;
        if (self.props.GlobalStore.getTokenExpTimeMsValue) {
            timer_verify = setTimeout(() => {
                console.log("定时器", self.props.GlobalStore.getTokenExpTimeMsValue);
                clearTimeout(timer_verify);
                self.props.GlobalStore.setIsTokenExpTimeMs(true);
                // }, 3000);
            }, self.props.GlobalStore.getTokenExpTimeMsValue);
        }
        return (
            <div className='Layouts_wrap clear clearFix'>
                <Left collapsed={this.state.collapsed} />
                <Right collapsed={this.state.collapsed} changeCollapsed={this.changeCollapsed} />
                <div style={{ clear: 'both' }}></div>


                <Modal
                    title="验证密码"
                    maskClosable={false}
                    visible={this.props.GlobalStore.getIsTokenExpTimeMs}
                    onOk={() => { this.handleSubmit() }}
                    onCancel={() => {
                        clearTimeout(timer_verify);
                        this.props.GlobalStore.setIsTokenExpTimeMs(false);
                        this.props.history.push("/login");
                    }}
                >



                    <Row>
                        <Col span={3}>
                            <Icon type="exclamation-circle" style={{ fontSize: '37px', color: "orange" }} />
                        </Col>
                        <Col span={21}>
                            <div>
                                <p className="clearfix" style={style.modal.main.rowTop.style}>
                                    <span style={style.modal.main.row.right.style}>系统已被锁定，请输入密码解锁！</span>
                                </p>

                                <p className="clearfix" style={style.modal.main.row.style}>
                                    <span style={style.modal.main.row.left.style}>用户名:</span>
                                    <span style={style.modal.main.row.right.style}>{localStorage.account}</span>
                                    {/* <input  value={localStorage.account} style={style.modal.main.row.right.style}  /> */}
                                    {/* <Input
                                        type="text"
                                        placeholder="请输入账号"
                                        style={style.modal.main.row.right.style}
                                        value={localStorage.account} /> */}
                                </p>
                                <p className="clearfix" style={style.modal.main.row.style}>
                                    <span style={style.modal.main.row.left.style}>密码:</span>
                                    <Input
                                        autoFocus
                                        type="password"
                                        placeholder="请输入密码"
                                        style={style.modal.main.row.right.style}
                                        defaultValue={this.password}
                                        onChange={e => this.password = e.target.value}
                                        onPressEnter={() => this.handleSubmit()} />
                                </p>
                            </div>
                        </Col>
                    </Row>


                </Modal>
            </div>
        )
    }
}

export default Layouts;


const style = {
    modal: {
        main: {
            style: {},
            row: {
                style: {
                    margin: '10px'
                },
                left: {
                    style: {
                        float: 'left',
                        width: '60px',
                        height: "32px",
                        lineHeight: "32px",
                        fontWeight: 'bold'
                    }
                },
                right: {
                    style: {
                        float: 'left',
                        width: 'fit-content',
                        height: "32px",
                        lineHeight: "32px"
                    }
                }
            },
            rowTop: {
                style: {
                    margin: '0 10px 10px 10px'
                }
            }
        }
    }
}
