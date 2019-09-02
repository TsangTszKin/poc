/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:30:47
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/business/pay/Detail';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import PageHeader from '@/components/PageHeader';
import { Row, Col, DatePicker, Button, Select, Spin, Divider } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';

@withRouter
@observer
class Pre extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.getData = this.getData.bind(this);
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
        this.getData()
        this.init_jiaoyiliang()
        this.init_pingjunhaoshi()
    }

    getData() {
        switch (this.props.match.path) {
            case '/business/pay/pre':
                store.getPayDetailDataForApi('front');
                break;
            case '/business/pay/unit':
                store.getPayDetailDataForApi('online');
                break;
            case '/business/pay/esb':
                store.getPayDetailDataForApi('esb');
                break;
            default:
                break;
        }
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
                                <DatePicker.RangePicker
                                    allowClear={false}
                                    defaultValue={[moment(store.helper.getData.query.startTime, 'YYYY-MM-DD hh:mm:ss'), moment(store.helper.getData.query.endTime, 'YYYY-MM-DD hh:mm:s')]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(date, dateString) => {
                                        console.log('date, dateString', date, dateString)
                                        let query = { startTime: `${dateString[0]} 00:00:00`, endTime: `${dateString[1]} 00:00:00` }
                                        store.helper.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary" onClick={this.getData}>查询</Button>
                            </div>
                        </div>


                        <Spin spinning={store.helper.getData.loading} size="large" >
                            <DiagramDetail
                                data={(() => {
                                    let data = [];
                                    store.data.getData.forEach((el, i) => {
                                        let title = '';
                                        switch (this.props.match.path) {
                                            case '/business/pay/pre':
                                                title = `支付系统前置节点${i + 1}`
                                                break;
                                            case '/business/pay/unit':
                                                title = `支付系统联机节点${i + 1}`
                                                break;
                                            case '/business/pay/esb':
                                                title = `支付系统ESB节点${i + 1}`
                                                break;
                                            default:
                                                break;
                                        }
                                        data.push({
                                            title: title,
                                            count: el.tradeCount,
                                            time: el.avg_time,
                                            ip: el.hostIp
                                        })
                                    })
                                    return data
                                })()}
                            />

                        </Spin>

                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24}>
                                <TimeUnit value={store.helper.getData.timeUnit} callBack={(value) => {
                                    store.helper.updateData('timeUnit', value);
                                    //todo 调接口
                                }} />
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>


                        </Row>
                        <Divider orientation="left">日志</Divider>
                        <Row style={{ marginBottom: '40px' }}>
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
    },

    {
        title: '支付系统前置节点3',
        count: 200,
        time: 20,
        ip: '96.0.56.200'
    },
    {
        title: '支付系统前置节点3',
        count: 200,
        time: 20,
        ip: '96.0.56.200'
    },
    {
        title: '支付系统前置节点3',
        count: 200,
        time: 20,
        ip: '96.0.56.200'
    },
    {
        title: '支付系统前置节点3',
        count: 200,
        time: 20,
        ip: '96.0.56.200'
    },

]