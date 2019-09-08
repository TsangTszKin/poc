/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 16:33:49
 * @Description: 
 */
import React, { Component } from 'react';
import { Avatar, Button, Icon, Menu, Dropdown } from 'antd';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';
import TopNav from '@/components/TopNav';
import PropTypes from 'prop-types';
import authService from '@/api/authService';
import common from '@/utils/common';

@withRouter
@inject('GlobalStore')
@observer
class Top extends Component {
    constructor(props) {
        super(props);
        this.resizePanelCallBackFunc = this.resizePanelCallBackFunc.bind(this);
        this.resizePanelCallBackFunc();
    }

    componentDidMount() {
        // let self = this;
        // window.onresize = function () {
        //     self.resizePanelCallBackFunc();
        // }

    }

    resizePanelCallBackFunc = () => {
        let winWidth = 0;
        if (window.innerWidth) winWidth = window.innerWidth;
        else if (document.body && document.body.clientWidth)     //IE 
            winWidth = document.body.clientWidth;
        if (winWidth < 1190 && !this.props.collapsed) {
            this.props.changeCollapsed();
        }
    }

    logout = () => {
        common.loading.show();
        authService.logout().then(() => {
            common.loading.hide();
            // if (!publicUtils.isOk(res)) return
            localStorage.removeItem('token');
            localStorage.removeItem('userName');
            this.props.history.replace('/login')
        }).catch(() => common.loading.hide())

        // localStorage.removeItem('token');
        // localStorage.removeItem('userName');
        // this.props.history.replace('/login')
    }
    callback = () => {
        // console.log(key);
    }
    componentWillMount() {
        if (this.props.GlobalStore.userInfo.getName == '') {
            this.props.GlobalStore.userInfo.setName(localStorage.userName);
            this.props.GlobalStore.userInfo.setOrgName(localStorage.orgName);
        }
    }
    render() {
        const menu = (
            <Menu>
                <Menu.Item key="1"
                //  onClick={() => this.logout()}
                 onClick={() => this.props.history.push('/login')}
                 
                 ><Icon type="logout" /><span style={{ marginLeft: "5px" }}>退出</span></Menu.Item>
            </Menu>
        );
        // console.log("this.props.GlobalStore.menu.getTop layout top", this.props.GlobalStore.menu.getTop);
        return (
            <div className='header clear clearFix'>
                <div className="aside-o">
                    <Button className="aside-ctr" type="primary" onClick={this.props.changeCollapsed} style={{ boxShadow: 'none' }}>
                        <Icon type={this.props.collapsed ? 'menu-unfold' : 'menu-fold'} />
                    </Button>

                </div>
                <div className="nav-o">
                    <TopNav topMenu={this.props.topMenu} />
                </div>

                <div className='user'>
                    <Avatar size="small" icon="user" />
                    <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link name" href="javascript:void(0);">
                            {this.props.GlobalStore.userInfo.getOrgName} - {this.props.GlobalStore.userInfo.getName}<Icon type="down" />
                        </a>
                    </Dropdown>
                </div>
            </div>
        )
    }
}
Top.propTypes = {
    changeCollapsed: PropTypes.func,
    collapsed: PropTypes.bool
}
Top.defaultProps = {
    changeCollapsed: () => { },
    collapsed: false
}
export default Top