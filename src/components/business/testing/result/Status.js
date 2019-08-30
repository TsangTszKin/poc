import React, { Component } from 'react';
import PropTypes from 'prop-types';
import '@/styles/status.less';

class Status extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        switch (this.props.status) {
            case 0:
                return <span className="status-text ing">未命中</span>;
            case 1:
                return <span className="status-text error">命中</span>;
            default:
                return this.props.status;
        }
    }
}
Status.propTypes = {
    status: PropTypes.number.isRequired,
};

export default Status