/* eslint-disable react/display-name */
/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 19:04:42
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/business/Home';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, Table } from 'antd'
// import Diagram from '@/components/business/home/Diagram'
// import 'echarts/theme/dark'
import PageHeader from '@/components/PageHeader';

@observer
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_1 = this.init_1.bind(this);
        this.init_2 = this.init_2.bind(this);
        this.init_3 = this.init_3.bind(this);
        this.init_4 = this.init_4.bind(this);
    }

    componentDidMount() {
        store.getEventSourceSelectListForApi();

        setInterval(() => {
            if (!common.isEmpty(window.document.querySelector("#business-home-header-info div.ant-tabs-top-bar"))) {
                window.document.querySelector("#business-home-header-info div.ant-tabs-top-bar").style.width = '50%';
            }

            // $("#business-home-header-info span.ant-tabs-tab-next").addClass("ant-tabs-tab-arrow-show").removeClass("ant-tabs-tab-btn-disabled");
        }, 300)

        this.init()
    }

    init() {
        this.init_1()
        this.init_2()
        this.init_3()
        this.init_4()
    }

    init_1() {
        var myChart = echarts.init(this._1);
        // 绘制图表

        let option = {
            title: {
                text: '',
                subtext: '告警平均数量',
                x: 'center'
            },
            tooltip: {
                formatter: "{a} <br/>{b} : {c}%"
            },
            series: [
                {
                    name: '数量',
                    type: 'gauge',
                    detail: { formatter: '{value}' },
                    data: [{ value: 50, name: '数量' }],
                    center: ['50%', '60%'],
                }
            ]
        };

        myChart.setOption(option);

        setInterval(function () {
            option.series[0].data[0].value = (Math.random() * 100).toFixed(2) - 0;
            myChart.setOption(option, true);
        }, 2000);
    }

    init_2() {
        var myChart = echarts.init(this._2);
        // 绘制图表

        let option = {
            title: {
                text: '',
                subtext: '告警级别分布图',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['高', '低']
            },
            series: [
                {
                    name: '数量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        { value: 135, name: '高' },
                        { value: 1548, name: '低' }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };


        myChart.setOption(option);
    }


    init_3() {
        var myChart = echarts.init(this._3);
        // 绘制图表

        let option = {
            title: {
                text: '',
                subtext: '告警类型数量分布图',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['电力设备', '其他设备']
            },
            series: [
                {
                    name: '数量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        { value: 135, name: '电力设备' },
                        { value: 1548, name: '其他设备' }
                    ],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };


        myChart.setOption(option);
    }

    init_4() {
        var myChart = echarts.init(this._4);
        // 绘制图表

        let option = {
            title: {
                text: '',
                subtext: '告警趋势图',
                x: 'center'
            },
            tooltip: {
                trigger: 'axis'
            },
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 1500, 934, 1290, 1330, 1320],
                type: 'line',
                center: ['50%', '60%']
            }]
        };



        myChart.setOption(option);
    }



    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    {/* <PageHeader meta={this.props.meta} /> */}
                    <div className="pageContent charts-main">
                        <Row style={{ marginBottom: '40px' }} gutter={16}>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_1}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>当前系统时间</p>
                                    <p style={{ fontSize: '14px', position: 'relative', top: '10px' }}>2019-08-28</p>
                                    <p style={{ fontSize: '30px', position: 'relative', top: '10px' }}>16:57:32</p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_2}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>设备数量</p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', position: 'relative', top: '25px' }}>51</p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_3}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>告警总量</p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', position: 'relative', top: '25px' }}>20</p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_4}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>活动告警数量</p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', position: 'relative', top: '25px' }}>49</p>
                                </div>
                            </Col>
                        </Row>
                        <Row style={{ margin: '60px 0' }}>
                            <Col span={6}>
                                <div ref={el => this._1 = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={6}>
                                <div ref={el => this._2 = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={6}>
                                <div ref={el => this._3 = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={6}>
                                <div ref={el => this._4 = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                        </Row>
                        <Row style={{ marginBottom: '40px' }} gutter={16}>
                            <Col span={12} >
                                <Table size="small" dataSource={dataSource} columns={columns} pagination={false} />
                            </Col>
                            <Col span={12}>
                                <Table size="small" dataSource={dataSource} columns={columns} pagination={false} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Home

const style = {
    top_cell_1: {
        height: '100px', width: '100%', backgroundColor: '#1c961c', color: '#fff', textAlign: 'center', borderRadius: '5px'
    },
    top_cell_2: {
        height: '100px', width: '100%', backgroundColor: '#3b66a8', color: '#fff', textAlign: 'center', borderRadius: '5px'
    },
    top_cell_3: {
        height: '100px', width: '100%', backgroundColor: '#d57526', color: '#fff', textAlign: 'center', borderRadius: '5px'
    },
    top_cell_4: {
        height: '100px', width: '100%', backgroundColor: '#0c7c7a', color: '#fff', textAlign: 'center', borderRadius: '5px'
    },

}

const dataSource = [
    {
        key: '1',
        time: '2019-08-29 12:12:44',
        content: 'PG-20123313492超额',
        name: '超标',
        level: 1,
    },
    {
        key: '1',
        time: '2019-08-29 12:12:44',
        content: 'PG-20123313492超额',
        name: '超标',
        level: 1,
    },
    {
        key: '1',
        time: '2019-08-29 12:12:44',
        content: 'PG-20123313492超额',
        name: '超标',
        level: 1,
    }
];

const columns = [
    {
        title: '时间',
        dataIndex: 'time',
        key: 'time',
        render: (value) => {
            return <span >{value}</span>
        }
    },
    {
        title: '告警内容',
        dataIndex: 'content',
        key: 'content',
        render: (value) => {
            return <span >{value}</span>
        }
    },
    {
        title: '告警名称',
        dataIndex: 'name',
        key: 'name',
        render: (value) => {
            return <span >{value}</span>
        }
    },
    {
        title: '告警级别',
        dataIndex: 'level',
        key: 'level',
        render: (value) => {
            return <span >{value}</span>
        }
    },
];


