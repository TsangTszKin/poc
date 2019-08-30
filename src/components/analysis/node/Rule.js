import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '@/components/analysis/node/form/Form';
import { Divider } from 'antd';
import Code from '@/components/Code';

class Rule extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form name="节点类型">
                    <p>执行节点-规则：判断是否活动卡</p>
                </Form>
                <Divider />
                <Form name="规则描述">
                    <p>当是活动卡时，输出1。</p>
                </Form>
                <Divider />
                <Form name="SQL">
                    <Code sqlCode="select * from t_trade where time like '%2018%'" type={1} />
                </Form>
            </div>
        )
    }
}

Rule.propTypes = {}
Rule.defaultProps = {}

export default Rule