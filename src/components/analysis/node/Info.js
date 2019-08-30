import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Form from '@/components/analysis/node/form/Form';
import FormItem from '@/components/analysis/node/form/FormItem';
import { Divider, Table } from 'antd';
const dataSource = [{
    key: '1',
    name: "交易总金额",
    code: "v_trade_num",
    type: "浮点型",
    defaultValue: "0"
}, {
    key: '2',
    name: "最后交易日期",
    code: "v_trade_num",
    type: "浮点型",
    defaultValue: "0"
}];
const columns = [{
    title: '名称',
    dataIndex: 'name',
    key: 'name',
}, {
    title: '标识',
    dataIndex: 'code',
    key: 'code',
}, {
    title: '数据类型',
    dataIndex: 'type',
    key: 'type'
}, {
    title: '默认值',
    dataIndex: 'defaultValue',
    key: 'defaultValue'
}];
class Info extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Form name="基本信息">
                    <FormItem name="名称" value="实时触发进度提醒短信" />
                    <FormItem name="标识" value="r_mnum_2" />
                    <FormItem name="事件源" value="信用卡实时交易事件" />
                    <FormItem name="维度" value="信用卡用户" />
                    <FormItem name="类别" value="类别一" />
                    <FormItem name="策略模式" value="流程模式" />
                    <FormItem name="策略类型" value="灰度策略" />
                </Form>
                <Divider />
                <Form name="临时变量">
                    <Table dataSource={dataSource} columns={columns} onChange={() => { }} pagination={false} />
                </Form>
            </div>
        )
    }
}

Info.propTypes = {}
Info.defaultProps = {}

export default Info