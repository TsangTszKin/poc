/*
 * @Author: zengzijian
 * @Date: 2018-08-14 10:42:15
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-03-20 15:35:38
 * @Description: 通用的保存或者编辑页面页脚的按钮组，包括“取消”和“保存”按钮
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, message } from 'antd';

let timer = 0;
class FormButtonGroup2 extends Component {
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
            // alert($("#root .right .panel").width())
            // $("#form-button-group").width($("#root .right .panel").width())
            window.document.querySelector("#form-button-group").style.width = window.document.querySelector("#root .right .panel").offsetWidth + 'px';

        }, 100)
    }

    componentDidMount() {
        this.adjustWidth();
        // $(".panel .pageContent").height($(".panel .pageContent").height() + 50)
        // window.document.querySelector(".panel .pageContent").style.height = window.document.querySelector(".panel .pageContent").offsetHeight + 100 + 'px';

    }

    componentWillUnmount() {
        window.clearInterval(timer);
    }


    render() {
        return (
            <div style={this.state.style} id="form-button-group">
                <Button style={{ marginRight: '24px' }} onClick={this.props.cancelCallBack} >取消</Button>
                <Button style={{ marginRight: '24px' }} onClick={this.props.multiOffline} >下线</Button>
                <Button type="primary" onClick={this.props.multiOnline} >上线</Button>
            </div>
        )
    }
}
FormButtonGroup2.propTypes = {
    cancelCallBack: PropTypes.func,
    saveCallBack: PropTypes.func,
    isFixed: false
}
FormButtonGroup2.defaultProps = {
    cancelCallBack: () => { },
    saveCallBack: () => { }
}
export default FormButtonGroup2;