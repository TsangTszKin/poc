import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';

function getCurrentTimeString() {
    var date = new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '';
    return Y + M + D;
}

class DateTimePicker extends Component {
    constructor(props) {
        super(props);
    }


    render() {
        return (
            <div style={this.props.style}>
                {
                    this.props.isOriginValueReuired ?
                        <DatePicker allowClear={false} style={{ float: 'left', width: '120px' }} onChange={(date, dateString) => { console.log(date, dateString); this.props.onChange('date', dateString); }} value={moment(this.props.date, 'YYYY-MM-DD')} />
                        :
                        <DatePicker allowClear={false} style={{ float: 'left', width: '120px' }} onChange={(date, dateString) => { console.log(date, dateString); this.props.onChange('date', dateString); }} />
                }
                {
                    this.props.isOriginValueReuired ?
                        <TimePicker allowEmpty={false} style={{ float: 'left', marginLeft: '10px', width: '120px' }} format={this.props.timePickerFormat} onChange={(time, timeString) => { console.log(time, timeString); this.props.onChange('time', timeString); }} value={moment(this.props.time, this.props.timePickerFormat)} />
                        :
                        <TimePicker allowEmpty={false} style={{ float: 'left', marginLeft: '10px', width: '120px' }} format={this.props.timePickerFormat} onChange={(time, timeString) => { console.log(time, timeString); this.props.onChange('time', timeString); }} />
                }


            </div>
        )
    }
}
DateTimePicker.propTypes = {
    date: PropTypes.string,
    time: PropTypes.string,
    onChange: PropTypes.func,
    timePickerFormat: PropTypes.string,
    isOriginValueReuired: PropTypes.bool
}
DateTimePicker.defaultProps = {
    date: getCurrentTimeString(),
    time: '00:00:00',
    onChange: () => { },
    timePickerFormat: 'HH:mm:ss',
    isOriginValueReuired: true
}
export default DateTimePicker;