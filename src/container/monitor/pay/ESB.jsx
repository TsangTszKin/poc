/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:18:31
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/monitor/pay/ESB';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, Empty, Button, PageHeader, Spin, Drawer } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import DiagramDetailESB from '@/components/business/home/DiagramDetailESB'
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'
import Paging from '@/components/Paging';

let timer

@withRouter
@observer
class ESB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.getDetailChartsForApi = this.getDetailChartsForApi.bind(this);
        this.init = this.init.bind(this);
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

    componentWillUnmount() {
        window.clearInterval(timer)
    }

    init() {
        store.getPayDetailESBDataForApi('esb');
        this.getDetailChartsForApi();
    }

    getDetailChartsForApi() {
        store.helper.updateData('loading2', true);
        payService.getDetailMonitorCharts({ sign: 'esb' }).then(res => {
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
        store.getLogForApi('esb');
    }

    getDetailChartsOneForApi(hostIp) {
        store.helper.updateData('loading3', true);

        payService.getDetailMonitorCharts({ hostIp: hostIp, sign: 'esb' }).then(res => {
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
                    <div className="pageContent charts-main">
                        <PageHeader
                            title={`ESB系统监控`}
                            subTitle="数据统计周期：1分钟"
                            style={{ padding: '0 0 30px 0' }}
                        />

                        <div style={{ margin: '100px 0' }}>
                            <DiagramDetailESB
                                data={(() => {
                                    let data = [];
                                    store.data.getData.forEach((el, i) => {
                                        let title = `支付系统ESB节点${i + 1}`
                                        data.push({
                                            title: el.hostIp,
                                            count: el.totalTrade,
                                            time: el.avgTime,
                                            ip: el.hostIp,
                                            service: (() => {
                                                let data = [];
                                                el.streamingLogVOS.forEach(el2 => {
                                                    data.push({
                                                        name: el2.name,
                                                        totalCount: el2.totalTrade,
                                                        avgTime: el2.avgTime,
                                                        ip: el.hostIp
                                                    })
                                                })
                                                return data
                                            })()
                                        })
                                    })
                                    return data
                                })()}
                                type="monitor"
                                callbackfn={this.getDetailChartsOneForApi}
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
                                    <DiagramDetailESB
                                        data={(() => {
                                            let target = store.data.getData.find(el => el.hostIp === store.logList.getData.title)
                                            if (!target) target = []
                                            else target = [target]
                                            let data = [];
                                            target.forEach((el, i) => {
                                                let title = `支付系统ESB节点${i + 1}`
                                                data.push({
                                                    title: el.hostIp,
                                                    count: el.totalTrade,
                                                    time: el.avgTime,
                                                    ip: el.hostIp,
                                                    service: (() => {
                                                        let data = [];
                                                        el.streamingLogVOS.forEach(el2 => {
                                                            data.push({
                                                                name: el2.name,
                                                                totalCount: el2.totalTrade,
                                                                avgTime: el2.avgTime,
                                                                ip: el.hostIp
                                                            })
                                                        })
                                                        return data
                                                    })()
                                                })
                                            })
                                            return data
                                        })()}
                                        type="monitor"
                                        callbackfn={this.getDetailChartsOneForApi}
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

export default ESB

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
