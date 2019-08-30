import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';
import common from '@/utils/common';
import { Popover } from "antd";

import '@/styles/business/testing/index.less';


class Status extends Component {
    constructor(props) {
        super(props);
        this.statusTypes = Array.isArray(this.props.statusTypes) ? this.props.statusTypes: [];
    }

    render() {
        let element, text,
            wrongMessage = <div className="test-wrong-message">{ this.props.data ? this.props.data.wrongMessage || '未知错误': '未知错误' }</div>
        ;
        switch (this.props.status) {
            case 203:
                element = <span className="status-text online">已测试</span>;
                break;
            case 202:
                element = <span className="status-text ready">待测试</span>;
                break;
            case 201:
                element = <span className="status-text ing">构建中</span>;
                break;
            case 204:
                element = (
                    <Popover content={wrongMessage} title="错误信息">
                        <span className="status-text error" style={{textDecoration: 'underline'}}>构建失败</span>
                    </Popover>
                );
                break;
            default:
                text = (this.statusTypes.find(item => item.val === this.props.status) || { label: '未知' }).label;
                element = <span className="status-text ready">{ text }</span>;
                break;
        }
        return element;
    }
}
Status.propTypes = {
    status: PropTypes.number.isRequired,
    statusTypes: PropTypes.array
}
export default Status