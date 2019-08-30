/*
 * @Author: zengzijian
 * @Date: 2018-08-14 10:42:15
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-05-17 13:32:38
 * @Description: 通用的保存或者编辑页面页脚的按钮组，包括“取消”和“保存”按钮
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Input, message } from 'antd';
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';

let timer = 0;

@inject('store')
@observer
class FormButtonGroupForEventSourceMapping extends Component {
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
        // $(".panel > .pageContent").height($(".panel>.pageContent").height() + 100)
        // window.document.querySelector(".panel .pageContent").style.height = window.document.querySelector(".panel .pageContent").offsetHeight + 100 + 'px';

    }

    componentWillUnmount() {
        window.clearInterval(timer);
    }



    render() {
        return (
            <div style={this.state.style} id="form-button-group">
                {this.props.isShowCancelBtn ?
                    <Button style={{ marginRight: '24px' }} onClick={this.props.cancelCallBack} >取消</Button> : ''
                }
                {
                    this.props.isShowSaveBtn ? <Button style={{ marginRight: '24px' }} type="primary" onClick={this.props.saveCallBack} >保存</Button> : ''
                }

            </div>
        )
    }
}
FormButtonGroupForEventSourceMapping.propTypes = {
    cancelCallBack: PropTypes.func,
    saveCallBack: PropTypes.func,
    isFixed: PropTypes.bool,
    isShowCancelBtn: PropTypes.bool,
    isShowSaveBtn: PropTypes.bool
}
FormButtonGroupForEventSourceMapping.defaultProps = {
    cancelCallBack: () => { },
    saveCallBack: () => { },
    isFixed: false,
    isShowCancelBtn: true,
    isShowSaveBtn: true
}
export default FormButtonGroupForEventSourceMapping;