/*
 * @Author: zengzijian
 * @Date: 2018-10-12 16:59:52
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2019-09-02 20:32:41
 * @Description: 
 */
import React, { Component } from 'react';
import store from '@/store/business/sms/Index';
import { observer, Provider } from 'mobx-react';
import common from '@/utils/common';
import echarts from 'echarts'
import { Row, Col, DatePicker, Button, Empty, Drawer, Spin } from 'antd'
import moment from 'moment';
import DiagramDetail from '@/components/business/home/DiagramDetail'
import Code from '@/components/Code';
import TimeUnit from '@/components/business/home/widgets/TimeUnit';
import smsService from '@/api/business/smsService'
import publicUtils from '@/utils/publicUtils'
import Paging from '@/components/Paging';

@observer
class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            breadcrumbName: ''
        }
        this.init_jiaoyiliang = this.init_jiaoyiliang.bind(this);
        this.init_pingjunhaoshi = this.init_pingjunhaoshi.bind(this);
        this.getChartsForApi = this.getChartsForApi.bind(this);
        this.changePage = this.changePage.bind(this);
    }

    componentDidMount() {
        this.init()
    }

    init() {
        store.reset();
        store.getSmsAllDataForApi();
        this.getChartsForApi();
    }

    getChartsForApi() {
        store.helper.updateData('loading2', true);
        let query = Object.assign({
            timeUnit: store.helper.getData.timeUnit
        }, store.helper.getData.query)
        smsService.getAllCharts(query).then(res => {
            store.helper.updateData('loading2', false);
            if (!publicUtils.isOk(res)) return
            this.init_jiaoyiliang(res.data.result.keys, res.data.result.sendCounts)
            this.init_pingjunhaoshi(res.data.result.keys, res.data.result.times)
        })
    }

    changePage = (pageNum, pageSize) => {
        console.log("分页回调：当前页码" + pageNum);
        console.log("分页回调：获取条数" + pageSize);
        store.logList.updateData('pageNum', pageNum);
        store.logList.updateData('pageSize', pageSize);
        let type = '';
        switch (store.logList.getData.title) {
            case 'MQ':
                type = '1'
                break;
            case 'Front':
                type = '2'
                break;
            case 'Realtime':
                type = '3'
                break;
            default:
                break;
        }
        store.getLogForApi(type);
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
        console.log('store.data.getData')
        return (
            <Provider store={store}>
                <div className='panel'>
                    <div className="pageContent charts-main">
                        <div className="clearfix" style={style.searchPanel}>
                            <div className="clearfix" style={style.searchShell}>
                                <span style={style.searchTitle}>统计周期 :</span>
                                <DatePicker.RangePicker size="small"
                                    allowClear={false}
                                    defaultValue={[moment(store.helper.getData.query.beginTime, 'YYYY-MM-DD hh:mm'), moment(store.helper.getData.query.endTime, 'YYYY-MM-DD hh:mm')]}
                                    format={'YYYY-MM-DD'}
                                    onChange={(date, dateString) => {
                                        console.log('date, dateString', date, dateString)
                                        let query = { beginTime: `${dateString[0]} 00:00`, endTime: `${dateString[1]} 00:00` }
                                        store.helper.updateData('query', query);
                                    }}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary" onClick={() => {
                                    store.getSmsAllDataForApi();
                                    this.getChartsForApi();
                                }}>查询</Button>
                            </div>
                        </div>

                        <Spin spinning={store.helper.getData.loading} size="large" >
                            <DiagramDetail
                                type="sms"
                                data={(() => {
                                    let data = [];
                                    store.data.getData.forEach((el, i) => {
                                        data.push({
                                            title: el.name,
                                            count: el.sendCount,
                                            time: el.takeTimes,
                                            ip: el.hostIp
                                        })
                                    })
                                    return data
                                })()}
                            />
                            {
                                common.isEmpty(store.data.getData) ?
                                    <Empty />
                                    :
                                    ''
                            }
                        </Spin>

                        <Row style={{ marginBottom: '40px' }}>
                            <Col span={24}>
                                <TimeUnit value={store.helper.getData.timeUnit} callBack={(value) => {
                                    store.helper.updateData('timeUnit', value);
                                    //todo 调接口
                                    this.getChartsForApi();
                                }} />
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.jiaoyiliang = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                            <Col span={12}>
                                <div ref={el => this.pingjunhaoshi = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>


                        </Row>
                    </div>

                    <Drawer
                        title={`日志（${store.logList.getData.title}）`}
                        placement="right"
                        closable={true}
                        onClose={() => store.logList.updateData('visible', false)}
                        visible={store.logList.getData.visible}
                        width={1200}
                    >
                        <Code sqlCode={store.logList.getData.dataSource} type={1} />
                        <Paging
                            pageNum={store.logList.getData.pageNum}
                            total={store.logList.getData.total}
                            showPageSize={store.logList.getData.pageSize}
                            changePage={this.changePage}
                        />
                    </Drawer>
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