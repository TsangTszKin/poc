import React, { Component } from 'react'
import PageHeader from '@/components/PageHeader'
import { Tabs, Divider, Table, DatePicker, TreeSelect, Drawer } from 'antd';
import SelectGroup from '@/components/analysis/SelectGroup';
import SelectGroup2 from '@/components/analysis/SelectGroup2';
import TimeRangePicker from '@/components/analysis/TimeRangePicker';
import Paging from '@/components/Paging';
import { Chart, Tooltip, Axis, Legend, Line, Point } from 'viser-react';
import { withRouter } from 'react-router-dom';
import PageToolBar from '@/components/PageToolBar';
import StrategyDetails from '@/components/analysis/StrategyDetails';
import StrategyDetailsPanel from '@/components/analysis/StrategyDetailsPanel';

const SHOW_PARENT = TreeSelect.SHOW_PARENT;

const treeData = [{
    title: '卡号/客户号',
    value: '0-0',
    key: '0-0',
    children: [],
}, {
    title: '事件源',
    value: '0-1',
    key: '0-1',
    children: [],
}, {
    title: '事件发生时间',
    value: '0-2',
    key: '0-2',
    children: [],
}, {
    title: '决策结果',
    value: '0-3',
    key: '0-3',
    children: [],
}, {
    title: '决策时间',
    value: '0-4',
    key: '0-4',
    children: [],
}, {
    title: '报文1',
    value: '0-5',
    key: '0-5',
    children: [],
}, {
    title: '报文2',
    value: '0-6',
    key: '0-6',
    children: [],
}];

const DataSet = require('@antv/data-set');
const sourceData = [
    { month: 'Jan', 最大耗时: 7.0, 平均耗时: 3.9, 最小耗时: 2.9 },
    { month: 'Feb', 最大耗时: 6.9, 平均耗时: 4.2, 最小耗时: 3.9 },
    { month: 'Mar', 最大耗时: 9.5, 平均耗时: 5.7, 最小耗时: 4.9 },
    { month: 'Apr', 最大耗时: 14.5, 平均耗时: 8.5, 最小耗时: 6.9 },
    { month: 'May', 最大耗时: 18.4, 平均耗时: 11.9, 最小耗时: 5.9 },
    { month: 'Jun', 最大耗时: 21.5, 平均耗时: 15.2, 最小耗时: 4.9 },
    { month: 'Jul', 最大耗时: 25.2, 平均耗时: 17.0, 最小耗时: 10.9 },
    { month: 'Aug', 最大耗时: 26.5, 平均耗时: 16.6, 最小耗时: 13.9 },
    { month: 'Sep', 最大耗时: 23.3, 平均耗时: 14.2, 最小耗时: 8.9 },
    { month: 'Oct', 最大耗时: 18.3, 平均耗时: 10.3, 最小耗时: 9.9 },
    { month: 'Nov', 最大耗时: 13.9, 平均耗时: 6.6, 最小耗时: 10.9 },
    { month: 'Dec', 最大耗时: 9.6, 平均耗时: 4.8, 最小耗时: 3.9 },
];
const sourceData1 = [
    { month: 'Jan', 触发数: 7.0, 命中数: 3.9 },
    { month: 'Feb', 触发数: 6.9, 命中数: 4.2 },
    { month: 'Mar', 触发数: 9.5, 命中数: 5.7 },
    { month: 'Apr', 触发数: 18.4, 命中数: 11.9 },
    { month: 'Jun', 触发数: 21.5, 命中数: 15.2 },
    { month: 'Jul', 触发数: 25.2, 命中数: 17.0 },
    { month: 'Aug', 触发数: 26.5, 命中数: 16.6 },
    { month: 'Sep', 触发数: 23.3, 命中数: 14.2 },
    { month: 'Oct', 触发数: 18.3, 命中数: 10.3 },
    { month: 'Nov', 触发数: 13.9, 命中数: 6.6 },
    { month: 'Dec', 触发数: 9.6, 命中数: 4.8 },
];
const sourceData2 = [
    { month: 'Jan', 命中率: 7.0 },
    { month: 'Feb', 命中率: 6.9 },
    { month: 'Mar', 命中率: 9.5 },
    { month: 'Apr', 命中率: 14.5 },
    { month: 'May', 命中率: 18.4 },
    { month: 'Jun', 命中率: 21.5 },
    { month: 'Jul', 命中率: 25.2 },
    { month: 'Aug', 命中率: 26.5 },
    { month: 'Sep', 命中率: 23.3 },
    { month: 'Oct', 命中率: 18.3 },
    { month: 'Nov', 命中率: 13.9 },
    { month: 'Dec', 命中率: 9.6 },
];
const dv = new DataSet.View().source(sourceData);
const dv1 = new DataSet.View().source(sourceData1);
const dv2 = new DataSet.View().source(sourceData2);
dv.transform({
    type: 'fold',
    fields: ['最大耗时', '平均耗时', , '最小耗时'],
    key: 'city',
    value: 'temperature',
});
dv1.transform({
    type: 'fold',
    fields: ['触发数', '命中数'],
    key: 'city',
    value: 'temperature',
});
dv2.transform({
    type: 'fold',
    fields: ['命中率'],
    key: 'city',
    value: 'temperature',
});
const data = dv.rows;
const data1 = dv1.rows;
const data2 = dv2.rows;

const scale = [{
    dataKey: 'month',
    min: 0,
    max: 1,
}];
const scale1 = [{
    dataKey: 'month',
    min: 0,
    max: 1,
}];
const scale2 = [{
    dataKey: 'month',
    min: 0,
    max: 1,
}];

const dataSource1 = [{
    key: '1',
    c1: '当月购买数',
    c2: "最大耗时",
    c3: 500,
    c4: 500,
    c5: 500,
    c6: 500,
    c7: 500,
}, {
    key: '2',
    c1: '本周第一笔达标流水号',
    c2: "平均耗时",
    c3: 400,
    c4: 500,
    c5: 500,
    c6: 500,
    c7: 500,
}];

const dataSource2 = [{
    key: '1',
    c1: 1,
    c2: "2018-10-11 08:30:20",
    c3: 10001,
    c4: "通过",
    c5: "明细"
}, {
    key: '2',
    c1: 2,
    c2: "2018-10-11 08:30:20",
    c3: 10002,
    c4: "通过",
    c5: "明细"
}];

@withRouter
class Monitor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectGroupValueList: [''],
            selectData: [{ code: '', value: '所有' }, { code: 1, value: "默认类别" }],
            value: []
        }
        this.selectGroupChange = this.selectGroupChange.bind(this);
        this.add = this.add.bind(this);
        this.sub = this.sub.bind(this);
        this.selectGroupChange2 = this.selectGroupChange2.bind(this);
        this.showDrawer = this.showDrawer.bind(this);
        this.onClose = this.onClose.bind(this);
    }

    componentDidMount() {
    }

    selectGroupChange = (i, name, value) => {
        console.log("selectGroupChange  i, name, value", i, name, value);
    }

    selectGroupChange2 = (i, name, value) => {
        console.log("selectGroupChange  i, name, value", i, name, value);
    }

    add = () => {

        let tempArray = this.state.selectGroupValueList;
        tempArray.push("")
        this.setState({
            selectGroupValueList: tempArray
        })
    }

    sub = (index) => {
        let tempArray = this.state.selectGroupValueList;
        tempArray.splice(index, 1);
        this.setState({
            selectGroupValueList: tempArray
        })
    }

    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };
    render() {

        const columns1 = [{
            title: '事件源',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '策略',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '触发数',
            dataIndex: 'c3',
            key: 'c3'
        }, {
            title: '命中数',
            dataIndex: 'c4',
            key: 'c4'
        }, {
            title: '命中率',
            dataIndex: 'c5',
            key: 'c5'
        }, {
            title: '周同比',
            dataIndex: 'c6',
            key: 'c6'
        }, {
            title: '日环比',
            dataIndex: 'c7',
            key: 'c7'
        }];

        const columns2 = [{
            title: '序号',
            dataIndex: 'c1',
            key: 'c1',
        }, {
            title: '时间',
            dataIndex: 'c2',
            key: 'c2',
        }, {
            title: '维度值',
            dataIndex: 'c3',
            key: 'c3'
        }, {
            title: '输出结果',
            dataIndex: 'c4',
            key: 'c4'
        }, {
            title: '更多',
            dataIndex: 'c5',
            key: 'c5',
            render: text => <a href="javascript:;" onClick={this.showDrawer}>{text}</a>,
        }];

        const tProps = {
            treeData,
            value: this.state.value,
            onChange: (value) => {
                console.log('onChange ', value);
                this.setState({ value });
            },
            treeCheckable: true,
            showCheckedStrategy: SHOW_PARENT,
            searchPlaceholder: '选择报文字段',
            style: {
                width: 300,
                float: 'right',
                marginTop: '5px',
                marginBottom: '15px'
            },
        };

        return (
            <div className='panel'>
                <PageHeader meta={this.props.meta}></PageHeader>
                <div className="pageContent">
                    <Tabs defaultActiveKey="1" onChange={() => { }} >
                        <Tabs.TabPane tab="策略统计" key="1">

                            <SelectGroup firstTitle="分析事件源：" add={this.add} sub={this.sub} valueList={this.state.selectGroupValueList} selectData={this.state.selectData} selectGroupChange={this.selectGroupChange} resultName="groupFields" />
                            <SelectGroup2 firstTitle="选择策略：" selectGroupChange={this.selectGroupChange2} />
                            <Divider />
                            <div style={{ height: '32px' }}>
                                <TimeRangePicker />
                            </div>
                            <div style={{ height: '500px' }}>
                                <div style={{ float: 'left', width: '50%' }}>
                                    <p style={{ margin: '20px 0 0 54px', fontWeight: 'bold' }}>次数</p>
                                    <Chart forceFit height={400} data={data1} scale={scale1}>
                                        <Tooltip />
                                        <Axis />
                                        <Legend />
                                        <Line position="month*temperature" color="city" />
                                        <Point position="month*temperature" color="city" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle" />
                                    </Chart>
                                </div>
                                <div style={{ float: 'left', width: '50%', fontWeight: 'bold' }}>
                                    <p style={{ margin: '20px 0 0 54px' }}>命中率</p>
                                    <Chart forceFit height={400} data={data2} scale={scale2}>
                                        <Tooltip />
                                        <Axis />
                                        <Legend />
                                        <Line position="month*temperature" color="city" />
                                        <Point position="month*temperature" color="city" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle" />
                                    </Chart>
                                </div>
                            </div>
                            <p style={{ margin: '20px 0 0 54px', fontWeight: 'bold' }}>耗时</p>
                            <Chart forceFit height={400} data={data} scale={scale}>
                                <Tooltip />
                                <Axis />
                                <Legend />
                                <Line position="month*temperature" color="city" />
                                <Point position="month*temperature" color="city" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle" />
                            </Chart>
                            <Table dataSource={dataSource1} columns={columns1} onChange={() => { }} pagination={false} />
                            <Paging pageNum={1} total={100} changePage={() => { }}></Paging>

                        </Tabs.TabPane>

                        <Tabs.TabPane tab="事件明细" key="2">
                            <DatePicker.RangePicker style={{ width: '210px', float: 'left', margin: '4px 15px 0 0' }} onChange={(date, dateString) => {
                                console.log(date, dateString);
                            }} />
                            <PageToolBar style={{ float: 'left' }} changeToolBar={() => { }} searchPlaceholder="输入维度值查询"></PageToolBar>
                            <TreeSelect {...tProps} />
                            <Table style={{ marginTop: '60px' }} dataSource={dataSource2} columns={columns2} onChange={() => { }} pagination={false} />
                            <Paging pageNum={1} total={100} changePage={() => { }}></Paging>
                            <Drawer
                                title="策略信息"
                                placement="right"
                                closable={false}
                                onClose={this.onClose}
                                visible={this.state.visible}
                                width={720}
                            >
                                <StrategyDetails />
                            </Drawer>
                        </Tabs.TabPane>

                        <Tabs.TabPane tab="决策路径" key="3">
                            <StrategyDetailsPanel />
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div >
        )
    }
}

export default Monitor