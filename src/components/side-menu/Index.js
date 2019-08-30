/*
 * @Author: zengzijian
 * @Date: 2019-08-24 09:40:24
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-24 09:58:11
 * @Description: 
 */
import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'
import { Menu, Icon } from 'antd'
const SubMenu = Menu.SubMenu
import '@/styles/side-menu.less'
import { inject, observer } from 'mobx-react'
/**
 * 侧导航栏菜单
 * 
 * @class SideMenu
 * @extends {Component}
 */
@withRouter
@inject('GlobalStore')
@observer
class SideMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keys: [],
            collapsed: false,
            style: {
                width: '180px'
            },
            defaultOpenKeys: [],
            index: 0
        }
        this.initMenuActive = this.initMenuActive.bind(this);
        this.onOpenChange = this.onOpenChange.bind(this);
    }

    initMenuActive = () => {
        let pathname = this.props.history.location.pathname;
        let tempArray = pathname.split('/');
        let openMenukey = '/' + tempArray[1] + '/' + tempArray[2];
        let activeMenuOption = openMenukey + '/' + tempArray[3];
        this.setState({
            keys: [activeMenuOption],
            defaultOpenKeys: this.props.collapsed ? []: [openMenukey]
        })
    }
    componentWillMount() {
        this.initMenuActive();
    }
    onSelect = ({ key }) => {
        // console.log("key", key);
        this.props.history.push(key);
        this.setState({
            keys: [key]
        })
    }
    componentWillReceiveProps(nextProps) {
        // console.info("nextProps", nextProps);
        this.setState({
            collapsed: nextProps.collapsed
        });

        if (this.props.location.pathname != nextProps.location.pathname) {
            this.initMenuActive();
        }

        if (nextProps.collapsed !== this.props.collapsed) {
            if (nextProps.collapsed) {
                this.setState({
                    style: {
                        width: "80px"
                    },
                    defaultOpenKeys: []
                })
            } else {
                this.setState({
                    style: {
                        width: "180px"
                    }
                })
            }
        }
    }


    onOpenChange = (defaultOpenKeys) => {
        // console.log("defaultOpenKeys  = ", defaultOpenKeys);
        this.setState({
            defaultOpenKeys: defaultOpenKeys,
        });
    }
    render() {
        return (
            <div className='SideMenu_wrap' style={this.state.style}>

                <Menu
                    mode="inline"
                    theme="dark"
                    onClick={this.onSelect}
                    selectedKeys={this.state.keys}
                    inlineCollapsed={this.props.collapsed}
                    defaultOpenKeys={this.state.defaultOpenKeys}
                    openKeys={this.state.defaultOpenKeys}
                    onOpenChange={this.onOpenChange}
                >
                    {this.props.leftMenu.map((item) =>
                        item.child && item.child.length > 0 ?
                            <SubMenu key={item.url} title={<span><Icon type={item.icon} /><span>{item.name}</span></span>} >
                                {item.child.map((listItem) =>
                                    <Menu.Item key={listItem.url}>
                                        <span>{listItem.name}</span>
                                    </Menu.Item>
                                )}
                            </SubMenu>
                            :
                            <Menu.Item key={item.url}>
                                <Icon type={item.icon} />
                                <span>{item.name}</span>
                            </Menu.Item>
                    )}
                </Menu>
            </div>
        )
    }
}

export default SideMenu