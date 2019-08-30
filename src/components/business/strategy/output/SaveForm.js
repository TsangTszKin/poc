/*
 * @Author: zengzijian
 * @Date: 2018-11-27 11:48:28
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:20:58
 * @Description: 
 */
import React, { Component } from 'react';
import { Form, Input, Select } from 'antd';
import variableService from '@/api/business/variableService';
import publicUtils from '@/utils/publicUtils';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import common from '@/utils/common';
import commonService from '@/api/business/commonService.js'

const FormItem = Form.Item;


@Form.create()
@withRouter
@inject('store')
@observer
class SaveForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataTypeList: [],
            categoryList: []
        }
        this.getDataTypeList = this.getDataTypeList.bind(this);
    }

    componentDidMount() {
        this.getDataTypeList();
        this.getCategoryList();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
            }
        });
    }

    getDataTypeList() {
        variableService.getDataTypeList().then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            res.data.result.forEach(element => {
                if (element.val == 16) return
                tempArray.push({
                    code: element.val + '·-·' + element.label,
                    value: element.label
                });
            })
            this.setState({
                dataTypeList: tempArray
            })
        })
    }

    getCategoryList = () => {
        commonService.getCategoryListByType('parameter').then(res => {
            if (publicUtils.isOk(res)) {
                this.categoryList = res.data.result;
                const categoryList = res.data.result.map(element => {
                    return {
                        code: element.dataValue + '·-·' + element.dataName,
                        value: element.dataName
                    };
                });
                this.setState({ categoryList });
            }
        })
    }


    render() {

        const { getFieldDecorator } = this.props.form;

        let getCategoryLabel = categoryValue => {
            console.log(this.state.categoryList);
            console.log('categoryValue', categoryValue);
            const selectedItem = this.categoryList ? this.categoryList.find(item => item.dataValue == categoryValue) : null;
            return selectedItem ? selectedItem.dataName : '';
        };
        const formItemLayout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 14 },
        };

        const inputGenerator = common.inputGenerator.call(this);
        let setDefaultValueInput = inputGenerator('defaultValue', this.props.store.saveData.getType,
            { initialValue: this.props.store.saveData.getDefaultValue, label: '默认值' });
        return (
            // eslint-disable-next-line react/no-string-refs
            <Form layout="horizontal" onSubmit={this.handleSubmit} ref="getFormValue">
                <FormItem
                    label="名称"
                    {...formItemLayout}
                >
                    {getFieldDecorator('name', {
                        rules: [
                            { required: true, message: '请输入名称!' },
                            { max: 32, message: '最大长度32!' },
                        ],
                        initialValue: this.props.store.saveData.getName
                    })(
                        <Input placeholder="请输入" />
                    )}
                </FormItem>
                <FormItem
                    label="标识"
                    {...formItemLayout}
                >
                    {getFieldDecorator('code', {
                        rules: [
                            { required: true, message: '请输入标识!', },
                            { message: '请输入字母，数字，下划线', pattern: new RegExp("^[A-Za-z0-9_]+$") },
                            { max: 12, message: '最大长度12!' },
                        ],
                        initialValue: this.props.store.saveData.getCode
                    })(
                        <Input placeholder="请输入" disabled={!common.isEmpty(this.props.store.saveData.getId)} />

                    )}
                </FormItem>

                <FormItem
                    label="数据类型"
                    {...formItemLayout}
                >
                    {getFieldDecorator('type_and_typeLabel', {
                        rules: [{ required: true, message: '请选择数据类型!' }],
                        initialValue: (common.isEmpty(this.props.store.saveData.getType) || common.isEmpty(this.props.store.saveData.getTypeLabel)) ? null : `${this.props.store.saveData.getType}·-·${this.props.store.saveData.getTypeLabel}`
                    })(
                        <Select onChange={(value) => {
                            this.props.store.saveData.setType(value.split('·-·')[0]);
                            this.props.store.saveData.setDefaultValue('');
                            this.props.form.setFields({ 'defaultValue': '' });
                        }}>
                            {
                                this.state.dataTypeList.map((item, i) =>
                                    <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    label="默认值"
                    { ...formItemLayout }
                >
                    { setDefaultValueInput }
                </FormItem>

                <FormItem
                    label="类别"
                    {...formItemLayout}
                >
                    {getFieldDecorator('category', {
                        rules: [{ required: true, message: '请选择类别!' }],
                        initialValue: common.isEmpty(this.props.store.saveData.category) ?
                            null : `${this.props.store.saveData.category}·-·${getCategoryLabel(this.props.store.saveData.category)}`
                    })(
                        <Select>
                            {
                                this.state.categoryList.map((item, i) =>
                                    <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                                )
                            }
                        </Select>
                    )}
                </FormItem>
            </Form>
        )
    }
}

export default SaveForm;