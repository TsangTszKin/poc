/* eslint-disable no-this-before-super */
/* eslint-disable react/display-name */
import React, { Component } from 'react'
import { observer, Provider } from 'mobx-react'
import { withRouter } from 'react-router-dom'
import store from '@/store/business/charts/Index'
import { Row, Col, DatePicker, Button } from 'antd'
import PageHeader from '@/components/PageHeader';
import echarts from 'echarts'
import moment from 'moment';

@withRouter @observer
class Index extends Component {

    constructor(props) {
        super(props)
        this.init = this.init.bind(this);
        this.init_duanxinfasongliang = this.init_duanxinfasongliang.bind(this);
        this.init_duanxinchenggongliang = this.init_duanxinchenggongliang.bind(this);
    }

    componentDidMount() {
        this.init();
    }

    init() {
        store.reset();
        this.init_duanxinfasongliang();
        this.init_duanxinchenggongliang();
    }

    init_duanxinfasongliang() {
        var myChart = echarts.init(this.duanxinfasongliang);
        // 绘制图表

        let option = {
            title: {
                text: '短信发送量'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['机构', '模板', '优先级']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2019/08/21', '2019/08/22', '2019/08/23', '2019/08/24', '2019/08/25', '2019/08/26', '2019/08/27']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '机构',
                    type: 'line',
                    data: [120, 132, 101, 134, 90, 230, 210]
                },
                {
                    name: '模板',
                    type: 'line',
                    data: [220, 182, 191, 234, 290, 330, 310]
                },
                {
                    name: '优先级',
                    type: 'line',
                    data: [150, 232, 201, 154, 190, 330, 410]
                }
            ]
        };

        myChart.setOption(option);
    }

    init_duanxinchenggongliang() {
        var myChart = echarts.init(this.duanxinchenggongliang);
        // 绘制图表

        let option = {
            title: {
                text: '短信成功率'
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['机构', '模板', '优先级']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['2019/08/21', '2019/08/22', '2019/08/23', '2019/08/24', '2019/08/25', '2019/08/26', '2019/08/27']
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name: '机构',
                    type: 'line',
                    data: [88, 78, 100, 99, 90, 97, 100]
                },
                {
                    name: '模板',
                    type: 'line',
                    data: [97, 88, 99, 93, 88, 77, 99]
                },
                {
                    name: '优先级',
                    type: 'line',
                    data: [92, 99, 98, 95, 94, 96, 98]
                }
            ]
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
                                <span style={style.searchTitle}>日期 :</span>
                                <DatePicker.RangePicker size="small"
                                    defaultValue={[moment('2015/01/01', 'YYYY/MM/DD'), moment('2015/01/01', 'YYYY/MM/DD')]}
                                    format={'YYYY/MM/DD'}
                                />
                            </div>
                            <div className="clearfix" style={style.searchShell}>
                                <Button size="small" type="primary">查询</Button>
                            </div>
                        </div>
                        <Row >
                            <Col span={24}>
                                <div ref={el => this.duanxinfasongliang = el} style={{ width: '100%', height: '300px' }}></div>
                            </Col>
                        </Row>
                        <Row style={{ marginTop: '30px' }}>
                            <Col span={24}>
                                <div ref={el => this.duanxinchenggongliang = el} style={{ width: '100%', height: '300px' }}></div>
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
        marginBottom: '20px'
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

