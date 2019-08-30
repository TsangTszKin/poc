/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-28 14:47:44
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/business/Home';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import PageHeader from '@/components/PageHeader';
import { Row, Col, DatePicker, Button, Select } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import Code from '@/components/Code';

@observer
class Pre extends Component {
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
            }]
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
                        <div className="clearfix" style={style.searchPanel}>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>统计周期 :</span>
                                <DatePicker.RangePicker size="small"
                                    defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                    format={'YYYY/MM/DD'}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary">查询</Button>
                            </div>
                        </div>

                        <DiagramDetail data={DiagramDetailData} />

                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24}>
                                <Select value="1hour" dropdownMatchSelectWidth={false} size="small" style={{ minWidth: '80px', width: 'fit-content', marginBottom: '20px' }}>
                                    <Select.Option value="1min">1分钟</Select.Option>
                                    <Select.Option value="5min">5分钟</Select.Option>
                                    <Select.Option value="1hour">1小时</Select.Option>
                                    <Select.Option value="1day">1天</Select.Option>
                                </Select>
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>

                            <Col span={24}>
                                <Code sqlCode={sessionStorage.log} type={1} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Pre

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
        title: '支付系统前置节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198'
    },
    {
        title: '支付系统前置节点2',
        count: 200,
        time: 20,
        ip: '96.0.56.199'
    },
    {
        title: '支付系统前置节点3',
        count: 200,
        time: 20,
        ip: '96.0.56.200'
    }
]