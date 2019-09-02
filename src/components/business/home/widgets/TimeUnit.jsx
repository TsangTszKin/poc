/* eslint-disable react/jsx-no-duplicate-props */
import React, { Component } from 'react';
import { Select } from 'antd';
import commonService from '@/api/business/commonService';
import publicUtils from '@/utils/publicUtils';
import PropTypes from 'prop-types';

class TimeUnit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            data: []
        }
    }
    componentDidMount() {
        commonService.getDict('timeUnit').then(res => {
            if (!publicUtils.isOk(res)) return
            this.setState({
                data: res.data.result
            })
        })
    }
    render() {
        return (
            <div>
                <Select
                    value="1hour"
                    dropdownMatchSelectWidth={false}
                    size="small"
                    style={{ minWidth: '80px', width: 'fit-content', margin: '20px 0px' }}
                    value={this.props.value}
                    onChange={(value) => this.props.callBack(value)}
                >
                    {
                        this.state.data.map((item, i) =>
                            <Select.Option value={item.val} key={i}>{item.label}</Select.Option>
                        )
                    }
                </Select>
            </div>
        );
    }
}
TimeUnit.propTypes = {
    value: PropTypes.number,
    callBack: PropTypes.func
}
TimeUnit.defaultProps = {
    value: 60,
    callBack: () => { }
}
export default TimeUnit;