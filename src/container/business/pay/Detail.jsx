/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:18:31
 * @Description: 
 */
import React, { Component, Fragment } from 'react';
import store from '@/store/business/pay/Detail';
import { observer, Provider, inject } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import PageHeader from '@/components/PageHeader';
import { Row, Col, DatePicker, Button, Drawer, Spin, Empty, Divider } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import DiagramDetailESB from '@/components/business/home/DiagramDetailESB'
import Code from '@/components/Code';
import { withRouter } from 'react-router-dom'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'
import Paging from '@/components/Paging';

@withRouter
@inject('GlobalStore')
@observer
class Detail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: '',
            index: 0
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.init_1 = this.init_1.bind(this);
        this.init_2 = this.init_2.bind(this);
        this.getData = this.getData.bind(this);
        this.getDetailChartsForApi = this.getDetailChartsForApi.bind(this);
        this.changePage = this.changePage.bind(this);
        this.getDetailChartsOneForApi = this.getDetailChartsOneForApi.bind(this);
    }

    componentDidMount() {
        if (!common.isEmpty(sessionStorage.timeParams)) {
            let timeParams = JSON.parse(sessionStorage.timeParams)
            let query = store.helper.getData.query;
            query.startTime = timeParams[0]
            query.endTime = timeParams[1]
            store.helper.updateData('query', common.deepClone(query))
            sessionStorage.removeItem('timeParams')
        }
        this.init()
    }

    init() {
        this.getData()
        this.getDetailChartsForApi();
    }

    getData() {
        switch (this.props.match.path) {
            case '/business/pay/pre':
                store.getPayDetailDataForApi('front');
                break;
            case '/business/pay/unit':
                store.getPayDetailDataForApi('online');
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
            case '/business/pay/pre':
                type = 'front'
                break;
            case '/business/pay/unit':
                type = 'online'
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
            case '/business/pay/pre':
                type = `front`
                break;
            case '/business/pay/unit':
                type = `online`
                break;
            default:
                break;
        }
        store.getLogForApi(type);
    }

    getDetailChartsOneForApi(hostIp) {
        store.helper.updateData('loading3', true);
        let query = Object.assign({
            timeUnit: store.helper.getData.timeUnit
        }, store.helper.getData.query)

        let type = ''
        switch (this.props.match.path) {
            case '/business/pay/pre':
                type = 'front'
                break;
            case '/business/pay/unit':
                type = 'online'
                break;
            default:
                break;
        }

        payService.getDetailCharts(Object.assign(query, { hostIp: hostIp }), type).then(res => {
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
                        <div className="clearfix" style={style.searchPanel}>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>统计周期 :</span>
                                <DatePicker.RangePicker
                                    size='small'
                                    allowClear={false}
                                    value={[moment(store.helper.getData.query.startTime, 'YYYY-MM-DD hh:mm'), moment(store.helper.getData.query.endTime, 'YYYY-MM-DD hh:mm')]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(date, dateString) => {
                                        console.log('date, dateString', date, dateString)
                                        let query = { startTime: `${dateString[0]} 00:00`, endTime: `${dateString[1]} 00:00` }
                                        store.helper.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary" onClick={() => {
                                    this.getData();
                                    this.getDetailChartsForApi();
                                }}>查询</Button>
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
                                            default:
                                                break;
                                        }
                                        data.push({
                                            title: title,
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
                                        case '/business/pay/pre':
                                            type = `front`
                                            break;
                                        case '/business/pay/unit':
                                            type = `online`
                                            break;
                                        default:
                                            break;
                                    }
                                    return type
                                })()}
                                callbackfn={this.getDetailChartsOneForApi}
                                extType="query"
                            />
                            {
                                common.isEmpty(store.data.getData) ?
                                    <Empty />
                                    :
                                    ''
                            }
                        </Spin>

                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24} style={{zIndex: '1'}}>
                                <TimeUnit value={store.helper.getData.timeUnit} callBack={(value) => {
                                    store.helper.updateData('timeUnit', value);
                                    //todo 调接口
                                    this.getDetailChartsForApi();
                                }} />
                            </Col>

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


                        </Row>

                        <Drawer
                            title={store.logList.getData.title}
                            placement="right"
                            closable={true}
                            onClose={() => store.logList.updateData('visible', false)}
                            visible={store.logList.getData.visible}
                            width={1200}
                        >

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


                            <Divider orientation="left">日志</Divider>

                            <Code sqlCode={store.logList.getData.dataSource} type={1} />
                            <Paging
                                pageNum={store.logList.getData.pageNum}
                                total={store.logList.getData.total}
                                showPageSize={store.logList.getData.pageSize}
                                changePage={this.changePage}
                            />
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
