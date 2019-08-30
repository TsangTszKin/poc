import React, { Component } from 'react';
import { Modal, Form, Input, Icon, Button, Select, Radio } from 'antd';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
class AddNodeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: true
        }
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.form3Options = [
            { name: '查询', value: 'query' }
        ];
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    handleChangeSelect = (value) => {
        value = value.target.value;
        console.log(`selected ${value}`, value);
        if (value === 0) {
            this.setState({
                disabled: true
            });
            // this.form3Options = [];
        } else {
            this.setState({
                disabled: false
            });
            // this.form3Options = [{ name: '查询', value: 'query' }];
        }
    }

    render() {

        const { getFieldDecorator, getFieldsError, getFieldError, isFieldTouched } = this.props.form;

        // Only show error after a field is touched.
        const form1Error = isFieldTouched('form1') && getFieldError('form1');
        const form2Error = isFieldTouched('form2') && getFieldError('form2');
        const form3Error = isFieldTouched('form3') && getFieldError('form3');
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };

        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit} ref="getFormValue">
                <FormItem
                    validateStatus={form1Error ? 'error' : ''}
                    help={form1Error || ''}
                    label="节点名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('form1', {
                        rules: [{ required: true, message: '请输入节点名称!' }],
                    })(
                        <Input placeholder="请输入" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={form2Error ? 'error' : ''}
                    help={form2Error || ''}
                    label="节点类型"
                    {...formItemLayout}
                >
                    {getFieldDecorator('form2', {
                        rules: [{ required: true, message: '请选择节点类型!' }],
                        initialValue: 0
                    })(
                        // <Select onChange={this.handleChangeSelect}>
                        //     <Select.Option value="0">控制节点</Select.Option>
                        //     <Select.Option value="1">执行节点</Select.Option>
                        // </Select>
                        <Radio.Group onChange={this.handleChangeSelect}>
                            <Radio.Button value={0}>控制节点</Radio.Button>
                            <Radio.Button value={1}>执行节点</Radio.Button>
                        </Radio.Group>
                    )}
                </FormItem>
                {
                    this.state.disabled ? '' :
                        <FormItem
                            validateStatus={form3Error ? 'error' : ''}
                            help={form3Error || ''}
                            label="执行节点类型"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('form3', {
                                rules: [{ required: !this.state.disabled, message: '请选择执行节点类型!' }],
                                initialValue: this.state.disabled ? '' : 2
                            })(
                                // <Select disabled={this.state.disabled}>
                                //     {/* <Select.Option value="no">暂无</Select.Option> */}
                                //     <Select.Option value="2">查询</Select.Option>
                                //     <Select.Option value="4">赋值</Select.Option>
                                // </Select>
                                <Radio.Group onChange={this.handleChangeSelect}>
                                    <Radio.Button value={2}>查询</Radio.Button>
                                    <Radio.Button value={4}>赋值</Radio.Button>
                                </Radio.Group>
                            )}
                        </FormItem>
                }
            </Form>
        )
    }
}

export default AddNodeForm;