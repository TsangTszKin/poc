/*
 * @Author: zengzijian
 * @Date: 2018-11-08 15:10:25
 * @LastEditors: zengzijian
 * @LastEditTime: 2018-11-09 09:23:24
 * @Description: 从折叠改版后的表格框
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import common from '@/utils/common';
import publicUtils from '@/utils/publicUtils';
import { Divider } from 'antd';

class FormBlock extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="form-header" style={this.props.style}>
                <Divider orientation="left">{this.props.header}</Divider>
                <div style={{ padding: '10px 32px 32px 32px' }}>
                    {this.props.children}
                </div>
            </div>
        )
    }
}
FormBlock.propTypes = {
    header: PropTypes.string,
    style: PropTypes.object
}
FormBlock.defaultProps = {
    header: ""
}
export default FormBlock;