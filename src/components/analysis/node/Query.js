import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '@/components/analysis/node/form/Form';
import StrategyPath from '@/components/analysis/StrategyPath';
import { Divider, Table } from 'antd';
import Code from '@/components/Code';

const dataSource = [{
    key: '1',
    c1: "交易总金额",
    c2: "交易金额",
    c3: "SUM",
    c4: "SUM"
}, {
    key: '2',
    c1: "最后交易日期",
    c2: "交易金额",
    c3: "SUM",
    c4: "SUM"
}];
const columns = [{
    title: '映射变量',
    dataIndex: 'c1',
    key: 'c1',
}, {
    title: '来源表字段',
    dataIndex: 'c2',
    key: 'c2',
}, {
    title: '计算函数1',
    dataIndex: 'c3',
    key: 'c3'
}, {
    title: '计算函数2',
    dataIndex: 'c4',
    key: 'c4'
}];

class Query extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form name="表">
                    <p>交易流水表</p>
                </Form>
                <Divider />
                <Form name="临时变量映射">
                    <Table dataSource={dataSource} columns={columns} onChange={() => { }} pagination={false} />
                </Form>
                <Divider />
                <Form name="分组字段">
                    <p>
                        <span style={{ marginRight: '20px' }}>按</span><span>客户号</span>
                    </p>
                </Form>
                <Divider />
                <Form name="排序字段">
                    <p>
                        <span style={{ marginRight: '20px' }}>按</span><span>客户号</span>
                    </p>
                </Form>
                <Divider />
                <Form name="图文">
                    <StrategyPath />
                </Form>
                <Divider />
                <Form name="SQL">
                    <Code sqlCode="select * from t_trade where time like '%2018%'" type={1} />
                </Form>
            </div>
        )
    }
}

Query.propTypes = {}
Query.defaultProps = {}

export default Query