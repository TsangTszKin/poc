/*
 * @Author: zengzijian
 * @Date: 2018-10-24 10:32:51
 * @LastEditors: zengzijian
 * @LastEditTime: 2019-08-12 17:09:22
 * @Description: 
 */
import React, { Component } from 'react';
import { Select, DatePicker } from 'antd';
import moment from 'moment';
import common from '@/utils/common';

const timeTypeList = [
    { code: 'HOUR', value: '按小时' },
    { code: 'DAY', value: '按天' },
    // { code: 'WEEK', value: '按周' },
    { code: 'MONTH', value: '按月' }
]

class TimeRangePicker extends Component {
    constructor(props) {
        super(props);
        this.changeTime = this.changeTime.bind(this);
        this.state = {
            monthValue: []
        }
    }

    changeTime(date, dateString) {
        console.log(date, dateString);
        switch (this.props.timeType) {
            case 'HOUR':
                this.props.changeTime(dateString, this.props.endTime);
                break;
            case 'DAY':
                this.props.changeTime(dateString[0], dateString[1]);
                break;
            case 'WEEK':
                this.props.changeTime(dateString[0], dateString[1]);
                break;
            case 'MONTH':
                // this.props.changeTime(dateString[0], dateString[1]);
                break;
            default:
                break;
        }
    }

    componentWillUpdate(nextProps) {
        if (nextProps.timeType != this.props.timeType) {
            switch (nextProps.timeType) {
                case 'HOUR':
                    this.props.changeTime(common.getCurrentTimeString(), this.props.endTime);
                    break;
                case 'DAY':
                    this.props.changeTime(common.getCurrentTimeString(), common.getCurrentTimeString());
                    break;
                case 'WEEK':
                    this.props.changeTime(common.getCurrentTimeString(), common.getCurrentTimeString());
                    break;
                case 'MONTH':
                    this.props.changeTime(this.props.startTime.split("-")[0] + '-' + this.props.startTime.split("-")[1], this.props.endTime.split("-")[0] + '-' + this.props.endTime.split("-")[1]);
                    break;
                default:
                    break;
            }
        }
    }

    render() {
        return (
            <div style={{ float: 'left', marginBottom: '20px' }}>
                <Select value={this.props.timeType} style={{ width: '150px', marginRight: '10px', float: 'left' }} onChange={(value) => { this.props.changeTimeType(value) }} placeholder="选择时间">
                    {
                        timeTypeList.map((item, i) =>
                            <Select.Option key={i} value={item.code}>{item.value}</Select.Option>
                        )
                    }
                </Select>
                {(() => {
                    switch (this.props.timeType) {
                        case 'HOUR':
                            return <DatePicker allowClear={false} placeholder="请选择" value={moment(this.props.startTime, 'YYYY-MM-DD')} onChange={this.changeTime} />
                        case 'DAY':
                            return <DatePicker.RangePicker allowClear={false} placeholder="选择起止日期" value={[moment(this.props.startTime, 'YYYY-MM-DD'), moment(this.props.endTime, 'YYYY-MM-DD')]} style={{ width: '220px' }} onChange={this.changeTime} />
                        case 'WEEK':
                            return <DatePicker.RangePicker allowClear={false} placeholder="选择起止时间" value={[moment(this.props.startTime, 'YYYY-MM-DD'), moment(this.props.endTime, 'YYYY-MM-DD')]} style={{ width: '220px', float: 'left' }} onChange={this.changeTime} />
                        case 'MONTH':
                            return <DatePicker.RangePicker
                                allowClear={false}
                                placeholder={['选择开始月份', '选择结束月份']}
                                format="YYYY-MM"
                                showTime style={{ width: '220px' }}
                                mode={['month', 'month']}
                                value={[moment(this.props.startTime, 'YYYY-MM'), moment(this.props.endTime, 'YYYY-MM')]}
                                onChange={() => alert()}
                                onPanelChange={(value) => {
                                    // console.log(value)
                                    // console.log(JSON.stringify(value))
                                    // console.log(moment(value[0]).format('YYYY-MM'))
                                    this.props.changeTime(moment(value[0]).format('YYYY-MM'), moment(value[1]).format('YYYY-MM'));
                                    // this.setState({ index: ++this.state.index })
                                }}
                            />

                        default:
                            break;
                    }
                })()}

            </div>
        )
    }
}
TimeRangePicker.propTypes = {

}
TimeRangePicker.defaultProps = {

}
export default TimeRangePicker;