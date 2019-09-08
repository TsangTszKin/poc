/* eslint-disable react/display-name */
/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 19:04:42
 * @Description: 
 */
import React, { Component, Fragment } from 'react';
import store from '@/store/monitor/alert/Index'
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, Table, Tag } from 'antd'
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

        store.reset();
        store.getAlertListForApi()
    }

    init_1() {
        var myChart = echarts.init(this._1);
        // 绘制图表

        let option = {
            title: {
                text: '交易量',
                subtext: '',
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
                text: '交易耗时',
                subtext: '',
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
    }


    init_3() {
        var myChart = echarts.init(this._3);
        // 绘制图表

        let option = {
            title: {
                text: '告警分布',
                subtext: '',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: ['提示', '重要', '紧急']
            },
            series: [
                {
                    name: '数量',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [
                        { value: 135, name: '提示' },
                        { value: 1548, name: '重要' },
                        { value: 1948, name: '紧急' }
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
                text: '日志采集量',
                subtext: '',
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
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>统一支付系统实时交易量</p>
                                    <p style={{ fontSize: '14px', position: 'relative', top: '10px' }}>（实时借记业务）</p>
                                    <p style={{ fontSize: '20px', position: 'relative', top: '20px' }}>450笔/分钟</p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_2}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>统一支付系统实时交易耗时</p>
                                    <p style={{ fontSize: '14px', position: 'relative', top: '10px' }}>（实时借记业务）</p>
                                    <p style={{ fontSize: '20px', position: 'relative', top: '20px' }}>200毫秒/笔</p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_3}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>告警数量</p>
                                    <p style={{ fontSize: '28px', fontWeight: 'bold', position: 'relative', top: '25px' }}>20</p>
                                </div>
                            </Col>
                            <Col span={6}>
                                <div
                                    style={style.top_cell_4}
                                >
                                    <p style={{ fontSize: '12px', position: 'relative', top: '10px' }}>实时日志采集数量</p>
                                    <p style={{ fontSize: '20px', fontWeight: 'bold', position: 'relative', top: '30px' }}>5000条/分钟</p>
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
                            <Col span={24} >
                                <Table size="small"
                                    dataSource={(() => {
                                        let dataSource = common.deepClone(store.list.getData.dataSource);
                                        dataSource.forEach((el, i) => {
                                            el.index = i + 1;
                                            el.action = <Fragment>
                                                <a onClick={() => {
                                                    // store.getChainDetailForApi(el.tradeNo)
                                                }}>设为已处理</a>
                                            </Fragment>
                                        })
                                        return dataSource
                                    })()}
                                    columns={columns} pagination={false} />
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
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '告警产生时间',
        dataIndex: 'time',
        key: 'time.',
        sorter: (a, b) => {
            return a.time.localeCompare(b.time)
        }
    },
    {
        title: '告警ID',
        dataIndex: 'id',
        key: 'id'
    },
    {
        title: '告警级别',
        dataIndex: 'level',
        key: 'level',
        render: (value) => {
            switch (value) {
                case '紧急':
                    return <Tag color="red">{value}</Tag>
                case '重要':
                    return <Tag color="orange">{value}</Tag>
                case '提示':
                    return <Tag >{value}</Tag>
                default:
                    break;
            }
            return <Tag>{value}</Tag>
        }
    },
    {
        title: '告警状态',
        dataIndex: 'status',
        key: 'status',
        render: (value) => {
            switch (value) {
                case '已处理':
                    return <Tag color="green">{value}</Tag>
                case '未处理':
                    return <Tag color="blue">{value}</Tag>
                default:
                    break;
            }
            return <Tag>{value}</Tag>
        }
    },
    {
        title: '告警消息',
        dataIndex: 'content',
        key: 'content'
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        fixed: 'right',
        width: 50
    }];