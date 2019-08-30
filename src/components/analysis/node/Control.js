import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '@/components/analysis/node/form/Form';
import StrategyPath from '@/components/analysis/StrategyPath';
import { Divider } from 'antd';
import Code from '@/components/Code';

class Control extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form name="节点类型">
                    <p>控制节点</p>
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

Control.propTypes = {}
Control.defaultProps = {}

export default Control