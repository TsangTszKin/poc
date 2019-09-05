/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:18:31
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/monitor/pay/Detail';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, DatePicker, Button, Select, Spin, PageHeader } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'

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
        this.getDetailChartsForApi = this.getDetailChartsForApi.bind(this);
    }

    componentDidMount() {
        this.init()
    }

    init() {
        this.getData()
        this.getDetailChartsForApi();
    }

    getData() {
        switch (this.props.match.path) {
            case '/monitor/pay/pre':
                store.getPayDetailDataForApi('front');
                break;
            case '/monitor/pay/unit':
                store.getPayDetailDataForApi('online');
                break;
            case '/monitor/pay/esb':
                store.getPayDetailDataForApi('esb');
                break;
            default:
                break;
        }
    }

    getDetailChartsForApi() {
        store.helper.updateData('loading2', true);
        let query = Object.assign({
            timeUnit: store.helper.getData.timeUnit
        }, store.helper.getData.query)

        let type = ''
        switch (this.props.match.path) {
            case '/monitor/pay/pre':
                type = 'front'
                break;
            case '/monitor/pay/unit':
                type = 'online'
                break;
            case '/monitor/pay/esb':
                type = 'esb'
                break;
            default:
                break;
        }

        payService.getDetailCharts(query, type).then(res => {
            store.helper.updateData('loading2', false);
            if (!publicUtils.isOk(res)) return
            this.init_jiaoyiliang(res.data.result.keys, res.data.result.trades)
            this.init_pingjunhaoshi(res.data.result.keys, res.data.result.times)
        })
    }

    init_jiaoyiliang(x = [], data = []) {
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
                data: x
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data,
                type: 'line'
            }],
            color: '#ec7c31'
        };

        myChart.setOption(option);
    }

    init_pingjunhaoshi(x = [], data = []) {
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
                data: x
            },
            yAxis: {
                type: 'value'
            },
            series: [{
                data: data,
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
                            title={`${(() => {
                                switch (this.props.match.path) {
                                    case '/monitor/pay/pre':
                                        return '前置'
                                    case '/monitor/pay/unit':
                                        return '联机'
                                    case '/monitor/pay/esb':
                                        return 'ESB'
                                    default:
                                        break;
                                }
                            })()}系统监控`}
                            subTitle="数据统计周期：1分钟"
                            style={{ padding: '0 0 30px 0' }}
                        />



                        <Spin spinning={store.helper.getData.loading} size="large" >
                            <DiagramDetail
                                data={(() => {
                                    let data = [];
                                    store.data.getData.forEach((el, i) => {
                                        let title = '';
                                        switch (this.props.match.path) {
                                            case '/monitor/pay/pre':
                                                title = `支付系统前置节点${i + 1}`
                                                break;
                                            case '/monitor/pay/unit':
                                                title = `支付系统联机节点${i + 1}`
                                                break;
                                            case '/monitor/pay/esb':
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



                        <Row style={{ margin: '10px 0 40px 0' }} gutter={10}>
                            <Col span={12}>
                                <Spin spinning={store.helper.getData.loading2} size="large">

                                    <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                                </Spin>
                            </Col>
                            <Col span={12}>
                                <Spin spinning={store.helper.getData.loading2} size="large">

                                    <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                                </Spin>
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