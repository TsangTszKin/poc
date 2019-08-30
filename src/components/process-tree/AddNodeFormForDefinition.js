import React, { Component } from 'react';
import { Modal, Form, Input, Icon, Button, Select, message, Radio } from 'antd';
import { withRouter } from 'react-router-dom';
import strategyService from '@/api/business/strategyService';
import commonService from '@/api/business/commonService';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { inject, observer } from 'mobx-react';

const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

@Form.create()
@withRouter
@inject('processTreeStore')
@observer
class AddNodeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: false,
            ruleSetList: [],
            categoryList: [],
            ruleSetName: '',
            showRuleSetNameForm: true
        }
        this.handleChangeSelect = this.handleChangeSelect.bind(this);
        this.getNodeDetailById = this.getNodeDetailById.bind(this);
        this.getInitData = this.getInitData.bind(this);
        this.getCategoryList = this.getCategoryList.bind(this);
        this.form3Options = [{ name: '查询', value: 'query' }];
    }

    componentDidMount() {
        if (this.props.match.params.type === 'greedy')
            this.getCategoryList();
    }
    getNodeDetailById() {

    }
    componentWillReceiveProps(nestProps) {
        console.log("nestProps  =", nestProps);
        this.getCategoryList();
    }
    getCategoryList() {
        commonService.getCategoryListByType("ruleSet").then(res => {
            if (!publicUtils.isOk(res)) return
            let tempArray = [];
            if (res.data.result && res.data.result instanceof Array) {

                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.dataValue,
                        value: element.dataName
                    });
                })
                this.setState({
                    categoryList: tempArray
                })
            }
        })
    }
    getInitData(category) {
        this.setState({
            ruleSetList: [],
            ruleSetName: "",
            showRuleSetNameForm: false
        })
        strategyService.getRuleSetListByDimensionForRuleNode(this.props.match.params.id, category).then(res => {
            if (!publicUtils.isOk(res)) return
            if (res.data.result && typeof res.data.result !== 'string') {
                let tempArray = [];
                res.data.result.forEach(element => {
                    tempArray.push({
                        code: element.id,
                        value: element.name
                    });
                })
                this.setState({
                    ruleSetList: tempArray
                })

                if (this.props.match.params.id) {
                    this.getNodeDetailById(this.props.nodeId);
                }
            }
            this.setState({
                showRuleSetNameForm: true
            })
        })
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
        console.log(`selected ${value}`);
        if (value === 0) {
            this.setState({
                disabled: true
            });
            this.form3Options = [];
        } else {
            this.setState({
                disabled: false
            });
            this.form3Options = [{ name: '查询', value: 'query' }];
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
                {
                    this.props.match.params.type === 'greedy' ?
                        <FormItem
                            style={{ display: 'none' }}
                            validateStatus={form1Error ? 'error' : ''}
                            help={form1Error || ''}
                            label="节点名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('form1', {
                                rules: [{ required: true, message: '请输入节点名称!' }],
                                initialValue: 'greedy'
                            })(
                                <Input placeholder="请输入" />
                            )}
                        </FormItem> :
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
                }

                {
                    this.props.match.params.type === 'greedy' ? <FormItem
                        validateStatus={form2Error ? 'error' : ''}
                        help={form2Error || ''}
                        label="规则集类别"
                        {...formItemLayout}
                    >
                        {getFieldDecorator('form2', {
                            rules: [{ required: true, message: '请选择规则集类别!' }],
                            initialValue: ''
                        })(
                            // <Radio.Group onChange={(e) => {
                            //     this.getInitData(e.target.value);
                            // }}>
                            //     {
                            //         this.state.categoryList.map((item, i) =>
                            //             <Radio.Button value={item.code}>{item.value}</Radio.Button>
                            //         )
                            //     }
                            // </Radio.Group>
                            <Select onChange={(value) => {
                                this.getInitData(value);
                            }}>
                                {
                                    this.state.categoryList.map((item, i) =>
                                        <Select.Option value={item.code}>{item.value}</Select.Option>
                                    )
                                }
                            </Select>

                        )}
                    </FormItem> :
                        <FormItem
                            validateStatus={form2Error ? 'error' : ''}
                            help={form2Error || ''}
                            label="节点类型"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('form2', {
                                rules: [{ required: true, message: '请选择节点类型!' }],
                                initialValue: 1
                            })(
                                <Radio.Group onChange={this.handleChangeSelect}>
                                    <Radio.Button value={0}>控制节点</Radio.Button>
                                    <Radio.Button value={1}>执行节点</Radio.Button>
                                </Radio.Group>
                            )}
                        </FormItem>
                }
                {
                    this.props.match.params.type === 'greedy' ?
                        this.state.showRuleSetNameForm ? <FormItem
                            validateStatus={form3Error ? 'error' : ''}
                            help={form3Error || ''}
                            label="规则集名称"
                            {...formItemLayout}
                        >
                            {getFieldDecorator('form3', {
                                rules: [{ required: !this.state.disabled, message: '请选择执行节点类型!' }],
                                initialValue: ""
                            })(

                                // <Radio.Group disabled={this.state.disabled}>
                                //     {
                                //         this.state.ruleSetList.map((item, i) =>
                                //             <Radio.Button value={item.code}>{item.value}</Radio.Button>
                                //         )
                                //     }
                                // </Radio.Group>
                                <Select disabled={this.state.disabled}>
                                    {
                                        this.state.ruleSetList.map((item, i) =>
                                            <Select.Option value={item.code}>{item.value}</Select.Option>
                                        )
                                    }
                                </Select>


                            )}
                        </FormItem> : ""
                        :


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
                                    <Radio.Group disabled={this.state.disabled}>
                                        <Radio.Button value={2}>查询</Radio.Button>
                                        <Radio.Button value={0}>规则</Radio.Button>
                                        <Radio.Button value={1}>规则集</Radio.Button>
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