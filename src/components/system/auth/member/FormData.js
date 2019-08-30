import React from 'react';
import { Icon, Form, Input, Radio, Select } from 'antd';
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
        const nameError = isFieldTouched('nickName') && getFieldError('nickName');
        const accountError = isFieldTouched('userName') && getFieldError('userName');
        const passwordError = isFieldTouched('password') && getFieldError('password');
        const phoneError = isFieldTouched('mobile') && getFieldError('mobile');
        const emailError = isFieldTouched('email') && getFieldError('email');
        const organizationError = isFieldTouched('organization') && getFieldError('organization');
        const enabledError = isFieldTouched('enabled') && getFieldError('enabled');

        const formItemLayout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        return (
            <Form layout="horizontal">
                <FormItem
                    validateStatus={nameError ? 'error' : ''}
                    help={nameError || ''}
                    label="姓名"
                    {...formItemLayout}
                >
                    {getFieldDecorator('nickName', {
                        rules: [{ required: true, message: '请输入长度小于20字符的用户名!', max: 20 }],
                        initialValue: this.props.store.getData.nickName
                    })(
                        <Input placeholder="请输入用户名" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={accountError ? 'error' : ''}
                    help={accountError || ''}
                    label="账号"
                    {...formItemLayout}
                >
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入长度小于20字符的账号!', max: 20 }],
                        initialValue: this.props.store.getData.userName
                    })(
                        <Input type="text" placeholder="请输入账号" />
                    )}
                </FormItem>
                {commom.isEmpty(this.props.store.getData.id) ?
                    <FormItem
                        validateStatus={passwordError ? 'error' : ''}
                        help={passwordError || ''}
                        label="密码"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入长度6~16字符的密码!', max: 16, min: 6 }],
                            initialValue: this.props.store.getData.password
                        })(
                            <Input type="password" placeholder="请输入密码" />
                        )}
                    </FormItem>
                    :
                    ''}
                <FormItem
                    validateStatus={phoneError ? 'error' : ''}
                    help={phoneError || ''}
                    label="手机号"
                    {...formItemLayout}
                >
                    {getFieldDecorator('mobile', {
                        rules: [{ required: true, message: '请输入正确的手机号!', max: 11 }],
                        initialValue: this.props.store.getData.mobile
                    })(
                        <Input type="number" placeholder="请输入手机号" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={emailError ? 'error' : ''}
                    help={emailError || ''}
                    label="邮箱"
                    {...formItemLayout}
                >
                    {getFieldDecorator('email', {
                        rules: [{ required: true, type: 'email', message: '请输入邮箱!' }, { max: 60, message: '邮箱长度不大于60个字符' }],
                        initialValue: this.props.store.getData.email
                    })(
                        <Input type="text" placeholder="请输入邮箱" />
                    )}
                </FormItem>
                <FormItem
                    validateStatus={organizationError ? 'error' : ''}
                    help={organizationError || ''}
                    label="所属机构"
                    {...formItemLayout}
                >
                    {getFieldDecorator('organization', {
                        rules: [{ required: true, message: '请选择机构!' }],
                        initialValue: this.props.store.getData.organization && this.props.store.getData.orgName ? `${this.props.store.getData.orgName}` : ''
                    })(
                        <Select >
                            {this.props.tree.map((item, i) =>
                                <Select.Option value={`${item.code}·-·${item.name}`} name={item.name} key={i}>{item.name}</Select.Option>
                            )}
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    validateStatus={enabledError ? 'error' : ''}
                    help={enabledError || ''}
                    label="状态"
                    {...formItemLayout}
                >
                    {getFieldDecorator('enabled', {
                        rules: [{ required: true, message: '请选择状态!' }],
                        initialValue: this.props.store.getData.enabled
                    })(
                        <Radio.Group>
                            <Radio value={true}>有效</Radio>
                            <Radio value={false}>无效</Radio>
                        </Radio.Group>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default FormData