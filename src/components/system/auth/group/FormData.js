import React from 'react';
import { Form, Input, Button } from 'antd';
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';

@inject('store')
@observer
@Form.create()
class FormData extends React.Component {
    constructor(props) {
        super(props);
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                console.log(this.props.store.data.getId, this.props.store.data.getName);
               
                this.props.store.modal.groupAdd.setIsShow(false);
                this.props.store.modal.groupSave.setIsShow(false);
                if (common.isEmpty(this.props.store.data.getId)){
                    this.props.store.saveForApi();
                }else {
                    this.props.store.renameForApi();
                }
                this.props.form.resetFields();
               
            }
        });


    }

    hasErrors(fieldsError) {
        return Object.keys(fieldsError).some(field => fieldsError[field]);
    }

    render() {
        const FormItem = Form.Item;
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        // Only show error after a field is touched.
        const nameError = isFieldTouched('name') && getFieldError('name');

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 24 },
        };

        return (
            <Form layout="horizontal" onSubmit={this.handleSubmit}>
                <FormItem
                    style={{ marginBottom: '13px' }}
                    validateStatus={nameError ? 'error' : ''}
                    help={nameError || ''}
                    // label="名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        rules: [{ required: true, message: '请输入小于20个字符!', max: 20 }],
                        initialValue: this.props.store.data.getName
                    })(
                        <Input placeholder="输入团队名称" value={this.props.store.data.getName} onChange={(e) => this.props.store.data.setName(e.target.value)} />
                    )}
                </FormItem>
                <Form.Item style={{ margin: '0', textAlign: 'right' }}>
                    <Button
                        size="small"
                        style={{ marginRight: '10px' }}
                        onClick={() => {
                            this.props.store.modal.groupAdd.setIsShow(false);
                            this.props.store.modal.groupSave.setIsShow(false);
                            this.props.store.data.setName("");
                            this.props.form.resetFields();
                        }}
                    >
                        取消
                    </Button>
                    <Button
                        type="primary"
                        htmlType="submit"
                        size="small"
                        disabled={common.isEmpty(this.props.store.data.getName)}
                    >
                        确定
                    </Button>
                </Form.Item>
            </Form>
        )
    }
}

export default FormData