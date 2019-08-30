/*
 * @Author: zengzijian
 * @Date: 2018-08-14 10:42:15
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-03-20 15:36:18
 * @Description: 通用的保存或者编辑页面页脚的按钮组，包括“取消”和“保存”按钮
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';
import publicUtils from '@/utils/publicUtils';

let timer = 0;
class FormButtonGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            style: {
                // padding: '10px',
                textAlign: 'right',
                backgroundColor: '#fff',
                position: 'fixed',
                bottom: '0',
                right: '0px',
                boxShadow: '0 -4px 4px rgba(0,21,41,.08)',
                zIndex: '999',
                height: "50px",
                padding: "10px"
            }
        }
    }

    adjustWidth() {
        timer = setInterval(function () {
            window.document.querySelector("#form-button-group").style.width = window.document.querySelector("#root .right .panel").offsetWidth + 'px';

        }, 100)
    }

    componentDidMount() {
        this.adjustWidth();
        // window.document.querySelector(".panel .pageContent").style.height = window.document.querySelector(".panel .pageContent").offsetHeight + 100 + 'px';

    }

    componentWillUnmount() {
        window.clearInterval(timer);
    }


    render() {
        return (
            <div style={this.state.style} id="form-button-group">
               {/* {
                    publicUtils.isAuth("system:config:task:edit") ? <Button type="primary" style={{ marginRight: '24px' }} onClick={this.props.syncToRTD} >同步RTD</Button> : ''
                }
                {
                    publicUtils.isAuth("system:config:task:edit") ? <Button type="primary" style={{ marginRight: '24px' }} onClick={this.props.syncExtVarToRTD} >同步衍生变量到RTD</Button> : ''
                }*/}
                {
                    publicUtils.isAuth("system:config:task:edit") ? <Button type="primary" onClick={this.props.save} >保存</Button> : ''
                }
            </div>
        )
    }
}
FormButtonGroup.propTypes = {
    syncToRTD: PropTypes.func,
    syncExtVarToRTD: PropTypes.func,
    save: PropTypes.func,
    isFixed: false
}
FormButtonGroup.defaultProps = {
    syncToRTD: () => { },
    syncExtVarToRTD: () => { },
    save: () => { },
}
export default FormButtonGroup;