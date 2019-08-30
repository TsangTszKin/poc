import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';
import common from '@/utils/common';
import { Popover } from "antd";


class Status extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let element,
            wrongMessage = this.props.data.wrongMessage || '未知错误';
            ;
        switch (this.props.status) {
            case 0:
                element = <span className="status-text ing">未就绪</span>;
                break;
            case 1:
                element = <span className="status-text ready">已就绪</span>;
                break;
            case 2:
                element = <span className="status-text ing">上线中</span>;
                break;
            case 3:
                element = <span className="status-text ing">下线中</span>;
                break;
            case 4:
                element = <span className="status-text online">已发布</span>;
                break;
            case 5:
                element = <span className="status-text error">删除失败</span>;
                break;
            case 6:
                element = (
                    <Popover content={wrongMessage} title="错误信息">
                        <span className="status-text error" style={{textDecoration: 'underline'}}>已出错</span>
                    </Popover>
                );
                break;
            case 7:
                element = <span className="status-text ready">发布中</span>;
                break;
            case 8:
                element = <span className="status-text ready">就绪中</span>;
                break;
            default:
                element = <span className="status-text ready">未知</span>;
                break;
        }
        return element;
    }
}
Status.propTypes = {
    status: PropTypes.number.isRequired
}
export default Status