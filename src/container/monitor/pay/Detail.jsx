/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:18:31
 * @Description: 
 */
import React, { Component, Fragment } from 'react';
import store from '@/store/monitor/pay/Detail';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, Empty, Spin, Drawer, PageHeader } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import DiagramDetailESB from '@/components/business/home/DiagramDetailESB'
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'
import CellDetail from '@/components/business/home/widgets/CellDetail'

let timer

@withRouter
@observer
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.getData = this.getData.bind(this);
        this.getDetailChartsForApi = this.getDetailChartsForApi.bind(this);
        this.changePage = this.changePage.bind(this);
        this.init_1 = this.init_1.bind(this);
        this.init_2 = this.init_2.bind(this);
        this.getDetailChartsOneForApi = this.getDetailChartsOneForApi.bind(this);
    }

    componentDidMount() {
        this.init();
        timer = setInterval(() => {
            this.init()
        }, 60000);
    }

    init() {
        this.getData()
        this.getDetailChartsForApi();
    }

    componentWillUnmount() {
        window.clearInterval(timer)
    }

    getData() {
        switch (this.props.match.path) {
            case '/monitor/pay/pre':
                store.getPayDetailDataForApi('front');
                break;
            case '/monitor/pay/unit':
                store.getPayDetailDataForApi('online');
                break;
            default:
                break;
        }
    }

    getDetailChartsForApi() {
        store.helper.updateData('loading2', true);

        let type = ''
        switch (this.props.match.path) {
            case '/monitor/pay/pre':
                type = 'front'
                break;
            case '/monitor/pay/unit':
                type = 'online'
                break;
            default:
                break;
        }

        payService.getDetailMonitorCharts({ sign: type }).then(res => {
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
                text: '平均耗时(ms)'
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


    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.logList.updateData('pageNum', pageNum);
        store.logList.updateData('pageSize', pageSize);
        let type = ''
        switch (this.props.match.path) {
            case '/monitor/pay/pre':
                type = `front`
                break;
            case '/monitor/pay/unit':
                type = `online`
                break;
            default:
                break;
        }
        store.getLogForApi(type);
    }

    getDetailChartsOneForApi(hostIp) {
        store.helper.updateData('loading3', true);

        let type = ''
        switch (this.props.match.path) {
            case '/monitor/pay/pre':
                type = 'front'
                break;
            case '/monitor/pay/unit':
                type = 'online'
                break;
            default:
                break;
        }

        payService.getDetailMonitorCharts({ hostIp: hostIp, sign: type }).then(res => {
            store.helper.updateData('loading3', false);
            if (!publicUtils.isOk(res)) return
            this.init_1(res.data.result.keys, res.data.result.trades)
            this.init_2(res.data.result.keys, res.data.result.times)
        })
    }

    init_1(x = [], data = []) {
        var myChart = echarts.init(this._1);
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

    init_2(x = [], data = []) {
        var myChart = echarts.init(this._2);
        // 绘制图表

        let option = {
            title: {
                text: '平均耗时(ms)'
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
                    <div className="pageContent charts-main" >

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

                        <div style={{ margin: '100px 0' }}>
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
                                            default:
                                                break;
                                        }
                                        data.push({
                                            title: el.hostIp,
                                            count: el.totalTrade,
                                            time: el.avgTime,
                                            ip: el.hostIp
                                        })
                                    })
                                    return data
                                })()}
                                type={(() => {
                                    let type = ''
                                    switch (this.props.match.path) {
                                        case '/monitor/pay/pre':
                                            type = `front`
                                            break;
                                        case '/monitor/pay/unit':
                                            type = `online`
                                            break;
                                        default:
                                            break;
                                    }
                                    return type
                                })()}
                                callbackfn={this.getDetailChartsOneForApi}
                                extType="monitor"
                            />
                        </div>
                        {
                            common.isEmpty(store.data.getData) ?
                                <Empty />
                                :
                                ''
                        }

                        <Row style={{ marginBottom: '40px' }}>

                            <Row style={{ margin: '10px 0 40px 0' }} gutter={10}>
                                <Col span={12}>
                                    <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                                </Col>
                                <Col span={12}>
                                    <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                                </Col>
                            </Row>


                        </Row>

                        <Drawer
                            title={store.logList.getData.title}
                            placement="right"
                            closable={true}
                            onClose={() => store.logList.updateData('visible', false)}
                            visible={store.logList.getData.visible}
                            width={1200}
                        >
                            <Spin spinning={store.helper.getData.loading3} size="large">
                                <div className="clearfix" style={{ margin: '40px auto', width: 'fit-content' }}>
                                    <DiagramDetail
                                        data={(() => {
                                            let target = store.data.getData.find(el => el.hostIp === store.logList.getData.title)
                                            if (!target) target = []
                                            else target = [target]
                                            let data = [];
                                            target.forEach((el, i) => {
                                                let title = '';
                                                switch (this.props.match.path) {
                                                    case '/monitor/pay/pre':
                                                        title = `支付系统前置节点${i + 1}`
                                                        break;
                                                    case '/monitor/pay/unit':
                                                        title = `支付系统联机节点${i + 1}`
                                                        break;
                                                    default:
                                                        break;
                                                }
                                                data.push({
                                                    title: el.hostIp,
                                                    count: el.totalTrade,
                                                    time: el.avgTime,
                                                    ip: el.hostIp
                                                })
                                            })
                                            return data
                                        })()}
                                        type={(() => {
                                            let type = ''
                                            switch (this.props.match.path) {
                                                case '/monitor/pay/pre':
                                                    type = `front`
                                                    break;
                                                case '/monitor/pay/unit':
                                                    type = `online`
                                                    break;
                                                default:
                                                    break;
                                            }
                                            return type
                                        })()}
                                        callbackfn={this.getDetailChartsOneForApi}
                                        extType="monitor"
                                    />
                                </div>
                            </Spin>

                            <Row style={{ margin: '10px 0 40px 0' }} gutter={10}>
                                <Col span={12}>
                                    <Spin spinning={store.helper.getData.loading3} size="large">
                                        <div ref={el => this._1 = el} style={{ width: '100%', height: '300px' }}></div>
                                    </Spin>
                                </Col>
                                <Col span={12}>
                                    <Spin spinning={store.helper.getData.loading3} size="large">
                                        <div ref={el => this._2 = el} style={{ width: '100%', height: '300px' }}></div>
                                    </Spin>
                                </Col>
                            </Row>
                        </Drawer>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Detail

const style = {
    searchPanel: {
        marginBottom: '100px'
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
        title: '支付系统ESB节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198',
        service: []
    },
    {
        title: '支付系统ESB节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198',
        service: []
    },
    {
        title: '支付系统ESB节点1',
        count: 200,
        time: 20,
        ip: '96.0.56.198',
        service: []
    }
]
