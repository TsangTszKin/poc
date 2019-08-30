import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '@/components/analysis/node/form/Form';
import { Divider, Table } from 'antd';

const dataSource = [{
    key: '1',
    c1: "规则001",
    c2: "v1",
    c3: "【交易金额 大于 5000】"
}, {
    key: '2',
    c1: "规则002",
    c2: "v2",
    c3: "【交易金额 大于 6000】" 
}];
const columns = [{
    title: '规则名',
    dataIndex: 'c1',
    key: 'c1',
}, {
    title: '规则版本',
    dataIndex: 'c2',
    key: 'c2',
}, {
    title: '规则描述',
    dataIndex: 'c3',
    key: 'c3'
}];

class RulesetForGreedy extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form name="节点类型">
                    <p>执行节点-规则集：判断是否活动卡</p>
                </Form>
                <Divider />
                <Form name="规则描述【全规则模式】">
                    <Table dataSource={dataSource} columns={columns} onChange={() => { }} pagination={false} />
                </Form>
                <Divider />
            </div>
        )
    }
}

RulesetForGreedy.propTypes = {}
RulesetForGreedy.defaultProps = {}

export default RulesetForGreedy