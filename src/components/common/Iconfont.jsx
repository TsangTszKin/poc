import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Popconfirm } from "antd";

class Iconfont extends Component {
    constructor(props) {
        super(props);

    }

    render() {
        const { disabled, onClick, className, title, showConfirm, style } = this.props;
        // const extendClassName = ['iconfont', className, disabled ? ' disabled': ''].join(' ');
        const extendClassName = `iconfont ${ className ? ' ' + className: '' } ${ disabled ? ' disabled': '' }`;
        let baseProps = {
            title,
            className: extendClassName,
            style,
        };
        if (!disabled) {
            baseProps = {
                ...baseProps,
            };
            if (showConfirm) {
                return <Popconfirm
                    title={`是否确定${ title }?`} onConfirm={ onClick }
                    onCancel={() => { }} okText="确定" cancelText="取消">
                    <icon {...baseProps} />
                </Popconfirm>
            } else {
                baseProps = {
                    ...baseProps,
                    onClick
                };
            }
        }
        return <icon {...baseProps} />;
    }
}

Iconfont.propTypes = {
    disabled: PropTypes.bool,
    onClick: PropTypes.func,
    className: PropTypes.string.isRequired,
    title: PropTypes.string,
    showConfirm: PropTypes.bool,
};

Iconfont.defaultProps = {
    onClick: () => {},
    disabled: false,
    className: '',
    title: '',
    showConfirm: false,
};

export default Iconfont;
