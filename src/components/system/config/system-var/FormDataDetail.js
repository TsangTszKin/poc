import React from 'react';
import { Icon, Form, Input, InputNumber, Radio, Switch } from 'antd';
import { inject, observer } from 'mobx-react';
import commom from '@/utils/common';

@Form.create()
@inject('store')
@observer
class FormData extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const FormItem = Form.Item;
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        // Only show error after a field is touched.
        const dataNameError = isFieldTouched('dataName') && getFieldError('dataName');
        const dataCodeError = isFieldTouched('dataCode') && getFieldError('dataCode');
        const dataValueError = isFieldTouched('dataValue') && getFieldError('dataValue');
        const statusError = isFieldTouched('status') && getFieldError('status');

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };

        return (
            <Form layout="horizontal">
                <FormItem
                    validateStatus={dataNameError ? 'error' : ''}
                    help={dataNameError || ''}
                    label="名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('dataName', {
                        rules: [{ required: true, message: '请输入长度小于50字符的名称!', max: 50 }],
                        initialValue: this.props.store.getData2.dataName
                    })(
                        <Input placeholder="请输入名称" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={dataCodeError ? 'error' : ''}
                    help={dataCodeError || ''}
                    label="标识"
                    {...formItemLayout}
                >
                    {getFieldDecorator('dataCode', {
                        rules: [{ required: true, message: '请输入长度小于20字符的标识!', max: 20 }],
                        initialValue: this.props.store.getData2.dataCode
                    })(
                        <Input type="text" placeholder="请输入标识" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={dataValueError ? 'error' : ''}
                    help={dataValueError || ''}
                    label="值"
                    {...formItemLayout}
                >
                    {getFieldDecorator('dataValue', {
                        rules: [{ required: true, message: '请输入整型的数值!' }],
                        initialValue: this.props.store.getData2.dataValue
                    })(
                        <InputNumber placeholder="请输入" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={statusError ? 'error' : ''}
                    help={statusError || ''}
                    label="是否可用"
                    {...formItemLayout}
                >
                    {getFieldDecorator('status', {
                        rules: [{ required: false, message: '请输入值!' }],
                        initialValue: this.props.store.getData2.status
                    })(
                        <Switch checkedChildren="是" unCheckedChildren="否" checked={this.props.store.getData2.status == 1}
                            onChange={(isChecked) => {
                                let data2 = this.props.store.getData2;
                                data2.status = isChecked ? 1 : 2;
                                this.props.store.setData2(data2);
                            }}
                        />
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default FormData