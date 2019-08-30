import React, { Component } from "react";
import PropTypes from "prop-types";
import packageStatus from '@/utils/strategy-package-status'
import common from "@/utils/common";
import { Popover } from "antd";


class Status extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { statusCode, statusGroup, errorMsg, isShowMsg } = this.props;
        let className, flag, text, fontStyle;
        className = statusGroup[statusCode] ? ` ${ statusGroup[statusCode].className }` : '';
        flag = statusGroup[statusCode] ? `${ statusGroup[statusCode].className }` : '';
        text = statusGroup[statusCode] ? ` ${ statusGroup[statusCode].text }` : '';
        fontStyle = flag ? {} : { fontSize: '14px', color: '#595959' };
        if (isShowMsg && !common.isEmpty(errorMsg)) {
            const errorEl = <div style={{maxWidth: '500px'}}>{ errorMsg || '未知错误' }</div>;
            return (<Popover content={ errorEl } title="错误信息">
                <span className="status-text error" style={ { textDecoration: 'underline' } }>{ text }</span>
            </Popover>);
        }
        return <span style={ fontStyle } className={ 'status-text' + className }>{ text }</span>;
    }
}

export default Status;

Status.propTypes = {
    statusCode: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]).isRequired,
    statusGroup: PropTypes.object, // 可以传入自定义的状态配置
    isShowMsg: PropTypes.bool,
};
Status.defaultProps = {
    statusCode: '-1',
    statusGroup: packageStatus,
    isShowMsg: false,
};