import React, {Component} from 'react';
import {Form, Input} from 'antd';
import variableService from '@/api/business/variableService';
import publicUtils from '@/utils/publicUtils';
import {withRouter} from 'react-router-dom';
import {inject, observer} from 'mobx-react';

const {TextArea} = Input;
const FormItem = Form.Item;
import common from '@/utils/common';

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@withRouter
@inject('store')
@observer
class SaveForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTypeList: []
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    render() {

        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;

        // Only show error after a field is touched.
        const form1Error = isFieldTouched('code') && getFieldError('code');
        // const form2Error = isFieldTouched('description') && getFieldError('description');
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 14},
        };
        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit} ref="getFormValue">
                <FormItem
                    validateStatus={form1Error ? 'error' : ''}
                    help={form1Error || ''}
                    label="名称"
                    {...formItemLayout}
                >
                    {
                        getFieldDecorator('code', {
                        rules: [{required: true, message: '请输入名称!'}],
                        initialValue: this.props.store.saveData.getCode
                    })(
                        <Input  disabled={this.props.store.saveData.getStatus == 1 ? true : false} placeholder="请输入"/>
                    )}
                </FormItem>

                <FormItem
                    label="描述"
                    {...formItemLayout}
                >
                    {getFieldDecorator('description', {
                        initialValue: this.props.store.saveData.getDescription
                    })(
                        <TextArea placeholder="请输入"/>
                    )}
                </FormItem>


            </Form>
        )
    }
}

export default SaveForm;