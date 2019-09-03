/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-03 16:08:49
 * @Description: 
 */
import React, { Component, Fragment } from 'react';
import store from '@/store/business/pay/Group';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, DatePicker, Button, Spin } from 'antd'
import moment from 'moment';
import DiagramPay from '@/components/business/home/DiagramPay'
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import publicUtils from '@/utils/publicUtils'
import payService from '@/api/business/payService'

@observer
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.getGroupChartsForApi = this.getGroupChartsForApi.bind(this);
    }

    componentDidMount() {
        this.init()
    }

    init() {
        store.reset();
        store.getPayGroupDataForApi();
        this.getGroupChartsForApi();
    }

    getGroupChartsForApi() {
        store.helper.updateData('loading2', true);
        let query = Object.assign({
            timeUnit: store.helper.getData.timeUnit
        }, store.helper.getData.query)
        payService.getGroupCharts(query).then(res => {
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
                                <Button size="small" type="primary" onClick={store.getPayGroupDataForApi}>查询</Button>
                            </div>
                        </div>

                        <Spin spinning={store.helper.getData.loading} size="large">
                            <DiagramPay />
                        </Spin>

                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24}>
                                <TimeUnit value={store.helper.getData.timeUnit} callBack={(value) => {
                                    store.helper.updateData('timeUnit', value);
                                    //todo 调接口
                                    this.getGroupChartsForApi();
                                }} />
                            </Col>
                        </Row>

                        <Spin spinning={store.helper.getData.loading2} size="large">
                            <Row>
                                <Col span={12}>
                                    <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                                </Col>
                                <Col span={12}>
                                    <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                                </Col>
                            </Row>
                        </Spin>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Home

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

