import React, { Component } from "react";
import store from '@/store/analysis/data-graphics/Index';
import { observer, Provider } from "mobx-react";
import {
    Button,
    Col,
    DatePicker,
    Dropdown,
    Icon,
    Menu,
    message,
    Modal,
    Progress,
    Radio,
    Row,
    Spin,
    Table
} from "antd";
import '@/styles/analysis/data-graphics.less';
import '@/styles/components/ProcessBar.less';
import common from "@/utils/common";
import ProcessBar from "@/components/common/ProcessBar";
import ActiveNumber from "@/components/common/ActiveNumber";
import AntVChart from "@/components/analysis/data-graohics/AntVChart";
import AntVChartPie from "@/components/analysis/data-graohics/AntVPie";
import Paging from "@/components/Paging";
import { withRouter } from "react-router-dom";
import eventService from "@/api/analysis/eventService";
import publicUtils from "@/utils/publicUtils";
import moment from 'moment';

const { RangePicker } = DatePicker;
const upArrow = <Icon className="data-change-number-icon green-arrow-up" type="caret-up"/>;
const downArrow = <Icon className="data-change-number-icon red-arrow-down" type="caret-down"/>;
const weekdays = ['', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];
const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'index',
    },
    {
        title: '请求时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },
    {
        title: '事件源',
        dataIndex: 'dsTypeName',
        key: 'dsTypeName',
    },
    {
        title: '状态',
        dataIndex: 'statusName',
        key: 'statusName',
        render: (text, record, index) => {
            return (<span className={ `status-text ${ record.statusCode === '2' ? 'online'
                : record.statusCode === '1' ? 'ready'
                    : record.statusCode ? 'ing' : '' }` }>{ text }</span>)
        }
    },
    {
        title: '耗时',
        dataIndex: 'decisionCostTime',
        key: 'decisionCostTime',
        render: text => text + '毫秒'
    },
    // {
    //     title: '报文1',
    //     dataIndex: 'field',
    //     key: 'field',
    // },
];

@withRouter
@observer
class Index extends Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        // 获取第一行和第三行饼图数据
        eventService.getTotal().then(res => {
            if (!publicUtils.isOk(res)) return;
            const { dataIndicatorVO, eventStatisticsVO } = res.data.result;
            // 第一行数据
            if (!common.isEmpty(dataIndicatorVO)) {
                store.panels.setData(dataIndicatorVO);
                store.panels.setIsLoading(false);
            }
            // 第三行饼图数据
            if (!common.isEmpty(eventStatisticsVO)) {
                const { requestTotal, hitTotal, hitTotalNum, requestTotalNum } = eventStatisticsVO;
                let data = {
                    request: [],
                    hit: []
                };
                for (let key in requestTotal) {
                    if (requestTotal.hasOwnProperty(key)) {
                        data.request.push({
                            item: key,
                            count: requestTotal[ key ].num,
                            percent: requestTotal[ key ].ratio,
                            name: requestTotal[ key ].name,
                        });
                    }
                }
                for (let key in hitTotal) {
                    if (hitTotal.hasOwnProperty(key)) {
                        data.hit.push({
                            item: key,
                            count: hitTotal[ key ].num,
                            percent: requestTotal[ key ].ratio,
                            name: requestTotal[ key ].name,
                        })
                    }
                }
                store.eventChart.setHitTotal(hitTotalNum);
                store.eventChart.setRequestTotal(requestTotalNum);
                store.eventChart.setData(data);
                store.eventChart.setType('request');
                // console.log(store.eventChart.data);
            }
        });
        // 第二行数据
        this.handleChangeType('0');
        // 第三行 表格数据
        this.getEventDetail();
        // 第三行 表格数据定时刷新
        this.resetInterval();
        // 第三行 饼图数据, 第一行新接口包含这块数据了
        // eventService.getEventStatistics().then(res => {
        //     if (!publicUtils.isOk(res) || common.isEmpty(res.data.result)) return;
        //     const { requestTotal, hitTotal, hitTotalNum, requestTotalNum } = res.data.result;
        //     let data = {
        //         request: [],
        //         hit: []
        //     };
        //     for (let key in requestTotal) {
        //         if (requestTotal.hasOwnProperty(key)) {
        //             data.request.push({
        //                 item: key,
        //                 count: requestTotal[ key ].num,
        //                 percent: requestTotal[ key ].ratio,
        //                 name: requestTotal[ key ].name,
        //             });
        //         }
        //     }
        //     for (let key in hitTotal) {
        //         if (hitTotal.hasOwnProperty(key)) {
        //             data.hit.push({
        //                 item: key,
        //                 count: hitTotal[ key ].num,
        //                 percent: requestTotal[ key ].ratio,
        //                 name: requestTotal[ key ].name,
        //             })
        //         }
        //     }
        //     store.eventChart.setHitTotal(hitTotalNum);
        //     store.eventChart.setRequestTotal(requestTotalNum);
        //     store.eventChart.setData(data);
        //     store.eventChart.setType('request');
        //     // console.log(store.eventChart.data);
        // });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    handleChartDateChange = res => {
        if (!publicUtils.isOk(res) || common.isEmpty(res.data.result)) return;
        let { hitTotal, requestTotal } = res.data.result;
        let totalHit = [],
            totalRequest = [];
        for (let key in hitTotal) {
            if (hitTotal.hasOwnProperty(key)) {
                totalHit.push({
                    time: this.numberToTime(key),
                    count: hitTotal[ key ]
                });
            }
        }
        for (let key in requestTotal) {
            if (requestTotal.hasOwnProperty(key)) {
                totalRequest.push({
                    time: this.numberToTime(key),
                    count: requestTotal[ key ]
                });
            }
        }
        // console.log(totalHit, totalRequest);
        store.chart.setTotalHit(totalHit);
        store.chart.setTotalRequest(totalRequest);
    };

    handleRankChange = res => {
        if (!publicUtils.isOk(res) || common.isEmpty(res.data.result)) return;
        // console.log(res);
        const result = res.data.result;
        let rank = [];
        for (let key in result) {
            if (result.hasOwnProperty(key)) {
                rank.push({
                    name: key,
                    percent: result[ key ]
                });
            }
        }
        store.chart.setRank(rank);
    }

    numberToTime = number => {
        switch (store.chart.type) {
            case '0':
                return number.length === 1 ? `0${ number }:00` : `${ number }:00`;
            case '1':
                return weekdays[parseInt(number)] || number;
            case '3':
                return `${number}月`;
            // case '4':
            //     return moment(store.chart.timeStart).add(Number(number) - 1, 'days').format('M/D');
            default:
                return number
        }

    }

    handleChangeTab = item => {
        const currentTab = item.key;
        store.chart.setCurrentTab(currentTab);
    };

    handleChangeType = type => {
        store.chart.setType(type);
        eventService.getTendency({
            dateType: store.chart.type,
            startDate: '',
            endDate: '',
        }).then(this.handleChartDateChange);
        eventService.getHitRank({
            dateType: store.chart.type,
            endDate: '',
            startDate: '',
        }).then(this.handleRankChange);
    };

    resetInterval = () => {
        clearInterval(this.interval);
        if (store.requestDetail.updateTime !== stop
            && Number.isFinite(store.requestDetail.updateTime)
            && store.requestDetail.updateTime >= 5
        ) {
            this.interval = setInterval(this.getEventDetail, store.requestDetail.updateTime * 1000);
        }
    };

    // value是moment对象
    handleChangeTime = (value, dateString) => {
        const [startTime, endTime] = dateString;
        if (!common.isEmpty(startTime) && !common.isEmpty(endTime)) {
            console.log('Formatted Selected Time: ', startTime, endTime);
            const startValue = value[ 0 ].valueOf();
            const endValue = value[ 1 ].valueOf();
            const diff = endValue - startValue;
            if (diff > 2592000000) {
                Modal.error({ title: '系统提示', content: '不可以超过30天' });
                return;
            }
            store.chart.setType('4');
            store.chart.setTimeStart(new Date(startTime));
            store.chart.setTimeEnd(new Date(endTime));
            eventService.getTendency({
                dateType: 4,
                startDate: new Date(startTime),
                endDate: new Date(endTime),
            }).then(this.handleChartDateChange);
            eventService.getHitRank({
                dateType: 4,
                startDate: new Date(startTime),
                endDate: new Date(endTime),
            }).then(this.handleRankChange);
        }
    };

    getEventDetail = () => {
        // message.warning('获取了一次数据');
        // store.requestDetail.setIsLoading(true);
        eventService.getEventDetailsList({
            "pageNum": store.pagination.page,
            "pageSize": store.pagination.pageSize,
            "dsTypes": [],
            "fields": [],
            "procRules": [],
            "strategies": [],
            "conditions": [],
            "startTime": "",
            "endTime": ""
        }).then(res => {
            store.requestDetail.setIsLoading(false);
            if (!publicUtils.isOk(res, false, false)) return;
            const pageList = res.data.pageList;
            store.pagination.setTotal(pageList.sum || 0);
            if (common.isEmpty(pageList.resultList)) return;
            let dataSource = pageList.resultList.map(({ ddApdate, statusName, statusCode, dsTypeName, decisionCostTime }, index) => {
                // console.log(ddApdate);
                return {
                    index: Number(store.pagination.pageSize) * (Number(store.pagination.page) - 1) + index + 1,
                    statusCode,
                    statusName,
                    dsTypeName,
                    decisionCostTime,
                    createTime: moment(Number(ddApdate)).format("YYYY-MM-DD HH:mm:ss"),
                    // createTime: common.formatTime(new Date(ddApdate)),
                }
            });
            console.log(dataSource);
            store.requestDetail.setDataSource(dataSource);
        })
    };

    handleRadioChange = e => {
        // console.log(e.target.value);
        store.eventChart.setType(e.target.value);
    };

    handleChangePage = (pageNum, pageSize) => {
        // console.log("分页回调：当前页码" + pageNum);
        // console.log("分页回调：获取条数" + pageSize);
        store.pagination.setPage(pageNum);
        store.pagination.setPageSize(pageSize);
        this.resetInterval();
        store.requestDetail.setIsLoading(true);
        this.getEventDetail();
    };

    handleMenuClick = ({ key }) => {
        if (key === store.requestDetail.updateTime) return;
        clearInterval(this.interval);
        // 停止刷新
        if (key === 'stop') {
            store.requestDetail.setUpdateTime('stop');
            return;
        }
        store.requestDetail.setUpdateTime(Number(key));
        // 新计时器
        this.interval = setInterval(this.getEventDetail, Number(key) * 1000);
    };

    goToDetail = () => this.props.history.push('/analysis/event/details');

    render() {
        const DateChangeItem = props => {
            let { label, percentNumber, className } = props;
            const isMinus = percentNumber >= 0;
            return (
                <div className={ `data-change-item ${ className }` }>
                    { label }
                    <div style={{ display: 'inline-block' }}>
                        { isMinus ? downArrow : upArrow }
                        <span className="data-change-number">{ percentNumber }</span>
                    </div>
                </div>
            )
        };
        const TypeItem = props => {
            let { text, value, current } = props;
            const className = current === value ? 'active' : '';
            return (
                <a
                    className={ `type-item ${ className }` }
                    href="javascript:"
                    onClick={ () => this.handleChangeType(value) }
                >{ text }</a>
            )
        };

        const scaleConfig = {
            'totalHit': {
                time: { alias: '时间', },
                count: { alias: '命中次数' }
            },
            'totalRequest': {
                time: { alias: '时间', },
                count: { alias: '请求次数' }
            },
        };

        const menu = (
            <Menu onClick={ this.handleMenuClick }>
                <Menu.Item key={ 5 }>5s</Menu.Item>
                <Menu.Item key={ 10 }>10s</Menu.Item>
                <Menu.Item key={ 20 }>20s</Menu.Item>
                <Menu.Item key={ 30 }>30s</Menu.Item>
                <Menu.Item key="stop">停止刷新</Menu.Item>
            </Menu>
        );

        return (
            <Provider store={ store }>
                <div className="data-graphics-container">
                    {/* 第一行，顶部四个小框 */ }
                    <div className="small-container-wrapper">
                        <Spin spinning={ store.panels.isLoading }>
                            <Row gutter={ 25 }>
                                <Col span={ 6 }>
                                    <div className="small-container">
                                        <div className="small-header">总请求数</div>
                                        <div className="small-body">
                                            <div className="data-count">
                                                <ActiveNumber className="data-number"
                                                              value={ store.panels.data.todayTotal } delay={ 1000 }
                                                              formatNumber/>
                                                <span className="data-number-after">次</span>
                                            </div>
                                            <div className="data-change">
                                                <DateChangeItem className="data-change-front" label="周同比"
                                                                percentNumber={ `${ store.panels.data.weekAllRatio }%` }/>
                                                <DateChangeItem label="日环比"
                                                                percentNumber={ `${ store.panels.data.dayAllRatio }%` }/>
                                            </div>
                                        </div>
                                        <div className="small-footer">
                                            <div className="day-request-count">
                                                日均请求数
                                                <span className="day-request-number">{ store.panels.data.dayAvg }</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={ 6 }>
                                    <div className="small-container">
                                        <div className="small-header">命中请求数</div>
                                        <div className="small-body">
                                            <div className="data-count">
                                                <ActiveNumber className="data-number"
                                                              value={ store.panels.data.todayHitNum } delay={ 1000 }
                                                              formatNumber/>
                                                <span className="data-number-after">次</span>
                                            </div>
                                            <div className="process-bar-container">
                                                <ProcessBar percent={ store.panels.data.todayhitRate }
                                                            animation={ true }
                                                            title="命中请求比例"
                                                />
                                            </div>
                                        </div>
                                        <div className="small-footer">
                                            <div className="data-change">
                                                <DateChangeItem className="data-change-front" label="周同比"
                                                                percentNumber={ `${ store.panels.data.weekHitRatio }%` }/>
                                                <DateChangeItem label="日环比"
                                                                percentNumber={ `${ store.panels.data.dayHitRatio }%` }/>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={ 6 }>
                                    <div className="small-container">
                                        <div className="small-header">平均决策耗时</div>
                                        <div className="small-body">
                                            <div className="data-count">
                                                <ActiveNumber className="data-number"
                                                              value={ store.panels.data.todayCostTimeAvg }
                                                              delay={ 1000 }
                                                              formatNumber/>
                                                <span className="data-number-after">ms</span>
                                            </div>
                                            <div className="process-bar-container">
                                                <ProcessBar percent={ store.panels.data.todayoverTimeRate }
                                                            color="#157edf"
                                                            animation={ true }
                                                            title="超时比例"
                                                >
                                                    <span>超时</span>
                                                </ProcessBar>

                                            </div>
                                        </div>
                                        <div className="small-footer">
                                            <div className="data-change">
                                                <DateChangeItem className="data-change-front" label="周同比"
                                                                percentNumber={ `${ store.panels.data.weekCostTimeRatio }%` }/>
                                                <DateChangeItem label="日环比"
                                                                percentNumber={ `${ store.panels.data.dayCostTimeRatio }%` }/>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col span={ 6 }>
                                    <div className="small-container">
                                        <div className="small-header">异常请求数</div>
                                        <div className="small-body">
                                            <div className="data-count">
                                                <ActiveNumber className="data-number"
                                                              value={ store.panels.data.todayErrorNum } delay={ 1000 }
                                                              formatNumber/>
                                                <span className="data-number-after">次</span>
                                            </div>
                                            <div className="data-change">
                                                <DateChangeItem className="data-change-front" label="周同比"
                                                                percentNumber={ `${ store.panels.data.errorWeekRatio }%` }/>
                                                <DateChangeItem label="日环比"
                                                                percentNumber={ `${ store.panels.data.errorDayRatio }%` }/>
                                            </div>
                                        </div>
                                        <div className="small-footer">
                                            <div className="day-request-count">
                                                异常请求总数
                                                <span className="day-request-number">{ store.panels.data.allErrorNum }</span>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </Spin>
                    </div>
                    {/*第二行，条形图部分 */ }
                    <div className="data-chart-container">
                        <div className="data-chart-header clearfix">
                            <Menu
                                className="data-chart-menu"
                                onClick={ this.handleChangeTab }
                                selectedKeys={ [store.chart.currentTab] }
                                mode="horizontal"
                            >
                                <Menu.Item className="menu-item" key="totalRequest">总请求数</Menu.Item>
                                <Menu.Item className="menu-item" key="totalHit">命中数</Menu.Item>
                            </Menu>
                            <div className="data-chart-menu-right">
                                <TypeItem text="今日" value="0" current={ store.chart.type }/>
                                <TypeItem text="本周" value="1" current={ store.chart.type }/>
                                <TypeItem text="本月" value="2" current={ store.chart.type }/>
                                <TypeItem text="全年" value="3" current={ store.chart.type }/>
                                <RangePicker
                                    className="data-chart-range-picker"
                                    onChange={ this.handleChangeTime }
                                    defaultValue={ [store.chart.timeStart, store.chart.timeEnd] }
                                    format={ store.chart.dateFormat }
                                />
                            </div>
                        </div>
                        <div className="data-chart-content">
                            <div className="data-chart-bar">
                                <p className="container-title">请求次数趋势</p>
                                <div>
                                    {
                                        store.chart.currentTab === 'totalRequest' ?
                                            <AntVChart data={ store.chart[ 'totalRequest' ] }
                                                       scaleConfig={ scaleConfig[ 'totalRequest' ] }/>
                                            : ''
                                    }
                                    {
                                        store.chart.currentTab === 'totalHit' ?
                                            <AntVChart data={ store.chart[ 'totalHit' ] }
                                                       scaleConfig={ scaleConfig[ 'totalHit' ] }/>
                                            : ''
                                    }
                                </div>
                            </div>
                            <React.Fragment>
                                <div className="data-chart-process">
                                    <div className="process-wrapper">
                                        <p className="container-title">策略命中排行榜</p>
                                        {
                                            store.chart.rank.map((item, index) => (
                                                <div className="process-item">
                                                    <div className="process-header">
                                                        <b className={ `process-index ${ index < 3 ? ' top' : '' }` }>{ index + 1 }</b>
                                                        <span className="process-title">{ item.name }</span>
                                                        <span
                                                            className="process-percent">{ `${ item.percent }%` }</span>
                                                    </div>
                                                    <Progress
                                                        type="line"
                                                        percent={ item.percent }
                                                        default={ 0 }
                                                        strokeColor="#E44B4E"
                                                        strokeWidth={ 6 }
                                                        showInfo={ false }
                                                    />
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            </React.Fragment>
                        </div>
                    </div>
                    {/*第三行，表格跟饼图 */ }
                    <div className="data-chart-container data-chart-3">
                        <Row gutter={ 25 }>
                            <Col span={ 12 }>
                                <div className="data-chart-header">
                                    <span className="container-title">实时请求明细</span>
                                    <div className="request-detail-buttons">
                                        <Dropdown className="update-time-dropdown" overlay={ menu }>
                                            <Button htmlType="button">
                                                { store.requestDetail.updateTime === 'stop' ? '停止更新' : `${ store.requestDetail.updateTime }s` }
                                                <Icon type="down"/>
                                            </Button>
                                        </Dropdown>
                                        <Button className="view-more-btn" type="default" htmlType="button"
                                                onClick={ this.goToDetail }>
                                            <Icon type="ellipsis"/>
                                        </Button>
                                    </div>
                                </div>
                                <div className="data-pie-content">
                                    <Spin spinning={ store.requestDetail.isLoading }>
                                        <Table columns={ columns }
                                               dataSource={ store.requestDetail.dataSource }
                                               size="middle"
                                               pagination={ false }/>
                                        {/*<Paging*/}
                                        {/*    size="small"*/}
                                        {/*    pageNum={ store.pagination.page }*/}
                                        {/*    showPageSize={ store.pagination.pageSize }*/}
                                        {/*    total={ store.pagination.total }*/}
                                        {/*    changePage={ this.handleChangePage }*/}
                                        {/*/>*/}
                                    </Spin>
                                </div>
                            </Col>
                            <Col span={ 12 }>
                                <div className="data-chart-header">
                                    <span className="container-title">事件统计</span>
                                    <Radio.Group
                                        className="chart-radio"
                                        value={ store.eventChart.type }
                                        onChange={ this.handleRadioChange }
                                    >
                                        <Radio.Button value="request">请求数</Radio.Button>
                                        <Radio.Button value="hit">命中数</Radio.Button>
                                    </Radio.Group>
                                </div>
                                <div className="data-pie-content">
                                    { store.eventChart.type === 'request' ?
                                        <AntVChartPie data={ store.eventChart.data[ 'request' ] }
                                                      total={ store.eventChart.requestTotal }/>
                                        : ''
                                    }
                                    { store.eventChart.type === 'hit' ?
                                        <AntVChartPie data={ store.eventChart.data[ 'hit' ] }
                                                      total={ store.eventChart.hitTotal }/>
                                        : ''
                                    }
                                </div>
                            </Col>
                        </Row>

                    </div>
                </div>
            </Provider>
        );
    }
}

export default Index;
