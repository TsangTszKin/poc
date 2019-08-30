import React, {Component, Fragment} from 'react'
import SelectGroup1 from '@/components/analysis/SelectGroup1';
import SelectGroup2 from '@/components/analysis/SelectGroup2';
import { Divider, Radio, Button, Table, Menu } from 'antd';
import TimeRangePicker from '@/components/analysis/TimeRangePicker';
import Paging from '@/components/Paging';
import { Chart, Tooltip, Axis, Legend, Line, Point } from 'viser-react';
import { withRouter } from 'react-router-dom';
import '@/styles/analysis/eventDetails.less';
import store from '@/store/analysis/event/StatisticsStore';
import { Provider, observer } from 'mobx-react';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';

const DataSet = require('@antv/data-set');


@withRouter
@observer
class Analysis extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectGroupValueList: [''],
            selectData: [{ code: '', value: '所有' }, { code: 1, value: "默认类别" }]
        }

    }

    componentDidMount() {
        store.initParams();
        store.getEventSourceListAndStrategyList().then(() => {
            // 页面改动中，功能延后调整
            if (this.props.match.path === '/analysis/event/home/:eventSourceType') {
                store.timePickerData.setType('HOUR');
                const currentEventSourceType = this.props.match.params.eventSourceType;
                let selectedEventSource = store.getStrategyList.find(item => item.eventSourceCode === currentEventSourceType);
                const { eventSourceId, eventSourceCode, strategyCode } = selectedEventSource || {};
                store.setSelectValueList1([
                    {
                        eventSourceCode: currentEventSourceType,
                        eventSourceId: eventSourceId || '',
                        strategyCode: strategyCode || ''
                    }
                ]);
            }
            store.getStatisticsListForApi();
            store.getChartDataForApi();
            store.getEventCols();
        });
    }

    render() {

        const dv = new DataSet.View().source(store.chart.getData);
        dv.transform({
            type: 'fold',
            fields: store.chart.getFields,
            key: 'city',
            value: 'temperature',
        });
        const data = dv.rows;

        const scale = [{
            dataKey: 'date',
            min: 0,
            max: 1,
        }];

        //解决在mobx中不能操作路由的问题
        switch (store.getPageType) {
            case 1:
                this.props.history.push("/analysis/event/details");
                store.setPageType(0);
                break;

            default:
                break;
        }


        return (
            <Provider store={store}>
                <div className='panel'>

                    <div className="pageContent">
                        <Fragment>
                        <SelectGroup1 firstTitle="选择事件源：" />
                        {
                            store.getRuleList.length > 0 ?
                                <SelectGroup2 firstTitle="选择策略：" width="calc(100% - 65px)" /> : ''
                        }
                        </Fragment>

                        <Divider />
                        <div style={{ height: '32px' }}>
                            <TimeRangePicker
                                timeType={store.timePickerData.getType}
                                startTime={store.timePickerData.getStartTime}
                                endTime={store.timePickerData.getEndTime}
                                changeTime={(startTime, endTime) => { console.log("startTime, endTime", startTime, endTime); store.timePickerData.setStartTime(startTime); store.timePickerData.setEndTime(endTime); }}
                                changeTimeType={(timeType) => { store.timePickerData.setType(timeType) }}
                            />
                            <Radio.Group value={store.getDimensions} onChange={(e) => { store.setDimensions(e.target.value); store.getStatisticsListForApi(); store.getChartDataForApi(); }} style={{ float: 'right' }}>
                                {
                                    store.getDimensionsList.map((item, i) =>
                                        <Radio.Button value={item.code}>{item.name}</Radio.Button>
                                    )}
                            </Radio.Group>
                        </div>
                        {
                            common.isEmpty(store.chart.getFields) ? '' :
                                <Chart forceFit height={400} data={data} scale={scale}>
                                    <Tooltip />
                                    <Axis />
                                    <Legend />
                                    <Line position="date*temperature" color="city" />
                                    <Point position="date*temperature" color="city" size={4} style={{ stroke: '#fff', lineWidth: 1 }} shape="circle" />
                                </Chart>
                        }


                        <Table dataSource={store.table.getDataSource} columns={store.table.getColumns} onChange={() => { }} pagination={false} scroll={{ x: store.table.getDataSource.length > 0 ? 1500 : 'auto' }} />
                        <Paging
                            pageNum={store.page.getNum}
                            showPageSize={store.page.getSize}
                            total={store.page.getTotal}
                            changePage={(pageNum, pageSize) => {
                                console.log("分页回调：当前页码" + pageNum);
                                console.log("分页回调：获取条数" + pageSize);
                                store.page.setNum(pageNum);
                                store.page.setSize(pageSize);
                                store.getStatisticsListForApi();
                                store.getChartDataForApi();
                            }}
                        ></Paging>
                    </div>
                </div>
            </Provider>
        )
    }
}

export default Analysis