import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { DatePicker, TimePicker } from 'antd';
import moment from 'moment';
import { inject, observer } from 'mobx-react';

function getCurrentTimeString() {
    var date = new Date();
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() + '';
    return Y + M + D;
}

@inject('store')
@observer
class DateTimePicker2 extends Component {
    constructor(props) {
        super(props);
        this.init = this.init.bind(this);
    }

    componentDidMount() {


        let self = this;
        var timer = setInterval(function () {
            if (window.layui) {
                layui.use(['layer', 'laydate', 'jquery'], function () {
                    window.layer = layui.layer;
                    window.laydate = layui.laydate;
                    window.$ = layui.$;
                    self.init();
                });
                stop();
            };
        }, 100);
        function stop() {
            window.clearInterval(timer);
        }
    }

    init() {
        //日期时间选择器
        let self = this;
        window.laydate.render({
            elem: `#${this.props.id}`,
            type: 'datetime',
            format: 'yyyy-MM-dd HH:mm:ss',
            theme: '#E44B4E',
            change: function (value) {
            },
            done: function (value) {
                console.log(value); //得到日期生成的值，如：2017-08-18
                // console.log(self.props)
                if (self.props.id == 'startTime') {
                    self.props.store.timeParams.setStart(value);
                } else {
                    self.props.store.timeParams.setEnd(value);
                }

            }
        });

    }

    render() {
        return (
            <div class="layui-inline" style={this.props.style}>
                <input type="text" class="layui-input" id={this.props.id} placeholder={this.props.placeholder} readOnly></input>
            </div>
        )
    }
}
DateTimePicker2.propTypes = {
    placeholder: PropTypes.string,
    id: PropTypes.string
}
DateTimePicker2.defaultProps = {
    placeholder: "请选择事件",
    id: "dateTime"
}
export default DateTimePicker2;