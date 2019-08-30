/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-24 15:43:47
 * @Description: 
 */
import React, { Component } from 'react';
import SideMenu from '@/components/side-menu/Index';
import logo from '@/assets/side-logo.png';
import shuangzhaokeji from '@/assets/shuangzhaokeji.png';
import { inject, observer } from 'mobx-react';
import PropTypes from 'prop-types';

@inject('GlobalStore')
@observer
class Left extends Component {
    constructor(props) {
        super(props);
        this.state = {
            styleOut: {
                width: '180px'
            },
            styleRight: {
                display: 'block'
            },
            styleLeft: {
                width: '60px'
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.collapsed !== this.props.collapsed) {
            if (nextProps.collapsed) {
                this.setState({
                    styleOut: {
                        width: "80px"
                    },
                    styleRight: {
                        display: 'none'
                    },
                    styleLeft: {
                        width: '100%'
                    }
                })
            } else {
                this.setState({
                    styleOut: {
                        width: "180px"
                    },
                    styleRight: {
                        display: 'block'
                    },
                    styleLeft: {
                        width: '60px'
                    }
                })
            }
        }
    }
    render() {
        // console.log("this.props.GlobalStore.menu.getLeft layout left", this.props.GlobalStore.menu.getLeft);
        return (
            <div className='left' style={this.props.style}>
                <div className='userInfo' style={this.state.styleOut}>
                    <div className="left" style={this.state.styleLeft}>
                        <img src={logo} style={{width: '38px', height: '32px'}}  />
                    </div>
                    <div className="right" style={this.state.styleRight}>
                        <img src={shuangzhaokeji} style={{width: '71px', height: '32px'}} />
                    </div>

                </div>
                <SideMenu leftMenu={this.props.GlobalStore.menu.getLeft} collapsed={this.props.collapsed}></SideMenu>
            </div>
        )
    }
}

Left.propTypes = {
    collapsed: PropTypes.bool
}
Left.defaultProps = {
    collapsed: false
}

export default Left