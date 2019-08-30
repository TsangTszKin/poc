import React from 'react';
import { Icon, Form, Input, Radio, Switch, Select } from 'antd';
import { inject, observer } from 'mobx-react';
import commom from '@/utils/common';

@Form.create()
@inject('store')
@observer
class FormData extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        const FormItem = Form.Item;
        const {
            getFieldDecorator, getFieldsError, getFieldError, isFieldTouched,
        } = this.props.form;
        // Only show error after a field is touched.
        const keyNameError = isFieldTouched('keyName') && getFieldError('keyName');
        const keyCodeError = isFieldTouched('keyCode') && getFieldError('keyCode');
        const dataTypeError = isFieldTouched('dataType') && getFieldError('dataType');

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        return (
            <Form layout="horizontal">
                <FormItem
                    validateStatus={keyNameError ? 'error' : ''}
                    help={keyNameError || ''}
                    label="名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('keyName', {
                        rules: [{ required: true, message: '请输入长度小于50字符的名称!', max: 50 }],
                        initialValue: this.props.store.getData.keyName
                    })(
                        <Input placeholder="请输入名称" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={keyCodeError ? 'error' : ''}
                    help={keyCodeError || ''}
                    label="标识"
                    {...formItemLayout}
                >
                    {getFieldDecorator('keyCode', {
                        rules: [{ required: true, message: '请输入长度小于20字符的标识!', max: 20 }],
                        initialValue: this.props.store.getData.keyCode
                    })(
                        <Input type="text" disabled={this.props.store.getData.id != null ? true : false}placeholder="请输入标识" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={dataTypeError ? 'error' : ''}
                    help={dataTypeError || ''}
                    label="类型"
                    {...formItemLayout}
                >
                    {getFieldDecorator('dataType', {
                        rules: [{ required: true, message: '请选择类型!' }],
                        initialValue: this.props.store.getData.dataType
                    })(
                        <Select >
                            <Select.Option value={12} >字符</Select.Option>
                            <Select.Option value={2003} >字典</Select.Option>
                            <Select.Option value={4} >整型</Select.Option>
                            <Select.Option value={6} >浮点型</Select.Option>
                            <Select.Option value={16} >布尔类型</Select.Option>
                            <Select.Option value={93} >日期类型</Select.Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem style ={{position: 'relative',left: '26px'}}
                          label="是否可用"
                          {...formItemLayout}>
                    {getFieldDecorator('status', {
                        initialValue: this.props.store.getData.status
                    })(
                        <Switch  defaultChecked ={this.props.store.getData.status ==1 ?true:false}/>
                    )}
                </FormItem>


            </Form>
        )
    }
}

export default FormData