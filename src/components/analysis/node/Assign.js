import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '@/components/analysis/node/form/Form';
import { Divider, Table } from 'antd';

const dataSource = [{
    key: '1',
    c1: "交易总金额",
    c2: "代码表",
    c3: "A01"
}, {
    key: '2',
    c1: "最后交易日期",
    c2: "代码表",
    c3: "A02" 
}];
const columns = [{
    title: '映射变量',
    dataIndex: 'c1',
    key: 'c1',
}, {
    title: '数据来源',
    dataIndex: 'c2',
    key: 'c2',
}, {
    title: '来源值',
    dataIndex: 'c3',
    key: 'c3'
}];

class Assign extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form name="节点类型">
                    <p>执行节点-赋值：临时变量映射</p>
                </Form>
                <Divider />
                <Form name="临时变量映射">
                    <Table dataSource={dataSource} columns={columns} onChange={() => { }} pagination={false} />
                </Form>
                <Divider />
            </div>
        )
    }
}

Assign.propTypes = {}
Assign.defaultProps = {}

export default Assign