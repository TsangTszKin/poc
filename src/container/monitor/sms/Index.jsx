/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:32:41
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/monitor/sms/Index';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, DatePicker, Button, Select, PageHeader } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import Code from '@/components/Code';
import TimeUnit from '@/components/business/home/widgets/TimeUnit';

@observer
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
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
        this.init_jiaoyiliang()
        this.init_pingjunhaoshi()
    }

    init_jiaoyiliang() {
        var myChart = echarts.init(this.jiaoyiliang);
        // 绘制图表

        let option = {
            title: {
                text: '交易量'
            },
            dataZoom: [{
            }, {
                type: 'inside'
            }],
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
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }],
            color: '#ec7c31'
        };

        myChart.setOption(option);
    }

    init_pingjunhaoshi() {
        var myChart = echarts.init(this.pingjunhaoshi);
        // 绘制图表

        let option = {
            title: {
                text: '平均耗时'
            },
            dataZoom: [{
            }, {
                type: 'inside'
            }],
            xAxis: {
                type: 'category',
                data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: [820, 932, 901, 934, 1290, 1330, 1320],
                type: 'line'
            }],
            color: '#ec7c31'
        };

        myChart.setOption(option);
    }

    render() {
        return (
            <Provider store={store}>
                <div className='panel'>
                    {/* <PageHeader meta={this.props.meta} /> */}
                    <div className="pageContent charts-main">

                        <PageHeader
                            title={`短信系统监控`}
                            subTitle="数据统计周期：1分钟"
                            style={{ padding: '0 0 30px 0' }}
                        />


                        <div style={{ marginTop: '40px' }}>
                            <DiagramDetail data={DiagramDetailData} type="sms" />
                        </div>

                        <Row style={{ marginBottom: '40px' }} gutter={10}>
                            <Col span={12}>
                                <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Index

const style = {
    searchPanel: {
        marginBottom: '40px'
    },
    searchShell: {
        margin: '0px 30px 10px 0px',
        width: 'fit-content',
        float: 'left',
        height: '25px'
    },
    searchTitle: {
        height: '21px',
        lineHeight: '21px',
        display: 'inline-block',
        marginRight: '5px'
    }
}

const DiagramDetailData = [
    {
        title: 'MQ',
        count: 200,
        time: 20,
        ip: ''
    },
    {
        title: 'Front',
        count: 200,
        time: 20,
        ip: ''
    },
    {
        title: 'Realtime',
        count: 200,
        time: 20,
        ip: ''
    }
]