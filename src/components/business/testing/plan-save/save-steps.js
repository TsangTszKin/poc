import {Button, Form, Icon, Input, Steps, Tag, Tooltip} from "antd";
import store from "@/store/business/testing/plan-save";
import React, {Component} from "react";
import {inject} from "mobx-react";

@inject('store')
class SaveSteps extends Component {
    constructor(props) {
        super(props);
    }

    // 记录Input组件的dom
    saveInputRef = input => { this.input = input }

    render() {
        const {inputVisible, newFilterTag} = this.state;
        const itemLayout = {labelCol: {span: 4, offset: 6}, wrapperCol: {span: 12}};
        const steps = [{
            title: '下载模板',
            content: (
                <div className="step-content">
                    <Form layout={{formLayout: 'horizontal'}}>
                        <Form.Item className="step-form-item" {...itemLayout} label="过滤字段">
                            {store.filterTags.map((tag, index) => {
                                const isLongTag = tag.length > 20;
                                const tagElem = (
                                    <Tag key={tag} closable={true} onClose={() => this.handleClose(tag)}>
                                        {isLongTag ? `${tag.slice(0, 20)}...` : tag}
                                    </Tag>
                                );
                                return isLongTag ? <Tooltip title={tag} key={tag}>{tagElem}</Tooltip> : tagElem;
                            })}
                            {inputVisible && (
                                <Input
                                    ref={this.saveInputRef}
                                    type="text"
                                    size="small"
                                    style={{ width: 78 }}
                                    value={newFilterTag}
                                    onChange={this.handleInputChange}
                                    onBlur={this.handleInputConfirm}
                                    onPressEnter={this.handleInputConfirm}
                                />
                            )}
                            {!inputVisible && (
                                <Tag
                                    onClick={this.showInput}
                                    style={{ background: '#fff', borderStyle: 'dashed' }}
                                >
                                    <Icon type="plus" /> 新字段
                                </Tag>
                            )}
                        </Form.Item>
                        <Form.Item className="step-form-item" {...itemLayout} label="下载模板">
                            <Button htmlType="button"><Icon type="download" onClick={this.downloadTemplate} />下载模板</Button>
                        </Form.Item>
                    </Form>

                    <Button type="primary" onClick={this.nextStep} htmlType="button">下一步</Button>
                </div>
            ),
        }, {
            title: '上传文件',
            content: (
                <div className="step-content">
                    <p>点击将文件拖拽到这里</p>
                    <div>
                        <Button type="primary" onClick={this.submit} htmlType="button">提交</Button>
                        <Button className="previous-step-btn" type="default" onClick={this.prevStep} htmlType="button">上一步</Button>
                    </div>
                </div>
            ),
        }, {
            title: '完成',
            content: (
                <div className="step-content">
                    table
                </div>
            ),
        }];

        return (
            <div className="test-save-content">
                <Steps current={this.state.currentStep}>
                    <Steps.Step title="下载模板" />
                    <Steps.Step title="上传数据" />
                    <Steps.Step title="完成" />
                </Steps>
                {steps[this.state.currentStep].content}
            </div>
        )
    }
}

export default SaveSteps;