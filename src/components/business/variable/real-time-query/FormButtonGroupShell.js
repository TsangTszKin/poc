/*
 * @Author: zengzijian
 * @Date: 2018-08-14 10:42:15
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-19 15:53:55
 * @Description: 通用的保存或者编辑页面页脚的按钮组，包括“取消”和“保存”按钮
 */
import React, { Component } from 'react';
import { observer } from 'mobx-react';

let timer = 0;

@observer
class FormButtonGroupShell extends Component {
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

    }

    componentWillUnmount() {
        window.clearInterval(timer);
    }

    render() {
        return (
            <div style={this.state.style} id="form-button-group">
                {this.props.children}
            </div>
        )
    }
}
FormButtonGroupShell.propTypes = {
}
FormButtonGroupShell.defaultProps = {
}
export default FormButtonGroupShell;