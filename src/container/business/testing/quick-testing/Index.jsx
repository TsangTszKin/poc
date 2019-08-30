/**
 * User: duxinzhong/duxz@shine-china.com
 * Date: 2019/5/8 16:20
 * Description: 测试列表，操作-快速测试
 */

import React, { Component } from "react";
import { observer, Provider } from "mobx-react";
import PageHeader from "@/components/PageHeader";
import FormHeader from "@/components/FormHeader";
import { Button, Col, Drawer, Form, Row, Spin, Table } from "antd";
import store from '@/store/business/testing/quick-test/Index';
import '@/styles/business/testing/index.less';
import { withRouter } from "react-router-dom";
import FlowNumberDetails from "@/components/analysis/FlowNumberDetails";
import common from "@/utils/common";

const headerStyle = { 'margin-left': '-8px', paddingBottom: '30px' };
const columnsTwo = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 55
}, {
    title: '时间',
    dataIndex: 'sendTime',
    key: 'sendTime',
}, {
    title: '耗时',
    dataIndex: 'timeCost',
    key: 'timeCost',
}, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
}, {
    title: '流水号',
    dataIndex: 'flowNumber',
    key: 'flowNumber',
}, {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
}];

@Form.create()
@withRouter
@observer
class QuickTesting extends Component {
    state = {
        fieldDataSource: [],
        inputValue: {}
    };

    constructor(props) {
        super(props);
    }

    goBack = () => this.props.history.push('/business/testing/list');
    startTest = () => {
        // console.log(store.reportField.fieldForm);
        let reportField = common.deepClone(store.reportField.fieldForm);
        this.props.form.validateFields((err, values) => {
            // console.log(err, values);
            if (!err) {
                reportField.forEach(item => {
                    item.value = !common.isEmpty(values[item.name]) ?
                        item.type === 93 ? values[item.name].format('YYYY-MM-DD HH:mm:ss') : values[item.name]
                        : '';
                });
                store.reportField.setFieldForm(reportField);
                store.sendFastTestField();
            }
        });

    };
    clearResults = () => store.testResult.setResultList([]);

    componentDidMount() {
        store.setTestId(this.props.match.params.id);
        store.fetchFieldTypeFromApi();
        store.fetchFieldListFromApi(this.props.match.params.id);
    }

    render() {
        const startTest = <Button className="start-test" type="primary" htmlType="button"
                                  onClick={ this.startTest }>开始测试</Button>;
        const clearResults = <Button className="start-test" type="primary" htmlType="button"
                                     onClick={ this.clearResults }>清空</Button>;
        const inputGenerator = common.inputGenerator.call(this);
        return (
            <Provider store={ store }>
                <div>
                    <Form ref="formRef">
                        <Button className="go-back-btn" type="default" htmlType="button"
                                onClick={ this.goBack }>返回</Button>
                        <PageHeader meta={ this.props.meta }/>
                        <div className="test-wrapper">
                            <Row gutter={ 10 }>
                                <Col xs={ 24 } xl={ 10 }>
                                    <div className="test-content">
                                        <FormHeader
                                            style={ headerStyle }
                                            title="报文输入"
                                            children={ store.reportField.isLoading ? '' : startTest }
                                        />
                                        <Spin spinning={ store.reportField.isLoading }>
                                            <div className="test-table-wrapper">
                                                <table className="test-table">
                                                    <thead className="test-table-header">
                                                    <tr>
                                                        <td className="input-item-name">字段名</td>
                                                        <td className="input-item-type">类型</td>
                                                        <td className="input-item-input">值</td>
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                    {
                                                        store.reportField.fieldForm.map(item => (
                                                            <tr className="test-table-item">
                                                                <td className="input-item-name">{ item.name }</td>
                                                                <td className="input-item-type">{ store.reportField.fieldType[item.type] }</td>
                                                                <td className="input-item-input">
                                                                    <Form.Item>
                                                                        {
                                                                            inputGenerator(item.name, item.type, item.type === 93 ? {} : {
                                                                                rules: [
                                                                                    {
                                                                                        max: item.maxLength || 12,
                                                                                        message: `最大长度${ item.maxLength || 12 }!`
                                                                                    }
                                                                                ]
                                                                            })
                                                                        }
                                                                    </Form.Item>
                                                                </td>
                                                            </tr>)
                                                        )
                                                    }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </Spin>
                                    </div>
                                </Col>
                                <Col xs={ 24 } xl={ 14 }>
                                    <div className="test-content">
                                        <FormHeader style={ headerStyle } title="测试结果" children={ clearResults }/>
                                        <Spin spinning={ store.testResult.isLoading }>
                                            <Table
                                                className="test-table"
                                                columns={ columnsTwo }
                                                scroll={ { x: store.getResultSource.length > 0 ? 470 : true } }
                                                dataSource={ store.testResult.resultList }
                                                pagination={ false }/>
                                        </Spin>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        <Drawer
                            placement="right"
                            closable={ false }
                            onClose={ () => {
                                store.drawer.setIsShow(false);
                            } }
                            visible={ store.drawer.isShow }
                            width="900"
                            destroyOnClose={ true }
                        >
                            <FlowNumberDetails/>
                        </Drawer>
                    </Form>

                </div>
            </Provider>
        );
    }
}

export default QuickTesting;

