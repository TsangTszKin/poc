/*
 * @Author: zengzijian
 * @Date: 2018-08-14 10:42:15
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-03-20 15:34:00
 * @Description: 通用的保存或者编辑页面页脚的按钮组，包括“取消”和“保存”按钮
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Modal, Input, message } from 'antd';
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';

let timer = 0;

@inject('store')
@inject('processTreeStore')
@observer
class FormButtonGroupForProcessTree extends Component {
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
            // console.log('window.document.querySelector("#root .right .panel").offsetWidth', window.document.querySelector("#root .right .panel").offsetWidth)
            window.document.querySelector("#form-button-group").style.width = window.document.querySelector("#root .right .panel").offsetWidth + 'px';
        }, 100)
    }

    componentDidMount() {
        this.adjustWidth();
        // $(".panel > .pageContent").height($(".panel>.pageContent").height() + 100)
        // console.log('window.document.querySelector(".panel .pageContent").offsetHeight', window.document.querySelector(".panel .pageContent").offsetHeight)
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

                {
                    this.props.store.getIsHaveCommitBtn ?
                        <Button style={{ marginRight: '24px' }} onClick={() => {
                            // this.props.store.submitSaveData()
                            this.props.store.modal.submit.setIsShow(true);
                        }} disabled={!this.props.processTreeStore.getIsCanCommit} >提交</Button>
                        : ''
                }

                {
                    this.props.store.getIsHaveCommitBtn ?
                        <Modal
                            title="提交"
                            // visible={true}
                            visible={this.props.store.modal.submit.getIsShow}
                            onOk={() => {
                                if (common.isEmpty(this.props.store.approvalSubmitParams.remark)) {
                                    message.warn("请输入备注");
                                    return
                                } else {
                                    this.props.store.approvalSubmitForApi();
                                }
                            }}
                            onCancel={() => this.props.store.modal.submit.setIsShow(false)}
                            okText="提交"
                        >
                            <p style={{ float: 'left', width: 'fit-content' }}>备注：</p>
                            <Input.TextArea
                                rows={4}
                                style={{ float: 'left', width: 'calc(100% - 50px)' }}
                                placeholder="请输入"
                                value={this.props.store.approvalSubmitParams.remark}
                                onChange={(e) => {
                                    this.props.store.approvalSubmitParams.remark = e.target.value;
                                }}
                            />
                            <div style={{ clear: 'both' }}></div>
                        </Modal>

                        : ''
                }


            </div>
        )
    }
}
FormButtonGroupForProcessTree.propTypes = {
    cancelCallBack: PropTypes.func,
    saveCallBack: PropTypes.func,
    isFixed: PropTypes.bool,
    isShowCancelBtn: PropTypes.bool,
    isShowSaveBtn: PropTypes.bool
}
FormButtonGroupForProcessTree.defaultProps = {
    cancelCallBack: () => { },
    saveCallBack: () => { },
    isFixed: false,
    isShowCancelBtn: true,
    isShowSaveBtn: true
}
export default FormButtonGroupForProcessTree;